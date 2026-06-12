// Per-post article page: breadcrumb, byline, featured image, .blog-prose
// body, tag chips, prev/next, related posts, and course/shop CTA.

import { SITE, escapeHtml, decodeEntities } from '../lib/content.js';
import { pageShell } from './chrome.js';
import { deriveMeta, blogPostingJsonLd, breadcrumbJsonLd, faqJsonLd, DEFAULT_BYLINE } from '../lib/seo.js';
import { postCard, formatDate } from './post-card.js';

const SHOP_URL = 'https://reagleeagle.gumroad.com/?section=SoACiIzAf7Uk2VwpGfH5Xg%3D%3D';

function tagChips(tags) {
  if (!tags?.length) return '';
  const chips = tags
    .map(
      (t) =>
        `<a href="/blog/topic/${t.slug}/" class="text-sm px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">${escapeHtml(t.name)}</a>`
    )
    .join('\n          ');
  return `<div class="flex flex-wrap gap-2 mt-10">
          ${chips}
        </div>`;
}

function prevNext(prev, next) {
  if (!prev && !next) return '';
  const cell = (post, label, alignRight) => {
    if (!post) return '<div></div>';
    return `<a href="/blog/${post.slug}/" class="glass rounded-3xl p-5 hover:-translate-y-1 transition-all duration-300 block ${alignRight ? 'text-right' : ''}">
            <p class="text-xs font-semibold text-primary uppercase tracking-wide mb-1">${label}</p>
            <p class="font-bold text-foreground leading-tight">${escapeHtml(decodeEntities(post.title))}</p>
          </a>`;
  };
  return `<nav aria-label="More posts" class="grid sm:grid-cols-2 gap-4 mt-12">
          ${cell(prev, '← Newer', false)}
          ${cell(next, 'Older →', true)}
        </nav>`;
}

function relatedSection(related) {
  if (!related.length) return '';
  const cards = related.map((p) => postCard(p, { imageSrc: p._cardImage })).join('\n            ');
  return `<section class="mt-16">
          <h2 class="text-2xl md:text-3xl font-bold tr-grad-text mb-8">Related Posts</h2>
          <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            ${cards}
          </div>
        </section>`;
}

const CTA_BLOCK = `<section class="glass-strong rounded-3xl p-8 md:p-10 mt-16 text-center">
          <h2 class="text-2xl md:text-3xl font-bold tr-grad-text mb-3">Write documentation that holds up</h2>
          <p class="max-w-2xl mx-auto text-foreground/90 mb-6">Session-ready courses, worksheets, and clinical tools built for working therapists — no prep time required.</p>
          <div class="flex flex-wrap justify-center gap-4">
            <a href="/courses" class="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">Explore Courses</a>
            <a href="${SHOP_URL}" target="_blank" rel="noopener noreferrer" class="px-6 py-3 rounded-xl border border-border bg-card text-primary font-semibold hover:bg-accent transition-colors">Visit the Shop</a>
          </div>
        </section>`;

export function renderPostPage({ post, contentHtml, faqItems, featuredSrc, prev, next, related, cssHref }) {
  const canonical = `${SITE}/blog/${post.slug}/`;
  const { title, description } = deriveMeta(post);
  const displayTitle = decodeEntities(post.title);
  const byline = post.byline || DEFAULT_BYLINE;

  const published = formatDate(post.date);
  const updated = formatDate(post.modified);
  const dateLine =
    updated !== published
      ? `${published} <span class="text-foreground/50">·</span> Updated ${updated}`
      : published;

  const featured = featuredSrc
    ? `<figure class="glass rounded-3xl overflow-hidden shadow-2xl mb-10">
          <img src="${escapeHtml(featuredSrc)}" alt="${escapeHtml(post.featured?.alt || displayTitle)}"${
            post.featured?.width ? ` width="${post.featured.width}"` : ''
          }${post.featured?.height ? ` height="${post.featured.height}"` : ''} decoding="async" class="w-full h-auto object-cover" />
        </figure>`
    : '';

  const ogImage = featuredSrc
    ? featuredSrc.startsWith('http')
      ? featuredSrc
      : `${SITE}${featuredSrc}`
    : `${SITE}/logo.png`;

  const ogExtra = `  <meta property="article:published_time" content="${post.date_gmt}" />
  <meta property="article:modified_time" content="${post.modified_gmt}" />
`;

  const jsonLd = [
    blogPostingJsonLd(post, { canonical, imageUrl: ogImage }),
    breadcrumbJsonLd([
      { name: 'Home', url: `${SITE}/` },
      { name: 'Blog', url: `${SITE}/blog/` },
      { name: displayTitle },
    ]),
    ...(faqItems.length ? [faqJsonLd(faqItems)] : []),
  ];

  const body = `      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-32">
        <nav aria-label="Breadcrumb" class="text-sm text-muted-foreground mb-6">
          <a href="/" class="hover:text-primary transition-colors">Home</a>
          <span class="mx-1">›</span>
          <a href="/blog/" class="hover:text-primary transition-colors">Blog</a>
          <span class="mx-1">›</span>
          <span class="text-foreground/80">${escapeHtml(displayTitle)}</span>
        </nav>
        <article>
          <header class="mb-10">
            <h1 class="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">${escapeHtml(displayTitle)}</h1>
            <p class="text-foreground/90 font-medium mb-1">By <span class="text-primary">${escapeHtml(byline)}</span></p>
            <p class="text-sm font-semibold text-primary tracking-wide uppercase">${dateLine}</p>
          </header>
          ${featured}
          <div class="blog-prose">
${contentHtml}
          </div>
          ${tagChips(post.tags)}
        </article>
        ${prevNext(prev, next)}
        ${CTA_BLOCK}
        ${relatedSection(related)}
      </div>`;

  return pageShell({
    title,
    description,
    canonical,
    cssHref,
    ogType: 'article',
    ogImage,
    ogExtra,
    jsonLd,
    body,
  });
}
