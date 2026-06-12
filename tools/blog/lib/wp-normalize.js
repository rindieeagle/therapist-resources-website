// Normalizes a WordPress REST post (fetched with ?_embed) into the canonical
// content/blog/<id>.json shape consumed by tools/blog/build-blog.js.
// The n8n "TR Blog Sync" workflow has a Code node that mirrors this logic —
// if the shape changes here, update that node too.

export const WP_HOST = 'blog.reagleeagle.com';

export function normalizeWpPost(wp) {
  const media = wp._embedded?.['wp:featuredmedia']?.[0];
  const author = wp._embedded?.author?.[0];
  const terms = (wp._embedded?.['wp:term'] ?? []).flat();
  const tags = terms
    .filter((t) => t && t.taxonomy === 'post_tag')
    .map(({ id, name, slug }) => ({ id, name, slug }));

  const seo = wp.tr_seo ?? {};

  return {
    id: wp.id,
    slug: wp.slug,
    status: wp.status,
    date: wp.date,
    date_gmt: toUtcIso(wp.date_gmt),
    modified: wp.modified,
    modified_gmt: toUtcIso(wp.modified_gmt),
    link: wp.link,
    title: wp.title?.rendered ?? '',
    excerpt: wp.excerpt?.rendered ?? '',
    content: wp.content?.rendered ?? '',
    author: { name: author?.name ?? 'Rindie Eagle' },
    byline: seo.byline || null,
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
    seo: {
      title: seo.title || null,
      metadesc: seo.metadesc || null,
      keyphrases: seo.keyphrases || null,
    },
  };
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
