# AGENTS.md — Build Instructions (Global Kids Preschool)

**Place at repo root as `AGENTS.md`.** Docs live in `/docs`: `PRD.md` (what/why), `ARCHITECTURE.md` (how it's wired), `DESIGN.md` (how it looks). Read all three fully before writing code. This file says *in what order* and *how to prove each step works*.

Build a lightweight, attractive, **real** preschool website: custom WordPress theme `gk-theme` + companion plugin `gk-core`. **No page builders. No Elementor/Astra. No demo content.**

---

## 0. Ground rules (always)

1. **No placeholders ship.** No lorem ipsum, `example.com`, `123`-style numbers, `#` links, stock/demo photos, or invented facts. Sample data is allowed only in `/seed`, flagged `SAMPLE` (meta `_gk_sample=1` / text token), and the launch gate fails if any survives.
2. **No hard facts in code or prose.** Phone, WhatsApp, email, address, hours, ratio, years, fees, ratings come only from `gk_setting()` / CPTs. A rating renders only if value + count + review URL exist. Never add review/rating schema.
3. **Tokens only.** No hardcoded colours, spacing, radii, font sizes — use CSS variables from `DESIGN.md §2`.
4. **Security on every custom action:** capability check + nonce, sanitise input, escape output, `$wpdb->prepare`. No secrets in the repo.
5. **Child privacy:** never collect child name/DOB/photo online; no child names beside photos; consent flags enforced.
6. **Performance budget is a requirement, not a goal** (PRD §6.1). Do not add a library, plugin, or font file without checking the budget; log the reason in `docs/DECISIONS.md`.
7. **Plugin budget ≤ 6** (ARCHITECTURE §1). No jQuery on the front end.
8. **Accessibility is built in**, not retrofitted (DESIGN §8).
9. **Small commits** after each checklist item. Run lint + build before every commit.
10. **Stop at each stage's verification.** If it fails, fix it before continuing. Never stack work on a broken stage.
11. **Docs are the source of truth.** If reality contradicts them, append to `docs/DECISIONS.md` (what, why) and update the doc — don't silently diverge.
12. **When unsure about client facts, ask — do not invent.** List open questions in `docs/QUESTIONS.md`.

**Typical commands (verify they work in this environment; adapt and record in `docs/RUNBOOK.md`):**
`npm ci` · `npm run build` · `npm run lint` · `npx wp-env start` (or WordPress Playground CLI if Docker unavailable) · `npx wp-env run cli wp gk seed` · `npx wp-env run cli wp gk launch-check` · `npx playwright test` · `npx lighthouse <url> --preset=desktop|--form-factor=mobile` · `composer phpcs`

---

## Stage 0 — Environment & scaffold
- [ ] Read the three docs; summarise in `docs/DECISIONS.md` the stack and the 5 biggest constraints in your own words
- [ ] Create the repo layout from ARCHITECTURE §3; `.gitignore`, `.editorconfig`, `package.json`, `composer.json`, `.wp-env.json`, lint configs
- [ ] Get a local WordPress running with `gk-theme` and `gk-core` active (empty shells)
- [ ] CI workflow: lint → build → zip artifacts (`gk-theme.zip`, `gk-core.zip`)
**Verify:** site loads locally, `npm run build` and lint pass, CI green, `docs/RUNBOOK.md` lists working commands.

## Stage 1 — Theme foundation & design tokens
- [ ] `theme.json` (palette, fonts, sizes, spacing, layout) per DESIGN §2.4
- [ ] Self-host Fredoka + Nunito WOFF2 variable subsets; preload critical; size-adjusted fallbacks
- [ ] Base CSS: reset, tokens, typography, layout utilities, buttons, forms base, focus styles, container/section rhythm
- [ ] `functions.php` + `/inc` modules; cleanup (emojis, embeds, unused block CSS, front-end jQuery)
- [ ] Static header/footer shell and a style-guide test page (`/_styleguide`, noindex, **removed before launch**)
**Verify:** styleguide renders all tokens/components skeletons; CSS ≤ 25 KB gz; fonts ≤ 80 KB; no CLS on font swap; contrast script passes for all token pairs.

## Stage 2 — `gk-core`: settings, roles, CPTs, hardening
- [ ] Settings screen + `gk_setting()` helpers + validation (phone, URL, email, lat/lng)
- [ ] CPTs/taxonomy/meta boxes per ARCHITECTURE §4.1; consent-gate on albums/testimonials (revert to draft + notice)
- [ ] Role `gk_school_admin`; capabilities; restrict plugin/theme/user management
- [ ] Hardening module (XML-RPC off, user enumeration closed, author archives off, version hidden, upload type limits, no SVG uploads)
- [ ] `seed/settings.sample.json` and WP-CLI `wp gk seed` (settings, menus, sample CPT entries flagged SAMPLE) — idempotent
**Verify:** School Admin can edit settings/content but cannot install plugins; invalid inputs rejected with messages; output escaped (test with `<script>` strings); anonymous request to `/wp-json/wp/v2/users` returns no users; seed runs twice without duplicates.

## Stage 3 — Global layout & components
- [ ] Header, desktop nav, **mobile menu** (focus trap, Esc, 56px links), sticky header shadow
- [ ] **Sticky mobile action bar** (Call · WhatsApp · Book Visit), safe-area aware, hides on field focus
- [ ] Footer (contact from Settings, hours, socials, legal), announcement bar, breadcrumbs, 404, skip link
- [ ] `gk_whatsapp_link($msg)`; page-aware prefilled messages (e.g., programme name)
- [ ] Core JS bundle: nav, sticky bar, reveal-on-scroll (reduced-motion safe), event hooks for analytics
**Verify:** keyboard-only navigation works end to end; no horizontal scroll at 360px; every contact link resolves from Settings (change a setting → all places update); JS ≤ 40 KB gz.

## Stage 4 — Dynamic blocks & patterns
- [ ] Server-rendered blocks: `gk/trust-strip` (conditional items), `gk/programmes`, `gk/teachers`, `gk/testimonials`, `gk/faq` (details/summary), `gk/albums`, `gk/news`, `gk/contact-card`, `gk/hours`
- [ ] Patterns: hero, USP grid, day timeline, safety checklist, steps, CTA band, fee cards (conditional), section header, wave dividers (3 variants)
- [ ] Decorative SVG set (blob, squiggle, stickers, dots) ≤ 6 KB total, `aria-hidden`
- [ ] Icon sprite (< 30 icons)
**Verify:** each block renders correctly with 0, 1, many items and with missing optional data (no empty shells, no "undefined"); cache purges on save; HTML validates; axe clean on the styleguide.

## Stage 5 — Pages, templates, seeded content
- [ ] Templates: front-page, page, programme single/archive, album single/archive, news, admissions, contact, parent-corner, thank-you, 404
- [ ] Seed all pages with fixed slugs (DESIGN §6) using patterns/blocks; menus; front page; legal pages from templates
- [ ] Draft all copy per DESIGN §9 using sample facts via settings/blocks; record every factual claim in `seed/COPY_REVIEW.md` for client approval
- [ ] Pastel photo placeholders flagged `_gk_placeholder` (never real stock)
- [ ] Parent Corner: password-protected, noindex, excluded from sitemap and cache
**Verify:** crawl the local site from `/` using only in-app links — every page reachable, no dead ends, no `#` hrefs; every page ends with a CTA; visual review at 360/390/768/1024/1440 vs DESIGN §6 section order and rhythm.

## Stage 6 — Enquiry & contact form pipeline
- [ ] Form per PRD §5.14 and ARCHITECTURE §6: nonce, honeypot, time trap, per-IP rate limit, Turnstile server verify, validation, store-first, notify + auto-reply, thank-you redirect (no PII in URL)
- [ ] Progressive enhancement (works without JS), inline accessible errors, double-submit protection
- [ ] Admin list: status, notes, CSV export; retention purge via WP-Cron
- [ ] FluentSMTP configured (test with the client's domain mailbox; check SPF/DKIM/DMARC records)
- [ ] Analytics events: `visit_form_submit`, `call_click`, `whatsapp_click`, `brochure_download`, `directions_click`
**Verify (Playwright + manual):** valid submit → entry stored + both emails + thank-you; invalid mobile/email/consent blocked; honeypot/time-trap/rate-limit/Turnstile-failure each rejected; mail failure still stores entry; JS disabled still works; no PII in URL/logs; entries not exposed via REST or anonymously.

## Stage 7 — SEO, schema, analytics, consent
- [ ] The SEO Framework configured: title pattern, per-page descriptions, sitemap, canonicals, OG/Twitter default image generated from logo
- [ ] `Preschool` JSON-LD (NAP, hours, geo, sameAs) + BreadcrumbList; **no rating/review schema**; validate
- [ ] Consent banner + GA4 loader (after Accept only) + Consent Mode defaults denied
- [ ] Alt-text enforcement notice in editor for images without alt; heading/H1 checks
- [ ] `noindex` + search-engine discouragement ON (staging/production until launch gate)
**Verify:** GA4 network calls absent before consent and present after; structured data validates; sitemap lists only public pages (not Parent Corner, thank-you, styleguide).

## Stage 8 — Visual polish, imagery, performance
- [ ] Image sizes registered; WebP/AVIF; `srcset/sizes`; explicit dimensions; LCP image priority; lazy elsewhere
- [ ] Maps + video facades (load on click)
- [ ] Apply DESIGN §3–5 polish: blobs, dividers, stickers, hover/press states, reveal motion, all component states
- [ ] LiteSpeed Cache settings documented (exclusions: parent-corner, form POST, thank-you)
**Verify:** Lighthouse mobile ≥ 90/95/95/95 on Home, a Programme, Admissions, Contact; LCP ≤ 2.5s, CLS ≤ 0.05, TBT ≤ 150ms; Home ≤ 900 KB; reduced-motion verified; DESIGN §10 checklist fully ticked.

## Stage 9 — Full QA & security pass
- [ ] Playwright e2e: nav, mobile menu, sticky bar, every CTA target, forms, Parent Corner password, 404
- [ ] Crawler: zero `#`, zero 404, zero mixed content, zero lorem/`example.`/`TODO`/`REPLACE`
- [ ] axe-core on every template (zero serious/critical) + manual keyboard and screen-reader spot check
- [ ] Security: headers present, XML-RPC off, enumeration closed, file editing disabled, uploads restricted, `phpcs` clean, dependency audit, no secrets in git history
- [ ] Cross-device screenshots (360/390/768/1024/1440) reviewed
**Verify:** all green; produce `docs/QA_REPORT.md` with results and any accepted exceptions.

## Stage 10 — Staging, content intake, launch, handoff
- [ ] Deploy artifacts to staging (STAGING bar, noindex, password); verify Hostinger specifics (PHP, SSH/zip, backups) and record in RUNBOOK
- [ ] Configure UpdraftPlus → client's Google Drive; **perform a restore drill** on a copy
- [ ] Content intake with client: replace every SAMPLE value/placeholder with real data; client approves `COPY_REVIEW.md`; photo-consent flags set; legal pages approved
- [ ] 2FA for all users; delete developer admin account at handoff (create a temporary one for the job); change all passwords
- [ ] `wp gk launch-check` → **PASS**; remove `/_styleguide`
- [ ] Go-live order: DNS/SSL → verify → submit sitemap → link Google Business Profile → verify Search Console → **remove noindex last** → UptimeRobot on
- [ ] Handoff pack: `docs/RUNBOOK.md`, client how-to (edit text, swap photos, add news/album/FAQ, read enquiries, update fees/hours, add Parent Corner files), training video script, credentials/ownership checklist, backup + restore steps
**Verify:** PRD §9 Launch Gate items 1–10 all true.

---

## `wp gk launch-check` must fail on
Lorem/`example.`/`TODO`/`REPLACE`/`SAMPLE`/`000`-style numbers in content, settings, menus, widgets, options · placeholder images (`_gk_placeholder`) · empty required settings (name, phone_e164, whatsapp_e164, email, address, city, area, hours) · invalid phone/URL/email · any `#` link in menus/content · rating shown without count + URL · published album/testimonial without consent flag · site not `noindex` on staging / `noindex` on production at go-live · default admin username present · XML-RPC reachable · Parent Corner indexable.

## Troubleshooting order
1. Read the real error (PHP log, browser console, Playwright trace).
2. Isolate: theme vs `gk-core` vs plugin (disable one at a time).
3. Cache first suspect for "change not showing" (purge LiteSpeed, then test logged-out).
4. Check the last commit; bisect.
5. Works locally, not on host → PHP version, file permissions, `wp-config` constants, mail/SMTP, cache rules.
6. A form that "works" but emails don't arrive → SPF/DKIM/DMARC and SMTP logs, not code.

## Check-in cadence
After each stage: run its verification → commit → update `docs/DECISIONS.md` and `docs/QUESTIONS.md` → re-read the next stage → report to the human: done, evidence, open questions, blockers (especially missing client content).
