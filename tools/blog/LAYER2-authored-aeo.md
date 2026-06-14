# Layer 2 — authored AEO fields via WordPress `tr_seo` meta

**Status:** designed, not deployed. Gated on a server-side mu-plugin edit (WP install, via Hostinger/WP admin). **Not needed for the current Foundations cluster** — those posts have no `sources`, and `answer_block`/`faq` derive accurately in Layer 1. Do this only when a post needs *authored* (not body-derived) `answer_block`/`faq`/`sources`, or when body structure makes derivation unreliable.

## What Layer 1 already does (no WordPress change)

`tools/blog/lib/wp-normalize.js` (and the mirrored n8n **TR Blog Sync** node `cc1`) build the full `content/blog/{id}.json` record — TR `link`/`canonical_url`, `answer_block`, `faq`, `schema_type`, `date_modified`, `related_links`, `author`, `organization`, split `keyphrases` — by deriving from the post body + slug + shared entities. Layer 2 only swaps four derived fields for authored ones.

## Confirmed `tr_seo` mechanism (verified 2026-06-14)

`tr_seo` is a custom REST field on `blog.reagleeagle.com` (registered in a mu-plugin / `functions.php`) that currently exposes:

| `tr_seo` key | backed by meta | source |
|---|---|---|
| `title` | `_wds_title` | SmartCrawl |
| `metadesc` | `_wds_metadesc` | SmartCrawl |
| `keyphrases` | `_wds_focus-keywords` | SmartCrawl |
| `byline` | `tr_byline` | custom |

Layer 2 adds `answer_block`, `faq`, `sources`, `date_modified` to this field.

## Step 1 — extend the mu-plugin (server-side; needs WP file access)

Register the new meta as REST-readable and add them to the `tr_seo` field. Sketch:

```php
add_action('init', function () {
  foreach (['tr_answer_block' => 'string', 'tr_faq' => 'string',
            'tr_sources' => 'string', 'tr_date_modified' => 'string'] as $key => $type) {
    register_post_meta('post', $key, [
      'type' => $type, 'single' => true, 'show_in_rest' => true,
      'auth_callback' => function () { return current_user_can('edit_posts'); },
    ]);
  }
});

// Inside the existing `tr_seo` get_callback, add:
//   'answer_block' => get_post_meta($post['id'], 'tr_answer_block', true) ?: null,
//   'faq'          => json_decode(get_post_meta($post['id'], 'tr_faq', true) ?: 'null', true),
//   'sources'      => json_decode(get_post_meta($post['id'], 'tr_sources', true) ?: 'null', true),
//   'date_modified'=> get_post_meta($post['id'], 'tr_date_modified', true) ?: null,
```

`faq`/`sources` are stored JSON-encoded (arrays), decoded on read. `wp-normalize.js`/`cc1` already prefer `seo.faq`/`seo.sources`/`seo.answer_block`/`seo.date_modified` when present, so no pipeline change is needed once the field returns them.

## Step 2 — write the meta on push (`.claude/scripts/push_blog_to_wp.py`)

Today the script sends `meta: {description}`. Replace with the SmartCrawl + custom keys, parsed from frontmatter (`answer_block`, `faq`, `sources`, `byline`, `smartcrawl_keyphrases`/`meta_description`/`seo_title`):

```python
payload["meta"] = {
    "_wds_title": fm.get("seo_title", title),
    "_wds_metadesc": meta_desc,
    "_wds_focus-keywords": fm.get("smartcrawl_keyphrases", ""),
    "tr_byline": fm.get("byline", ""),
    "tr_answer_block": fm.get("answer_block", ""),
    "tr_faq": json.dumps(parse_yaml_faq(fm)),       # frontmatter faq -> [{q,a}]
    "tr_sources": json.dumps(parse_sources(fm)),    # frontmatter sources -> [..]
    "tr_date_modified": to_utc_iso(fm.get("date_modified")),
}
```

Note: the current frontmatter parser (`parse_frontmatter`) is line-based and does not handle the nested `faq:` / `sources:` YAML lists — switch to PyYAML (`yaml.safe_load`) for the frontmatter block, or add small list parsers. WordPress silently ignores unregistered meta keys, so this is a no-op until Step 1 ships.

## Step 3 — mirror in the n8n **WordPress Auto-Publish** node

`WordPress Auto-Publish` (id `lGn7vqTExAOgraYzRzeJJ`) duplicates the Python push. If posts are pushed through it, give its payload the same `meta` keys. (Separately worth flagging: the Python script and this node do the same job — candidate to consolidate.)

## Verify

1. Push a post; GET `…/wp-json/wp/v2/posts?slug=…&_fields=tr_seo` → `tr_seo` shows authored `answer_block`/`faq`/`sources`/`date_modified`.
2. Publish it; the TR Blog Sync record now carries the authored values (not the derived ones). Confirm `faq` matches the frontmatter verbatim.
3. If too constrained, the documented fallback is generating the JSON straight from markdown frontmatter (skips the WP round-trip entirely).
