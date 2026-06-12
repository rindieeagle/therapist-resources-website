// Static page shell for blog pages: head, header, footer.
// The header/footer markup mirrors src/components/Header.jsx and Footer.jsx
// class-for-class (minus entrance animations). If those components change
// structurally, mirror the change here.

import { SITE, escapeHtml } from '../lib/content.js';

const GA_ID = 'G-QVC5HWYFGL';
const SHOP_URL = 'https://reagleeagle.gumroad.com/?section=SoACiIzAf7Uk2VwpGfH5Xg%3D%3D';
const CONTACT_URL = 'https://rindieme.formaloo.me/contact';

const icon = (paths, cls = 'w-5 h-5') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${cls}" aria-hidden="true">${paths}</svg>`;

const ICONS = {
  moon: icon('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'),
  sun: icon(
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'
  ),
  menu: icon('<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>', 'w-6 h-6'),
  close: icon('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', 'w-6 h-6'),
  linkedin: icon(
    '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>'
  ),
  facebook: icon('<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>'),
  mail: icon('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'),
  heart: icon(
    '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    'w-4 h-4 text-pink-400 fill-pink-400 drop-shadow-md'
  ),
};

const NAV_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Courses', href: '/courses' },
  { name: 'Web Apps', href: '/web-apps' },
  { name: 'Blog', href: '/blog/', active: true },
  { name: 'Shop', href: SHOP_URL, external: true },
  { name: 'Contact', href: CONTACT_URL, external: true },
];

const logoImgs = (cls) =>
  `<img src="/tr-rectangle-logo-on-white.png" alt="Therapist Resources Logo" class="${cls} dark:hidden" />` +
  `<img src="/tr-rectangle-logo-on-blue.png" alt="Therapist Resources Logo" class="${cls} hidden dark:block" />`;

const themeToggleButton = (extraCls = '') =>
  `<button type="button" class="js-theme-toggle inline-flex items-center justify-center rounded-md h-10 w-10 text-foreground hover:bg-accent transition-colors ${extraCls}" aria-label="Toggle dark mode">
    <span class="dark:hidden">${ICONS.moon}</span>
    <span class="hidden dark:block">${ICONS.sun}</span>
  </button>`;

function navLink(item, mobile = false) {
  const base = 'text-foreground/80 hover:text-primary transition-colors duration-300 font-medium';
  const active = 'text-primary font-medium transition-colors duration-300';
  const cls = `${mobile ? 'block py-3 ' : ''}${item.active ? active : base}`;
  const external = item.external ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a href="${escapeHtml(item.href)}" class="${cls}"${external}>${escapeHtml(item.name)}</a>`;
}

function headerHtml() {
  return `<header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass border-b border-border">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <a href="/" aria-label="Therapist Resources home">
          <div class="flex items-center gap-2">
            ${logoImgs('h-8 sm:h-10 w-auto')}
            <span class="hidden sm:inline text-lg sm:text-xl font-bold tr-grad-text">Therapist Resources</span>
          </div>
        </a>
        <div class="hidden md:flex items-center gap-8">
          ${NAV_ITEMS.map((i) => navLink(i)).join('\n          ')}
        </div>
        ${themeToggleButton('hidden md:inline-flex')}
        <div class="md:hidden flex items-center gap-2">
          ${themeToggleButton()}
          <button type="button" id="js-mobile-menu-button" class="inline-flex items-center justify-center rounded-md h-10 w-10 text-foreground hover:bg-accent transition-colors" aria-label="Toggle menu" aria-expanded="false">
            <span class="js-icon-menu">${ICONS.menu}</span>
            <span class="js-icon-close hidden">${ICONS.close}</span>
          </button>
        </div>
      </div>
      <div id="js-mobile-menu" class="hidden md:hidden mt-4 glass rounded-3xl p-4 border border-border">
        ${NAV_ITEMS.map((i) => navLink(i, true)).join('\n        ')}
      </div>
    </nav>
  </header>`;
}

function footerHtml() {
  const year = new Date().getFullYear();
  const social = (href, svg, label) =>
    `<a href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label}" class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 backdrop-blur-sm border border-border shadow-lg transition-all duration-300">${svg}</a>`;

  return `<footer class="relative py-12 px-4 glass border-t border-border shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.3)]">
    <div class="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
    <div class="container mx-auto max-w-6xl relative z-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
        <div class="text-center sm:text-left sm:col-span-2 md:col-span-1">
          <div class="flex items-center justify-center sm:justify-start gap-2 mb-4">
            ${logoImgs('h-auto w-44 max-w-full sm:w-52 md:w-56 object-contain')}
          </div>
        </div>
        <div class="text-center">
          <h3 class="text-foreground font-bold mb-4 text-lg drop-shadow-md">Quick Links</h3>
          <nav class="space-y-2">
            <a href="/" class="block text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">Home</a>
            <a href="/courses" class="block text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">Courses</a>
            <a href="/web-apps" class="block text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">Web Apps</a>
            <a href="/blog/" class="block text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">Blog</a>
          </nav>
        </div>
        <div class="text-center sm:text-right md:text-right">
          <h3 class="text-foreground font-bold mb-4 text-lg drop-shadow-md">Connect</h3>
          <div class="flex gap-4 justify-center sm:justify-end mb-4">
            ${social('https://www.linkedin.com/in/rindieeagle', ICONS.linkedin, 'LinkedIn')}
            ${social('https://www.facebook.com/rindieresources', ICONS.facebook, 'Facebook')}
            ${social(CONTACT_URL, ICONS.mail, 'Contact')}
          </div>
          <p class="text-foreground/80 text-sm font-medium drop-shadow-sm">rindie@therapistresources.com</p>
        </div>
      </div>
      <div class="pt-8 border-t border-border text-center">
        <p class="text-foreground/70 text-sm flex flex-wrap items-center justify-center gap-1 sm:gap-2 font-medium">
          <span>© ${year} Therapist Resources &amp; Encouragement Ink.</span>
          <span class="flex items-center gap-1">
            <span class="hidden xs:inline sm:inline">Made with</span>
            ${ICONS.heart}
            <span class="hidden xs:inline sm:inline">for therapists everywhere.</span>
          </span>
        </p>
        <p class="text-muted-foreground text-xs mt-2 font-medium">All rights reserved. Professional resources designed by Rindie Eagle MA, LPCC</p>
        <div class="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-xs font-medium text-muted-foreground">
          <a href="https://reagleeagle.com/privacy" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="https://reagleeagle.com/terms" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">Terms and Conditions</a>
          <a href="https://reagleeagle.com/cookies" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>`;
}

// Theme toggle + mobile menu, mirroring src/lib/theme.jsx behavior
// (localStorage key 'tr-theme', .dark class + data-theme attribute).
const CHROME_SCRIPT = `<script>
(function () {
  document.querySelectorAll('.js-theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var el = document.documentElement;
      var dark = el.classList.toggle('dark');
      el.setAttribute('data-theme', dark ? 'dark' : 'light');
      try { localStorage.setItem('tr-theme', dark ? 'dark' : 'light'); } catch (e) {}
    });
  });
  var btn = document.getElementById('js-mobile-menu-button');
  var menu = document.getElementById('js-mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', String(!open));
      btn.querySelector('.js-icon-menu').classList.toggle('hidden');
      btn.querySelector('.js-icon-close').classList.toggle('hidden');
    });
  }
})();
</script>`;

// Replicated from index.html so blog pages behave identically (GA4, theme
// bootstrap, FOUC guard, Mailchimp). Deliberately omits the Horizons dev
// tooling that vite injects into the SPA's index.html.
function headHtml({ title, description, canonical, cssHref, ogType, ogImage, ogExtra = '', jsonLd = [] }) {
  const jsonLdBlocks = jsonLd
    .map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
    .join('\n  ');

  return `<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" type="image/png" href="/favicon.png" />
  <link rel="alternate" type="application/rss+xml" title="Therapist Resources Blog" href="${SITE}/blog/feed.xml" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:site_name" content="Therapist Resources" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${ogImage}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${ogImage}" />
${ogExtra}  ${jsonLdBlocks}
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '${GA_ID}');
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
    rel="stylesheet">
  <script>
    (function () {
      try {
        var t = localStorage.getItem('tr-theme') || 'light';
        var el = document.documentElement;
        if (t === 'dark') {
          el.classList.add('dark');
          el.setAttribute('data-theme', 'dark');
        } else {
          el.setAttribute('data-theme', 'light');
        }
      } catch (e) {}
    })();
  </script>
  <!-- Critical CSS to prevent FOUC -->
  <style>
    html, body {
      margin: 0;
      padding: 0;
      min-height: 100vh;
      background: #FAFBFC;
    }

    html.dark, html.dark body {
      background: #0F3A52;
    }
  </style>
  <link rel="stylesheet" href="${cssHref}" />
  <script id="mcjs">!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/6a56fdf5ad057aa9d119505c9/d27ea7b9fcc7366b3dbd77b8a.js");</script>
</head>`;
}

export function pageShell({ title, description, canonical, cssHref, ogType = 'website', ogImage, ogExtra, jsonLd, body, extraScript = '' }) {
  return `<!DOCTYPE html>
<html lang="en">
${headHtml({ title, description, canonical, cssHref, ogType, ogImage: ogImage || `${SITE}/logo.png`, ogExtra, jsonLd })}
<body>
  <div class="min-h-screen bg-background relative overflow-x-hidden">
    <div class="fixed inset-0 bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5 animate-gradient pointer-events-none"></div>
    ${headerHtml()}
    <main>
${body}
    </main>
    ${footerHtml()}
  </div>
  ${CHROME_SCRIPT}
${extraScript}
</body>
</html>
`;
}
