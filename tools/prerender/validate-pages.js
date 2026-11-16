// Check the published HTML, without executing browser JavaScript.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'node-html-parser';

const dist = path.resolve('dist');
const pages = [
  ['/', 'index.html', ['Professional Resources', 'Caseload Calculator', 'Write it Right']],
  ['/courses', 'courses.html', ['Write it Right Bundle', 'Attract Your Ideal Client', '9.5 NBCC credit hours']],
  ['/web-apps', 'web-apps.html', ['Caseload Calculator', 'Behavioral Definition Builder']],
];
for (const [route, file, content] of pages) {
  const html = await fs.readFile(path.join(dist, file), 'utf8');
  const document = parse(html);
  assert.equal(document.querySelector('#root').getAttribute('data-prerender-route'), route);
  assert.ok(document.querySelector('main h1'), `${route}: missing main heading`);
  for (const text of content) assert.ok(document.querySelector('main').text.includes(text), `${route}: missing ${text}`);
  assert.equal(document.querySelectorAll('link[rel="canonical"]').length, 1);
  assert.equal(document.querySelector('link[rel="canonical"]').getAttribute('href'), `https://therapistresources.com${route}`);
  assert.equal(document.querySelectorAll('meta[name="description"]').length, 1);
  assert.ok(document.querySelector('meta[name="description"]').getAttribute('content').length > 40);
  assert.equal(document.querySelectorAll('title').length, 1);
  const graph = JSON.parse(document.querySelector('script[type="application/ld+json"]').text)['@graph'];
  assert.equal(graph.find(item => item['@type'] === 'WebPage').url, `https://therapistresources.com${route}`);
  assert.ok(document.querySelector('noscript').text.includes('opacity: 1 !important'), `${route}: animation content hidden without JS`);
  assert.ok(document.querySelector('footer').text.includes('ACEP No. 8223'));
  const links = document.querySelectorAll('main a[href]');
  assert.ok(links.length >= 2, `${route}: missing crawlable links`);
  if (route === '/courses') {
    assert.ok(links.some(link => link.getAttribute('href') === 'https://foundations.therapistresources.com'));
    assert.ok(links.some(link => link.text.includes('Download Workbook') && link.getAttribute('href').includes('1_lnW1KFYhhN78Xl7hh0qk6vytT6XuJX7')));
  }
  console.log(`${route}: readable content, links, NBCC footer and metadata passed`);
}
assert.equal((await fs.readdir(dist)).some(file => file.includes('entry-server')), false);
