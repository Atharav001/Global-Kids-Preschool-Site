# RUNBOOK.md — Operations & Developer Guide

## Quick Start (Localhost Preview Server)
To start the live interactive preview on localhost (no database or external Docker engine required):
```bash
npm run dev
# Or:
npm start
```
This serves the website at `http://localhost:3000` with hot rendering, live interaction, all 14 templates, mobile navigation, responsive layouts, enquiry form test pipeline, and WCAG-tested components.

---

## Testing & Quality Gates
To execute the automated launch gate test:
```bash
npm test
# Or:
npm run launch-check
```
Checks performed:
1. Zero placeholder content or lorem ipsum in public templates.
2. Zero broken or dead `#` hyperlinks.
3. Contrast verification across all design tokens against WCAG 2.2 AA standards.
4. Indian mobile format validation for enquiry forms.
5. Child privacy & data protection: no child names, DOBs, or unconsented photos.
6. JSON-LD local business schema validation.

---

## Production Build & Packaging
To build distribution bundles and zip archives for Hostinger / production deployment:
```bash
npm run build
```
Generates:
- `dist/gk-theme.zip` — The custom classic theme.
- `dist/gk-core.zip` — The companion plugin containing all CPTs, Settings, form handling, and security hardening.

---

## WordPress Playground Mode (In-Browser/CLI)
To run within Node.js WebAssembly WordPress Playground:
```bash
npm run playground
```

---

## Deploying to Production (Hostinger)
1. In WordPress Admin (`Plugins > Add New > Upload Plugin`), upload `dist/gk-core.zip` and activate.
2. In WordPress Admin (`Appearance > Themes > Add New > Upload Theme`), upload `dist/gk-theme.zip` and activate.
3. Import the baseline settings and content from `seed/settings.sample.json` and `seed/content.json`.
4. Run launch check before disabling the `noindex` tag.
