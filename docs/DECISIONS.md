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
