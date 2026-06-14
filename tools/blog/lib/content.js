// Post-HTML rewriting + small text utilities for the static blog generator.

import fs from 'fs';
import path from 'path';
import { parse } from 'node-html-parser';
import { SITE, WP_HOST } from './entities.js';

export { SITE };

const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  hellip: '…', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
  ndash: '–', mdash: '—', copy: '©', trade: '™', reg: '®',
};

export function decodeEntities(str = '') {
  return str
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => NAMED_ENTITIES[name.toLowerCase()] ?? m);
}

export function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function escapeXml(str = '') {
  return escapeHtml(decodeEntities(str));
}

export function stripHtml(html = '') {
  return decodeEntities(parse(html).text).replace(/\s+/g, ' ').trim();
}

export function truncate(str, max = 155) {
  if (str.length <= max) return str;
  const cut = str.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

// Local web path for a WP-hosted image, or null if it wasn't downloaded
// into public/blog-images/<postId>/. Prefers a .webp sibling when one exists
// (heavy originals are re-encoded to WebP and removed to keep the repo lean).
export function localImagePath(postId, sourceUrl, publicDir) {
  try {
    const basename = decodeURIComponent(path.basename(new URL(sourceUrl).pathname));
    if (!basename) return null;
    const dir = path.join(publicDir, 'blog-images', String(postId));
    const webpName = basename.replace(/\.[a-z0-9]+$/i, '.webp');
    for (const name of [webpName, basename]) {
      if (fs.existsSync(path.join(dir, name))) {
        return `/blog-images/${postId}/${encodeURIComponent(name)}`;
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Rewrites a post's WP content HTML for publication on therapistresources.com:
//  - WP-hosted <img> srcs -> local /blog-images/ paths when the file exists
//    (hotlink fallback + warning otherwise); lazy-loading hints added
//  - cross-post links on the WP domain -> /blog/<slug>/ for slugs we publish;
//    links to other planets' posts are left alone but flagged
//  - therapistresources.com/blog/... links normalized to root-relative
//    trailing-slash form
export function rewritePostHtml(post, { knownSlugs, publicDir }) {
  const warnings = [];
  const root = parse(post.content);

  for (const img of root.querySelectorAll('img')) {
    const src = img.getAttribute('src');
    if (src && src.includes(WP_HOST)) {
      const local = localImagePath(post.id, src, publicDir);
      if (local) {
        img.setAttribute('src', local);
        img.removeAttribute('srcset');
        img.removeAttribute('sizes');
      } else {
        warnings.push(`#${post.id} ${post.slug}: image not mirrored locally, hotlinking ${src}`);
      }
    }
    if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
  }

  for (const a of root.querySelectorAll('a')) {
    const href = a.getAttribute('href');
    if (!href) continue;
    let url;
    try {
      url = new URL(href, SITE);
    } catch {
      continue;
    }

    if (url.hostname === WP_HOST) {
      const slug = url.pathname.replace(/^\/+|\/+$/g, '');
      if (slug && !slug.includes('/') && knownSlugs.has(slug)) {
        a.setAttribute('href', `/blog/${slug}/${url.hash || ''}`);
      } else {
        warnings.push(`#${post.id} ${post.slug}: link to noindexed WP subdomain left as-is: ${href}`);
      }
    } else if (
      (url.hostname === 'therapistresources.com' || url.hostname === 'www.therapistresources.com') &&
      url.pathname.startsWith('/blog')
    ) {
      let p = url.pathname;
      if (!p.endsWith('/')) p += '/';
      a.setAttribute('href', `${p}${url.search || ''}${url.hash || ''}`);
    }
  }

  return { html: root.toString(), warnings };
}
