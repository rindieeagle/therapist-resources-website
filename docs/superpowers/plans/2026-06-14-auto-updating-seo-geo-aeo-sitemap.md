# Auto-Updating SEO / GEO / AEO Discovery Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the build regenerate four correct, data-driven discovery files on every `npm run build` — `sitemap.xml` (stable `lastmod` + images), `robots.txt` (explicit AI-crawler posture), `llms.txt` (spec-compliant index), and `llms-full.txt` (full article text) — with no hand-maintained URL lists.

**Architecture:** A new `tools/blog/lib/discovery.js` owns the static-page manifest, a git-based `lastmod` helper, and the full-content builder. `tools/blog/lib/feeds.js` is extended for the image-aware sitemap and the new `llms.txt`. `tools/blog/build-blog.js` wires it in (it already owns `dist/` writes and runs after `vite build`). The fragile `<Helmet>`-scraping `generate-llms.js` is retired.

**Tech Stack:** Plain Node.js ESM (v25), built-in `node:test`, `node:child_process` for git. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-06-14-auto-updating-seo-geo-aeo-sitemap-design.md`

---

## File Structure

| File | Responsibility |
|------|----------------|
| `tools/blog/lib/discovery.js` (new) | `PAGE_MANIFEST`, `SITE_SUMMARY`, `gitLastModified()`, `buildLlmsFull()` |
| `tools/blog/lib/discovery.test.js` (new) | Unit tests for `gitLastModified` + `buildLlmsFull` |
| `tools/blog/lib/feeds.js` (modify) | `buildSitemap()` gains images + git `lastmod`; new `buildLlmsTxt()` replaces `appendBlogToLlmsTxt()` |
| `tools/blog/lib/feeds.test.js` (new) | Unit tests for `buildSitemap` + `buildLlmsTxt` |
| `tools/blog/build-blog.js` (modify) | Wire new writers; drop `appendBlogToLlmsTxt` |
| `public/robots.txt` (modify) | Explicit AI-crawler allow block |
| `package.json` (modify) | `build` drops `generate-llms` prefix; add `test` script |
| `tools/generate-llms.js` (delete) | Retired — replaced by `buildLlmsTxt` |
| `public/llms.txt` (delete) | Retired seed — now written directly to `dist/` |

---

## Task 0: Create the feature branch

- [ ] **Step 1: Branch off main**

Run:
```bash
git checkout -b feat/seo-geo-aeo-discovery
```
Expected: `Switched to a new branch 'feat/seo-geo-aeo-discovery'`

---

## Task 1: Discovery module — manifest, git lastmod, full-content builder

**Files:**
- Create: `tools/blog/lib/discovery.js`
- Test: `tools/blog/lib/discovery.test.js`

- [ ] **Step 1: Write the discovery module**

Create `tools/blog/lib/discovery.js`:

```js
// Discovery layer for SEO/GEO/AEO: the static-page manifest, a stable
// (git-based) lastmod helper, and the full-content dump for AI answer engines.
// Lives below feeds.js in the import graph: imports only content.js + entities.js.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { SITE } from './entities.js';
import { stripHtml, decodeEntities } from './content.js';

// One-line site summary, reused verbatim by llms.txt and llms-full.txt.
export const SITE_SUMMARY =
  'Clinical documentation training and practice tools for therapists, by Rindie Eagle, MA, LPCC. Notes that hold up to audits, courses, and web apps.';

// Live SPA routes only. `source` (repo-root-relative) backs the lastmod date;
// `description` feeds llms.txt. ResourcesPage is intentionally absent — its route
// is commented out in src/App.jsx. Re-enable by adding one row here.
export const PAGE_MANIFEST = [
  {
    route: '/',
    source: 'src/components/HomePage.jsx',
    title: 'Home',
    description:
      'Therapist Resources: clinical documentation training, courses, and practice tools for therapists.',
  },
  {
    route: '/courses',
    source: 'src/pages/CoursesPage.jsx',
    title: 'Courses',
    description:
      'Courses for therapists on audit-ready clinical documentation, including the Write it Right series.',
  },
  {
    route: '/web-apps',
    source: 'src/pages/WebAppsPage.jsx',
    title: 'Web Apps',
    description:
      'Web apps and interactive tools that help therapists document faster and stay audit-ready.',
  },
];

// Last resort when git history and the file itself are both unavailable.
const FALLBACK_DATE = '2026-01-01T00:00:00.000Z';

// ISO date of the last commit that touched `filePath`. Falls back to the file's
// mtime, then a constant — never throws, so a shallow CI clone can't fail the build.
export function gitLastModified(filePath, { root = process.cwd() } = {}) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', filePath], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (out) return new Date(out).toISOString();
  } catch {
    // git missing, not a repo, or file untracked — fall through to mtime.
  }
  try {
    return fs.statSync(path.join(root, filePath)).mtime.toISOString();
  } catch {
    return FALLBACK_DATE;
  }
}

// Full plaintext of every post for deep AI ingestion. Newest-first (callers pass
// posts already sorted that way). Body HTML is flattened via the shared stripHtml.
export function buildLlmsFull(posts, { site = SITE, summary = SITE_SUMMARY } = {}) {
  const sections = posts.map((post) => {
    const title = decodeEntities(post.title);
    const url = `${site}/blog/${post.slug}/`;
    const modified = post.modified_gmt || post.date_gmt;
    const body = stripHtml(post.content || '');
    return `# ${title}\nURL: ${url}\nPublished: ${post.date_gmt}  Modified: ${modified}\n\n${body}`;
  });
  return `# Therapist Resources — Full Content\n\n> ${summary}\n\n${sections.join('\n\n---\n\n')}\n`;
}
```

- [ ] **Step 2: Write the failing tests**

Create `tools/blog/lib/discovery.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gitLastModified, buildLlmsFull, PAGE_MANIFEST } from './discovery.js';

const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

test('gitLastModified returns an ISO date for a tracked file', () => {
  const date = gitLastModified('package.json');
  assert.match(date, ISO);
});

test('gitLastModified falls back to the constant for a missing, untracked path', () => {
  const date = gitLastModified('no/such/file-xyz.nope');
  assert.equal(date, '2026-01-01T00:00:00.000Z');
});

test('PAGE_MANIFEST excludes the hidden /resources route', () => {
  assert.ok(!PAGE_MANIFEST.some((p) => p.route === '/resources'));
});

test('buildLlmsFull renders a section per post with title, url, and body', () => {
  const posts = [
    { title: 'First &amp; Best', slug: 'first', date_gmt: '2026-06-01T00:00:00Z',
      modified_gmt: '2026-06-02T00:00:00Z', content: '<p>Hello <strong>world</strong>.</p>' },
    { title: 'Second', slug: 'second', date_gmt: '2026-05-01T00:00:00Z',
      content: '<p>Body two.</p>' },
  ];
  const out = buildLlmsFull(posts, { site: 'https://example.com' });
  assert.ok(out.startsWith('# Therapist Resources — Full Content\n\n> '));
  assert.ok(out.includes('# First & Best'));
  assert.ok(out.includes('URL: https://example.com/blog/first/'));
  assert.ok(out.includes('Hello world.'));
  assert.ok(out.includes('# Second'));
  assert.ok(out.includes('\n---\n'));
});
```

- [ ] **Step 3: Run the tests to verify they pass**

Run: `node --test tools/blog/lib/discovery.test.js`
Expected: PASS — `# pass 4`, `# fail 0`.

- [ ] **Step 4: Commit**

```bash
git add tools/blog/lib/discovery.js tools/blog/lib/discovery.test.js
git commit -m "feat(blog): add discovery module (page manifest, git lastmod, llms-full)"
```

---

## Task 2: Upgrade feeds.js — image-aware sitemap + spec-compliant llms.txt

**Files:**
- Modify: `tools/blog/lib/feeds.js`
- Test: `tools/blog/lib/feeds.test.js`

- [ ] **Step 1: Update imports**

In `tools/blog/lib/feeds.js`, replace the entire import block at the top (currently lines 3-6, the `import fs` line through the `deriveMeta` import) so it reads:

```js
import { SITE, escapeXml, stripHtml, truncate, decodeEntities } from './content.js';
import { deriveMeta } from './seo.js';
import { PAGE_MANIFEST, SITE_SUMMARY, gitLastModified } from './discovery.js';
```

This intentionally drops the `import fs from 'fs';` and `import path from 'path';` lines — `appendBlogToLlmsTxt` (removed in Step 3) was their only consumer; `buildSitemap` and `buildRss` use neither.

- [ ] **Step 2: Replace `buildSitemap` with the image-aware, git-lastmod version**

Replace the entire existing `buildSitemap` function (currently lines 10-44, the `STATIC_ROUTES` const through the closing `}`) with:

```js
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
      post._cardImage && post._cardImage.startsWith('/')
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
```

- [ ] **Step 3: Replace `appendBlogToLlmsTxt` with `buildLlmsTxt`**

Replace the entire existing `appendBlogToLlmsTxt` function (currently lines 77-86) with:

```js
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
```

(`fs` / `path` are no longer used by this function; leave the top-of-file `import fs` / `import path` in place — `buildRss` and other code may rely on them. If lint flags them as unused after this change, remove only the now-unused ones.)

- [ ] **Step 4: Write the failing tests**

Create `tools/blog/lib/feeds.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSitemap, buildLlmsTxt } from './feeds.js';

const POSTS = [
  {
    title: 'Medical Necessity', slug: 'medical-necessity', date_gmt: '2026-06-01T00:00:00Z',
    modified_gmt: '2026-06-10T00:00:00Z', _cardImage: '/blog-images/283/mn.png',
    featured: { alt: 'Four criteria cards' }, seo: { metadesc: 'Four criteria, explained.' },
  },
  {
    title: 'No Image Post', slug: 'no-image', date_gmt: '2026-05-01T00:00:00Z',
    _cardImage: 'https://blog.reagleeagle.com/x.png', // hotlinked → no image entry
    excerpt: '<p>Just an excerpt.</p>',
  },
];

test('buildSitemap declares the image namespace and emits local images only', () => {
  const xml = buildSitemap({ posts: POSTS, topicSlugs: ['golden-thread'], indexPageCount: 1 });
  assert.ok(xml.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'));
  assert.ok(xml.includes('<image:loc>https://therapistresources.com/blog-images/283/mn.png</image:loc>'));
  assert.ok(xml.includes('<image:caption>Four criteria cards</image:caption>'));
  // hotlinked post gets no image entry
  assert.equal(xml.match(/<image:image>/g).length, 1);
});

test('buildSitemap includes static pages and topic + post URLs, no changefreq', () => {
  const xml = buildSitemap({ posts: POSTS, topicSlugs: ['golden-thread'], indexPageCount: 2 });
  assert.ok(xml.includes('<loc>https://therapistresources.com/courses</loc>'));
  assert.ok(xml.includes('<loc>https://therapistresources.com/blog/page/2/</loc>'));
  assert.ok(xml.includes('<loc>https://therapistresources.com/blog/topic/golden-thread/</loc>'));
  assert.ok(xml.includes('<loc>https://therapistresources.com/blog/medical-necessity/</loc>'));
  assert.ok(!xml.includes('<changefreq>'));
  assert.ok(!xml.includes('<priority>'));
});

test('buildLlmsTxt is spec-compliant, lists live pages, and drops /resources', () => {
  const txt = buildLlmsTxt({ posts: POSTS });
  assert.ok(txt.startsWith('# Therapist Resources\n\n> '));
  assert.ok(txt.includes('## Pages'));
  assert.ok(txt.includes('(https://therapistresources.com/courses)'));
  assert.ok(!txt.includes('/resources'));
  assert.ok(txt.includes('## Blog Posts'));
  assert.ok(txt.includes('(https://therapistresources.com/blog/medical-necessity/): Four criteria, explained.'));
});
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `node --test tools/blog/lib/feeds.test.js`
Expected: PASS — `# pass 3`, `# fail 0`.
Then run `node --test 'tools/blog/lib/**/*.test.js'` (Node-expanded glob — note: a bare directory path like `tools/blog/lib/` does NOT work in Node 25, it tries to load the dir as a module) to confirm BOTH suites pass: `# pass 7`.

- [ ] **Step 6: Commit**

```bash
git add tools/blog/lib/feeds.js tools/blog/lib/feeds.test.js
git commit -m "feat(blog): image-aware sitemap + spec-compliant llms.txt"
```

---

## Task 3: Wire the new writers into the blog build

**Files:**
- Modify: `tools/blog/build-blog.js`

- [ ] **Step 1: Update the feeds import**

In `tools/blog/build-blog.js`, change the feeds import (currently line 20) to:

```js
import { buildSitemap, buildRss, buildLlmsTxt } from './lib/feeds.js';
import { buildLlmsFull } from './lib/discovery.js';
```

- [ ] **Step 2: Replace the feeds-writing block**

Replace the current block (lines 207-210):

```js
  // Feeds + discovery files.
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), buildSitemap({ posts, topicSlugs: topics.map((t) => t.slug), indexPageCount }));
  writePage(path.join(DIST, 'blog', 'feed.xml'), buildRss(posts));
  appendBlogToLlmsTxt(DIST, posts);
```

with:

```js
  // Feeds + discovery files. build-blog owns sitemap.xml, llms.txt, and
  // llms-full.txt outright (written after _cardImage resolution above).
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), buildSitemap({ posts, topicSlugs: topics.map((t) => t.slug), indexPageCount }));
  writePage(path.join(DIST, 'blog', 'feed.xml'), buildRss(posts));
  fs.writeFileSync(path.join(DIST, 'llms.txt'), buildLlmsTxt({ posts }));
  fs.writeFileSync(path.join(DIST, 'llms-full.txt'), buildLlmsFull(posts));
```

- [ ] **Step 3: Update the file header comment**

In the top comment block, replace the two lines (currently lines 7-8):

```js
//   dist/sitemap.xml                   full sitemap (owns the file)
//   dist/llms.txt                      blog section appended
```

with:

```js
//   dist/sitemap.xml                   full sitemap incl. image extension (owns the file)
//   dist/llms.txt                      spec-compliant index (owns the file)
//   dist/llms-full.txt                 full post text for AI answer engines (owns the file)
```

- [ ] **Step 4: Verify the build runs (vite must run first to create dist/assets)**

Run: `npm run build`
Expected: ends with `✓ blog: N post(s), ...`. No `❌ blog build failed`.

- [ ] **Step 5: Commit**

```bash
git add tools/blog/build-blog.js
git commit -m "feat(blog): write sitemap, llms.txt, and llms-full.txt from build"
```

---

## Task 4: Explicit AI-crawler posture in robots.txt

**Files:**
- Modify: `public/robots.txt`

- [ ] **Step 1: Replace robots.txt contents**

Overwrite `public/robots.txt` with:

```
# Therapist Resources — robots.txt
# AI / answer-engine crawlers, allowed for citation visibility (GEO/AEO).
# Flip any single bot to "Disallow: /" to opt it out.
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: *
Allow: /

Sitemap: https://therapistresources.com/sitemap.xml
```

- [ ] **Step 2: Commit**

```bash
git add public/robots.txt
git commit -m "feat(seo): explicit AI-crawler allow-list in robots.txt"
```

---

## Task 5: Retire the old llms generator and update npm scripts

**Files:**
- Delete: `tools/generate-llms.js`, `public/llms.txt`
- Modify: `package.json`

- [ ] **Step 1: Confirm nothing else references the old generator**

Run: `grep -rn "generate-llms\|appendBlogToLlmsTxt" tools/ src/ package.json`
Expected: the only remaining hit is the `package.json` `build` script (fixed next). If anything else appears, stop and resolve it before deleting.

- [ ] **Step 2: Delete the retired files**

Run:
```bash
git rm tools/generate-llms.js public/llms.txt
```
Expected: both files staged for deletion.

- [ ] **Step 3: Update package.json scripts**

In `package.json`, change the `build` script and add a `test` script. The scripts block should read:

```json
  "scripts": {
    "dev": "vite --host :: --port 3000",
    "build": "vite build && node tools/blog/build-blog.js",
    "build:blog": "node tools/blog/build-blog.js",
    "test": "node --test 'tools/blog/lib/**/*.test.js'",
    "migrate:wp": "node tools/migrate-from-wp.js",
    "preview": "vite preview --host :: --port 3000",
    "lint": "eslint . --quiet",
    "lint:warn": "eslint ."
  },
```

- [ ] **Step 4: Run the test script to confirm wiring**

Run: `npm test`
Expected: runs both test files — `# pass 7`, `# fail 0`.

- [ ] **Step 5: Commit**

```bash
git add package.json
git commit -m "chore(build): retire generate-llms.js, add test script"
```

---

## Task 6: End-to-end verification

**Files:** none (verification only)

- [ ] **Step 1: Clean build**

Run: `npm run build`
Expected: succeeds; `✓ blog:` line printed.

- [ ] **Step 2: Sitemap is valid XML with the image namespace**

Run: `xmllint --noout dist/sitemap.xml && grep -c '<image:image>' dist/sitemap.xml`
Expected: no xmllint output (valid), and a count of `<image:image>` entries ≥ 1.
(If `xmllint` is unavailable, run `node -e "require('node:fs').readFileSync('dist/sitemap.xml','utf8')" ` and visually confirm it opens and closes `<urlset>`.)

- [ ] **Step 3: llms.txt is spec-compliant and has no dead /resources link**

Run: `head -8 dist/llms.txt && echo '---' && grep -c '/resources' dist/llms.txt`
Expected: starts with `# Therapist Resources` then a `>` summary; the `/resources` count is `0`.

- [ ] **Step 4: llms-full.txt contains real article body text**

Run: `head -5 dist/llms-full.txt && wc -l dist/llms-full.txt`
Expected: starts with `# Therapist Resources — Full Content`; line count is substantial (full post bodies present).

- [ ] **Step 5: robots.txt shipped with the AI block**

Run: `grep -E 'GPTBot|ClaudeBot|PerplexityBot|Sitemap:' dist/robots.txt`
Expected: all four lines present.

- [ ] **Step 6: Static-page lastmod is stable across rebuilds**

Run:
```bash
A=$(grep -A1 '<loc>https://therapistresources.com/courses</loc>' dist/sitemap.xml | grep lastmod)
npm run build >/dev/null 2>&1
B=$(grep -A1 '<loc>https://therapistresources.com/courses</loc>' dist/sitemap.xml | grep lastmod)
[ "$A" = "$B" ] && echo "STABLE: $A" || echo "DRIFT: $A vs $B"
```
Expected: `STABLE: ...` — the `/courses` lastmod did not change between builds.

- [ ] **Step 7: Lint stays clean**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 8: Final commit (if any verification fixups were made)**

```bash
git add -A
git commit -m "test(seo): verify discovery layer end-to-end" --allow-empty
```

---

## Self-Review Notes

- **Spec coverage:** stable lastmod (Task 2/6), image extension (Task 2), robots AI block (Task 4), spec-compliant llms.txt + dead-link fix (Task 2), llms-full.txt (Task 1/3), single source of truth / retire generator (Task 3/5), edge cases git-fallback + missing-image-skip + entity-decode (Task 1/2 code + tests). All covered.
- **Type/name consistency:** `gitLastModified`, `buildLlmsFull`, `buildLlmsTxt`, `buildSitemap`, `PAGE_MANIFEST`, `SITE_SUMMARY` used identically across discovery.js, feeds.js, build-blog.js, and tests.
- **No placeholders:** every code and command step is concrete.
