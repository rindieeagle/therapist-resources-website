// Post card markup shared by the blog index, topic hubs, and related-posts
// sections. Mirrors the card design from the original BlogPage.jsx.

import { escapeHtml, decodeEntities } from '../lib/content.js';

export function formatDate(wpDate) {
  // WP `date` is site-local ("2026-06-12T10:00:00") — format the date part
  // directly to avoid timezone shifts.
  const [y, m, d] = wpDate.slice(0, 10).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function postCard(post, { imageSrc }) {
  const url = `/blog/${post.slug}/`;
  const title = decodeEntities(post.title);
  const image = imageSrc
    ? `<img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(post.featured?.alt || title)}" loading="lazy" decoding="async" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />`
    : `<div class="w-full h-full flex flex-col items-center justify-center text-muted-foreground space-y-2"><span class="text-sm font-medium">No Image</span></div>`;

  return `<article class="group relative flex flex-col h-full glass rounded-3xl overflow-hidden shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-1 transition-all duration-300">
  <a href="${url}" class="block h-48 w-full bg-muted overflow-hidden relative cursor-pointer">
    ${image}
    <div class="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
  </a>
  <div class="p-6 flex flex-col flex-1 relative">
    <p class="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">${formatDate(post.date)}</p>
    <div class="flex-1">
      <h3 class="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-tight"><a href="${url}">${escapeHtml(title)}</a></h3>
      <div class="text-foreground/70 line-clamp-3 text-sm leading-relaxed">${post.excerpt}</div>
    </div>
    <div class="mt-auto pt-4 border-t border-border flex items-center">
      <div class="text-sm font-medium text-foreground/90">By <span class="text-primary">${escapeHtml(post.author?.name || 'Rindie Eagle')}</span></div>
      <a href="${url}" class="ml-auto inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">Read more →</a>
    </div>
  </div>
</article>`;
}
