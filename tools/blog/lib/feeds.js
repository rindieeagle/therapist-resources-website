// sitemap.xml, RSS feed, and llms.txt additions for the static blog.

import fs from 'fs';
import path from 'path';
import { SITE, escapeXml, stripHtml, truncate, decodeEntities } from './content.js';
import { deriveMeta } from './seo.js';

const STATIC_ROUTES = ['/', '/courses', '/web-apps'];

export function buildSitemap({ posts, topicSlugs, indexPageCount }) {
  const buildDate = new Date().toISOString();
  const urls = [];

  for (const route of STATIC_ROUTES) {
    urls.push({ loc: `${SITE}${route}`, lastmod: buildDate });
  }

  const newestPost = posts[0]?.modified_gmt || buildDate;
  urls.push({ loc: `${SITE}/blog/`, lastmod: newestPost });
  for (let p = 2; p <= indexPageCount; p++) {
    urls.push({ loc: `${SITE}/blog/page/${p}/`, lastmod: newestPost });
  }
  for (const slug of topicSlugs) {
    urls.push({ loc: `${SITE}/blog/topic/${slug}/`, lastmod: newestPost });
  }
  for (const post of posts) {
    urls.push({ loc: `${SITE}/blog/${post.slug}/`, lastmod: post.modified_gmt || post.date_gmt });
  }

  const entries = urls
    .map(
      ({ loc, lastmod }) => `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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

export function appendBlogToLlmsTxt(distDir, posts) {
  const llmsPath = path.join(distDir, 'llms.txt');
  const existing = fs.existsSync(llmsPath) ? fs.readFileSync(llmsPath, 'utf8').trimEnd() : '';
  const lines = posts.map((post) => {
    const { description } = deriveMeta(post);
    return `- [${decodeEntities(post.title)}](/blog/${post.slug}/): ${description}`;
  });
  const blogSection = `## Blog\n- [Blog Index](/blog/): Articles on clinical documentation, practice tools, and resources for therapists.\n\n## Blog Posts\n${lines.join('\n')}`;
  fs.writeFileSync(llmsPath, `${existing}\n\n${blogSection}\n`);
}
