# Layer 2 — authored AEO fields via WordPress `tr_seo` meta

**Status:** designed, not deployed. Needs a small file uploaded to the WordPress install (`blog.reagleeagle.com`). **Not needed for the current Foundations cluster** — those posts have no `sources`, and `answer_block`/`faq` derive accurately in Layer 1. Do this only when a post needs *authored* (not body-derived) `answer_block`/`faq`/`sources`, or when body structure makes derivation unreliable.

## What Layer 1 already does (no WordPress change)

`tools/blog/lib/wp-normalize.js` and the mirrored n8n **TR Blog Sync** node `cc1` build the full `content/blog/{id}.json` record by deriving from the post body + slug + shared entities. They already **prefer** authored values when present: `seo.answer_block`, `seo.faq`, `seo.sources`, `seo.date_modified`. Layer 2 just makes those authored values arrive. **No pipeline or n8n change is required** — only the WordPress side and the push script.

## Confirmed `tr_seo` mechanism (verified 2026-06-14)

`tr_seo` is a custom REST field on `blog.reagleeagle.com` exposing SmartCrawl meta + a custom byline:

| `tr_seo` key | backed by meta | source |
|---|---|---|
| `title` | `_wds_title` | SmartCrawl |
| `metadesc` | `_wds_metadesc` | SmartCrawl |
| `keyphrases` | `_wds_focus-keywords` | SmartCrawl |
| `byline` | `tr_byline` | custom |

The post `meta` object is REST-exposed, so new registered meta keys appear there and can be injected into `tr_seo` without editing the original registration.

## Step 1 — deploy the mu-plugin (server-side; needs WP file access)

Upload `tools/blog/deploy/tr-seo-aeo.php` to `wp-content/mu-plugins/tr-seo-aeo.php`. It is self-contained: registers `tr_answer_block` / `tr_faq` / `tr_sources` / `tr_date_modified` (REST-writable by editors) and injects them into `tr_seo` via a `rest_prepare_post` filter. It does **not** touch the existing tr_seo code. Reversible: delete the file.

Deploy routes (any one):
- **Hostinger hPanel → File Manager** (recommended; ~2 min, no risk to existing code).
- **SFTP/SSH** — `.env` has SSH vars (`SSH_HOST_COMMAND`, `SSH_ROOT`, ...). Use only after confirming which host is the WordPress install; editing a live site this way is hard to reverse.
- **A "Code Snippets" plugin**, if installed — paste the body of the PHP file as a new active snippet (skip the file upload).
- WP admin → Plugin/Theme File Editor (paste into a child theme `functions.php`) — works, but a mu-plugin is cleaner and survives theme changes.

## Step 2 — write the meta on push (`.claude/scripts/push_blog_to_wp.py`)

Today the script sends `meta: {description}`. Replace with the SmartCrawl + custom keys, parsed from frontmatter:

```python
payload["meta"] = {
    "_wds_title": fm.get("seo_title", title),
    "_wds_metadesc": meta_desc,
    "_wds_focus-keywords": fm.get("smartcrawl_keyphrases", ""),
    "tr_byline": fm.get("byline", ""),
    "tr_answer_block": fm.get("answer_block", ""),
    "tr_faq": json.dumps(faq_list),          # frontmatter faq -> [{q,a}]
    "tr_sources": json.dumps(sources_list),  # frontmatter sources -> [..]; omit if empty
    "tr_date_modified": to_utc_iso(fm.get("date_modified")),
}
```

Caveat: the current `parse_frontmatter` is line-based and does **not** parse the nested `faq:` / `sources:` YAML lists. Switch the frontmatter block to `yaml.safe_load`, or add small list parsers, before this will populate `tr_faq`/`tr_sources`. WordPress silently ignores unregistered meta keys, so this change is a safe no-op until Step 1 ships. (Whether SmartCrawl's `_wds_*` accept REST writes depends on their registration; if not, set the SEO fields in the SmartCrawl box as today — the `tr_*` keys are the ones this feature relies on.)

## Step 3 — mirror in the n8n **WordPress Auto-Publish** node

`WordPress Auto-Publish` (id `lGn7vqTExAOgraYzRzeJJ`) duplicates the Python push. If posts go through it, give its payload the same `meta` keys. (Worth flagging separately: the Python script and this node do the same job — a consolidation candidate.)

## Verify

1. Push a post; `GET …/wp-json/wp/v2/posts?slug=…&_fields=tr_seo` → `tr_seo` now shows authored `answer_block` / `faq` / `sources` / `date_modified`.
2. Publish it; the TR Blog Sync record carries the authored values instead of the derived ones. Confirm `faq` matches the frontmatter verbatim (the build's FAQ visible/structured parity check stays clean).
3. If the WP round-trip proves too constrained, the documented fallback is generating the JSON straight from the markdown frontmatter (skips WordPress entirely).
