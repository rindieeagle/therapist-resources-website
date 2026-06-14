# Product

## Register

brand

## Users

Practicing mental-health clinicians — LPCCs, LMFTs, LCSWs, psychologists, and master's-level counselors. They are licensed peers, not students, and they arrive with full clinical competence. The defining constraint is time: most visit between sessions, after a full caseload, or late at night while catching up on documentation and admin. They are looking for something that saves them time or sharpens their craft — a course, a worksheet, a documentation framework, or a ready-to-use tool — and they decide fast whether a resource was built by someone who actually understands the work.

A secondary audience is the business-and-efficiency side of the same clinician: therapists building digital products, passive income, or practice automations (the Modern Therapist newsletter audience). The site serves them too, but the clinical practitioner is the center.

## Product Purpose

Therapist Resources — "Smart Tools for Modern Therapists," an Encouragement Ink brand — is the marketing and content hub that showcases and sells the brand's offerings: courses (the quarterly *Write it Right* documentation series — SOAP, Treatment Planning, Diagnostic Assessment, Discharge Summary), digital resources and worksheets, a clinical blog, and a set of free interactive web-app tools that act as proof-of-value entry points.

The site's design *is* the product here: it's how a busy clinician decides, in seconds, whether this brand is credible and worth their money. **Success is converting visiting therapists into buyers of courses and digital products.** Free tools, the blog, and the newsletter all exist to build the trust that makes that purchase feel obvious. The interactive web-app tools are a secondary, product-register surface; when work focuses on a specific tool, that surface can be treated as `product`, but the site's default register is `brand`.

## Brand Personality

Four pillars: **Professional** (clinician to clinician — assume competence, respect expertise), **Practical** (every resource solves a real problem; usefulness over cleverness), **Growth-Oriented** (the tree-and-hands logo is development; support expanding skill and impact), and **Encouraging** (lift without fluff — honest, warm, grounded).

Voice is collegial, grounded, clear, and encouraging. Peer, not guru: "here's what I've found helpful," never "you must do this." It acknowledges that clinical work is hard without catastrophizing or sugarcoating. Three words: **collegial, grounded, capable.** The emotional target is a clinician feeling *respected and relieved* — "this was built by someone who's still in the chair on Monday morning" — never hyped, never talked down to.

Hard voice constraints (these are design constraints, not just copy rules): no em dashes, no emojis in professional content, one exclamation point max per piece, no hype words ("transformational," "game-changer," "excited to announce"), and no contrast-flip structures ("it's not X, it's Y").

## Anti-references

The site must not look or feel like any of these:

- **Sterile clinical / EHR software.** No cold insurance-portal or EHR-dashboard energy — gray data tables, dense forms, institutional blue. Credibility should not read as coldness.
- **AI-hype / influencer marketing.** No loud full-bleed gradients, hero-metric templates, "transformational" launch copy, gradient text, or breathless energy. The brand sells to skeptical professionals; hype reads as a tell that the author has never run a caseload.
- **Generic wellness / spa.** No soft-pastel, lotus-and-stones, vague-calm-app aesthetic. Calm here is earned through clarity and order, not borrowed from meditation-app stock imagery — and never at the cost of clinical credibility.
- **Corporate SaaS template.** No cookie-cutter startup landing page: stocky hero, identical icon-heading-text card grids, tiny tracked uppercase eyebrows over every section. Indistinguishable-from-a-thousand-others is a failure.

## Design Principles

1. **Clinician to clinician.** Assume the reader is a competent licensed peer. Never over-explain clinical concepts or condescend. The design should respect their expertise and their time — get to the substance fast.
2. **Usefulness over cleverness.** Every section, control, and flourish earns its place by helping the therapist do or decide something. If it doesn't serve the practitioner, cut it. Practical beats impressive.
3. **Calm is earned, not decorated.** The composure that fits a therapeutic brand comes from order, whitespace, and clarity — not from pastel softness or spa imagery. A clear, confident layout reads as more trustworthy than a soothing one.
4. **Credibility is the conversion engine.** What sells the courses and products is visible clinical substance: real sample notes, honest depth, the author's credentials (Rindie Eagle, MA, LPCC), the free tools that prove the brand delivers. Show the work; let proof do the persuading instead of marketing claims.
5. **Encourage without hype.** Practice the brand's own voice in the interface. One honest, specific benefit outperforms three superlatives. Warmth and confidence, never breathless excitement.

## Accessibility & Inclusion

- **Contrast:** WCAG AA minimum for all text (body ≥ 4.5:1, large text ≥ 3:1); prefer AAA / 7:1 where feasible, since the audience reads dense educational material. Watch the common failure of muted gray body text on tinted near-white surfaces.
- **Never encode meaning in color alone.** The navy / peacock / cyan / violet accent system must always be reinforced with labels, icons, or text so it works for color-blind users.
- **Reduced motion is required.** Every animation needs a `prefers-reduced-motion: reduce` alternative (crossfade or instant). The framer-motion work already in the codebase must honor this.
- **Reading comfort:** generous line height (1.6 body), body line length capped at ~65–75ch, legible type sizes — the content is long-form clinical and educational material.
