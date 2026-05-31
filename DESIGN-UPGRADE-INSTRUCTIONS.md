# Therapist Resources Website — Design Upgrade Instructions

**For:** an AI coding agent working inside this repo (`therapist-resources-website`).
**Goal:** Restyle the site to the Therapist Resources 5/2026 design system (navy-led light remix) **and add a working light/dark mode toggle**. **Light is the default.**
**Hard constraint:** Change styling only. Do **not** change a single word of copy, any link, any image content (except the one clearly-flagged optional logo swap), any route, or any form.

Read this whole document before you start. Then work the steps in order.

---

## 0. The one thing that will trip you up

There is a `design-system/` folder **inside this repo**. **Ignore it. Do not import from it.** It is a stale snapshot that uses the Poppins font. The current, correct design system is a **separate repo** on this machine:

```
/Users/rindie/projects/tr-design-system-5-2026
```

Its canonical token + font source is:

```
/Users/rindie/projects/tr-design-system-5-2026/public/colors_and_type.css
/Users/rindie/projects/tr-design-system-5-2026/public/mobile.css
/Users/rindie/projects/tr-design-system-5-2026/public/fonts/          (Plus Jakarta Sans *.ttf)
/Users/rindie/projects/tr-design-system-5-2026/public/assets/         (new brand logos)
/Users/rindie/projects/tr-design-system-5-2026/SKILL.md               (the design rules)
```

The display font is **Plus Jakarta Sans**, body is **Inter**. Never Poppins.

---

## 1. Current state of this site (what you're changing)

- **Stack:** Vite 4 + React 18 + Tailwind 3.4 + shadcn/Radix UI + framer-motion + lucide-react. Routing via react-router-dom.
- **Styling:** Tailwind utility classes inline in components, plus `src/index.css`. No CSS modules.
- **The site is dark-only, and the dark theme is hardcoded.** Two problems you must fix:
  1. `src/index.css` `:root` holds dark shadcn HSL values, and `body` is `@apply bg-cyan-950 text-slate-200`.
  2. Components hardcode dark colors directly: `text-white/90`, `bg-white/5`, `border-white/10`, `text-cyan-300`, `bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900`, etc. **These will not respond to any toggle.** Converting them to theme-aware tokens is the bulk of this job.
- `tailwind.config.js` already has `darkMode: ['class']` and fonts `['"Plus Jakarta Sans"', 'Inter', 'sans-serif']`. Keep both.

---

## 2. Architecture you're implementing

**Theme model:** Light is the default (no class). Dark is opt-in. A toggle sets, on `<html>`, **both**:
- the `.dark` class (so shadcn's HSL variables flip), **and**
- the `data-theme="dark"` attribute (so the imported `--tr-*` design tokens flip).

Setting both lets us reuse the canonical design-system CSS **unmodified** (it keys dark off `[data-theme="dark"]`) while keeping shadcn's `.dark` convention.

**Token layering:**
1. Import the canonical `colors_and_type.css` → gives all `--tr-*` tokens (light + dark) and the Plus Jakarta Sans `@font-face`.
2. In `src/index.css`, define the shadcn semantic HSL vars (`--background`, `--primary`, …) for **light** in `:root` and **dark** in `.dark`, mapped to the tr palette.
3. Convert hardcoded component classes to semantic Tailwind tokens (`bg-background`, `text-foreground`, `border-border`, `text-primary`, …) that read those vars and therefore flip automatically.

---

## 3. Step-by-step

### Step 3.1 — Branch

```bash
cd /Users/rindie/projects/therapist-resources-website
git checkout -b design-upgrade
npm install   # if node_modules is missing
```

Do all work on `design-upgrade`. **Do not deploy. Do not merge.**

### Step 3.2 — Bring in the canonical tokens, fonts, and logos

Create `src/styles/` and copy the canonical files in:

```bash
mkdir -p src/styles/fonts
cp /Users/rindie/projects/tr-design-system-5-2026/public/colors_and_type.css src/styles/
cp /Users/rindie/projects/tr-design-system-5-2026/public/mobile.css          src/styles/   # optional, mobile primitives
cp /Users/rindie/projects/tr-design-system-5-2026/public/fonts/PlusJakartaSans-*.ttf src/styles/fonts/
# new brand logos into public/
cp /Users/rindie/projects/tr-design-system-5-2026/public/assets/tr-rectangle-logo-on-white.png public/
cp /Users/rindie/projects/tr-design-system-5-2026/public/assets/tr-rectangle-logo-on-blue.png  public/
```

The `@font-face` rules in `colors_and_type.css` use **relative** paths `url("fonts/PlusJakartaSans-*.ttf")`. Because you copied the fonts to `src/styles/fonts/`, those relative paths resolve correctly when the CSS sits in `src/styles/`. Vite/PostCSS will bundle and fingerprint them.

**Conflict note:** `colors_and_type.css` may also style bare elements globally (`body`, `h1`–`h6`, `p`). If those rules fight Tailwind base or this site's layout, neutralize them in your **local copy** (comment out the bare-element selectors). Keep the `:root` token block, the `[data-theme="dark"]` block, and all `@font-face` rules — those are what we need. The file is a local copy; trimming it here does not touch the source repo.

### Step 3.3 — Rewrite `src/index.css`

At the very top, before the Tailwind directives, import the tokens:

```css
@import './styles/colors_and_type.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

Replace the existing single dark `:root { … }` block with a **light** `:root` and a **dark** `.dark` block. Paste these (values pre-computed from the tr palette; fine-tune only if contrast needs it):

```css
@layer base {
  :root {            /* LIGHT — default */
    --background: 210 25% 98%;       /* tr-bg-base   #FAFBFC */
    --foreground: 198 57% 14%;       /* tr-text      #0F2A36 */
    --card: 0 0% 100%;               /* tr-bg-paper  #FFFFFF */
    --card-foreground: 198 57% 14%;
    --popover: 0 0% 100%;
    --popover-foreground: 198 57% 14%;
    --primary: 202 65% 30%;          /* peacock      #1B5A7E */
    --primary-foreground: 0 0% 100%;
    --secondary: 200 33% 97%;        /* surface-soft #F6FAFC */
    --secondary-foreground: 198 57% 14%;
    --muted: 200 43% 96%;            /* tint         #F1F7FA */
    --muted-foreground: 199 24% 38%; /* text-70      #4A6B7A */
    --accent: 200 43% 96%;
    --accent-foreground: 202 65% 30%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;
    --border: 205 28% 92%;           /* tr-border    #E5ECF1 */
    --input: 205 28% 92%;
    --ring: 202 65% 30%;
    --radius: 0.5rem;
  }

  .dark {            /* DARK — opt-in */
    --background: 201 69% 19%;       /* tr dark bg   #0F3A52 */
    --foreground: 0 0% 100%;
    --card: 201 50% 16%;
    --card-foreground: 0 0% 100%;
    --popover: 201 55% 14%;
    --popover-foreground: 0 0% 100%;
    --primary: 199 90% 60%;          /* bright sky/cyan CTA on dark */
    --primary-foreground: 201 69% 12%;
    --secondary: 201 40% 24%;
    --secondary-foreground: 0 0% 100%;
    --muted: 201 35% 26%;
    --muted-foreground: 200 25% 78%;
    --accent: 201 40% 28%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 62% 45%;
    --destructive-foreground: 0 0% 100%;
    --border: 200 30% 30%;
    --input: 200 30% 30%;
    --ring: 199 90% 60%;
  }
}
```

Then update the `body` rule. Replace `@apply bg-cyan-950 text-slate-200 …` with token-driven colors, and drive the backdrop bloom from the theme-aware `--tr-bg-radials` token (it is already defined per-theme in the imported CSS, so it flips for free):

```css
@layer base {
  * { @apply border-border; }

  body {
    @apply bg-background text-foreground antialiased overflow-x-hidden;
    font-family: 'Inter', sans-serif;
    background-image: var(--tr-bg-radials);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
}
```

Keep the film-grain `body::before`, the reduced-motion block, GPU acceleration helpers, mobile blur reductions, and the `@keyframes` — unchanged.

Rewrite the glass utilities to use the tr glass tokens so they flip with the theme:

```css
.glass {
  background: var(--tr-glass-base);
  -webkit-backdrop-filter: var(--tr-glass-blur);
  backdrop-filter: var(--tr-glass-blur);
  border: 1px solid var(--tr-glass-border);
}
.glass-strong {
  background: var(--tr-glass-strong);
  -webkit-backdrop-filter: var(--tr-glass-blur);
  backdrop-filter: var(--tr-glass-blur);
  border: 1px solid var(--tr-glass-border-cta);
}
```

Add a theme-aware brand gradient-text utility (used for the brand wordmark / headline accents):

```css
@layer utilities {
  .tr-grad-text {
    background: var(--tr-grad-headline-light);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .dark .tr-grad-text { background: var(--tr-grad-headline-dark); -webkit-background-clip: text; background-clip: text; }
}
```

Keep `.font-playfair` and `.font-inter` as they are.

### Step 3.4 — Prevent a flash of the wrong theme (FOUC)

In `index.html`, add a blocking script in `<head>` **before** the app loads:

```html
<script>
  (function () {
    try {
      var t = localStorage.getItem('tr-theme') || 'light';
      var el = document.documentElement;
      if (t === 'dark') { el.classList.add('dark'); el.setAttribute('data-theme', 'dark'); }
      else { el.setAttribute('data-theme', 'light'); }
    } catch (e) {}
  })();
</script>
```

(Default is `'light'`. We do not auto-follow the OS preference, so the site opens light for everyone unless they choose dark.)

### Step 3.5 — Theme state + toggle

Create `src/lib/theme.jsx` (a tiny context so the desktop and mobile toggles stay in sync):

```jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'light', toggle: () => {} });

function apply(theme) {
  const el = document.documentElement;
  if (theme === 'dark') { el.classList.add('dark'); el.setAttribute('data-theme', 'dark'); }
  else { el.classList.remove('dark'); el.setAttribute('data-theme', 'light'); }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('tr-theme') || 'light'; } catch { return 'light'; }
  });
  useEffect(() => {
    apply(theme);
    try { localStorage.setItem('tr-theme', theme); } catch {}
  }, [theme]);
  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
```

Create `src/components/ThemeToggle.jsx`:

```jsx
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/theme';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggle } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={className}
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

export default ThemeToggle;
```

Wrap the app. In `src/main.jsx`, wrap `<App />` in `<ThemeProvider>`:

```jsx
import { ThemeProvider } from '@/lib/theme';
// ...
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
```

Place the toggle in `src/components/Header.jsx`:
- Desktop: add `<ThemeToggle />` at the end of the `hidden md:flex …` nav group.
- Mobile: add `<ThemeToggle />` next to the existing hamburger `Button` (keep them in the same flex row), or as the first item in the mobile menu panel.

### Step 3.6 — Convert hardcoded dark classes (the main work)

Go through **every** component and page (list in §4) and replace hardcoded dark colors with theme-aware tokens. Apply this mapping consistently. Change `className` strings only — never the text between tags.

| Current (hardcoded dark) | Replace with (theme-aware) |
|---|---|
| `bg-cyan-950` | `bg-background` |
| `bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900` (App.jsx page wrapper) | `bg-background` (let the body backdrop radials show through) |
| `from-cyan-500/10 via-purple-500/10 to-teal-500/10` (App.jsx animated overlay) | keep the `animate-gradient` overlay but soften: `from-primary/5 via-accent/10 to-primary/5` (works in both modes) |
| `text-white`, `text-white/90`, `text-white/80` | `text-foreground`, `text-foreground/90`, `text-foreground/80` |
| `text-slate-200`, `text-slate-300`, `text-slate-400` | `text-foreground` (primary) or `text-muted-foreground` (secondary/meta) |
| `bg-white/5`, `bg-white/10` (glass panels) | use the `.glass` utility class, or `bg-card` for solid cards |
| `bg-white/15` (stronger glass) | `.glass-strong` |
| `border-white/10`, `border-white/20` | `border-border` |
| `text-cyan-300`, `text-cyan-400`, `text-teal-400` (links / active / accent) | `text-primary` |
| `hover:text-cyan-300` | `hover:text-primary` |
| `hover:bg-white/10` | `hover:bg-accent` |
| brand wordmark gradient `bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent` | `tr-grad-text` |
| `bg-cyan-500` / `bg-teal-500` solid CTA fills | `bg-primary text-primary-foreground` |
| icon badge fills `bg-cyan-500/20` etc. | `bg-primary/10 text-primary` |
| `shadow-…` neutral shadows on cards | keep, or use `shadow-xl` (tinted shadows are optional polish) |

Notes:
- The `Header` is `bg-white/5 border-b border-white/10` → `glass border-b border-border` (or `.glass`).
- Active nav state `text-cyan-300` → `text-primary`; resting `text-white/90` → `text-foreground/80`.
- After conversion, search the repo for any remaining hardcoded dark utility and convert it: `cyan-950|slate-900|slate-200|slate-300|slate-400|white/5|white/10|white/15|white/20|cyan-300|cyan-400|teal-400|purple-900`. Decide each by role (background / text / border / accent) using the table.
- Leave framer-motion props, layout classes (flex, grid, spacing, sizing, rounded-*), and animation utilities untouched.

### Step 3.7 — `tailwind.config.js`

Keep `darkMode: ['class']` and the existing `fontFamily.sans`. No change required. (Optional: add a `tr` color group mapped to the `--tr-*` tokens if you find you need brand colors Tailwind doesn't already expose via the semantic vars. Not required for this job.)

### Step 3.8 — Optional, FLAGGED: logo swap

The Header currently uses `/logo.png` (old circular mark). The 5/2026 system ships a new brand logo. **This changes a visible brand asset — treat it as optional and easy to revert.** If doing it, swap per theme:

```jsx
import { useTheme } from '@/lib/theme';
// inside Header:
const { theme } = useTheme();
<img
  src={theme === 'dark' ? '/tr-rectangle-logo-on-blue.png' : '/tr-rectangle-logo-on-white.png'}
  alt="Therapist Resources Logo"
  className="h-8 sm:h-10 w-auto"
/>
```

If Rindie prefers to keep the existing logo, skip this step entirely — everything else still works.

---

## 4. Files to touch

**Styling / config:**
- `src/index.css` — token rewrite, `@import` tokens, body, glass, gradient util
- `index.html` — FOUC script (and confirm no Poppins `<link>` sneaks in)
- `tailwind.config.js` — verify only

**New files:**
- `src/lib/theme.jsx`
- `src/components/ThemeToggle.jsx`

**Wire-up:**
- `src/main.jsx` — wrap in `ThemeProvider`
- `src/App.jsx` — page wrapper gradient → `bg-background`; soften animated overlay

**Class conversion (every file below):**
- Components: `Header.jsx`, `Footer.jsx`, `Hero.jsx`, `HeroImage.jsx`, `HomePage.jsx`, `Story.jsx`, `ResourcesShowcase.jsx`, `ProjectRoadmap.jsx`, `CallToAction.jsx`, `WelcomeMessage.jsx`
- Pages: `pages/CoursesPage.jsx`, `pages/WebAppsPage.jsx`, `pages/BlogPage.jsx`
- UI: `components/ui/button.jsx` (verify variants use `bg-primary` / `bg-accent` tokens; usually already correct — change only if it hardcodes colors)

**Assets:**
- `public/` — copied new logos (only if doing §3.8)
- `src/styles/` — copied `colors_and_type.css`, `mobile.css`, `fonts/`

---

## 5. DO NOT CHANGE (content-preservation — non-negotiable)

You may edit only: `className` / `style` strings, CSS files, `tailwind.config.js`, the new theme files, `index.html` (theme script + fonts), and the flagged logo `src`/asset files.

Never edit:
- Any visible copy: headings, paragraphs, list text, button labels, nav item names, taglines.
- Route paths or the routing structure in `App.jsx`.
- External URLs: Gumroad shop link, Formaloo contact link, `blog.reagleeagle.com`, social links.
- The Mailchimp newsletter form: its `action`, field `name`s, hidden inputs, or submission logic.
- `<Helmet>` title / meta description text.
- Image files or their `src` (except the flagged logo swap), `alt` text, portrait, hero backgrounds (`rainbowbrain.png`, `laptop-bg.jpg`).
- `.env`, `vite.config.js`, the Vite editor plugins, `tools/`.

If a change *requires* touching copy, stop and leave a note instead.

---

## 6. Verify

```bash
npm run dev        # iterate during the work
# when done:
npm run build      # must succeed (runs tools/generate-llms.js then vite build)
npm run preview    # serves the production build on port 3000
```

Then check, in a browser, **both modes × all four routes** (`/`, `/courses`, `/web-apps`, `/blog`):

- [ ] Light mode is the default on first load (cleared localStorage).
- [ ] Toggle switches light ↔ dark; choice **persists** across reload and across route changes.
- [ ] No flash of the wrong theme on reload (FOUC script works).
- [ ] Text is readable in both modes (no white-on-white, no dark-on-dark). Headings render in Plus Jakarta Sans.
- [ ] Brand accents are peacock `#1B5A7E` family in light; brighter cyan/sky in dark. Glass panels look right in both.
- [ ] Mobile menu opens/closes; toggle present and working on mobile.
- [ ] `prefers-reduced-motion` still honored; no new console errors or 404s (fonts/logos load).

**Content check (must pass):**

```bash
git diff --stat
git diff            # scan: every change should be a className/style/CSS/config/new-file change
```

Confirm zero copy changes. A fast guard — diff should show **no** removed/added text nodes inside JSX (only attribute/string-class changes). If any copy line changed, revert that hunk.

When everything passes, **stop**. Leave the work committed on the `design-upgrade` branch for Rindie's review. **Do not deploy and do not merge to `main`.**

---

## 7. Design rules reference (for judgment calls)

If you need to make a styling decision the mapping table doesn't cover, follow the canonical rules in:

```
/Users/rindie/projects/tr-design-system-5-2026/SKILL.md
```

Key ones: one gradient per screen; CTAs use the primary gradient/peacock; lavender (`#9F90C9`) is micro-accent only; shadows are tinted (peacock/cyan), never neutral grey; section rhythm ~80px desktop / 48px mobile; cards default to `24px` radius and `24px` padding. Preview cards live in `tr-design-system-5-2026/public/preview/` if you want visual ground truth.
