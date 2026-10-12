# PRD — Global Kids Preschool Website (v1.0)

**Save in repo as:** `docs/PRD.md` · **Companions:** `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, root `AGENTS.md`
**Status:** Ready for build · **Owner:** Developer (freelance) for client Gokul / school founder Shanmuga Praba S

---

## 1. Overview

### 1.1 What this is
A lightweight, attractive, mobile-first website for a preschool / day care. Its one job: turn a worried, comparison-shopping parent into a **school visit**, then an **admission**. It also gives enrolled parents a simple place for circulars and forms, and gives the school a site its staff can edit without a developer.

### 1.2 Why a rebuild (lessons from the audit of the current site)
The current site is an unmodified starter template. Every requirement below exists to prevent a repeat of these failures:

| Audit failure | Requirement it created |
|---|---|
| Lorem ipsum on every page | **Launch gate:** zero placeholder text/images at go-live (§9) |
| Fake phone, `example.com` emails, Brooklyn address | **Single source of truth** for all facts (Settings, FR-ST) |
| Every button linked to `#` | Every CTA must resolve to a real target; tested automatically |
| Fake teachers, fake testimonial, unverifiable "4.8 Google" | Only real, permissioned content; ratings shown only with a real linked profile |
| US dollar fees, US forms | India-specific content (₹, Indian admission norms) |
| No privacy/consent for a site that collects parent data | Privacy-by-design (§6.4) |
| Stock photos, template logo | Real photography pipeline; brand assets from client |
| Empty SEO, no local signals | Local SEO built in (FR-SEO) |

### 1.3 Goals
1. **Convert:** a parent can reach the school (call / WhatsApp / visit form) within **2 taps from any page**.
2. **Build trust in 10 seconds:** real photos, real contact details, real safety facts, real reviews.
3. **Be fast on a mid-range phone on 4G** (budgets in §6.1).
4. **Be editable by non-technical staff** without breaking the design.
5. **Be safe:** minimal child data, no public child identifiers, hardened WordPress.
6. **Look current and warm, not like a template** (see DESIGN.md).

### 1.4 Non-goals (v1)
Parent login portal, online fee payment, live chat bot, multi-language switcher, e-commerce, student information system, collecting any child's name/DOB/photo online.

---

## 2. Users

| Persona | Needs | Notes |
|---|---|---|
| **P1 Prospective parent** (primary) | Safety proof, fees/timings, programme fit, location, reviews, fast contact | Mostly Android phone, WhatsApp-native, comparing 2–4 schools, often first-time parent. Relatives (grandparents) may also read — keep text large and plain. |
| **P2 Enrolled parent** | Circulars, calendar, menu, forms, announcements | Wants it in two taps, no account to remember (v1). |
| **P3 School admin** (Gokul / staff) | Edit text, photos, news, fees, hours; read enquiries | Non-technical; may edit from a phone. Must not be able to break layout or install plugins. |

---

## 3. Success metrics

| Metric | Target (calibrate after 60 days of data) |
|---|---|
| Action rate (call tap + WhatsApp tap + form submit) per session | ≥ 4% |
| Visit-form completion rate (started → submitted) | ≥ 40% |
| Lighthouse mobile: Performance / Accessibility / Best Practices / SEO | ≥ 90 / 95 / 95 / 95 |
| Core Web Vitals (mobile, field or lab) | LCP ≤ 2.5s · CLS ≤ 0.05 · INP ≤ 200ms |
| Placeholder/sample content at launch | 0 |
| Time for admin to publish a news post (untrained, first try) | ≤ 5 min |

---

## 4. Scope

**In (v1):** the 14 page types in §5, custom lightweight theme, school settings panel, custom enquiry/visit form, WhatsApp/call CTAs, galleries/albums with consent controls, FAQ, news/events, password-protected Parent Corner, SEO + local schema, consent-gated analytics, backups, hardening, handoff.

**Phase 2 (priced separately):** parent login portal (prefer off-the-shelf), bilingual site (Polylang), online fee payment, admission CRM/WhatsApp automation, virtual tour, deeper blog programme.

---

## 5. Functional requirements

Priority: **P0** = launch blocker · **P1** = should ship in v1 · **P2** = nice to have.

### 5.1 Global
| ID | Requirement | P |
|---|---|---|
| G1 | Header: logo, primary nav, persistent **Book a Visit** button | P0 |
| G2 | Mobile: accessible full-screen menu + **sticky bottom action bar** (Call · WhatsApp · Book Visit) that never covers form fields/focus | P0 |
| G3 | Footer: address, phone, WhatsApp, email, hours, socials, map link, quick links, legal links, auto-year copyright | P0 |
| G4 | Optional announcement bar (e.g., "Admissions open for 2027–28") toggled in Settings | P1 |
| G5 | Breadcrumbs on inner pages | P1 |
| G6 | Friendly 404 with links to Programmes, Admissions, Contact | P1 |
| G7 | All phone/WhatsApp/email/address/hours come from Settings only — never typed into templates or prose | P0 |
| G8 | Skip-link, visible focus, landmarks, `lang` attribute | P0 |

### 5.2 Home
| ID | Requirement | P |
|---|---|---|
| H1 | Hero: H1 with area + city, one-line promise, 2 CTAs (Book a Visit · WhatsApp), real photo | P0 |
| H2 | Trust strip: years running, children taught, teacher–child ratio, Google rating. **Each item renders only if its Settings value exists**; rating only if value + count + review URL exist | P0 |
| H3 | Programme cards (from Programme entries) → programme pages | P0 |
| H4 | "Why Global Kids": 4–6 evidence-backed points (icon + specific fact) | P0 |
| H5 | "A day at Global Kids" timeline | P1 |
| H6 | Safety highlights (icons) → Facilities & Safety page | P0 |
| H7 | Gallery strip (latest consented photos) | P1 |
| H8 | Founder note with real photo | P0 |
| H9 | Teachers strip | P1 |
| H10 | Reviews (approved testimonials + link to Google reviews) | P1 |
| H11 | Admission in 4 steps | P0 |
| H12 | FAQ (top 6) | P1 |
| H13 | Final CTA band + map card + footer | P0 |

### 5.3 About & Team
| ID | Requirement | P |
|---|---|---|
| A1 | Story, founder photo + note, vision/values in plain language | P0 |
| A2 | Team page/section from Teacher entries (name, role, qualification, experience, photo) | P1 |

### 5.4 Programmes
| ID | Requirement | P |
|---|---|---|
| PR1 | Programmes index (grid) | P0 |
| PR2 | Programme detail: age range, timings, typical schedule, what children learn, ratio/class size, fee (conditional), related photos, related FAQs, CTA | P0 |
| PR3 | Comparison table (age · timing · hours · fee-if-shown) | P1 |

### 5.5 Our Approach
| ID | Requirement | P |
|---|---|---|
| AP1 | Philosophy + learning areas (language, numeracy, motor, creative, social-emotional, discovery) | P0 |
| AP2 | How progress is shared with parents (meetings, reports, updates) | P1 |

### 5.6 Facilities & Safety (the key trust page)
| ID | Requirement | P |
|---|---|---|
| S1 | Editable checklist grid (CCTV, staff verification, secure entry, authorised-pickup protocol, hygiene, first aid, fire safety, transport, food) — only items the school actually has | P0 |
| S2 | Real photos for each facility | P0 |
| S3 | Authorised-pickup and emergency process explained | P1 |

### 5.7 Admissions
| ID | Requirement | P |
|---|---|---|
| AD1 | 4-step process | P0 |
| AD2 | Age eligibility + cut-off date | P0 |
| AD3 | Documents checklist (Indian norms; no US forms) | P0 |
| AD4 | Fees shown as ₹ per programme **or** "on request" via Settings switch | P0 |
| AD5 | FAQ grouped by topic (admissions, fees, safety, daily routine) with accordion | P0 |
| AD6 | **Visit/enquiry form** (§5.14) | P0 |
| AD7 | Brochure download (if file set in Settings) | P1 |
| AD8 | Thank-you page after submit with WhatsApp + call options | P0 |

### 5.8 Gallery
| ID | Requirement | P |
|---|---|---|
| GA1 | Album grid (cover, title, date) | P0 |
| GA2 | Album page: responsive grid + accessible lightbox | P0 |
| GA3 | **Consent control:** an album/testimonial cannot be published unless "Parent photo consent confirmed" is ticked | P1 |
| GA4 | Video via click-to-load facade (no heavy iframes on load) | P1 |

### 5.9 News & Events
| ID | Requirement | P |
|---|---|---|
| N1 | News index + post template, categories (Events, Celebrations, Parenting tips) | P1 |
| N2 | Latest 3 shown on Home | P2 |

### 5.10 Reviews
| ID | Requirement | P |
|---|---|---|
| RV1 | Testimonial list from approved entries (name as parent first name + initial, programme, text) | P1 |
| RV2 | Link to Google reviews (only if configured) | P1 |

### 5.11 Parent Corner
| ID | Requirement | P |
|---|---|---|
| PC1 | Password-protected page (single shared password, shared via WhatsApp) | P1 |
| PC2 | File list for circulars, calendar, menu, forms; admin adds files by editing the page | P1 |
| PC3 | Noindex + excluded from sitemap + not cached | P0 |

### 5.12 Contact
| ID | Requirement | P |
|---|---|---|
| C1 | Address, tap-to-call, WhatsApp, email, hours, parking/drop-off note | P0 |
| C2 | Map via click-to-load facade + "Open in Google Maps" link | P0 |
| C3 | Contact form (same pipeline as visit form, different fields) | P0 |

### 5.13 Legal
| ID | Requirement | P |
|---|---|---|
| L1 | Privacy Policy, Terms, **Photo & Child-Safety Policy** (templates written by developer, **reviewed/approved by client**; client may consult a lawyer) | P0 |
| L2 | Consent banner gating analytics; no tracking before consent | P0 |

### 5.14 Enquiry / Visit form
| ID | Requirement | P |
|---|---|---|
| F1 | Fields: parent name*, mobile*, email, programme of interest*, child's age band*, preferred visit date, preferred time (morning/afternoon), message, **consent checkbox*** (links to Privacy Policy). **Do not ask for child's name, DOB or photo.** | P0 |
| F2 | Client + server validation; Indian mobile format; friendly inline errors | P0 |
| F3 | Spam defence: honeypot + time trap + Cloudflare Turnstile (server-verified) + per-IP rate limit | P0 |
| F4 | On submit: store entry (admin-only), email notification to school, auto-reply to parent (if email given), redirect to thank-you page; no data loss if email fails | P0 |
| F5 | Admin list with status (new/contacted/visited/enrolled/closed), notes, CSV export; retention auto-purge after N months (Settings) | P1 |
| F6 | Works without JavaScript (progressive enhancement) | P1 |

### 5.15 Settings (single source of truth)
| ID | Requirement | P |
|---|---|---|
| ST1 | "School Settings" admin screen: name, tagline, established year, phone (display + tel format), WhatsApp number + default message, email, address, area, city, pincode, lat/lng, Google Maps URL, hours, social URLs, teacher–child ratio, children-taught (optional), Google rating/count/review URL (all optional), fee display mode, admission cut-off text, brochure file, GA4 ID, announcement bar, retention months | P0 |
| ST2 | Helper `gk_setting()` used everywhere; values validated (phone, URL, email) | P0 |
| ST3 | Role **School Admin**: edit content + Settings + enquiries; cannot install/edit plugins, themes, users | P0 |

### 5.16 SEO & Local
| ID | Requirement | P |
|---|---|---|
| SEO1 | Title pattern `{Page} · Preschool in {Area}, {City} · {Name}`; unique meta descriptions; one H1/page | P0 |
| SEO2 | `Preschool` (LocalBusiness) JSON-LD with real NAP, hours, geo, sameAs; BreadcrumbList. **No self-published review/rating schema** | P0 |
| SEO3 | XML sitemap, robots, canonicals, OG/Twitter images | P0 |
| SEO4 | Meaningful alt text on every non-decorative image | P0 |
| SEO5 | Google Business Profile linked and NAP consistent (operational task, in handoff) | P1 |

### 5.17 Analytics
| ID | Requirement | P |
|---|---|---|
| AN1 | GA4 loads only after consent | P0 |
| AN2 | Events: `call_click`, `whatsapp_click`, `visit_form_submit`, `brochure_download`, `directions_click` | P1 |
| AN3 | Search Console verified (DNS) — operational task | P1 |

---

## 6. Non-functional requirements

### 6.1 Performance (mobile, Lighthouse simulated 4G, Moto-G-class CPU)
- LCP ≤ 2.5s (target 2.0s) · CLS ≤ 0.05 · INP ≤ 200ms · TBT ≤ 150ms
- Home initial transfer ≤ 900 KB; first-party JS ≤ 40 KB gz; CSS ≤ 25 KB gz; fonts ≤ 80 KB total; LCP image ≤ 120 KB
- No jQuery on the front end; no page builder; no carousel libraries; plugin count ≤ 6
- Images: AVIF/WebP, responsive `srcset`, explicit dimensions, lazy-load below the fold

### 6.2 Accessibility
WCAG 2.2 AA: contrast (verified by script), keyboard operability, focus visibility, labelled forms, reduced-motion respected, 44px touch targets, no autoplay, captions/transcripts for any speech video.

### 6.3 Security
Hardened WordPress (see ARCHITECTURE §9), 2FA for all admins, nonces + capability checks on every custom action, output escaping, input sanitisation, spam defence, no secrets in repo, HTTPS only, security headers.

### 6.4 Privacy (India DPDP Act 2023 aware — client to confirm specifics with a lawyer)
- Collect minimum data; **no child names/DOB/photos online** in v1.
- Explicit consent checkbox + privacy notice on every form.
- Never publish a child's full name with a photo; no pickup times/routes; written parental photo consent before any child image is published.
- No behavioural tracking/ads aimed at children; analytics only after consent.
- Retention policy for enquiries (default 12 months, configurable); deletion on request process documented.

### 6.5 Compatibility
Last 2 versions of Chrome, Safari (iOS 15+), Firefox, Edge, Samsung Internet; Android WebView; viewports 360–1920px.

### 6.6 Reliability
Daily DB + weekly file backups to **off-host storage**, restore drill passed before launch, uptime monitoring with alerts.

### 6.7 i18n readiness
All strings via `__()`; Indic-script font fallback ready; language switcher is Phase 2.

---

## 7. Content requirements (what the client must supply)
Logo (vector/high-res), brand colours (if any), real photos (building, classrooms, play area, activities, teachers, founder), programmes + age bands + timings + fees, address/phone/WhatsApp/email/hours/maps pin, staff list + qualifications, safety facts, 6–10 permissioned testimonials, social links, GBP access, parent photo-consent forms, languages needed. **Developer drafts all copy; client approves every factual claim** (tracked in `seed/COPY_REVIEW.md`).

---

## 8. Constraints & assumptions
- WordPress on Hostinger (existing). Hostinger plan features (SSH, staging, backups, PHP version) are verified in Phase 0.
- Location, language(s), fee visibility, and photo availability are unknown at writing — they are inputs, not blockers to building (the build uses clearly flagged sample data until replaced).
- Traffic is small/local; page caching is sufficient (no Redis/queues/replicas).

## 9. Acceptance — the Launch Gate (all must pass)
1. `wp gk launch-check` returns **PASS**: no lorem/`example.`/`TODO`/`REPLACE`/`SAMPLE`/placeholder images; all required Settings filled and valid.
2. Crawler finds **zero** links to `#`, zero 404s, zero mixed content.
3. Form: submissions stored, emailed, auto-replied; spam traps verified; consent required.
4. Lighthouse + Core Web Vitals budgets met on Home, a Programme page, Admissions, Contact.
5. axe: zero serious/critical violations on all templates; keyboard test passed.
6. Backups: restore drill completed from off-host copy.
7. 2FA on, headers set, XML-RPC off, user enumeration closed, file editing disabled.
8. Legal pages approved by client; photo-consent flags set on all published galleries/testimonials.
9. GBP linked, Search Console verified, sitemap submitted, noindex removed **last**.
10. Client trained (video + doc) and holds all credentials/ownership.

## 10. Risks & open questions
| Risk / question | Plan |
|---|---|
| Client is slow with photos/content (most common slip) | Content is a signed dependency; timeline pauses; sample data keeps dev moving |
| Language(s) needed? | Ask in Phase 0; v1 single-language, i18n-ready |
| Show fees publicly? | Settings switch handles both |
| Hostinger plan limits (no SSH/staging) | Zip-based deploy fallback in ARCHITECTURE §10 |
| Parent portal expectations | Phase 2, off-the-shelf first |
| Domain/hosting ownership unclear | Verify before any build work |
