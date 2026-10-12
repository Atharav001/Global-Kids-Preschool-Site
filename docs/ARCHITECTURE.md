# ARCHITECTURE — Global Kids Preschool Website (v1.0)

**Save in repo as:** `docs/ARCHITECTURE.md` · Read `PRD.md` first. Visual rules are in `DESIGN.md`.

---

## 1. Decision log

| Decision | Choice | Why | Rejected alternative |
|---|---|---|---|
| Platform | **WordPress on the client's existing Hostinger** | Client owns it, wants to edit himself, ecosystem for backups/SEO/mail | Astro/Next + Git CMS: faster in theory, but client can't edit comfortably and the paid host goes unused |
| Theme | **Custom classic theme `gk-theme` with `theme.json`** (PHP templates + block patterns) | Lightweight, no page-builder bloat, fully agent-codable; client still edits page text in the block editor | Elementor/Astra (current): heavy, template-looking. Full Site Editing theme: more moving parts for an agent, easier for client to break layout |
| Custom logic | **Companion plugin `gk-core`** (CPTs, settings, form, schema, consent, hardening, CLI) | Content survives theme changes; one place for business logic | Putting logic in theme (breaks on theme switch) |
| Forms | **Own lightweight form in `gk-core`** | One simple form type, zero plugin CSS/JS, full control of data minimisation/retention | Fluent Forms (fine fallback if client later wants drag-and-drop forms) |
| Front-end JS | **Vanilla, ≈ 10–15 KB**, no jQuery, no frameworks | Performance budget | React/Alpine/sliders |
| Build tooling | `esbuild` + `lightningcss` (or equivalent) — bundle/minify only | Tiny, no webpack config sprawl | Webpack/Vite for a theme this small |
| Analytics | **GA4, consent-gated, injected by `gk-core`** (no Site Kit) | Less weight, consent control | Site Kit; cookieless tools (valid alternative; lose click-event reporting) |
| Parent area | **Password-protected page** (v1) | No accounts to manage, zero child-data risk | Custom login portal (Phase 2, prefer off-the-shelf) |

**Plugin budget (≤ 6 total):** `gk-core` (ours) · FluentSMTP (mail delivery) · The SEO Framework · LiteSpeed Cache (Hostinger runs LiteSpeed) · UpdraftPlus (off-host backups) · Two Factor (+ login-attempt limiting). Verify each is current/maintained at build time. **Remove Elementor, Astra and all demo content.**

---

## 2. System context

```
 Parent (mobile browser)
        │ HTTPS
        ▼
 [ Cloudflare DNS (+ optional free proxy/CDN) ]
        ▼
 ┌─────────────────────────── Hostinger (LiteSpeed, PHP 8.2+, MariaDB) ───────────────────────────┐
 │  LiteSpeed page cache                                                                          │
 │   └─ WordPress core                                                                            │
 │        ├─ gk-theme  (templates, patterns, CSS/JS, fonts)                                       │
 │        ├─ gk-core   (settings, CPTs, blocks, form, schema, consent+GA4 loader, CLI, hardening) │
 │        └─ plugins: FluentSMTP · The SEO Framework · LiteSpeed Cache · UpdraftPlus · Two Factor │
 └──────────────────────────────────────────────────────────────────────────────────────────────┘
        │ outbound only
        ├─ SMTP (domain mailbox or transactional provider) → notifications + auto-reply
        ├─ Cloudflare Turnstile (server-side verify on form submit)
        ├─ Google Analytics 4 (only after consent)
        ├─ Google Maps (click-to-load iframe) / Google Business Profile (links only)
        ├─ WhatsApp via wa.me links (no API, no data stored by us)
        └─ UpdraftPlus → Google Drive (backups)
```

No database server, queue, Redis, or CDN image service is needed at this traffic level. Page caching is the scaling strategy; if ever needed, add Cloudflare proxying first.

---

## 3. Repository layout

```
/ (repo root)
├── AGENTS.md
├── docs/{PRD,ARCHITECTURE,DESIGN,DECISIONS}.md      # DECISIONS = append-only log of deviations
├── wp-content/
│   ├── themes/gk-theme/
│   │   ├── style.css                # header comment only
│   │   ├── theme.json               # tokens: colours, type, spacing, layout
│   │   ├── functions.php            # bootstraps /inc
│   │   ├── header.php footer.php front-page.php page.php single.php archive.php 404.php index.php
│   │   ├── single-gk_programme.php archive-gk_programme.php
│   │   ├── single-gk_album.php archive-gk_album.php
│   │   ├── page-templates/{admissions,contact,parent-corner,thank-you}.php
│   │   ├── inc/{setup,enqueue,images,nav,template-tags,security-headers}.php
│   │   ├── template-parts/{header,footer,cards,sections,icons,dividers}/
│   │   ├── patterns/*.php           # block patterns (registered from files)
│   │   └── assets/{src/{css,js,fonts,icons},dist}/
│   └── plugins/gk-core/
│       ├── gk-core.php
│       └── includes/{settings,cpt,meta-boxes,blocks/*,shortcodes,schema,form/*,
│                      consent,analytics,roles,hardening,cli,launch-check}.php
├── seed/{settings.sample.json,content.json,pages/*.html,forms/,images/,COPY_REVIEW.md}
├── tests/{e2e/*.spec.ts,a11y/,lighthouse.config.js,scripts/}
├── .github/workflows/ci.yml          # lint + build + tests + zip artifacts
├── .wp-env.json  package.json  composer.json  .editorconfig  .gitignore
```
Never commit: `wp-config.php`, `.env`, uploads, backups, API keys.

---

## 4. Data model

### 4.1 Custom post types (all registered in `gk-core`)

| CPT | Slug | Public | Fields (classic meta boxes, no JS build) | Notes |
|---|---|---|---|---|
| Programme | `gk_programme` | yes | age_from, age_to, timings, schedule (text), ratio, fee_text, highlights (3–6 lines), order | Archive = Programmes index; featured image required |
| Teacher | `gk_teacher` | no archive; used in blocks | role, qualification, years_experience, photo (featured), order | |
| Testimonial | `gk_testimonial` | no single page | parent_display_name, programme, quote, **consent_confirmed** | Publish blocked without consent |
| Album | `gk_album` | yes | event_date, **consent_confirmed**; images = core Gallery block in content; cover = featured image | Publish blocked without consent |
| FAQ | `gk_faq` | no single page | question = title, answer = content, topic (taxonomy `gk_faq_topic`: admissions, fees, safety, daily-routine), order | Rendered as `<details>` accordion |
| Enquiry | `gk_enquiry` | **private**, `show_in_rest=false` | parent_name, phone, email, programme, age_band, visit_date, visit_time, message, source_page, consent_ts, consent_text_version, status, notes | Admin-only; CSV export; retention purge |

`post` = News/Events (categories: Events, Celebrations, Parenting tips). Pages for everything else.

### 4.2 Settings (`gk_settings`, one option array, Settings API, validated on save)
`school_name, tagline, est_year, phone_display, phone_e164, whatsapp_e164, whatsapp_default_msg, email, address_line1, address_line2, area, city, state, pincode, lat, lng, maps_url, hours (structured per day), instagram, facebook, youtube, ratio_text, children_taught (opt), google_rating (opt), google_review_count (opt), google_review_url (opt), fee_mode (show|on_request), admission_cutoff_text, brochure_id, ga4_id, announce_enabled, announce_text, announce_url, retention_months, turnstile_site_key` (secret key lives in `wp-config.php` constant, **not** the DB).

Helpers: `gk_setting($key, $default='')`, `gk_phone_link()`, `gk_whatsapp_link($message)` → `https://wa.me/<digits>?text=<rawurlencode>`, `gk_has_rating()`.

### 4.3 Roles
`gk_school_admin` = Editor capabilities + `manage_gk_settings` + `manage_gk_enquiries`. No plugin/theme install/edit, no user management. Developer uses Administrator during the project and **deletes that account at handoff**.

### 4.4 Menus & front page
Menus `primary`, `footer`, `legal` registered and seeded. Front page and posts page assigned by the seed script. Slugs fixed (see DESIGN §6) so internal links never break.

---

## 5. Rendering model
- Full-page cache by LiteSpeed for all public pages; **excluded from cache:** Parent Corner, thank-you page (if it shows dynamic data), form POST endpoint, admin.
- Dynamic blocks (`gk/programmes`, `gk/teachers`, `gk/testimonials`, `gk/faq`, `gk/trust-strip`, `gk/albums`, `gk/news`, `gk/contact-card`, `gk/hours`) are **server-rendered PHP** reading CPTs/settings; they output plain semantic HTML. Cache is purged on relevant post/setting saves.
- Page prose lives in editable blocks inside seeded pages; **hard facts never appear in prose** — only via blocks/shortcodes (`[gk_setting key="phone_display"]`).
- Patterns (hero, trust strip, steps, CTA band, etc.) are registered from `/patterns` so the admin can insert consistent sections.

---

## 6. Enquiry pipeline

```
Form GET → server prints nonce + honeypot + timestamp token
Submit (fetch enhancement, or normal POST fallback to admin-post.php)
  1. verify nonce, honeypot empty, time-trap (min 3s, max 1h)
  2. rate-limit per IP hash (transient; e.g. 5 / hour)
  3. verify Turnstile token server-side (wp_remote_post, 5s timeout)
  4. sanitise + validate (name, IN mobile, email, enums, date ≥ today, consent === true)
  5. insert gk_enquiry (status=new, consent_ts, consent_text_version)  ← stored FIRST
  6. wp_mail → school (Reply-To = parent)  ·  wp_mail → parent auto-reply (if email)
     └ if mail fails: log + admin notice; data is already safe
  7. redirect to /thank-you/?ref=<opaque id>  (no PII in URL)
Daily WP-Cron: purge enquiries older than retention_months; send "N new enquiries" nudge optional.
```
Failure modes handled: Turnstile outage (fail closed with clear message + show WhatsApp/call alternative), SMTP failure (stored anyway), JS disabled (works), double submit (idempotency token).

Security of the pipeline is tested in AGENTS Stage 6/9.

---

## 7. Integrations

| Integration | Purpose | Data shared | Failure behaviour |
|---|---|---|---|
| SMTP (FluentSMTP) | Deliver notification/auto-reply | Parent contact + message | Entry saved; admin notice |
| Cloudflare Turnstile | Bot defence | Token + IP (to Cloudflare) | Fail closed with fallback contact options |
| GA4 | Conversions, traffic | Pseudonymous events, **only after consent** | Site unaffected |
| Google Maps | Directions | Loads only after click | Plain link remains |
| Google Business Profile | Local discovery | n/a (links) | n/a |
| WhatsApp (wa.me) | Primary contact channel | Prefilled text in link | Phone number shown as text too |
| UpdraftPlus → Google Drive | Backups | Site files + DB | Alert email on failure |
| UptimeRobot | Downtime alerts | URL ping | n/a |

---

## 8. Performance architecture
- **CSS:** one minified stylesheet (`main.css`), tokens in `:root`, no utility framework; per-template CSS only if > 4 KB.
- **JS:** one deferred bundle: nav toggle, sticky-bar logic, reveal-on-scroll (IntersectionObserver), lightbox (`<dialog>`), consent banner, map facade, form enhancement, event tracking. Template-gated modules lazy-imported only where used.
- **Fonts:** self-hosted WOFF2 variable subsets (Fredoka + Nunito, Latin), `font-display: swap`, preload the 1–2 critical files, size-adjusted fallbacks to prevent CLS.
- **Images:** registered sizes `gk-card 640×480`, `gk-hero 1600×900`, `gk-square 600×600`; WebP/AVIF; `srcset/sizes`; explicit width/height; LCP image `fetchpriority="high"`, never lazy; everything else lazy.
- **Embeds:** facades for Maps and YouTube; no third-party scripts before consent except Turnstile on form pages only.
- **WordPress cleanup:** dequeue emojis, embeds, block-library CSS not used, jQuery on front; disable XML-RPC, pingbacks, RSS bloat, author archives.
- **Cache headers:** long immutable caching for hashed/versioned assets; HTML cached by LiteSpeed.

## 9. Security architecture
- `wp-config.php`: `DISALLOW_FILE_EDIT`, `FORCE_SSL_ADMIN`, unique salts, non-default DB prefix, Turnstile secret constant, `WP_DEBUG` off in prod.
- Hardening in `gk-core/hardening.php`: disable XML-RPC, block `/wp/v2/users` enumeration for anonymous, disable author archives, hide WP version, restrict upload types (jpg, png, webp, avif, pdf; **no SVG uploads**), remove default admin username advice in handoff doc.
- Headers (via theme/`.htaccess`, verify host compatibility): `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera/mic/geo off), `X-Frame-Options: SAMEORIGIN`; CSP in report-only first, then enforced if stable.
- Custom code rules: capability check + nonce on every action; escape on output (`esc_html/esc_attr/esc_url/wp_kses_post`); sanitise on input; `$wpdb->prepare` for any SQL; no `eval`, no remote code, no unserialize of user data.
- Auth: 2FA for every admin/School Admin; login-attempt limiting; strong passwords; no shared accounts.
- **Child-data architecture:** no child identifiers collected; enquiries admin-only and not in REST; consent text versioned; retention purge; photo-consent gate on albums/testimonials.

## 10. Environments, deploy, rollback
| Env | Where | Notes |
|---|---|---|
| Local | `wp-env` (Docker) or WordPress Playground CLI | Seeded with sample data flagged `SAMPLE` |
| Staging | Hostinger subdomain / staging feature (verify plan) | `noindex`, password-protected, visible STAGING bar |
| Production | Client's domain | `noindex` until launch gate passes |

**Deploy (code only):** CI builds `gk-theme.zip` and `gk-core.zip` → deploy via SSH/rsync if available, else upload zips in WP admin. **Content is never overwritten by deploys; after launch production is the source of truth** — never push a staging DB over production. Rollback = redeploy previous zip artifact; DB backup restore only for content disasters. Schema changes: none beyond CPT/meta (no custom tables), so rollbacks are safe.

## 11. Backups & disaster recovery
- Hostinger backups (as available) **plus** UpdraftPlus: DB daily, files weekly, retain ≥ 14 days, stored in client's Google Drive.
- Monthly WXR export + media copy kept by client.
- Code in Git (client-owned repo at handoff).
- **Restore drill before launch** on a staging copy; documented steps in `docs/RUNBOOK.md`. Targets: RPO ≤ 24h, RTO ≤ 4h.

## 12. Monitoring & operations
UptimeRobot (5-min), Search Console (indexing, queries), GA4 events (§PRD AN2), PHP error log review monthly, monthly update window (WP core/plugins) with backup first, quarterly broken-link crawl. Care-plan scope defined in contract.

## 13. Engineering standards
PHP: WordPress Coding Standards (phpcs), PHP 8.2+, strict escaping. JS/CSS: ESLint + Stylelint. Commits small and descriptive. Every deviation from docs appended to `docs/DECISIONS.md`. No dead code, no unused enqueues.

## 14. Verify at build time (unknowns)
Hostinger plan: SSH, staging, PHP version, backup frequency · exact current commands for `wp-env`/Playground · current plugin versions and maintenance status · Turnstile + SMTP configuration on host · whether the host's LiteSpeed config permits our headers.
