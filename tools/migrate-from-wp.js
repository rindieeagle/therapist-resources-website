#!/usr/bin/env node
// One-time migration: pulls all published Therapist Resources posts (category 5)
// from the WordPress install and writes them into the repo's content pipeline:
//   content/blog/<post_id>.json        (canonical post data)
//   public/blog-images/<post_id>/...   (featured + in-content images)
//
// Run locally only:  node tools/migrate-from-wp.js
// Credentials: WP_USERNAME / WP_APP_PASSWORD from the environment or .env
// (falls back to the legacy VITE_-prefixed names). Idempotent — re-run safe.

import fs from 'fs';
import path from 'path';
import { parse } from 'node-html-parser';
import { normalizeWpPost, collectWpImageUrls } from './blog/lib/wp-normalize.js';

const WP_BASE = 'https://blog.reagleeagle.com/wp-json/wp/v2';
const CATEGORY_ID = 5; // Therapist Resources
const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content', 'blog');
const IMAGES_DIR = path.join(ROOT, 'public', 'blog-images');
const SIZE_WARN_BYTES = 1.5 * 1024 * 1024;

function loadEnv() {
  const envPath = path.join(ROOT, '.env');
  const fileEnv = {};
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m) fileEnv[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
  const get = (...names) => {
    for (const n of names) {
      if (process.env[n]) return process.env[n];
      if (fileEnv[n]) return fileEnv[n];
    }
    return null;
  };
  return {
    username: get('WP_USERNAME', 'VITE_WP_USERNAME'),
    appPassword: get('WP_APP_PASSWORD', 'VITE_WP_APP_PASSWORD'),
  };
}

async function fetchAllPosts(headers) {
  const posts = [];
  for (let page = 1; ; page++) {
    const url = `${WP_BASE}/posts?categories=${CATEGORY_ID}&status=publish&_embed&per_page=100&page=${page}`;
    const res = await fetch(url, { headers });
    if (res.status === 400 && page > 1) break; // past the last page
    if (!res.ok) throw new Error(`WP fetch failed (${res.status}): ${url}`);
    const batch = await res.json();
    posts.push(...batch);
    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
    if (page >= totalPages) break;
  }
  return posts;
}

async function downloadImage(url, destDir, headers) {
  const basename = decodeURIComponent(path.basename(new URL(url).pathname));
  if (!basename) return { url, skipped: true };
  const dest = path.join(destDir, basename);
  if (fs.existsSync(dest)) return { url, basename, existed: true };
  // Heavy originals get re-encoded to .webp and deleted — don't re-download.
  const webpSibling = path.join(destDir, basename.replace(/\.[a-z0-9]+$/i, '.webp'));
  if (fs.existsSync(webpSibling)) return { url, basename, existed: true };

  const res = await fetch(url, { headers });
  if (!res.ok) return { url, basename, failed: `HTTP ${res.status}` };
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(dest, buf);
  return { url, basename, bytes: buf.length };
}

async function main() {
  const { username, appPassword } = loadEnv();
  if (!username || !appPassword) {
    console.error('❌ Missing WP_USERNAME / WP_APP_PASSWORD (or VITE_ equivalents) in env or .env');
    process.exit(1);
  }
  const headers = {
    Authorization: `Basic ${Buffer.from(`${username}:${appPassword}`).toString('base64')}`,
  };

  console.log(`Fetching published posts in category ${CATEGORY_ID}…`);
  const wpPosts = await fetchAllPosts(headers);
  console.log(`Found ${wpPosts.length} post(s).`);
  fs.mkdirSync(CONTENT_DIR, { recursive: true });

  const warnings = [];
  for (const wp of wpPosts) {
    const post = normalizeWpPost(wp);
    const jsonPath = path.join(CONTENT_DIR, `${post.id}.json`);
    fs.writeFileSync(jsonPath, `${JSON.stringify(post, null, 2)}\n`);

    const imageUrls = collectWpImageUrls(post, parse);
    const destDir = path.join(IMAGES_DIR, String(post.id));
    for (const url of imageUrls) {
      const r = await downloadImage(url, destDir, headers);
      if (r.failed) warnings.push(`image failed (${r.failed}): ${url}`);
      else if (r.bytes > SIZE_WARN_BYTES) {
        warnings.push(`large image (${(r.bytes / 1024 / 1024).toFixed(1)} MB): blog-images/${post.id}/${r.basename}`);
      }
    }
    console.log(`✓ #${post.id} ${post.slug} (${imageUrls.length} image(s))`);
  }

  if (warnings.length) {
    console.log('\nWarnings:');
    for (const w of warnings) console.log(`  ⚠ ${w}`);
  }
  console.log(`\nDone. Review the diff in content/blog/ and public/blog-images/, then commit.`);
}

main().catch((err) => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
