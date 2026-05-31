# SKILL — Designing for Therapist Resources

Quick reference for an agent designing **anything new** that needs to look like it belongs to the Therapist Resources brand: a marketing page, an in-app screen, a worksheet PDF, a slide, an email, a social card.

Read `README.md` first for the why. This file is the **how, in 60 seconds**.

---

## 1. Always import the tokens

```html
<link rel="stylesheet" href="colors_and_type.css">
<link rel="stylesheet" href="mobile.css">
<body class="tr-app tr-app--animated">…</body>
```

`tr-app` gives you the dark cyan-950 backdrop with corner radials. `tr-app--animated` adds the slate→purple drift used on every marketing page. Skip `--animated` for in-product screens where motion would be distracting. **Always include `mobile.css` second** — it adds responsive type, touch-safe hit targets, and short-circuits hover-only motion on coarse pointers.

## 2. Pick a surface, not a color

Don't start with hex codes. Start by deciding which **surface tier** the new element lives on:

- **Glass Base** (`.tr-glass`) — for resting cards. 95% of the time this is right.
- **Glass Mid** — for hover state, modal chrome, or "this card is selected."
- **Brand-tinted Glass** — only for CTAs and category badges.

If you find yourself reaching for a fourth tier, you're probably trying to invent a new pattern — stop and ask whether the design needs it.

## 3. Headlines: pick one gradient pattern

Three headline gradients exist:

1. **Hero wash** (white → teal-100 → cyan-100) — top of a hero, line 1.
2. **Brand accent** (teal-300 → cyan-400) — hero line 2, brand wordmark.
3. **Section wash** (aqua-200 → cyan-300 → sky-300) — section H2s.

Use **one** per screen. Two competing gradient headlines on the same page is the #1 way to make this brand feel cluttered. Body copy is always solid white at 80% opacity — no gradients on paragraphs, ever.

## 4. CTAs follow a strict hierarchy

| Tier      | Style                                     | When                           |
| --------- | ----------------------------------------- | ------------------------------ |
| Primary   | Cyan→sky pill, white text, shadow-2xl     | One per screen. The main goal. |
| Enroll    | Lavender→indigo pill, 12px radius         | Course pages only              |
| Ghost     | Glass pill, white text                    | Secondary action ("Learn more")|
| Text link | cyan-300 with hover to cyan-200           | In-paragraph                   |

Two primary CTAs side-by-side is wrong. Use Primary + Ghost.

## 5. Use Lucide icons; color via `currentColor`

```html
<svg class="icon" stroke="currentColor" stroke-width="2" stroke-linecap="round">…</svg>
```

`stroke-width="2"`, round caps, round joins. On glass surfaces wrap them in a 44–48px rounded-square tinted tile (see `preview/cards.html`).

## 6. Spacing & rhythm

- Section padding: **80px** vertical on desktop, **48px** mobile.
- Card grid gap: **24px** (or 32px for hero-prominent grids).
- Card internal padding: **24px**, dropping to 18px for compact tiles.
- Card radius: **24px** unless you have a strong reason.

## 7. Voice in a sentence

The reader is a busy clinician. **Lead with their problem**, name the ethics out loud, avoid hype words, keep paragraphs to 2–3 sentences. If a headline could equally describe a SaaS product or a vitamin brand, it's not on-brand yet.

## 8. Common mistakes to avoid

- ❌ Neutral grey shadow → ✅ tinted cyan/violet shadow
- ❌ Two gradient headlines on one screen → ✅ one
- ❌ Inventing a new accent color → ✅ pick from the existing six
- ❌ Light card on dark page (looks like a paste error) → ✅ glass tier
- ❌ AI-slop emoji headers → ✅ Lucide icon in a tinted tile
- ❌ Logo on a busy photo → ✅ glass tile behind logo first
- ❌ Hover effect with no touch fallback → ✅ gate with `(pointer: coarse)` or accept it disables on phones
- ❌ 14px form inputs on mobile (iOS auto-zooms) → ✅ use `.tr-mfield` or 16px+ font

## 9. Mobile (60-second cheat sheet)

- Three breakpoints: **<640 mobile · 640–1024 tablet · ≥1024 desktop**.
- Always load `mobile.css` after `colors_and_type.css`. It's additive.
- Touch hit targets: `.tr-touch` gives you 44px minimum; buttons/inputs already get 48–56px below 640px.
- Hover behaviors are disabled on `(pointer: coarse)` automatically. Don't add a parallel touch animation — keep it predictable.
- Five mobile-native primitives ship with the system: `.tr-mnav` + `.tr-mdrawer`, `.tr-msheet`, `.tr-mstack`, `.tr-mctabar`, `.tr-mfield`. See **Mobile Showcase.html** for live examples.
- For mobile heroes, one stacked-block CTA per row, 32px headline, single-stop accent gradient (already wired in mobile.css).

## 10. When in doubt

Open `preview/uikit-hero.html` and `preview/uikit-cards.html` side-by-side. Almost every layout the brand needs is a recombination of those two scaffolds. Steal the rhythm before you invent a new one.
