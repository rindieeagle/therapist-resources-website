// sitemap.xml, RSS feed, and llms.txt additions for the static blog.

import { SITE, escapeXml, stripHtml, truncate, decodeEntities } from './content.js';
import { deriveMeta } from './seo.js';
import { PAGE_MANIFEST, SITE_SUMMARY, gitLastModified } from './discovery.js';

const IMAGE_NS = 'http://www.google.com/schemas/sitemap-image/1.1';

export function buildSitemap({ posts, topicSlugs, indexPageCount }) {
  const urls = [];

  // Static SPA pages: lastmod from the page's last git commit, so it only moves
  // when the page actually changes (build-time stamps make Google distrust it).
  for (const page of PAGE_MANIFEST) {
    urls.push({ loc: `${SITE}${page.route}`, lastmod: gitLastModified(page.source) });
  }

  const buildDate = new Date().toISOString();
  const newestPost = posts[0]?.modified_gmt || buildDate;
  urls.push({ loc: `${SITE}/blog/`, lastmod: newestPost });
  for (let p = 2; p <= indexPageCount; p++) {
    urls.push({ loc: `${SITE}/blog/page/${p}/`, lastmod: newestPost });
  }
  for (const slug of topicSlugs) {
    urls.push({ loc: `${SITE}/blog/topic/${slug}/`, lastmod: newestPost });
  }
  for (const post of posts) {
    // Only emit images we actually serve (local /blog-images/ paths); never a
    // hotlinked cross-domain URL.
    const image =
      post._cardImage && post._cardImage.startsWith('/blog-images/')
        ? { loc: `${SITE}${post._cardImage}`, caption: post.featured?.alt || decodeEntities(post.title) }
        : null;
    urls.push({ loc: `${SITE}/blog/${post.slug}/`, lastmod: post.modified_gmt || post.date_gmt, image });
  }

  const entries = urls
    .map(({ loc, lastmod, image }) => {
      const imageXml = image
        ? `\n    <image:image>\n      <image:loc>${escapeXml(image.loc)}</image:loc>\n      <image:caption>${escapeXml(image.caption)}</image:caption>\n    </image:image>`
        : '';
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>${imageXml}\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="${IMAGE_NS}">
${entries}
</urlset>
`;
}

export function buildRss(posts) {
  const items = posts
    .slice(0, 20)
    .map((post) => {
      const url = `${SITE}/blog/${post.slug}/`;
      const description = truncate(stripHtml(post.excerpt), 300);
      return `    <item>
      <title>${escapeXml(decodeEntities(post.title))}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.date_gmt).toUTCString()}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Therapist Resources Blog</title>
    <link>${SITE}/blog/</link>
    <atom:link href="${SITE}/blog/feed.xml" rel="self" type="application/rss+xml" />
    <description>Clinical documentation, practice tools, and courses for therapists by Rindie Eagle, MA, LPCC.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

// Spec-compliant llms.txt: title + summary, live pages (from the manifest),
// and every published post with its meta description. Returns the full file.
export function buildLlmsTxt({ posts, pages = PAGE_MANIFEST, site = SITE, summary = SITE_SUMMARY }) {
  const pageLines = pages.map((p) => `- [${p.title}](${site}${p.route}): ${p.description}`);
  const postLines = posts.map((post) => {
    const { description } = deriveMeta(post);
    return `- [${decodeEntities(post.title)}](${site}/blog/${post.slug}/): ${description}`;
  });
  return `# Therapist Resources

> ${summary}

## Pages
${pageLines.join('\n')}

## Blog
- [Blog Index](${site}/blog/): Articles on clinical documentation, practice tools, and resources for therapists.

## Blog Posts
${postLines.join('\n')}
`;
}
