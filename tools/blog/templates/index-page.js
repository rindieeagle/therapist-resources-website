// Blog index + topic hub pages. Layout mirrors the original BlogPage.jsx:
// gradient heading, mobile topic pills, sticky glass sidebar with topic
// search, 3-column card grid, numbered pagination — all as real links.

import { SITE, escapeHtml } from '../lib/content.js';
import { pageShell } from './chrome.js';
import { blogIndexJsonLd, breadcrumbJsonLd } from '../lib/seo.js';
import { postCard } from './post-card.js';

const VISIBLE_TOPICS = 15;

const topicLinkCls = (active) =>
  `text-sm px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-left shrink-0 ${
    active ? 'text-primary font-semibold bg-primary/10' : 'text-foreground/70 hover:text-primary hover:bg-accent'
  }`;

function topicLink(topic, activeTopic, extraCls = '') {
  const active = activeTopic?.slug === topic.slug;
  return `<a href="/blog/topic/${topic.slug}/" data-topic="${escapeHtml(topic.name.toLowerCase())}" class="${topicLinkCls(active)}${extraCls}">${escapeHtml(topic.name)}</a>`;
}

function sidebar(topics, activeTopic) {
  const links = topics
    .map((t, i) => topicLink(t, activeTopic, i >= VISIBLE_TOPICS ? ' js-topic-extra hidden' : ''))
    .join('\n          ');
  const showMore =
    topics.length > VISIBLE_TOPICS
      ? `<button type="button" id="js-topic-more" class="w-full mt-3 pt-3 border-t border-border text-sm text-primary hover:text-primary/80 transition-colors">Show all topics</button>`
      : '';

  return `<aside class="hidden lg:block">
      <div class="sticky top-28 glass rounded-3xl p-6">
        <h3 class="text-lg font-bold text-foreground mb-3">Topics</h3>
        <input id="js-topic-search" type="text" placeholder="Search topics..." class="w-full px-3 py-2 mb-3 rounded-lg bg-card border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors" />
        <div id="js-topic-list" class="flex flex-col gap-1">
          <a href="/blog/" class="${topicLinkCls(!activeTopic)}">All Posts</a>
          ${links}
        </div>
        ${showMore}
      </div>
    </aside>`;
}

function mobilePills(topics, activeTopic) {
  const pills = topics
    .slice(0, VISIBLE_TOPICS)
    .map((t) => topicLink(t, activeTopic))
    .join('\n        ');
  return `<div class="lg:hidden mb-8">
      <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <a href="/blog/" class="${topicLinkCls(!activeTopic)}">All Posts</a>
        ${pills}
      </div>
    </div>`;
}

function pagination(page, totalPages, baseUrl) {
  if (totalPages <= 1) return '';
  const pageUrl = (n) => (n === 1 ? baseUrl : `${baseUrl}page/${n}/`);
  const disabled = 'px-4 py-2 rounded-xl border border-border text-muted-foreground/50 cursor-not-allowed';
  const enabled = 'px-4 py-2 rounded-xl border border-border bg-card text-primary hover:bg-accent transition-colors';

  const prev = page === 1 ? `<span class="${disabled}">Previous</span>` : `<a href="${pageUrl(page - 1)}" class="${enabled}">Previous</a>`;
  const next = page === totalPages ? `<span class="${disabled}">Next</span>` : `<a href="${pageUrl(page + 1)}" class="${enabled}">Next</a>`;
  const numCls = (n) =>
    `w-10 h-10 rounded-xl border inline-flex items-center justify-center transition-colors ${
      n === page
        ? 'border-primary/50 bg-primary/10 text-primary font-semibold'
        : 'border-border bg-card text-foreground/70 hover:bg-accent hover:text-primary'
    }`;
  const numbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .map((n) => (n === page ? `<span class="${numCls(n)}">${n}</span>` : `<a href="${pageUrl(n)}" class="${numCls(n)}">${n}</a>`))
    .join('\n          ');

  return `<div class="flex flex-wrap items-center justify-center gap-2 mt-12">
          ${prev}
          ${numbers}
          ${next}
        </div>`;
}

// Topic search: filters across ALL topics (including the hidden overflow);
// clearing the search restores the default top-15 view.
const TOPIC_SCRIPT = `<script>
(function () {
  var input = document.getElementById('js-topic-search');
  if (!input) return;
  var links = Array.prototype.slice.call(document.querySelectorAll('#js-topic-list [data-topic]'));
  var more = document.getElementById('js-topic-more');
  var expanded = false;
  function refresh() {
    var q = input.value.trim().toLowerCase();
    links.forEach(function (l) {
      var matches = q ? l.getAttribute('data-topic').indexOf(q) !== -1 : true;
      var overflow = l.classList.contains('js-topic-extra') && !expanded && !q;
      l.classList.toggle('hidden', !matches || overflow);
    });
    if (more) more.classList.toggle('hidden', !!q || expanded);
  }
  input.addEventListener('input', refresh);
  if (more) more.addEventListener('click', function () { expanded = true; refresh(); });
})();
</script>`;

export function renderIndexPage({ posts, topics, activeTopic, page, totalPages, cssHref, allPostCount }) {
  const baseUrl = activeTopic ? `/blog/topic/${activeTopic.slug}/` : '/blog/';
  const canonical = `${SITE}${baseUrl}${page > 1 ? `page/${page}/` : ''}`;

  const pageSuffix = page > 1 ? ` — Page ${page}` : '';
  const title = activeTopic
    ? `${activeTopic.name} Articles for Therapists${pageSuffix} | Therapist Resources Blog`
    : `Therapist Resources Blog: Clinical Documentation & Practice Tools${pageSuffix}`;
  const description = activeTopic
    ? `Articles about ${activeTopic.name} for therapists — practical, evidence-informed guidance from Rindie Eagle, MA, LPCC.`
    : 'Insights, clinical documentation guidance, and practical tools for therapists by Rindie Eagle, MA, LPCC.';

  const subtitle = activeTopic
    ? `Posts about <span class="text-primary font-semibold">${escapeHtml(activeTopic.name)}</span> · <a href="/blog/" class="text-primary hover:text-primary/80 underline underline-offset-4">view all posts</a>`
    : 'Insights, updates, and helpful tools for therapists.';

  const cards = posts.length
    ? posts.map((p) => postCard(p, { imageSrc: p._cardImage })).join('\n            ')
    : '<div class="col-span-full text-center text-muted-foreground py-20"><p class="text-lg">No posts found.</p></div>';

  const body = `      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-32">
        <div class="text-center mb-16">
          <h1 class="text-4xl md:text-5xl font-bold mb-6 tr-grad-text drop-shadow-md pb-2">Latest Resources &amp; Articles</h1>
          <p class="max-w-2xl mx-auto text-xl text-foreground/90">${subtitle}</p>
        </div>
        ${mobilePills(topics, activeTopic)}
        <div class="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
          ${sidebar(topics, activeTopic)}
          <div>
            <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            ${cards}
            </div>
            ${pagination(page, totalPages, baseUrl)}
          </div>
        </div>
      </div>`;

  const jsonLd = [
    ...blogIndexJsonLd({ canonical, posts, description }),
    ...(activeTopic
      ? [breadcrumbJsonLd([
          { name: 'Home', url: `${SITE}/` },
          { name: 'Blog', url: `${SITE}/blog/` },
          { name: activeTopic.name },
        ])]
      : []),
  ];

  return pageShell({
    title,
    description,
    canonical,
    cssHref,
    ogType: 'website',
    jsonLd,
    body,
    extraScript: TOPIC_SCRIPT,
  });
}
