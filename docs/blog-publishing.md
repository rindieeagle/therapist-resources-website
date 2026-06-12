# Blog Publishing Pipeline

How a blog post travels from a ghostwritten draft to a real HTML page at
`https://therapistresources.com/blog/<slug>/`.

## Architecture

```
Claude ghostwrites markdown draft
        │  POST https://n8n.reagle.cloud/webhook/wordpress-publish
        ▼
WordPress draft (blog.reagleeagle.com, category 5, noindexed)
        │  Rindie reviews, attaches featured image, clicks Publish
        ▼
wp-content/mu-plugins/tr-blog-webhook.php
        │  POST https://n8n.reagle.cloud/webhook/tr-blog-sync  (secret header)
        ▼
n8n "TR Blog Sync" — fetches post ?_embed, downloads images,
commits content/blog/<id>.json + public/blog-images/<id>/* to GitHub main
        │  push to main
        ▼
Hostinger auto-deploy: npm run build
  = generate-llms.js → vite build → tools/blog/build-blog.js
        │  publishes dist/
        ▼
https://therapistresources.com/blog/<slug>/   (real HTML, full SEO/AEO)
```

WordPress is the **single source of truth** for post content. Never hand-edit
`content/blog/*.json` — edit the post in WordPress and let the pipeline re-sync
(or re-run `npm run migrate:wp` locally).

## What the build generates

`tools/blog/build-blog.js` runs after `vite build` and writes into `dist/`:

- `/blog/<slug>/` — post pages: BlogPosting + BreadcrumbList JSON-LD (FAQPage
  when the post has a "Frequently asked questions" section), OG/Twitter cards,
  canonical, byline, related posts, prev/next, CTA block
- `/blog/` + `/blog/page/N/` — paginated index (9 posts/page), same design as
  the old headless BlogPage
- `/blog/topic/<tag>/` — topic hub pages for every tag
- `/blog/feed.xml` — RSS 2.0
- `/sitemap.xml` — full sitemap (the generator owns this file)
- `/llms.txt` — blog section appended

If the generator fails, the whole build fails and the previous deploy stays
live — that is intentional.

## Ghostwriting format

Posts are authored as markdown files with YAML frontmatter (reference example:
`projects/write-it-right-series/campaigns/foundations/blog/clinical-documentation-audit.md`
in the Claude EA workspace).

| Frontmatter | Destination |
| --- | --- |
| `title`, `slug`, `tags` (names), `excerpt` | WordPress post fields |
| `seo_title`, `meta_description` | SmartCrawl `_wds_title` / `_wds_metadesc` |
| `smartcrawl_keyphrases` | SmartCrawl `_wds_focus-keywords` |
| `byline` | `tr_byline` post meta (supports co-authors, shown on the page + JSON-LD) |
| `category` | `category_id: 5` for Therapist Resources |
| `image_suggestion`, `image_alt_text` | guidance for Rindie when attaching the featured image in WP |
| `faq`, `schema_type`, `internal_links`, `linkedin_hashtags`, `source` | editorial metadata only — NOT pushed to WP |

FAQPage JSON-LD is generated automatically by detecting the body's
`## Frequently asked questions` section — the structured `faq` frontmatter
never needs to reach WordPress.

### Transform rules (markdown → webhook payload)

When pushing a draft, convert the markdown body to HTML and **strip**:

1. the leading `# H1` (WordPress renders the title itself),
2. the `## SmartCrawl Self-Check` section,
3. all `<!-- TODO ... -->` comments.

Keep the answer block, FAQ section, and disclaimer footer in the body.

### Link conventions

- Cross-links to other TR posts are written as their WordPress URLs
  (`https://blog.reagleeagle.com/<slug>/`) so they work in WP preview. The
  build rewrites them to `/blog/<slug>/` once the target slug exists in
  `content/blog/`; until then they're left as-is and flagged as build warnings.
- Canonical URLs use a trailing slash: `https://therapistresources.com/blog/<slug>/`.
- **Slugs are frozen at publish.** Renaming a slug in WP moves the page to a
  new URL and 404s the old one (no redirects by design) — fix typos before
  publishing.

### Webhook payload (`POST /webhook/wordpress-publish`)

```json
{
  "title": "...",
  "content": "<p>HTML body…</p>",
  "slug": "kebab-case-slug",
  "excerpt": "Plain-text excerpt…",
  "category_id": 5,
  "tags": ["clinical documentation", "golden thread"],
  "meta_title": "SEO title",
  "meta_description": "Meta description ≤155 chars",
  "keyphrases": "primary, secondary, third",
  "byline": "Rindie Eagle, MA, LPCC & Renee Devine, MS, LMHC"
}
```

Tags are **names**; the workflow resolves them to IDs and creates missing
tags. The response includes `edit_url` for jumping straight into wp-admin.

## Publish / update / unpublish behavior

- **Publish** in WP → page, index, topic pages, sitemap, RSS, llms.txt all
  generated on the next deploy.
- **Edit** a published post → same path; changes go live within the hour
  (blog HTML has a 1-hour CDN TTL).
- **Unpublish/trash** → n8n deletes `content/blog/<id>.json`; the page and its
  sitemap/feed entries disappear on the next deploy (old URL 404s).

## Images

- n8n downloads the featured + in-content images into
  `public/blog-images/<id>/` and the build serves them from
  therapistresources.com (no hotlinking to the WP subdomain).
- Keep featured images reasonably sized (≲500 KB). Heavy originals can be
  re-encoded locally: `cwebp -q 82 in.png -o in.webp` (the build automatically
  prefers a `.webp` sibling and the original can be deleted).

## Operations

- **n8n workflows**: "TR Blog Sync" (outbound), "WordPress Auto-Publish"
  (inbound drafts), "TR Blog Sync — Error Handler" (Telegram alert on
  failures). Success/unpublish events also notify Telegram.
- **WP plugin**: `wp/tr-blog-webhook.php` in this repo, deployed to
  `wp-content/mu-plugins/` on the blog server. The webhook secret lives in
  `wp-config.php` (`TR_BLOG_WEBHOOK_SECRET`) — never commit it; this repo is
  public.
- **Secrets**: real values live in the gitignored `.env` (see `.env.example`
  for the shape) and in n8n credentials.
- **Full re-sync**: `npm run migrate:wp` (reads `WP_USERNAME`/`WP_APP_PASSWORD`
  from `.env`) — idempotent, safe to re-run anytime.
- **Local preview**: `npm run build && python3 -m http.server 8080 -d dist`,
  then open `http://localhost:8080/blog/`.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Published in WP, nothing on the site | n8n → Executions → "TR Blog Sync" (did the webhook fire? secret match?), then GitHub commit history, then Hostinger deploy log |
| Telegram error alert | The message names the failing node; open that execution in n8n |
| Build failed on Hostinger | Run `npm run build` locally — the generator prints the exact error; a failed build never replaces the live site |
| Post shows hotlinked WP image | Image download failed in n8n (flagged in the build warnings); re-save the post in WP or add the file to `public/blog-images/<id>/` |
| Stale page after an edit | CDN TTL is 1 hour for `/blog/`; hard-refresh or wait |
