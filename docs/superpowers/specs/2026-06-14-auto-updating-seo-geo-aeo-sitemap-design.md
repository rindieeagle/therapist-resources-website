# Auto-Updating SEO / GEO / AEO Discovery Layer — Design

**Date:** 2026-06-14
**Status:** Approved (design)
**Owner:** Rindie Eagle

## Problem

The site already auto-generates a sitemap on every build, but the discovery layer
has gaps that weaken both classic SEO and AI/answer-engine visibility (GEO/AEO):

1. **Unstable `lastmod`.** Static routes (`/`, `/courses`, `/web-apps`), the blog
   index, pagination, and topic pages are stamped with the *build time* on every
   build. Search engines learn to distrust `lastmod` that always moves.
2. **Dead link in `llms.txt`.** It advertises `/resources`, but that route is
   commented out in `src/App.jsx` and 404s. Caused by regex-scraping React
   `<Helmet>` tags in `tools/generate-llms.js`.
3. **`llms.txt` is not spec-compliant.** No `# Title`, no `>` summary line.
4. **No full-content file for AI engines.** Answer engines only see titles.
5. **No images in the sitemap**, despite locally-hosted featured images.
6. **AI-crawler posture is implicit.** `User-agent: *  Allow: /` already permits
   them, but nothing documents or controls it.

## Goal

A single, data-driven discovery layer that regenerates on every `npm run build`
from `content/blog/*.json` plus one explicit page list — no hand-maintained URL
lists — producing four correct artifacts: `sitemap.xml`, `robots.txt`,
`llms.txt`, and `llms-full.txt`.

Non-goals: a sitemap index (well under the 50,000-URL limit), `changefreq` /
`priority` (Google ignores both), and changing the Hostinger deploy pipeline.

## Approach (chosen: A — one discovery module, single source of truth)

Consolidate generation into the existing blog build. Add a focused module
`tools/blog/lib/discovery.js` that owns the static-page manifest, the git-based
`lastmod` helper, and the `llms-full.txt` builder; extend `feeds.js` for the
sitemap and `llms.txt`; wire it all through `tools/blog/build-blog.js`, which
already owns `dist/` writes. Retire the brittle `<Helmet>`-scraping path.

Rejected: **B** (minimal patch) keeps the fragile two-stage `llms.txt` flow;
**C** (standalone generator) duplicates JSON reads.

## Architecture

```
content/blog/*.json ─┐
                     ├─> discovery.js (page manifest + git lastmod + full-text)
src page manifest ───┘            │
                                  ├─> feeds.js: buildSitemap()  -> dist/sitemap.xml
                                  ├─> feeds.js: buildLlmsTxt()  -> dist/llms.txt
                                  └─> discovery.js: buildLlmsFull() -> dist/llms-full.txt

public/robots.txt (static, edited once) ──(vite copy)──> dist/robots.txt
```

All writes happen in the `build-blog.js` step (after `vite build` has copied
`public/*` into `dist/`). The existing Hostinger upload carries `dist/` to the
web root, so all four files land at `https://therapistresources.com/<file>`.

## Components

### 1. Static page manifest (`discovery.js`)

Explicit list of live SPA routes mapped to their source file (for `lastmod`),
title, and description. Replaces `<Helmet>` regex scraping.

| Route        | Source file                       | In sitemap | In llms.txt Pages |
|--------------|-----------------------------------|:----------:|:-----------------:|
| `/`          | `src/components/HomePage.jsx`      | yes        | yes               |
| `/courses`   | `src/pages/CoursesPage.jsx`        | yes        | yes               |
| `/web-apps`  | `src/pages/WebAppsPage.jsx`        | yes        | yes               |

`ResourcesPage.jsx` is intentionally excluded (route commented out / hidden).
When the `/resources` route is re-enabled later, add one manifest row.

### 2. `lastmod` resolution (`discovery.js`)

`gitLastModified(filePath)` returns the ISO date of the last commit touching the
file, via `git log -1 --format=%cI -- <path>` (executed with `child_process`).
Fallbacks, in order: file `mtime`, then a hardcoded constant date. This keeps
static-page `lastmod` stable across builds — it only moves when the page's source
actually changes.

- Static pages: `gitLastModified(manifest source)`.
- Posts: `post.modified_gmt || post.date_gmt` (unchanged).
- Blog index / pagination / topics: newest relevant post's modified date
  (unchanged) — content-derived, acceptably stable.

### 3. `sitemap.xml` (extend `feeds.js: buildSitemap`)

- Add `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"` to
  `<urlset>`.
- For each post with a locally-mirrored featured image (`post._cardImage`
  starting with `/blog-images/`), append:
  ```xml
  <image:image>
    <image:loc>https://therapistresources.com/blog-images/.../file.png</image:loc>
    <image:caption>ALT TEXT</image:caption>
  </image:image>
  ```
  Posts whose featured image is not mirrored locally (hotlinked) get no
  `<image:>` entry — never emit a cross-domain/broken image URL.
- Static-page `lastmod` switches from build time to `gitLastModified`.
- Single file; no `changefreq` / `priority`.

`buildSitemap` will need each post's resolved `_cardImage` and `featured.alt`.
`build-blog.js` already computes `_cardImage` before calling feeds — pass posts
through after that resolution.

### 4. `robots.txt` (static, `public/robots.txt`)

Edited once by hand (no generator). Keeps `Allow: /` for all, keeps the
`Sitemap:` line, and adds an explicit, commented allow block for the major AI
crawlers so the posture is documented and any single bot can later be flipped to
`Disallow`:

```
# AI / answer-engine crawlers — allowed for citation visibility (GEO/AEO)
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

### 5. `llms.txt` (consolidate into `feeds.js: buildLlmsTxt`)

Spec-compliant, generated from manifest + JSON (replaces both
`generate-llms.js`'s output and `appendBlogToLlmsTxt`):

```
# Therapist Resources

> Clinical documentation training and practice tools for therapists, by
> Rindie Eagle, MA, LPCC. Notes that hold up to audits, courses, and web apps.

## Pages
- [Home](https://therapistresources.com/): ...
- [Courses](https://therapistresources.com/courses): ...
- [Web Apps](https://therapistresources.com/web-apps): ...

## Blog
- [Blog Index](https://therapistresources.com/blog/): Articles on clinical
  documentation, practice tools, and resources for therapists.

## Blog Posts
- [<title>](https://therapistresources.com/blog/<slug>/): <metadesc>
```

Page descriptions come from the manifest; post descriptions from
`deriveMeta(post).description`. Titles decoded via `decodeEntities`. Use absolute
URLs (better for ingestion than root-relative).

### 6. `llms-full.txt` (new, `discovery.js: buildLlmsFull`)

Full article text for deep ingestion:

```
# Therapist Resources — Full Content

> <same summary line as llms.txt>

# <post title>
URL: https://therapistresources.com/blog/<slug>/
Published: <date_gmt>  Modified: <modified_gmt>

<clean plaintext body — HTML stripped via stripHtml + decodeEntities,
 collapsed whitespace>

---

# <next post title>
...
```

Posts ordered newest-first (same order as the JSON load). Generated from the
post `content` field; no per-post hand editing.

## Wiring (`build-blog.js`)

1. Keep current load of posts/topics and `_cardImage` resolution.
2. After `_cardImage` is set: write `sitemap.xml` (now image-aware + git lastmod),
   `llms.txt`, and `llms-full.txt` via the discovery/feeds functions.
3. Remove the `appendBlogToLlmsTxt` call and the dependence on
   `generate-llms.js` having pre-written `public/llms.txt`.
4. `package.json` `build` script: drop the `node tools/generate-llms.js || true &&`
   prefix (no longer the llms source). Retire or delete `tools/generate-llms.js`
   and the now-unused `public/llms.txt` seed.

## Edge cases

- **git unavailable** (e.g. shallow CI clone): `gitLastModified` falls back to
  `mtime`, then a constant — build never fails on this.
- **Post missing local featured image:** skip its `<image:>` entry.
- **HTML entities** in titles/descriptions: decoded with existing
  `decodeEntities`.
- **Empty/malformed post body** in `llms-full.txt`: emit header with an empty
  body rather than crash.
- **`/resources` re-enabled:** add one manifest row; everything else follows.

## Testing / verification

- `npm run build` succeeds; `dist/` contains all four files.
- `sitemap.xml`: valid XML (`xmllint --noout`), `image:` namespace present,
  static-page `lastmod` matches `git log` dates and is unchanged across two
  consecutive builds with no source changes.
- `llms.txt`: starts with `# `, has `>` summary, contains no `/resources` link,
  lists all current posts.
- `llms-full.txt`: contains the body text of a spot-checked post.
- `robots.txt` in `dist/` matches the upgraded `public/robots.txt`.
- Re-run build after editing a page file → that page's `lastmod` advances; others
  stay put.

## Files touched

- **New:** `tools/blog/lib/discovery.js`
- **Edit:** `tools/blog/lib/feeds.js` (sitemap images + git lastmod;
  `buildLlmsTxt` replaces `appendBlogToLlmsTxt`)
- **Edit:** `tools/blog/build-blog.js` (wiring)
- **Edit:** `public/robots.txt` (AI-crawler block)
- **Edit:** `package.json` (build script)
- **Remove:** `tools/generate-llms.js`, `public/llms.txt` (seed)
