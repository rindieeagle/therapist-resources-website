// Meta derivation and JSON-LD builders for blog pages.
// References the stable @ids defined in index.html's site-wide JSON-LD graph.

import { parse } from 'node-html-parser';
import { decodeEntities, stripHtml, truncate } from './content.js';
import { SITE, ORG_ID, PERSON_ID, WEBSITE_ID, DEFAULT_BYLINE } from './entities.js';

export { ORG_ID, PERSON_ID, WEBSITE_ID, DEFAULT_BYLINE };
const TITLE_SUFFIX = ' | Therapist Resources';

export function deriveMeta(post) {
  const title = post.seo?.title || `${decodeEntities(post.title)}${TITLE_SUFFIX}`;
  const description = post.seo?.metadesc || truncate(stripHtml(post.excerpt), 155);
  return { title, description };
}

// "Rindie Eagle, MA, LPCC & Renee Devine, MS, LMHC" -> [{name, creds}, ...]
export function parseByline(byline) {
  if (!byline) return [];
  return byline
    .split(/\s*(?:&|\band\b)\s*/)
    .map((part) => {
      const [name, ...creds] = part.split(',').map((s) => s.trim());
      return name ? { name, creds: creds.join(', ') || null } : null;
    })
    .filter(Boolean);
}

function authorsJsonLd(post) {
  const people = parseByline(post.byline || DEFAULT_BYLINE);
  const authors = people.map(({ name, creds }) =>
    name.startsWith('Rindie Eagle')
      ? { '@id': PERSON_ID }
      : { '@type': 'Person', name, ...(creds ? { honorificSuffix: creds } : {}) }
  );
  return authors.length === 1 ? authors[0] : authors;
}

export function blogPostingJsonLd(post, { canonical, imageUrl }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${canonical}#article`,
    headline: decodeEntities(post.title),
    description: deriveMeta(post).description,
    ...(imageUrl ? { image: imageUrl } : {}),
    datePublished: post.date_gmt,
    dateModified: post.date_modified || post.modified_gmt,
    author: authorsJsonLd(post),
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    isPartOf: { '@id': WEBSITE_ID },
    ...(post.tags?.length ? { keywords: post.tags.map((t) => t.name).join(', ') } : {}),
    inLanguage: 'en-US',
  };
}

export function breadcrumbJsonLd(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map(({ name, url }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      ...(url ? { item: url } : {}),
    })),
  };
}

// Detects a "## Frequently asked questions" (or FAQ/FAQs) section: the
// questions are the next-level-down headings, each answered by the paragraphs
// that follow until the next heading. Matches the ghostwriting format.
export function detectFaq(contentHtml) {
  const root = parse(contentHtml);
  const blocks = root.childNodes.filter((n) => n.nodeType === 1);
  const isHeading = (el) => /^H[1-6]$/i.test(el.rawTagName || '');
  const level = (el) => Number(el.rawTagName.slice(1));

  const faqIdx = blocks.findIndex(
    (el) => isHeading(el) && /^(faqs?|frequently asked questions)\b/i.test(stripHtml(el.innerHTML))
  );
  if (faqIdx === -1) return [];

  const faqLevel = level(blocks[faqIdx]);
  const items = [];
  let current = null;
  for (const el of blocks.slice(faqIdx + 1)) {
    if (isHeading(el)) {
      if (level(el) <= faqLevel) break;
      if (current?.a) items.push(current);
      current = { q: stripHtml(el.innerHTML), a: '' };
    } else if (current && (el.rawTagName || '').toLowerCase() === 'p') {
      const text = stripHtml(el.innerHTML);
      if (text) current.a = current.a ? `${current.a} ${text}` : text;
    }
  }
  if (current?.a) items.push(current);
  return items;
}

export function faqJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function blogIndexJsonLd({ canonical, posts, name, description }) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      '@id': `${SITE}/blog/#blog`,
      url: `${SITE}/blog/`,
      name: name || 'Therapist Resources Blog',
      description,
      publisher: { '@id': ORG_ID },
      isPartOf: { '@id': WEBSITE_ID },
      inLanguage: 'en-US',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${canonical}#postlist`,
      itemListElement: posts.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE}/blog/${p.slug}/`,
        name: decodeEntities(p.title),
      })),
    },
  ];
}
