# DECISIONS.md — Global Kids Preschool Website

This is an append-only log of architectural and technical decisions, tradeoffs, and deviations.

---

## Initial Stack Summary (Stage 0)

1. **Target Platform**: WordPress classic custom theme (`gk-theme`) paired with a dedicated companion plugin (`gk-core`) on Hostinger LiteSpeed hosting.
2. **Design Language**: "Sunny, soft, and sure" (Warm, high-contrast, editorial, child-friendly yet reassuring for parents).
3. **Typography**: Fredoka (Headings) and Nunito (Body/UI) with native system fallbacks.
4. **Styles & Scripts**: Custom zero-dependency CSS bundle (`main.css`), CSS custom properties, vanilla ES6 modular JS bundle (< 15 KB gzipped), native `<dialog>` accessible lightbox, zero jQuery.
5. **Data Architecture**: Custom Post Types (`gk_programme`, `gk_teacher`, `gk_testimonial`, `gk_album`, `gk_faq`, `gk_enquiry`) and centralized `gk_settings` options schema.
6. **Local Development & Preview**: Hybrid architecture supporting both WP-CLI/Playground environments and a high-performance interactive preview server (`http://localhost:3000`) for instant live inspection without external Docker dependencies.

---

## 5 Biggest Constraints

1. **Zero-Placeholder Launch Gate**:
   Strict enforcement: No `lorem ipsum`, no `example.com`, no dummy phone numbers, no dead `#` links, and no stock-photo walls. Every fact must come from centralized Settings. Sample data must be strictly tokenized (`SAMPLE` / `_gk_sample=1`) and rejected at launch check.

2. **Strict Child Privacy & Data Minimization (DPDP Act 2023 Aligned)**:
   Online forms must NEVER collect child names, dates of birth, or photos. No child full names beside photos. No public pupil directories. Parental photo-consent toggles must gate publication of albums and testimonials.

3. **Performance & Lightweight Asset Budgets**:
   - Mobile LCP ≤ 2.5s, CLS ≤ 0.05, INP ≤ 200ms on simulated 4G / mid-range mobile.
   - Max CSS ≤ 25 KB gzipped, first-party JS ≤ 40 KB gzipped, font budget ≤ 80 KB.
   - Strict plugin count ceiling (≤ 6 plugins total in production). No heavy page builders (no Elementor/Astra bloat).

4. **Thumb-First Mobile Conversions (< 2 Taps to Contact)**:
   Every page must feature instant contact options (Book a Visit, tap-to-call, and WhatsApp). Sticky mobile action bar must be keyboard-aware and safe-area aware, never obscuring input fields.

5. **Non-Technical Admin Safeguards**:
   The school admin (`gk_school_admin` role) must be able to edit text, announce notices, update fees, add galleries, and review enquiries without having the ability to break layout or install unvetted third-party plugins.

---

## Decision: Mobile View Margins & End-to-End Zoom Responsiveness (Stage 8 Refinement)

- **Date**: 2026-10-19
- **What**: Enhanced mobile view margins, fluid card/panel padding, and end-to-end zoom fitting across all viewport sizes (320px–4K) and zoom levels (50%–300%).
- **Details**:
  1. Updated viewport meta tag to include `viewport-fit=cover` across `header.php` and preview server for safe-area edge-to-edge support on modern devices.
  2. Applied global viewport overflow containment (`overflow-x: hidden; max-width: 100vw;`) on `html` and `body`, paired with `overflow-wrap: break-word` on typography and `max-width: 100%` on buttons, media, canvas, and iframes to eliminate side-scroll.
  3. Replaced static auto-fit column minimums with `minmax(min(100%, Xpx), 1fr)` across all cards, timeline, faculty, safety, and programme grids.
  4. Converted card, form, and panel paddings to fluid clamps (`clamp(1rem, 3.5vw, ...)`) to maximize usable width on narrow devices while maintaining spacious desktop styling.
  5. Refined institutional top utility bar and sticky header for mobile view: single-line helpline + admission badge on mobile screens, responsive logo title clamp, and collision-free menu toggle.
  6. Verified momentum touch scrolling on data tables (`.table-scroll`) and flex-wrapping on footer legal links.
- **Verification**: All launch-check tests, WCAG contrast checks, and build packaging passed (CSS bundle 11.59 KB gz, budget <= 25 KB).
