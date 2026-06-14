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
  // every page got a real lastmod (guards against a silent undefined/empty)
  assert.ok(!xml.includes('<lastmod>undefined</lastmod>'));
  assert.ok(!xml.includes('<lastmod></lastmod>'));
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
