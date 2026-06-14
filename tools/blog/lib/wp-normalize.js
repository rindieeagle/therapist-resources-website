// Normalizes a WordPress REST post (fetched with ?_embed) into the canonical
// content/blog/<id>.json shape consumed by tools/blog/build-blog.js.
// The n8n "TR Blog Sync" workflow has a Code node that mirrors this logic —
// if the shape changes here, update that node too.
//
// AEO/GEO contract: the record carries the public TR URL (never the WP
// permalink) plus answer_block, faq, schema_type, related_links, author,
// organization, and split keyphrases. Authored values arriving via the WP
// `tr_seo` meta (Layer 2) take priority; otherwise fields are derived from the
// post content + slug + shared entities (Layer 1). Schema itself is still
// composed at build time from the @id graph — this record is the data source,
// not a place to embed JSON-LD.

import { parse } from 'node-html-parser';
import { SITE, WP_HOST, AUTHOR, ORGANIZATION, DEFAULT_BYLINE } from './entities.js';
import { stripHtml } from './content.js';
import { parseByline, detectFaq } from './seo.js';

export { WP_HOST };

export function normalizeWpPost(wp) {
  const media = wp._embedded?.['wp:featuredmedia']?.[0];
  const terms = (wp._embedded?.['wp:term'] ?? []).flat();
  const tags = terms
    .filter((t) => t && t.taxonomy === 'post_tag')
    .map(({ id, name, slug }) => ({ id, name, slug }));

  const seo = wp.tr_seo ?? {};
  const slug = wp.slug;
  const contentHtml = wp.content?.rendered ?? '';
  const canonical = canonicalUrl(slug);
  const byline = seo.byline || null;

  // Authored AEO fields (Layer 2, via tr_seo) win; otherwise derive (Layer 1).
  const faq = (Array.isArray(seo.faq) && seo.faq.length ? seo.faq : detectFaq(contentHtml)) ?? [];
  const answerBlock = seo.answer_block || deriveAnswerBlock(contentHtml);
  const sources = normalizeSources(seo.sources);

  return {
    id: wp.id,
    slug,
    status: wp.status,
    date: wp.date,
    date_gmt: toUtcIso(wp.date_gmt),
    modified: wp.modified,
    modified_gmt: toUtcIso(wp.modified_gmt),
    // Public destination, never the WP permalink. wp_link kept for traceability.
    link: canonical,
    canonical_url: canonical,
    wp_link: wp.link,
    title: wp.title?.rendered ?? '',
    excerpt: wp.excerpt?.rendered ?? '',
    content: contentHtml,
    ...(answerBlock ? { answer_block: answerBlock } : {}),
    author: buildAuthor(byline),
    byline,
    organization: ORGANIZATION,
    featured: media?.source_url
      ? {
          source_url: media.source_url,
          alt: media.alt_text || '',
          width: media.media_details?.width ?? null,
          height: media.media_details?.height ?? null,
        }
      : null,
    tags,
    categories: wp.categories ?? [],
    related_links: deriveRelatedLinks(contentHtml),
    ...(faq.length ? { faq } : {}),
    schema_type: ['BlogPosting', ...(faq.length ? ['FAQPage'] : [])],
    date_modified: seo.date_modified ? toUtcIso(seo.date_modified) : toUtcIso(wp.modified_gmt),
    ...(sources.length ? { sources } : {}),
    seo: {
      title: seo.title || null,
      metadesc: seo.metadesc || null,
      keyphrases: splitKeyphrases(seo.keyphrases),
    },
  };
}

// Public TR canonical for a slug: absolute, https, lowercase, trailing slash.
function canonicalUrl(slug) {
  return `${SITE}/blog/${String(slug).toLowerCase()}/`;
}

// First substantive paragraph of the body — the extractable answer block.
// Skips tiny intro/label lines; the authored tr_seo.answer_block overrides this.
function deriveAnswerBlock(contentHtml) {
  if (!contentHtml) return null;
  const root = parse(contentHtml);
  for (const p of root.querySelectorAll('p')) {
    const text = stripHtml(p.innerHTML);
    if (text.length >= 40) return text;
  }
  return null;
}

// In-content links to TR blog siblings -> [{url, anchor}], deduped. Per the
// canonical internal-link rule, body sibling links are already TR /blog/ URLs
// (never the WP permalink), so we collect those and trailing-slash normalize.
function deriveRelatedLinks(contentHtml) {
  if (!contentHtml) return [];
  const root = parse(contentHtml);
  const seen = new Set();
  const links = [];
  for (const a of root.querySelectorAll('a')) {
    const href = a.getAttribute('href');
    if (!href) continue;
    let url;
    try {
      url = new URL(href, SITE);
    } catch {
      continue;
    }
    if (url.hostname.replace(/^www\./, '') !== 'therapistresources.com') continue;
    if (!url.pathname.startsWith('/blog/')) continue;
    const linkSlug = url.pathname.replace(/^\/blog\/+/, '').replace(/\/+$/, '');
    if (!linkSlug || linkSlug.includes('/')) continue;
    const canonical = `${SITE}/blog/${linkSlug}/`;
    if (seen.has(canonical)) continue;
    seen.add(canonical);
    const anchor = stripHtml(a.innerHTML);
    if (anchor) links.push({ url: canonical, anchor });
  }
  return links;
}

// Byline string -> data-record author (object, or array for co-authored posts).
// Rindie gets the stable @id + url; co-authors carry name + credentials only.
function buildAuthor(byline) {
  const people = parseByline(byline || DEFAULT_BYLINE);
  const authors = people.map(({ name, creds }) =>
    name.startsWith('Rindie Eagle')
      ? { id: AUTHOR.id, name: AUTHOR.name, credentials: creds || AUTHOR.credentials, url: AUTHOR.url }
      : { name, ...(creds ? { credentials: creds } : {}) }
  );
  return authors.length === 1 ? authors[0] : authors;
}

// "focus, secondary, tertiary" -> { focus, secondary: [...] }.
function splitKeyphrases(raw) {
  if (!raw) return { focus: null, secondary: [] };
  const parts = String(raw)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return { focus: parts[0] ?? null, secondary: parts.slice(1) };
}

// Accepts authored sources as objects ({title,url,publisher?,type?}) or as the
// frontmatter "Title: https://url" string convention; normalizes to objects.
// title is required; url optional (book/PDF citations may have no URL).
function normalizeSources(raw) {
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : [raw];
  return arr
    .map((s) => {
      if (s && typeof s === 'object') return s;
      const str = String(s).trim();
      const m = str.match(/(https?:\/\/\S+)/);
      if (!m) return { title: str };
      const url = m[1].replace(/[).,]+$/, '');
      const title = str.replace(m[1], '').replace(/[\s:–-]+$/, '').trim();
      return { title: title || url, url };
    })
    .filter((x) => x.title || x.url);
}

// WP *_gmt fields come without a timezone marker ("2026-06-12T15:30:00").
function toUtcIso(gmt) {
  if (!gmt) return null;
  return /Z$/.test(gmt) ? gmt : `${gmt}Z`;
}

// Image URLs referenced by a post that live on the WP install
// (featured image + in-content <img>), deduplicated.
export function collectWpImageUrls(normalized, parseHtml) {
  const urls = new Set();
  if (normalized.featured?.source_url?.includes(WP_HOST)) {
    urls.add(normalized.featured.source_url);
  }
  const root = parseHtml(normalized.content);
  for (const img of root.querySelectorAll('img')) {
    const src = img.getAttribute('src');
    if (src && src.includes(WP_HOST)) urls.add(src);
  }
  return [...urls];
}
