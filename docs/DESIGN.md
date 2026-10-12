# DESIGN — Global Kids Preschool Website (v1.0)

**Save in repo as:** `docs/DESIGN.md`. Every value here is a decision. Implement as written; if you must deviate, log it in `docs/DECISIONS.md`.

---

## 1. Design intent

**"Sunny, soft, and sure."** Warm and joyful for children, calm and credible for parents. Modern and editorial with playful touches — never clip-art, never a template look.

Principles
1. **Trust first, delight second.** Real photos, real facts, clear contact. Playfulness decorates; it never replaces proof.
2. **Light on the wire.** Beauty comes from colour, type, shape and whitespace — not heavy images, libraries or animation.
3. **Thumb-first.** Mobile is the primary canvas; one-hand reachable actions.
4. **Warm, not busy.** Max 3 decorative motifs; lots of breathing room.
5. **Everything has a job.** Each section answers one parent question (see PRD §1).

**Anti-patterns (from the audit — never do):** stock-photo walls, lorem/filler, dead `#` buttons, fake ratings, five-colour rainbow, auto-playing carousels, cartoon clip-art mascots, text over busy photos without scrim, tiny grey text.

---

## 2. Design tokens

### 2.1 Colour (light theme only)
Derive/validate against the real logo: if the logo's colours clash, shift hue of tints (not the neutrals/CTA) and re-run the contrast script. Contrast **must be verified by script**; values below are starting points.

```css
:root{
  /* neutrals */
  --bg:#FFF8EC; --surface:#FFFFFF; --ink:#2B2A35; --ink-soft:#5B596A; --line:#EADFC9;
  /* brand */
  --sun:#FFC93C; --sun-hover:#F7B500; --on-sun:#2B2A35;
  --blue:#2A62D8;   /* links, focus, secondary emphasis */
  --coral:#FF6B4A;  /* illustration/badges only, not body text */
  --mint:#2FA67A; --lilac:#7C5CE0; /* illustration/icon accents only */
  /* section tints */
  --tint-sky:#E6F3FF; --tint-mint:#E3F6EA; --tint-blush:#FFE7DF;
  --tint-lilac:#EEE8FF; --tint-sun:#FFF0BF;
  /* feedback */
  --ok:#2E8B57; --err:#C0392B; --focus:#2A62D8;
}
```
Usage: page `--bg`; cards `--surface`; alternate sections between `--bg` and one tint (rotate sky → mint → blush → lilac, never two adjacent the same). Primary button = `--sun` with `--on-sun` text. Text colours: `--ink` / `--ink-soft` only. Coral/mint/lilac never carry text. Min contrast: 4.5:1 body, 3:1 large text and UI components.

### 2.2 Typography
- **Headings:** Fredoka (600). **Body/UI:** Nunito (400/600/700). Self-hosted WOFF2 variable subsets (Latin), `font-display: swap`, size-adjusted fallbacks (`system-ui`), 2 families max.
- If a regional language is enabled later: add the matching Noto Sans script as fallback for that `lang` only.
- Spelling: Indian/British (colour, centre, programme).

```css
:root{
  --font-head:"Fredoka",system-ui,sans-serif; --font-body:"Nunito",system-ui,sans-serif;
  --fs-xs:.8125rem; --fs-sm:.9375rem; --fs-base:1.0625rem; --fs-lg:1.25rem;
  --fs-xl:clamp(1.5rem,1.3rem + 1vw,2rem);
  --fs-2xl:clamp(1.875rem,1.5rem + 1.8vw,2.75rem);
  --fs-3xl:clamp(2.375rem,1.7rem + 3.2vw,4rem);   /* H1 */
  --lh-body:1.65; --lh-head:1.15; --measure:65ch;
}
```
H1 `--fs-3xl`, H2 `--fs-2xl`, H3 `--fs-xl`, card titles `--fs-lg`, body `--fs-base` (17px — readable for relatives), meta `--fs-sm`. Eyebrow labels: Fredoka 600, uppercase, 0.08em tracking, `--fs-xs`, in `--blue`.

### 2.3 Space, shape, depth
```css
:root{
  --s-1:.25rem; --s-2:.5rem; --s-3:.75rem; --s-4:1rem; --s-6:1.5rem;
  --s-8:2rem; --s-12:3rem; --s-16:4rem; --s-24:6rem;
  --section-y:clamp(3rem,6vw,6rem);
  --container:1200px; --container-narrow:720px; --gutter:clamp(1rem,4vw,2rem);
  --r-sm:12px; --r-md:20px; --r-lg:32px; --r-pill:999px;
  --blob:63% 37% 54% 46% / 55% 48% 52% 45%;
  --shadow-sm:0 2px 8px -2px rgba(43,42,53,.10);
  --shadow-md:0 12px 32px -14px rgba(43,42,53,.22);
  --shadow-lg:0 24px 48px -20px rgba(43,42,53,.28);
  --ease:cubic-bezier(.22,.8,.3,1); --t-fast:140ms; --t-base:240ms; --t-slow:420ms;
}
```
Breakpoints (mobile-first `min-width`): 30em · 48em · 64em · 80em.

### 2.4 `theme.json` mapping
Expose palette (names above), font families, font sizes (xs–3xl), spacing scale, `contentSize: 720px`, `wideSize: 1200px`, disable custom colours/gradients/font-sizes for the School Admin role so editors can't drift off-brand.

---

## 3. Shape language & decoration (the "aesthetic" layer)
Only these three motifs, all inline SVG/CSS, `aria-hidden`, total ≤ 6 KB:
1. **Blob masks** on hero/about photos (`border-radius: var(--blob)` or SVG clip) — everywhere else photos use `--r-md`.
2. **Wavy section dividers** (3 variants), filled with the next section's colour.
3. **Hand-drawn squiggle underline** under one key word per hero/section title, and small **sticker badges** (rotated −3° to 4°) for facts like "12+ years".
Plus tiny confetti dots/stars (≤ 6 per section, CSS only). Decoration never conveys information and never overlaps text.

Iconography: outlined, 2px stroke, rounded caps (Lucide-style subset), inlined SVG sprite, 24px, `currentColor`. Fewer than 30 icons.

Photography: warm natural light, candid, real. Ratios: hero 4:3 (mobile) / 5:4 (desktop), cards 4:3, teachers 1:1, gallery native. Rounded `--r-md`. Consistent colour grade. **Never show a child's full name with a photo.** During development use pastel abstract placeholders labelled "Photo: [description]" — the launch gate rejects them.

---

## 4. Components (every interactive one needs: default · hover · active · focus-visible · disabled · loading · error)

| Component | Spec |
|---|---|
| **Button** | Pill, min-height 48px, padding 0 1.5rem, Fredoka 600. *Primary:* `--sun` bg, `--on-sun` text, hover `--sun-hover` + lift 2px. *Secondary:* 2px `--ink` outline, transparent, hover fills `--ink` w/ white text. *Text:* underline offset 4px, `--blue`. Press: scale .98. |
| **Header** | Sticky, `--bg` at 92% + subtle blur only if perf OK; logo left, nav centre, "Book a Visit" button right; shadow appears after 8px scroll. Mobile: logo + menu button. |
| **Mobile menu** | Full-screen sheet, 56px links, close button first in focus order, traps focus, Esc closes, includes Call/WhatsApp buttons. |
| **Sticky action bar (mobile)** | Bottom, 3 equal buttons: Call · WhatsApp · Book Visit; height 56px + `env(safe-area-inset-bottom)`; hides when keyboard/form field focused; body gets matching bottom padding. |
| **Announcement bar** | `--tint-sun`, centred 1-line, dismissible (remembers via localStorage), toggled in Settings. |
| **Section header** | Eyebrow + H2 + optional 1–2 line sub (max 55ch), left-aligned on mobile, centred on desktop. |
| **Hero** | See §6 Home. |
| **Trust strip** | 2×2 grid mobile / 4 across desktop; big Fredoka number + label; renders only items with data. |
| **Programme card** | `--surface`, `--r-md`, shadow-sm; image 4:3, tint chip with age range, title, 2-line summary, "Learn more →". Hover: lift 4px + shadow-md. Whole card is one link. |
| **USP/feature card** | Icon in tinted circle (56px), bold specific headline, 1–2 lines. |
| **Day timeline** | Mobile vertical line with dots; desktop horizontal scroll-free 5–6 steps; each: time, title, one line. |
| **Safety checklist** | Grid of icon + label + short note; check icon in `--ok`. |
| **Teacher card** | Square photo `--r-md`, name, role, qualification line. |
| **Testimonial card** | Quote in Fredoka 500 `--fs-lg`, parent name + programme; tint background; 3 max visible, others stacked (no carousel). |
| **Gallery** | CSS grid (2 cols mobile / 3–4 desktop), uniform crops in grid; native `<dialog>` lightbox with arrows, swipe, Esc, focus return, alt text announced. |
| **FAQ** | `<details>/<summary>`, 56px summary row, plus/minus icon rotates, one open allowed at a time optional. |
| **Steps** | Numbered circles (Fredoka) joined by dashed line; 4 steps. |
| **Fee card** (if shown) | Programme name, ₹ amount + period, inclusions list; no "most popular" gimmicks. |
| **CTA band** | `--tint-sun` or `--ink` bg; headline, 2 buttons. |
| **Form** | Labels above fields (never placeholder-only), 52px inputs, `--r-sm`, 2px `--line` border, focus 3px `--focus` ring + offset; errors: `--err` text + icon + `aria-describedby`; consent checkbox 24px with full-row hit area; submit full-width on mobile. |
| **Consent banner** | Bottom card, 2 equal buttons (Accept / Decline), no dark patterns, link to policy; doesn't block content. |
| **Footer** | `--ink` bg, white text (verify contrast); 4 columns desktop → stacked mobile; wave divider on top. |
| **Breadcrumbs** | `--fs-sm`, chevron separators, current page not linked. |
| **404 / Thank-you** | Friendly illustration (SVG), clear next actions. |

---

## 5. Motion
- Reveal-on-scroll: fade + translateY(12px → 0), 420ms `--ease`, once, via IntersectionObserver, **disabled under `prefers-reduced-motion`**.
- Hover: cards lift 4px; buttons lift 2px; links underline grow.
- One slow ambient float (12s) on a hero sticker only, no-preference users only.
- Page transitions: none. No parallax. No autoplay video. No scroll-jacking.
- Never animate layout properties; use `transform/opacity` only.

---

## 6. Sitemap, slugs & page specs

Fixed slugs (do not rename): `/` · `/about/` · `/programmes/` (+ `/programmes/{slug}/`) · `/our-approach/` · `/facilities-safety/` · `/admissions/` · `/gallery/` (+ `/gallery/{album}/`) · `/news/` · `/reviews/` · `/parent-corner/` · `/contact/` · `/thank-you/` · `/privacy-policy/` · `/terms/` · `/photo-child-safety-policy/`

Navigation: **Primary** — About · Programmes · Facilities & Safety · Admissions · Gallery · Contact (+ "More": Our Approach, News, Reviews, Parent Corner). **Footer** — all pages + legal. Every page ends with one primary CTA (Book a Visit) and offers WhatsApp.

### Home (top → bottom)
1. **Announcement bar** (optional)
2. **Header**
3. **Hero** (`--bg`): left column — eyebrow ("Preschool in {Area}, {City}"), H1 with one squiggle-underlined word, 1–2 line promise, buttons *Book a school visit* + *Chat on WhatsApp*, a one-line micro-proof (rating only if real). Right — blob-masked real photo with two sticker badges fed from Settings (e.g., "{N}+ years", "Teacher–child ratio {x}") shown only if data exists. Mobile: text first, photo 4:3 below. LCP rule: text is LCP on mobile; hero image `fetchpriority=high` on desktop.
4. **Trust strip** (white card overlapping hero bottom by −2rem)
5. **Programmes** (`--tint-sky`): 3–4 cards
6. **Why Global Kids** (`--bg`): 4–6 USP cards, each with a specific fact
7. **A day at Global Kids** (`--tint-mint`): timeline
8. **Safety** (`--bg`): 6 checklist items + "See all safety measures"
9. **Gallery strip** (`--tint-blush`): 6 photos + "View gallery"
10. **Founder note** (`--bg`): blob photo + 3-line note + signature-style name (text, not image)
11. **Teachers** (`--tint-lilac`)
12. **Reviews** (`--bg`): 3 testimonials + Google link (only if configured)
13. **Admissions in 4 steps** (`--tint-sun`)
14. **FAQ** (`--bg`): 6 questions + "More FAQs"
15. **CTA band + map card**
16. **Footer**

### Programmes index / detail
Index: intro + grid + comparison table. Detail: hero (title, age chip, photo), at-a-glance row (age · timing · ratio · fee), "What your child will do" (3–5 cards), sample schedule, gallery, related FAQs, CTA band.

### About
Story (editorial two-column, blob photo), founder note, values (3 cards), team grid, CTA.

### Our Approach
Philosophy lead, six learning-area cards (icon + plain-language outcome), "how we share progress", day timeline, CTA.

### Facilities & Safety
Intro promise (specific), checklist grid with photos, pickup & emergency process (steps), hygiene/food/transport blocks (only those that exist), CTA.

### Admissions
At-a-glance (age cut-off, timings), 4 steps, documents checklist, fees (show/on-request), brochure, FAQ accordion by topic, **visit form** (anchor `#visit`), WhatsApp alt.

### Gallery / Album
Album grid with cover, title, date; album page with grid + lightbox. Only consented albums.

### News, Reviews, Parent Corner
News: card list (3 cols) + single post (narrow column). Reviews: testimonial list + Google CTA. Parent Corner: lock icon intro, password form, file list grouped (Circulars · Calendar · Menu · Forms), "Questions? WhatsApp us".

### Contact
Two columns desktop: contact card (call, WhatsApp, email, address, hours, parking note) + form; map facade below with "Open in Google Maps".

---

## 7. Responsive rules
- 360px is the design floor; no horizontal scroll ever.
- Grids use `repeat(auto-fit, minmax(260px,1fr))` (cards) — no fixed column counts below 48em.
- Container padding `--gutter`; text blocks capped at `--measure`.
- Touch targets ≥ 44px; spacing between tappables ≥ 8px.
- Tables (comparison) become stacked cards below 48em.
- Sticky bar replaces floating WhatsApp bubble on mobile; on ≥ 64em show a small floating WhatsApp button bottom-right instead.

## 8. Accessibility specifics
Skip link first focusable; landmarks (`header/nav/main/footer`); one H1; heading order; visible 3px focus ring with 2px offset on every focusable; forms: label+`for`, `aria-describedby` for errors, `aria-live=polite` status region; lightbox & mobile menu trap focus and restore it; decorative SVG `aria-hidden`; informative images have real alt; no information by colour alone; link text meaningful ("Read about our Nursery programme", not "Click here"); `prefers-reduced-motion` honoured; zoom to 200% without loss.

## 9. Copy & microcopy guide
Voice: warm, plain, specific, reassuring — like a trusted teacher talking to a parent. Short sentences; "your child"; numbers over adjectives; no superlatives ("best", "No.1") and no unverifiable claims. Examples — CTAs: *Book a school visit · Chat on WhatsApp · Call us · See our programmes · Download brochure*. Form success: "Thank you, {first name}. We'll call you within one working day to confirm your visit." (only if the school confirms that promise). Errors: "Please enter a 10-digit mobile number." Every factual sentence goes into `seed/COPY_REVIEW.md` for client approval.

## 10. Design QA checklist
- [ ] Contrast script passes for every text/background pair
- [ ] Only 2 font families, ≤ 4 font files, no layout shift on font swap
- [ ] No more than 3 decorative motifs; none overlap text
- [ ] Section background rhythm follows §6 order; no adjacent identical tints
- [ ] Every component shows all states
- [ ] 360 / 390 / 768 / 1024 / 1440 screenshots reviewed for clipping, tap size, spacing
- [ ] Sticky bar never hides content or form fields
- [ ] Reduced-motion mode verified
- [ ] No stock photos, no placeholders, no dead links
