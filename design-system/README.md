# Therapist Resources — Brand & Design System

> Smart tools for modern therapists. Bridging traditional therapy and modern technology.

This is the working brand system for **therapistresources.com**, an evolving library of practical, ethics-first resources — courses, worksheets, web apps, and articles — built by a clinician for clinicians who want to fold modern tools (AI included) into their practice without losing the human core of therapy.

The system documented here is reverse-engineered from the production codebase and tuned **peacock-forward**: a dark-glassmorphism aesthetic that lives on a peacock teal/cyan/indigo backdrop with sky-blue and lavender accents. Lighter than the original deep slate — still confident, but more open and airy.

---

## Voice & Audience

Therapist Resources speaks to **licensed clinicians** — therapists, counselors, and graduate-track students — who are curious about technology but allergic to hype. Copy is warm and competent: confident enough to teach, humble enough to acknowledge that AI in clinical work is new ground. Avoid bro-tech swagger ("game-changing," "10x," "supercharge"). Avoid clinical-coldness too. The voice is a thoughtful colleague at a workshop, not a vendor at a conference.

A few rules of thumb:

- Lead with the **clinician's problem**, not the technology. ("Cut your case-note time in half" beats "AI-powered note generation.")
- Be specific about modality and population when relevant — CBT vs. IFS, adolescents vs. couples — generality reads as marketing.
- Name the ethics out loud. Confidentiality, consent, and HIPAA aren't disclaimers; they're part of the value.
- Founder's voice is welcome. Rindie Eagle, MA, LPCC, is the author and the byline; the brand is one therapist sharing what works.
- One signpost quote on the brand: *"Follow your heart, but take your brain with you."* Use it sparingly, never as filler.

## What lives in this project

```
.
├── README.md                    ← You are here
├── colors_and_type.css          ← Single source of truth: tokens, type stack, base classes
├── mobile.css                   ← Mobile layer: responsive type, touch policy, mobile primitives
├── assets/                      ← Logos, hero imagery, favicon
└── preview/                     ← One HTML card per token group + UI-kit examples
```

Every preview HTML is a thumbnail you can open standalone — open `preview/uikit-hero.html` to see the system in flight, or any of the foundation cards (`colors-*.html`, `type-*.html`, etc.) to inspect a single layer.

---

## Visual Foundations

### Color

The site is **dark by default** but on the lighter, brighter end of dark. Every surface sits over an animated gradient that drifts between cyan-800 and indigo-900, with peacock cyan, sky-blue, and lavender radial bloom in the corners. There is no light theme — light surfaces only appear inside specific components (Mailchimp inputs, the occasional white card on a marketing page).

| Role               | Token                  | Hex        | Where it shows up                                  |
| ------------------ | ---------------------- | ---------- | -------------------------------------------------- |
| App backdrop deep  | `--tr-bg-deep`         | `#155E75`  | Cyan-800, top-left of the gradient                 |
| App backdrop mid   | `--tr-bg-mid`          | `#0E7490`  | Cyan-700, peacock bloom in the center              |
| App backdrop end   | (indigo-900)           | `#1E3A8A`  | Bottom-right wash, where lavender meets the field  |
| Primary accent     | `--tr-sky-300`         | `#7DD3FC`  | Eyebrows, links, icon strokes, brand wordmark      |
| CTA gradient       | `--tr-grad-primary`    | cyan→sky   | Every primary pill button                          |
| Lavender accent    | `--tr-violet-300`      | `#C4B5FD`  | Course badges, decorative dots, secondary glow     |
| Headline wash      | `--tr-grad-blog-text`  | aqua→sky→lavender | Section H2s ("Latest Resources & Articles")|

The four logo-sampled colors (`--tr-leaf-aqua`, `--tr-leaf-blue`, `--tr-leaf-lavender`, `--tr-leaf-purple`, `--tr-trunk-teal`) are reserved for **illustrative moments**: badge fills on top of glass, decorative dots, and any time a design needs to feel directly tied to the logo. Do not use them as primary CTAs — they're softer than the spectrum colors and lose presence on the dark backdrop.

### Surfaces (Glassmorphism)

Three glass tiers, applied via `backdrop-filter: blur(24px)`:

1. **Glass Base** — `rgba(255,255,255,0.05)` + 1px border at white/10. Default for every card.
2. **Glass Mid** — `rgba(255,255,255,0.10)` + 1px border at white/20. Hover state and "stronger" surfaces (modal headers, the active nav item).
3. **Glass + Brand Tint** — a 20% cyan→teal or violet→fuchsia gradient layered over a 12px blur. Reserved for CTA bands and category badges.

A common mistake: stacking shadow-2xl on top of glass without a tint. The result reads as a flat grey rectangle. Always pair glass with either a brand tint, a top-bar gradient strip, or a colored hover glow — see `preview/cards.html` for the three accepted patterns.

### Typography

| Stack | Family | Weights | Use |
|-------|--------|---------|-----|
| Display | **Poppins** (brand) | 600, 700, 800 | All headlines, prices, big numbers |
| Body | **Poppins** (brand) | 300, 400, 500 | Paragraphs, UI labels, captions |
| Serif | **Playfair Display** | 400, italic | The single founder quote, optional |
| Mono | system mono | 400 | Code, token names in this docs system |

Display sizes step from 12px eyebrow → 16px body → 20px lead → 24/36/48/72px headings. On hero copy, headlines split across two lines — line 1 in white-to-cyan wash, line 2 in cyan-to-teal accent. That two-tone gradient is a **brand signature**; don't replicate the same wash twice in a single layout.

### Spacing, Radii, Shadows

Spacing follows a 4px base scale, typed as Tailwind tokens (`space-1..space-24`). Section padding is 80px on desktop, 48px on mobile. Cards take 24px internal padding.

Radii prefer **soft and round**. `radius-xl` (24px) is the default for cards; `radius-2xl` (32px) for hero shells; `radius-pill` (9999px) for every CTA, badge, and social button. Sharp corners (`radius-sm` 8px) only appear on form inputs.

Shadows are **always tinted, never neutral grey**. The system has six options (see `preview/shadows.html`); the two used most are:

- `--tr-shadow-card` (shadow-2xl): default rest state for every card
- `--tr-shadow-cta` (cyan glow at 50%): hover state on primary CTAs

A neutral `box-shadow: 0 4px 12px rgba(0,0,0,0.3)` is a smell — it means a designer reached for browser defaults instead of the brand glow palette.

### Motion

Three motion patterns, used sparingly:

1. **Backdrop drift** — the app gradient animates `background-position` over 15s on a sine curve. Set once on the page wrapper; never animate again inside content.
2. **Pulse-slow** — opacity 1 ↔ 0.7 over 4s on hero decorations (background blur orbs, the eyebrow dot).
3. **Hover lift** — cards translate -4px and upgrade their glass tier; primary CTAs scale to 1.02 and gain the cyan-glow shadow. Duration 200ms, ease `cubic-bezier(0.4, 0, 0.2, 1)`.

Respect `prefers-reduced-motion` (`colors_and_type.css` already does).

---

## Components

The full kit lives in `preview/`. Headline pieces:

- **Buttons** (`buttons.html`) — primary cyan→sky pill, ghost glass pill, lavender→indigo "Enroll" pill, gradient badges, circular social buttons.
- **Cards** (`cards.html`) — three accepted glass patterns: default, hover-lifted, and top-bar-anchored.
- **Inputs** (`inputs.html`) — light Mailchimp newsletter inputs (white background) and dark search inputs (glass on dark). Don't mix.
- **Iconography** (`iconography.html`) — **Lucide React**, 2px stroke, round caps. Color via `currentColor` so an icon adopts the surrounding text color (cyan-300 on dark, white inside filled buttons).
- **Resource cards** (`uikit-cards.html`) — the Course card (violet badge, $price, Enroll button, stat row) and the Article card (cyan badge, author with avatar, "Read more →") side by side.
- **Hero band** (`uikit-hero.html`) — the canonical opener: eyebrow pill, two-tone gradient headline, lead paragraph, primary + ghost CTA, stat row.

When composing a new screen, start by picking one of the two card archetypes above and one hero pattern. Almost everything else on the marketing site is a recombination of those two units.

---

## Brand Marks

Three logo lockups live in `assets/`:

- `logo-rectangle.png` — primary horizontal lockup, **for light-on-light or chrome usage**.
- `logo.png` — circular tree-of-leaves mark, **for dark surfaces** (this site, social avatars).
- `logo-vertical.png` — stacked, for narrow contexts and footer.

The mark itself is a stylized tree built from soft-edged leaves in aqua, sky blue, lavender, and purple, growing out of a deep teal trunk — a quiet visual metaphor for the brand: many small, distinct things growing into one whole.

**Clear space:** keep at least the height of the trunk's base on every side. **Minimum size:** 32px tall for the circle mark, 120px wide for the rectangle. **Don't:** recolor it, drop-shadow it, or place it on a busy photograph without first putting it inside a glass tile (see `logos.html`).

## Mobile

This system is **mobile-ready** out of the box. Three breakpoints (mobile&nbsp;<640&nbsp;· tablet 640–1024&nbsp;· desktop ≥1024), responsive type and spacing tokens, touch-safe hit targets, and five mobile-native primitives.

### Wiring

```html
<link rel="stylesheet" href="colors_and_type.css">
<link rel="stylesheet" href="mobile.css">  <!-- always loaded SECOND -->
```

`mobile.css` is purely additive — it does not override desktop styles, only narrows the type scale, lifts hit targets, and short-circuits hover-only behaviors on coarse pointers.

### Touch policy

On `(pointer: coarse)` devices, **all hover lifts, magnetic pulls, and decorative hover glows are disabled**. Press states (scale on tap) stay. The Magnetic Button respects this automatically — touch users get a clean tap-scale and nothing else. If you build new hover-driven motion, gate it on the same media query or add the `.tr-no-touch-hover` helper.

### Mobile tokens

| Token                          | Mobile  | Tablet  | Desktop |
| ------------------------------ | ------- | ------- | ------- |
| `--tr-space-section`           | 48px    | 64px    | 80px    |
| `--tr-space-gutter`            | 20px    | 32px    | 48px    |
| `--tr-touch-min`               | 44px (iOS HIG) — applies on coarse pointers via `.tr-touch` |
| `--tr-touch-comfy`             | 48px (Material) — default for buttons/inputs on mobile |
| `--tr-fs-h1-mobile`            | 32px    | —       | 48px    |
| `--tr-fs-h2-mobile`            | 28px    | —       | 36px    |
| `--tr-fs-eyebrow-mobile`       | 13px    | —       | 12px    |

Form inputs are bumped to **16px font + 56px height** below 640px to prevent iOS Safari's auto-zoom on focus.

### Mobile-native primitives

Five additions that have no desktop equivalent. Each has a preview card.

- **Mobile Nav** (`preview/mobile-nav.html`) — `.tr-mnav` topbar + `.tr-mdrawer` slide-in drawer (max 360px, scrim, animated hamburger).
- **Bottom Sheet** (`preview/mobile-bottom-sheet.html`) — `.tr-msheet` slide-up panel for sort, filter, share. Drag handle, scrim close, safe-area aware.
- **Card Stack** (`preview/mobile-card-stack.html`) — `.tr-mstack` horizontal scroll-snap, 86% width per card, hidden scrollbar.
- **Sticky CTA Bar** (`preview/mobile-cta-bar.html`) — `.tr-mctabar` for course-page persistent purchase. Frosted glass, safe-area-bottom inset.
- **Float-label inputs** (`preview/mobile-inputs.html`) — `.tr-mfield` with 56px hit target, 16px font, label drops to 78% on focus or filled.

### One-page demo

Open **Mobile Showcase.html** to see all six primitives wired up live.

---


| Card                           | Group       |
| ------------------------------ | ----------- |
| `preview/colors-brand.html`    | Colors      |
| `preview/colors-logo.html`     | Colors      |
| `preview/surfaces-glass.html`  | Colors      |
| `preview/gradients.html`       | Colors      |
| `preview/type-display.html`    | Type        |
| `preview/type-body.html`       | Type        |
| `preview/type-gradient.html`   | Type        |
| `preview/spacing.html`         | Spacing     |
| `preview/radii.html`           | Spacing     |
| `preview/shadows.html`         | Spacing     |
| `preview/buttons.html`         | Components  |
| `preview/cards.html`           | Components  |
| `preview/inputs.html`          | Components  |
| `preview/iconography.html`     | Components  |
| `preview/uikit-cards.html`     | Components  |
| `preview/uikit-hero.html`      | Components  |
| `preview/mobile-hero.html`     | Components  |
| `preview/mobile-nav.html`      | Components  |
| `preview/mobile-bottom-sheet.html` | Components |
| `preview/mobile-card-stack.html` | Components |
| `preview/mobile-cta-bar.html`  | Components  |
| `preview/mobile-inputs.html`   | Components  |
| `preview/logos.html`           | Brand       |

Every card is small, standalone HTML — easy to fork into a new component, easy to screenshot for a deck, easy to read end-to-end.
