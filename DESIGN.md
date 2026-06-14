---
name: Therapist Resources
description: Smart tools for modern therapists — navy-led ink-on-paper with peacock/cyan light and frosted glass, in a light default and a dark register.
colors:
  # Brand core (sampled from the tree-of-leaves logo)
  trunk-navy: "#001C3F"
  peacock: "#1B5A7E"
  leaf-teal: "#64C5C9"
  leaf-cyan: "#05B4DD"
  leaf-blue: "#0276B5"
  leaf-lavender: "#9F90C9"
  # Working accents
  aqua-mint: "#5EEAD4"
  bright-teal: "#2DD4BF"
  teal-500: "#14B8A6"
  peacock-cyan: "#06B6D4"
  cyan-600: "#0891B2"
  sky-300: "#7DD3FC"
  quiet-lavender: "#C4B5FD"
  link-cyan: "#0E7490"
  # Ink + text (light register)
  deep-peacock-ink: "#0F2A36"
  text-strong: "#1B3D4D"
  text-body: "#2A4F5F"
  text-secondary: "#4A6B7A"
  text-meta: "#6B8A98"
  text-legal: "#8FA6B2"
  # Surfaces (light register)
  cool-paper: "#FAFBFC"
  paper-white: "#FFFFFF"
  peacock-tint: "#F1F7FA"
  surface-soft: "#F6FAFC"
  hairline: "#E5ECF1"
  hairline-strong: "#CBD9E2"
  # Dark register anchor (Calm Authority)
  deep-peacock-bg: "#0F3A52"
  # Semantic
  success: "#34D399"
  warning-pink: "#F9A8D4"
  danger: "#F87171"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, Inter, sans-serif"
    fontSize: "clamp(40px, 6vw, 72px)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Plus Jakarta Sans, Inter, sans-serif"
    fontSize: "clamp(32px, 5vw, 48px)"
    fontWeight: 700
    lineHeight: 1.1
  title:
    fontFamily: "Plus Jakarta Sans, Inter, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.3
  lead:
    fontFamily: "Inter, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.6
    letterSpacing: "0.07em"
  quote:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(22px, 3vw, 30px)"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.peacock}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.pill}"
    padding: "12px 28px"
  button-ghost:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.deep-peacock-ink}"
    rounded: "{rounded.pill}"
    padding: "12px 28px"
  card-glass:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.text-body}"
    rounded: "{rounded.xl}"
    padding: "24px"
  input:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.deep-peacock-ink}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  eyebrow:
    textColor: "{colors.aqua-mint}"
    typography: "{typography.label}"
---

# Design System: Therapist Resources

## 1. Overview

**Creative North Star: "Ink & Aurora" (light, default) · "Calm Authority" (dark)**

One identity with two registers. The default light register, **Ink & Aurora**, is deep peacock ink on paper, lit from the corners by aurora-like teal and cyan radial blooms, with frosted-glass cards floating above the wash. The opt-in dark register, **Calm Authority** (`data-theme="dark"`), drops the same system onto a deep peacock backdrop where navy carries the authority and the same teal/cyan light keeps it composed rather than cold. Both registers are first-class and permanent; the dark theme is not a throwaway. The visual language is navy-led, light by default, and the same `--tr-*` tokens flip between the two.

The personality is a senior clinician who is both deeply credible and genuinely warm. Authority comes from deep navy and peacock ink, real typographic hierarchy, and generous whitespace. Warmth comes from luminous peacock/cyan light, soft frosted glass, and a quiet, encouraging voice in the copy. The system explicitly rejects the four things a skeptical professional reads as fake: the cold sterility of EHR and insurance-portal software, the loud gradients and hype of AI-influencer marketing, the soft pastel vagueness of generic wellness and spa brands, and the cookie-cutter sameness of a corporate SaaS template. A deliberate film-grain texture overlay (0.03 opacity, desktop only) is layered over the whole page as an anti-AI signal — proof of a human hand.

Density is calm and editorial: 80px desktop section rhythm, 24px card padding, content measured for long-form clinical reading. Nothing shouts. The accent colors are vibrant and meant to be seen, but they are deployed with discipline — one gradient headline per screen, lavender held back to a micro-accent, shadows always tinted rather than grey.

**Key Characteristics:**

- Navy-led, ink-on-paper, light by default — with a permanent deep-peacock dark register.
- Frosted-glass cards floating above teal/cyan radial blooms.
- Tinted shadows only; grey drop shadows are forbidden.
- A single navy → peacock → cyan headline gradient per screen.
- Lavender lives only as a micro-accent.
- Film-grain "Non-AI" texture as a signature anti-AI tell.
- Plus Jakarta Sans display over Inter body; Playfair italic for rare pull-quotes.

## 2. Colors

A navy-led palette sampled from the brand's tree-of-leaves logo: deep navy and peacock for authority, a teal → cyan → blue light ramp for life, lavender as a whisper. The same tokens drive both registers; the light values are canonical and the dark register overrides them.

### Primary

- **Peacock** (#1B5A7E): The lead brand color. Heads the light primary CTA gradient and the navy-led headline gradient. The anchor of every key surface.
- **Trunk Navy** (#001C3F): The deepest value. Wordmark, deepest headings, and the start of the navy-led headline and backdrop gradients. Anchors the dark register.
- **Deep Peacock Ink** (#0F2A36): Not black — a deep peacock-tinted ink for all primary headings and strong body text on light. Contrast without harshness.

### Secondary

- **Leaf Teal** (#64C5C9), **Leaf Cyan** (#05B4DD), **Leaf Blue** (#0276B5): The logo light ramp. Drive the roadmap/headline gradient (teal → cyan → blue) and decorative accents.
- **Peacock Cyan** (#06B6D4) / **Cyan 600** (#0891B2): The bright kick at the end of the primary CTA gradient; tinted CTA borders and cyan glow shadows.
- **Aqua Mint** (#5EEAD4) / **Bright Teal** (#2DD4BF): Eyebrow text and the start of the teal→cyan CTA ramp.
- **Link Cyan** (#0E7490): Inline text links on light (a cyan-700 that passes contrast on white).
- **Sky 300** (#7DD3FC): Support accent and the brighter link color in the dark register.

### Tertiary

- **Leaf Lavender** (#9F90C9) / **Quiet Lavender** (#C4B5FD): The single warm note. A periwinkle-to-lavender that bridges sky into purple.

### Neutral

- **Cool Paper** (#FAFBFC): The default light page base.
- **Paper White** (#FFFFFF): Card and input surfaces.
- **Peacock Tint** (#F1F7FA) / **Surface Soft** (#F6FAFC): Faint peacock-tinted recessed surfaces.
- **Hairline** (#E5ECF1) / **Hairline Strong** (#CBD9E2): Borders, dividers, and the heavier focus border.
- **Text ramp**: Strong #1B3D4D, Body #2A4F5F, Secondary #4A6B7A, Meta #6B8A98, Legal #8FA6B2 — a peacock-tinted grey ramp, never neutral grey.
- **Deep Peacock Background** (#0F3A52): The dark register's base canvas (Calm Authority).

### Named Rules

**The Lavender Micro-Accent Rule.** Lavender is permitted only as a single eyebrow dot or the course-enroll CTA. It is forbidden as a headline color or a primary CTA color. Its rarity is the point.

**The Tinted-Shadow Rule.** Every shadow is tinted peacock or cyan (e.g. `rgba(6,182,212,0.50)`). Neutral grey drop shadows are forbidden — they read as flat and cheap against this palette.

**The One Gradient Headline Rule.** Exactly one navy-led gradient headline (navy → peacock → cyan) per screen. Two competing gradient headlines are forbidden. Everywhere else, headings are solid Deep Peacock Ink.

### Dark Register (Calm Authority)

On `[data-theme="dark"]` the base flips to Deep Peacock #0F3A52 with a navy→deep-blue wash, surfaces become white-on-dark glass tiers (0.05 / 0.10 / 0.15), text inverts to white at descending opacities, links shift to Sky 300, and shadows deepen. Eyebrows brighten to Sky 300. The shadcn token layer mirrors this via the `.dark` class. Both registers must be tested; neither may be removed.

## 3. Typography

**Display Font:** Plus Jakarta Sans (700/800), self-hosted, with Inter fallback.
**Body Font:** Inter (400–600), with system-sans fallback.
**Quote Font:** Playfair Display italic (rare), with Georgia fallback.

**Character:** A geometric-humanist display over a neutral workhorse body — a clean, modern, highly legible pairing that reads as competent and unfussy. The two never compete; one is for headlines, one is for reading. Playfair italic appears only as an occasional editorial pull-quote.

### Hierarchy

- **Display** (700, clamp 40→72px, 1.1, -0.02em): Hero h1 only. The one place the type goes large.
- **Headline** (700, clamp 32→48px, 1.1): Page titles.
- **Title** (700, 24–36px, 1.3): Section and card headings (h2/h3). Mobile floors: h2 28px, h3 20px.
- **Lead** (400, 20px, 1.6): Hero body and subheads.
- **Body** (400, 16px, 1.6): Base paragraph. Cap the measure at 65–75ch for the long clinical/educational content.
- **Label / Eyebrow** (600, 12px, +0.07em, uppercase): Kickers and badges. Aqua Mint on light, Sky 300 on dark. Mobile floor 13px.

### Named Rules

**The Two-Family Rule.** Plus Jakarta Sans for display, Inter for body, Playfair italic for the rare quote. No third sans. Never pair two similar sans families.

**The 1.6 Body Rule.** Body line-height is 1.6 and the measure is capped at 65–75ch. This is reading material for busy clinicians; comfort over compactness.

## 4. Elevation

Depth is built from three layered materials, not from hard shadows: a radial-bloom backdrop, frosted glass, and tinted glows. Cards sit on three glass tiers — base (white 0.72), mid (0.85, hover/selected), and strong (0.92, modal chrome and CTAs) — each with an 8px backdrop blur, a hairline border, and a tinted shadow. On dark, the tiers become white-on-dark at 0.05 / 0.10 / 0.15. The effect is surfaces that float above a luminous wash rather than stamped cards.

### Shadow Vocabulary

- **Card** (`0 25px 50px -12px rgba(0,0,0,0.25)`): The resting float for glass cards (deepens to -20px / 0.55 on dark).
- **CTA glow** (`0 10px 25px -5px rgba(6,182,212,0.50)`): Peacock-cyan glow under primary buttons on hover.
- **Cyan / Violet glow** (`...rgba(56,189,248,0.45)` / `...rgba(139,92,246,0.40)`): Accent glows for sky and lavender elements.
- **Soft / Up-glow** (`0 10px 30px -15px rgba(0,0,0,0.30)`): Diffuse ambient lift; up-glow anchors the footer.

### Named Rules

**The Tinted-Glow Rule.** Elevation reads as a tinted peacock/cyan glow plus frosted glass — never a hard neutral-grey drop shadow.

**The Floating Glass Rule.** Cards float above the radial-bloom backdrop via backdrop-blur and a hairline border. The backdrop is part of the elevation system, not decoration.

## 5. Components

### Buttons

- **Shape:** Fully rounded pill (`9999px`).
- **Primary:** The peacock→cyan light gradient (`--tr-grad-primary`), white text, 12px×28px padding, with a peacock glow shadow. Hover scales to 1.02 and brightens the glow to the CTA shadow; active scales to 0.98.
- **Ghost:** Base glass (white 0.72) with Deep Peacock Ink text and a hairline border. Hover lifts to the mid glass tier and the heavier border.
- **shadcn Button:** The Radix/CVA `Button` (default/outline/ghost/link, `rounded-md`, focus-visible ring) is used for in-app/utility controls and pulls from the HSL shadcn token layer. The pill `.tr-btn` is the brand/marketing CTA. Don't mix the two roles on the same surface.

### Cards / Containers

- **Corner Style:** 24px (`--tr-radius-xl`); 32px for glass hero shells.
- **Background:** Glass tier (`.tr-glass`) — white 0.72 with 8px backdrop blur.
- **Shadow Strategy:** The Card shadow from Elevation; tinted, never grey.
- **Border:** Hairline #E5ECF1 (CTA cards use the brand-tinted cyan edge `rgba(6,182,212,0.30)`).
- **Internal Padding:** 24px.

### Inputs / Fields

- **Style:** Paper-white background, hairline border, 12px radius — unobtrusive at rest.
- **Focus:** Border shifts to Hairline Strong (#CBD9E2); pair with a visible focus ring for accessibility.

### Eyebrow / Badge

- **Style:** 12px uppercase, +0.07em tracking, weight 600, Aqua Mint on light / Sky 300 on dark. Small circular teal badges carry white minimalist icons inside feature cards.

### Gradient Headline (signature)

- The one navy → peacock → cyan text gradient per screen (`.tr-grad-text`), background-clipped to the headline. This is the brand's deliberate signature, not decorative gradient text — and it is the *only* sanctioned use of gradient-on-text.

## 6. Do's and Don'ts

### Do

- **Do** lead each screen with one navy → peacock → cyan gradient headline; keep every other heading solid Deep Peacock Ink (#0F2A36).
- **Do** float frosted-glass cards above the peacock/cyan radial-bloom backdrop; keep shadows tinted peacock/cyan.
- **Do** keep the film-grain "Non-AI" texture overlay (0.03 opacity, desktop) — it is a deliberate signal of a human hand.
- **Do** use pill CTAs with the peacock→cyan gradient and a cyan glow on hover.
- **Do** keep body at 1.6 line-height and a 65–75ch measure, and use Deep Peacock Ink or #2A4F5F for body text, never a light grey.
- **Do** reinforce every color cue with a label or icon; never encode meaning in color alone.
- **Do** maintain both registers — light "Ink & Aurora" default and dark "Calm Authority" (`data-theme="dark"`) — and test both. Neither may be removed.
- **Do** honor `prefers-reduced-motion` (already wired in `colors_and_type.css`).

### Don't

- **Don't** drift toward **sterile clinical / EHR software**: no flat institutional blue, no grey data-table chrome, no dense form-first layouts. Credibility must not read as coldness.
- **Don't** use **AI-hype / influencer** styling: no loud full-bleed rainbow gradients, no hero-metric template, no "transformational" energy. Gradient text is reserved for the single brand headline; decorative gradient text anywhere else is forbidden.
- **Don't** fall into **generic wellness / spa**: no soft-pastel lotus-and-stones, no vague calm-app imagery. Calm here is earned through order and whitespace, not borrowed from a meditation app.
- **Don't** ship **corporate SaaS template** patterns: no endlessly repeated identical icon-heading-text card grids, no tiny tracked uppercase eyebrow over *every* section, no stock-photo hero.
- **Don't** use neutral-grey drop shadows; tint them peacock or cyan.
- **Don't** use lavender as a headline or primary-CTA color — micro-accent only.
- **Don't** put body text in muted grey on a tinted near-white surface (the contrast trap); stay at #2A4F5F or darker.
- **Don't** use em dashes or emojis in interface copy, and cap exclamation points at one — the brand voice is a design constraint.
