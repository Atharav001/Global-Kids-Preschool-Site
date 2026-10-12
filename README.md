# Global Kids Preschool — Official Website (v1.0)

A lightweight, accessible, mobile-first website for **Global Kids Preschool & Daycare**, built with custom WordPress architecture (`gk-theme` + companion plugin `gk-core`) and a standalone interactive preview server.

[![CI Pipeline](https://github.com/Atharav001/Global-Kids-Preschool-Site/actions/workflows/ci.yml/badge.svg)](https://github.com/Atharav001/Global-Kids-Preschool-Site/actions)

---

## 🌟 Key Features & Architectural Highlights

1. **"Sunny, Soft, and Sure" Design System**:
   - Palette tailored for warm early education with high-contrast text (`#FFF8EC` cream background, `#FFC93C` sun yellow, `#2A62D8` trust blue).
   - Clean, rounded typography using self-hosted Google Fonts: **Fredoka** (headings) and **Nunito** (body/UI).
   - Subtle, organic accents: blob-masked hero photography, wavy section dividers, and sticker badges.

2. **Thumb-First Mobile Experience**:
   - Sticky mobile action bar with instant 1-tap options: **Call Direct**, **WhatsApp**, and **Book a Visit**.
   - Input-aware behavior: automatically slides away when form fields or keyboards are focused.
   - Accessible full-screen navigation sheet with focus trapping and `Esc` key dismissal.

3. **Strict Child Privacy by Design (DPDP Act 2023 Compliant)**:
   - **Zero child identifiers online**: online enquiry forms never ask for child names, dates of birth, or photos.
   - **Parental photo-consent gate**: gallery albums and testimonials cannot be published unless verified consent is confirmed.
   - Data minimization and automated retention purging for visitor inquiries.

4. **Extreme Performance Budgets**:
   - Core CSS bundle: **5.87 KB gzipped** (Budget: ≤ 25 KB).
   - First-party JS bundle: **2.14 KB gzipped** (Budget: ≤ 40 KB).
   - Zero jQuery, zero heavy page builders, and zero unnecessary plugins.

---

## 🚀 Instant Localhost Preview Server

You can run the live, interactive preview server with zero external database or Docker setup:

```bash
# 1. Start the live preview server
npm run dev
# or: npm start
```

Open your browser and navigate to:
👉 **`http://localhost:3000`**

### Available Routes to Test:
- `/` — Homepage (Hero, trust strip, programmes, USPs, timeline, founder note, reviews, FAQs)
- `/about/` — School story, core values, educator profiles
- `/programmes/` — Curriculums, daily schedules, and comparison matrix
- `/our-approach/` — Montessori + play-based learning philosophy
- `/facilities-safety/` — Safety checklist, CCTV, and dual-card pickup protocol
- `/admissions/` — 4-step admissions guide, eligibility, and interactive visit booking form
- `/gallery/` — Campus life photo albums with accessible `<dialog>` lightbox
- `/reviews/` — Verified parent testimonials
- `/news/` — School events and parenting tips
- `/parent-corner/` — Enrolled families portal
- `/contact/` — Direct tap-to-call, WhatsApp helpdesk, and campus map directions
- `/privacy-policy/` — Comprehensive child privacy policy

---

## 🧪 Testing & Launch Gate Verification

Run the automated launch gate test suite to verify WCAG contrast, link integrity, and data protection:

```bash
npm test
# Or: npm run launch-check
```

---

## 📦 Building Deployment Packages

To generate deployable production zip archives for Hostinger:

```bash
npm run build
```

Outputs:
- `dist/gk-theme.zip` (Custom classic theme with `theme.json`)
- `dist/gk-core.zip` (Companion plugin with settings, CPTs, and security hardening)

---

## 📂 Project Structure

```
├── .github/workflows/ci.yml       # GitHub Actions CI pipeline
├── docs/
│   ├── PRD.md                     # Product Requirements Document (v1.0)
│   ├── ARCHITECTURE.md            # Technical Architecture Specification
│   ├── DESIGN.md                  # Visual Design System Specification
│   ├── DECISIONS.md               # Architecture decision log
│   ├── QUESTIONS.md               # Client intake questionnaire
│   ├── RUNBOOK.md                 # Developer & operations guide
│   └── QA_REPORT.md               # Quality assurance audit report
├── seed/
│   ├── settings.sample.json       # Baseline settings configuration
│   ├── content.json               # Seeded programme and educator content
│   └── COPY_REVIEW.md             # Client factual claims sign-off log
├── server/
│   └── server.js                  # Standalone localhost preview server
├── tests/
│   └── launch-check.js            # Launch gate test suite
├── wp-content/
│   ├── themes/gk-theme/           # Custom classic theme
│   └── plugins/gk-core/           # Companion business logic plugin
└── package.json
```
