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

test('buildLlmsFull drops inline script/style content, keeps real text', () => {
  const posts = [
    { title: 'Widget Post', slug: 'widget', date_gmt: '2026-06-01T00:00:00Z',
      content: '<p>Keep this sentence.</p><script>var leak = function(){return 1;};</script><style>.x{color:red}</style>' },
  ];
  const out = buildLlmsFull(posts, { site: 'https://example.com' });
  assert.ok(out.includes('Keep this sentence.'));
  assert.ok(!out.includes('var leak'));
  assert.ok(!out.includes('color:red'));
});
