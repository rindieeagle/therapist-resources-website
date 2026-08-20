#!/usr/bin/env node
// Static blog generator. Runs AFTER `vite build` and writes into dist/:
//   dist/blog/<slug>/index.html        post pages
//   dist/blog/ + dist/blog/page/N/     paginated index
//   dist/blog/topic/<tag>/ (+ pages)   topic hub pages
//   dist/blog/feed.xml                 RSS
//   dist/sitemap.xml                   full sitemap incl. image extension (owns the file)
//   dist/llms.txt                      spec-compliant index (owns the file)
//   dist/llms-full.txt                 full post text for AI answer engines (owns the file)
//
// Reads content/blog/*.json (committed by n8n / tools/migrate-from-wp.js).
// Fully hermetic: no network access. Any hard error fails the build so a
// broken deploy never replaces a working one.

import fs from 'fs';
import path from 'path';
import { rewritePostHtml, localImagePath } from './lib/content.js';
import { detectFaq } from './lib/seo.js';
import { renderPostPage } from './templates/post-page.js';
import { renderIndexPage } from './templates/index-page.js';
import { buildSitemap, buildRss, buildLlmsTxt } from './lib/feeds.js';
import { buildLlmsFull } from './lib/discovery.js';

const POSTS_PER_PAGE = 9;
const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const PUBLIC = path.join(ROOT, 'public');
const CONTENT_DIR = path.join(ROOT, 'content', 'blog');

const warnings = [];

function loadPosts() {
  if (!fs.existsSync(CONTENT_DIR)) {
    warnings.push('content/blog/ does not exist — generating an empty blog.');
    return [];
  }
  const posts = [];
  for (const file of fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.json'))) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
    let post;
    try {
      post = JSON.parse(raw);
    } catch (err) {
      throw new Error(`content/blog/${file}: invalid JSON (${err.message})`);
    }
    for (const field of ['id', 'slug', 'title', 'content', 'date', 'date_gmt']) {
      if (!post[field]) throw new Error(`content/blog/${file}: missing required field "${field}"`);
    }
    if (post.status !== 'publish') {
      warnings.push(`content/blog/${file}: status "${post.status}" — skipped`);
      continue;
    }
    validatePost(file, post);
    posts.push(post);
  }

  const slugs = new Set();
  for (const p of posts) {
    if (slugs.has(p.slug)) throw new Error(`duplicate slug across posts: "${p.slug}"`);
    slugs.add(p.slug);
  }

  posts.sort((a, b) => new Date(b.date_gmt) - new Date(a.date_gmt));
  return posts;
}

// Normalize a question for comparison (case/space-insensitive, no trailing punctuation).
function normQuestion(s) {
  return String(s || '').toLowerCase().replace(/\s+/g, ' ').trim().replace(/[?.!]+$/, '');
}

// AEO/GEO data-contract guardrails. Defensive: fields are only checked when
// present, so records predating the enriched contract still build. Structural
// problems hard-fail (a broken deploy never replaces a working one); contract
// drift that does not break a page only warns.
function validatePost(file, post) {
  const where = `content/blog/${file}`;
  if (post.canonical_url && post.link && post.canonical_url !== post.link) {
    throw new Error(`${where}: canonical_url !== link ("${post.canonical_url}" vs "${post.link}")`);
  }
  if (post.wp_link && post.link && post.wp_link === post.link) {
    throw new Error(`${where}: link still points at the WordPress permalink (${post.link}); expected the TR URL`);
  }
  if (Array.isArray(post.faq) && post.faq.length) {
    const keys = post.faq.map((f) => normQuestion(f.q));
    if (new Set(keys).size !== keys.length) throw new Error(`${where}: duplicate FAQ question(s)`);
    const visible = detectFaq(post.content).map((f) => normQuestion(f.q));
    const structured = new Set(keys);
    const missing = visible.filter((q) => !structured.has(q));
    const extra = keys.filter((q) => !visible.includes(q));
    if (missing.length || extra.length) {
      warnings.push(`${where}: FAQ structured/visible mismatch (missing ${missing.length}, extra ${extra.length})`);
    }
  }
  // Only the enriched object form is expected to carry focus; a legacy flat
  // string just means the record predates the {focus, secondary} shape.
  if (post.seo?.keyphrases && typeof post.seo.keyphrases === 'object' && !post.seo.keyphrases.focus) {
    warnings.push(`${where}: seo.keyphrases.focus is empty`);
  }
  if (post.answer_block && (post.answer_block.length < 120 || post.answer_block.length > 450)) {
    warnings.push(`${where}: answer_block length ${post.answer_block.length} outside ~120–450 chars`);
  }
}

function discoverCss() {
  const assetsDir = path.join(DIST, 'assets');
  if (!fs.existsSync(assetsDir)) throw new Error('dist/assets not found — run vite build first');
  const matches = fs.readdirSync(assetsDir).filter((f) => /^index-.+\.css$/.test(f));
  if (matches.length !== 1) {
    throw new Error(`expected exactly one dist/assets/index-*.css, found ${matches.length} (${matches.join(', ')})`);
  }
  return `/assets/${matches[0]}`;
}

function collectTopics(posts) {
  const bySlug = new Map();
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      const entry = bySlug.get(tag.slug) ?? { ...tag, count: 0 };
      entry.count++;
      bySlug.set(tag.slug, entry);
    }
  }
  return [...bySlug.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function relatedPosts(post, posts) {
  const tagIds = new Set((post.tags ?? []).map((t) => t.id));
  return posts
    .filter((p) => p.id !== post.id)
    .map((p) => ({ p, overlap: (p.tags ?? []).filter((t) => tagIds.has(t.id)).length }))
    .sort((a, b) => b.overlap - a.overlap || new Date(b.p.date_gmt) - new Date(a.p.date_gmt))
    .slice(0, 3)
    .filter((r) => r.overlap > 0 || posts.length <= 4)
    .map((r) => r.p);
}

function writePage(outPath, html) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
}

function paginate(items, perPage) {
  const pages = [];
  for (let i = 0; i < items.length; i += perPage) pages.push(items.slice(i, i + perPage));
  return pages.length ? pages : [[]];
}

function writeIndexSet({ posts, topics, activeTopic, cssHref, outBase }) {
  const pages = paginate(posts, POSTS_PER_PAGE);
  pages.forEach((pagePosts, i) => {
    const page = i + 1;
    const html = renderIndexPage({
      posts: pagePosts,
      topics,
      activeTopic,
      page,
      totalPages: pages.length,
      cssHref,
    });
    const outPath = page === 1 ? path.join(outBase, 'index.html') : path.join(outBase, 'page', String(page), 'index.html');
    writePage(outPath, html);
  });
  return pages.length;
}

function main() {
  const posts = loadPosts();
  const cssHref = discoverCss();
  const topics = collectTopics(posts);
  const knownSlugs = new Set(posts.map((p) => p.slug));

  // Resolve card/featured images once per post.
  for (const post of posts) {
    if (post.featured?.source_url) {
      const local = localImagePath(post.id, post.featured.source_url, PUBLIC);
      post._cardImage = local ?? post.featured.source_url;
      if (!local) warnings.push(`#${post.id} ${post.slug}: featured image not mirrored locally, hotlinking`);
    } else {
      post._cardImage = null;
    }
  }

  // Post pages.
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const { html: contentHtml, warnings: w } = rewritePostHtml(post, { knownSlugs, publicDir: PUBLIC });
    warnings.push(...w);
    const html = renderPostPage({
      post,
      contentHtml,
      faqItems: post.faq?.length ? post.faq : detectFaq(contentHtml),
      featuredSrc: post._cardImage,
      prev: posts[i - 1] ?? null,
      next: posts[i + 1] ?? null,
      related: relatedPosts(post, posts),
      cssHref,
    });
    writePage(path.join(DIST, 'blog', post.slug, 'index.html'), html);
  }

  // Blog index + topic hubs.
  const indexPageCount = writeIndexSet({ posts, topics, activeTopic: null, cssHref, outBase: path.join(DIST, 'blog') });
  for (const topic of topics) {
    const topicPosts = posts.filter((p) => (p.tags ?? []).some((t) => t.slug === topic.slug));
    writeIndexSet({ posts: topicPosts, topics, activeTopic: topic, cssHref, outBase: path.join(DIST, 'blog', 'topic', topic.slug) });
  }

  // Feeds + discovery files. build-blog owns sitemap.xml, llms.txt, and
  // llms-full.txt outright (written after _cardImage resolution above).
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), buildSitemap({ posts, topicSlugs: topics.map((t) => t.slug), indexPageCount }));
  writePage(path.join(DIST, 'blog', 'feed.xml'), buildRss(posts));
  fs.writeFileSync(path.join(DIST, 'llms.txt'), buildLlmsTxt({ posts }));
  fs.writeFileSync(path.join(DIST, 'llms-full.txt'), buildLlmsFull(posts));

  console.log(`✓ blog: ${posts.length} post(s), ${topics.length} topic(s), ${indexPageCount} index page(s) → dist/blog/`);
  if (warnings.length) {
    console.log('Warnings:');
    for (const w of warnings) console.log(`  ⚠ ${w}`);
  }
}

try {
  main();
} catch (err) {
  console.error(`❌ blog build failed: ${err.message}`);
  process.exit(1);
}
