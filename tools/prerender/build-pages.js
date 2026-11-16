// Render the existing React pages during the build. No server runs in production.
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'node-html-parser';

process.env.NODE_ENV = 'production';

const root = process.cwd();
const dist = path.join(root, 'dist');
const temporary = path.join(root, 'node_modules', '.cache', 'tr-prerender');
const pages = [
  { route: '/', file: 'index.html' },
  { route: '/courses', file: 'courses.html' },
  { route: '/web-apps', file: 'web-apps.html' },
];
const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
if (!template.includes('<div id="root"></div>')) throw new Error('Prerender root marker is missing');

try {
  const { build } = await import('vite');
  await build({
    logLevel: 'warn',
    build: {
      ssr: path.join(root, 'src', 'entry-server.jsx'),
      outDir: temporary,
      emptyOutDir: true,
      rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } },
    },
  });
  const { render } = await import(pathToFileURL(path.join(temporary, 'entry-server.mjs')).href);

  for (const { route, file } of pages) {
    const { html, head } = render(route);
    if (!parse(html).querySelector('main h1')) throw new Error(`No page content rendered for ${route}`);
    const title = parse(head.title.toString()).text;
    const description = parse(head.meta.toString()).querySelector('meta[name="description"]')?.getAttribute('content');
    const canonical = `https://therapistresources.com${route}`;
    let document = template
      .replace('<div id="root"></div>', `<div id="root" data-prerender-route="${route}">${html}</div>`)
      .replace(/<title>[\s\S]*?<\/title>/, head.title.toString())
      .replace(/<meta name="description"[^>]*\/>/, head.meta.toString())
      .replace(/<link rel="canonical"[^>]*\/>/, head.link.toString());

    document = document.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g, (match, start, json, end) => {
      const data = JSON.parse(json);
      for (const item of data['@graph'] ?? []) {
        if (item['@type'] === 'WebPage') Object.assign(item, { '@id': `${canonical}#webpage`, url: canonical, name: title, description });
      }
      return `${start}${JSON.stringify(data).replace(/</g, '\\u003c')}${end}`;
    });
    await fs.writeFile(path.join(dist, file), document);
  }
  console.log('Prerendered Home, Courses and Web Apps to HTML.');
} finally {
  // Keep the rendering bundle and its source out of the published dist directory.
  await fs.rm(temporary, { recursive: true, force: true });
}
