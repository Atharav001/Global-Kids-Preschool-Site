/**
 * Global Kids Preschool — Localhost Preview Server
 * Native Node.js (zero external dependencies).
 *
 * Design language: institutional Indian school portal — sharp geometry,
 * navy + gold accents, a systematic single-line navigation bar with
 * dropdown sub-pages, and connected, fully linked content.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname, '..');

const settings = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'seed/settings.sample.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'seed/content.json'), 'utf8'));
const SITE_URL = process.env.SITE_URL || `http://localhost:${PORT}`;

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function wa(customMsg = '') {
  const number = (settings.whatsapp_e164 || '919876543210').replace(/[^0-9]/g, '');
  const msg = customMsg || settings.whatsapp_default_msg;
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

const PROGRAMME_ROUTES = {
  toddler: '/programmes/toddler-playgroup/',
  playgroup: '/programmes/toddler-playgroup/',
  nursery: '/programmes/nursery/',
  kindergarten: '/programmes/kindergarten/',
  daycare: '/programmes/daycare/',
};

function programmeHref(slug) {
  return PROGRAMME_ROUTES[slug] || `/programmes/${slug}/`;
}

/* ------------------------------------------------------------------ *
 * Official school crest
 * ------------------------------------------------------------------ */

function renderEmblem(className = 'school-emblem') {
  return `<svg class="${className}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Global Kids Preschool crest">
    <circle cx="50" cy="50" r="47" stroke="#E7A100" stroke-width="2.5" fill="#142A5C"/>
    <circle cx="50" cy="50" r="44" stroke="#E7A100" stroke-width="1" stroke-dasharray="2 2"/>
    <circle cx="50" cy="50" r="38" fill="#FFFFFF"/>
    <path d="M50 16 L68 22 C68 38 64 54 50 63 C36 54 32 38 32 22 Z" fill="#F7F9FC" stroke="#142A5C" stroke-width="2"/>
    <path d="M33 22.5 C40 24 60 24 67 22.5 C67 36 60 44 50 48 C40 44 33 36 33 22.5 Z" fill="#EAF1FB"/>
    <circle cx="50" cy="32" r="7" fill="#E7A100"/>
    <path d="M50 20 L50 23 M42 24 L44 26 M58 24 L56 26 M39 32 L42 32 M58 32 L61 32" stroke="#C78B00" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M42 41 C45 40 48 40.5 50 42 C52 40.5 55 40 58 41 L58 47 C55 46 52 46.5 50 48 C48 46.5 45 46 42 47 Z" fill="#FFFFFF" stroke="#142A5C" stroke-width="1.2"/>
    <line x1="50" y1="42" x2="50" y2="48" stroke="#142A5C" stroke-width="1.2"/>
    <path d="M50 56 C50 53 50 50 50 49" stroke="#1E7A55" stroke-width="2" stroke-linecap="round"/>
    <path d="M50 52 C46 51 44 49 45 47 C48 47 50 50 50 52 Z" fill="#1E7A55"/>
    <path d="M50 50 C54 49 56 47 55 45 C52 45 50 48 50 50 Z" fill="#1E7A55"/>
    <path d="M26 42 C24 52 28 64 36 71" stroke="#E7A100" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M74 42 C76 52 72 64 64 71" stroke="#E7A100" stroke-width="2" stroke-linecap="round" fill="none"/>
    <polygon points="50,9 51.5,13 55,13 52,15.5 53.5,19.5 50,17 46.5,19.5 48,15.5 45,13 48.5,13" fill="#E7A100"/>
    <path d="M22 75 L30 73 L50 75 L70 73 L78 75 L74 81 L68 79 L50 82 L32 79 L26 81 Z" fill="#E7A100" stroke="#142A5C" stroke-width="1.2"/>
    <text x="50" y="79" font-family="'Plus Jakarta Sans', sans-serif" font-size="5" font-weight="800" fill="#142A5C" text-anchor="middle" letter-spacing="0.5">ESTD 2014</text>
  </svg>`;
}

/* ------------------------------------------------------------------ *
 * Icon set (inline SVG, no external sprite)
 * ------------------------------------------------------------------ */

const svg = (paths, size = 20) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

const icons = {
  phone: svg('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>'),
  whatsapp: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm4.52 11.53c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.07-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.57c.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.12-.22-.19-.47-.32z"/></svg>`,
  mail: svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>'),
  mapPin: svg('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'),
  clock: svg('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),
  check: svg('<polyline points="20 6 9 17 4 12"/>', 18),
  arrowRight: svg('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>', 18),
  chevronDown: svg('<polyline points="6 9 12 15 18 9"/>', 16),
  menu: svg('<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>', 24),
  close: svg('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>', 24),
  users: svg('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
  shield: svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'),
  book: svg('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'),
  award: svg('<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>'),
  calendar: svg('<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'),
  file: svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'),
  download: svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>'),
  building: svg('<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>'),
  heart: svg('<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>'),
  star: svg('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'),
  graduation: svg('<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>'),
  leaf: svg('<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/>'),
  palette: svg('<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>'),
  puzzle: svg('<path d="M19.439 7.85c0-1.57.802-2.5 2.1-2.5.4 0 .7.1 1 .2V4a2 2 0 0 0-2-2h-3.85c-.1.3-.2.6-.2 1 0 1.3-.93 2.1-2.5 2.1-1.57 0-2.5-.8-2.5-2.1 0-.4-.1-.7-.2-1H7a2 2 0 0 0-2 2v1.46c.3.1.6.2 1 .2 1.3 0 2.1.93 2.1 2.5 0 1.57-.8 2.5-2.1 2.5-.4 0-.7-.1-1-.2V16a2 2 0 0 0 2 2h1.46c.1-.3.2-.6.2-1 0-1.3.93-2.1 2.5-2.1 1.57 0 2.5.8 2.5 2.1 0 .4.1.7.2 1H20a2 2 0 0 0 2-2v-3.85c-.3-.1-.6-.2-1-.2-1.3 0-2.1-.93-2.1-2.5z"/>'),
  sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>'),
  lock: svg('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
  bus: svg('<path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M4 12h16"/><path d="M8 21v-2M16 21v-2"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/>'),
  utensils: svg('<path d="M3 2v7c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2V2M5 11v11M9 2v20"/>'),
  camera: svg('<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>'),
  sparkles: svg('<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>'),
  alert: svg('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'),
};

/* ------------------------------------------------------------------ *
 * Navigation model — single line, dropdown sub-pages
 * ------------------------------------------------------------------ */

const NAV = [
  { label: 'Home', href: '/' },
  {
    label: 'About', href: '/about/',
    children: [
      ['Our Story & Heritage', '/about/'],
      ["Principal's Message", '/principals-message/'],
      ['Vision & Mission', '/vision-mission/'],
      ['Faculty & Staff', '/faculty/'],
      ['Awards & Recognition', '/awards/'],
    ],
  },
  {
    label: 'Programmes', href: '/programmes/',
    children: [
      ['Programme Overview', '/programmes/'],
      ['Toddler & Playgroup', '/programmes/toddler-playgroup/'],
      ['Nursery / Pre-KG', '/programmes/nursery/'],
      ['Kindergarten (LKG & UKG)', '/programmes/kindergarten/'],
      ['Daycare & Extended Care', '/programmes/daycare/'],
      ['Curriculum & Approach', '/our-approach/'],
    ],
  },
  {
    label: 'Admissions', href: '/admissions/',
    children: [
      ['Admission Overview', '/admissions/'],
      ['Admission Process', '/admissions/process/'],
      ['Age Criteria & Eligibility', '/admissions/eligibility/'],
      ['Documents Checklist', '/admissions/documents/'],
      ['Fee Structure', '/admissions/fees/'],
      ['Frequently Asked Questions', '/admissions/faqs/'],
    ],
  },
  {
    label: 'Campus', href: '/facilities-safety/',
    children: [
      ['Facilities & Infrastructure', '/facilities-safety/'],
      ['Child Safety & Security', '/safety/'],
      ['Photo Gallery', '/gallery/'],
      ['Events & Activities', '/events/'],
      ['Notice Board', '/news/'],
    ],
  },
  {
    label: 'Parents', href: '/parents/',
    children: [
      ['Parent Corner', '/parent-corner/'],
      ['Circulars & Notices', '/circulars/'],
      ['School Calendar', '/school-calendar/'],
      ['Downloads & Handbooks', '/downloads/'],
      ['Parent Reviews', '/reviews/'],
    ],
  },
  { label: 'Contact', href: '/contact/' },
];

function isActive(item, activeSlug) {
  if (item.href === '/') return activeSlug === 'home';
  const leaf = item.children ? item.children.map((c) => c[1]) : [item.href];
  return leaf.some((href) => href.replace(/\/$/, '') === '/' + activeSlug) ||
    (item.children || []).some((c) => '/' + activeSlug + '/' === c[1]);
}

/* ------------------------------------------------------------------ *
 * Chrome: utility bar, header, mobile nav, footer
 * ------------------------------------------------------------------ */

function renderUtilityBar() {
  return `
  <div class="school-top-utility">
    <div class="container school-utility-inner">
      <div class="utility-left">
        <a href="tel:${esc(settings.phone_e164)}">${icons.phone} ${esc(settings.phone_display)}</a>
        <span class="utility-divider">|</span>
        <a href="mailto:${esc(settings.email)}">${icons.mail} ${esc(settings.email)}</a>
        <span class="utility-divider">|</span>
        <span>Mon–Sat, 8:30 AM – 4:30 PM</span>
      </div>
      <div class="utility-right">
        <a href="/admissions/" class="utility-badge">Admissions 2026–27 Open</a>
        <a href="/parent-corner/" class="utility-link">${icons.lock} Parent Corner</a>
        <a href="${wa()}" target="_blank" rel="noopener noreferrer" class="utility-link utility-wa">${icons.whatsapp} WhatsApp</a>
      </div>
    </div>
  </div>`;
}

function renderHeader(activeSlug) {
  const items = NAV.map((item) => {
    const active = isActive(item, activeSlug) ? ' active' : '';
    if (!item.children) {
      return `<div class="nav-item"><a href="${item.href}" class="nav-link${active}">${item.label}</a></div>`;
    }
    const dropdown = item.children.map(([label, href]) => {
      const childActive = href.replace(/\/$/, '') === '/' + activeSlug ? ' class="active"' : '';
      return `<a href="${href}"${childActive}>${label}</a>`;
    }).join('');
    return `<div class="nav-item">
      <a href="${item.href}" class="nav-link${active}" aria-haspopup="true">${item.label} <span class="nav-caret">${icons.chevronDown}</span></a>
      <div class="nav-dropdown">${dropdown}</div>
    </div>`;
  }).join('');

  return `
  <header class="site-header" role="banner">
    <div class="container header-inner">
      <a href="/" class="brand-logo" aria-label="${esc(settings.school_name)} — home">
        ${renderEmblem()}
        <span class="brand-text">
          <span class="brand-title">${esc(settings.school_name)}</span>
          <span class="brand-subtitle">Annanagar West · Chennai</span>
        </span>
      </a>

      <nav class="primary-nav" aria-label="Primary">
        <div class="nav-menu-desktop">${items}</div>
      </nav>

      <div class="header-cta-group">
        <a href="/admissions/#visit" class="btn btn-primary">Book a Visit</a>
        <button class="btn-menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu-drawer" aria-label="Open navigation menu">
          ${icons.menu}
        </button>
      </div>
    </div>
  </header>`;
}

function renderMobileNav(activeSlug) {
  const items = NAV.map((item) => {
    const active = isActive(item, activeSlug) ? ' active' : '';
    if (!item.children) {
      return `<li><a href="${item.href}" class="mobile-nav-link${active}">${item.label}</a></li>`;
    }
    const sub = item.children.map(([label, href]) => {
      const childActive = href.replace(/\/$/, '') === '/' + activeSlug ? ' class="active"' : '';
      return `<li><a href="${href}"${childActive}>${label}</a></li>`;
    }).join('');
    return `<li class="mobile-nav-group${active ? ' open' : ''}">
      <button type="button" class="mobile-nav-group-toggle${active}" aria-expanded="${active ? 'true' : 'false'}">${item.label} <span class="mobile-caret">${icons.chevronDown}</span></button>
      <ul class="mobile-submenu">${sub}</ul>
    </li>`;
  }).join('');

  return `
  <div class="mobile-menu-overlay" aria-hidden="true"></div>
  <aside id="mobile-menu-drawer" class="mobile-menu-drawer" aria-label="Mobile navigation">
    <div class="mobile-menu-header">
      <a href="/" class="brand-logo">${renderEmblem()}<span class="brand-text"><span class="brand-title">${esc(settings.school_name)}</span></span></a>
      <button class="btn-menu-close btn-menu-toggle" type="button" aria-label="Close navigation menu">${icons.close}</button>
    </div>
    <ul class="mobile-nav-list">${items}</ul>
    <div class="mobile-menu-actions">
      <a href="/admissions/#visit" class="btn btn-primary">Book a Campus Visit</a>
      <a href="${wa()}" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
      <a href="tel:${esc(settings.phone_e164)}" class="btn btn-secondary">Call ${esc(settings.phone_display)}</a>
    </div>
  </aside>`;
}

function renderFooter() {
  return `
  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.9rem;">
            ${renderEmblem()}
            <h4 style="margin:0;">${esc(settings.school_name)}</h4>
          </div>
          <p style="color: rgba(255,255,255,0.78); font-size:0.92rem; margin-bottom:1.25rem;">
            ${esc(settings.tagline)}. A child-centred preschool in ${esc(settings.area)}, ${esc(settings.city)}, committed to joyful learning, safety and family partnership.
          </p>
          <div class="footer-contact-item">${icons.mapPin}<span>${esc(settings.address_line1)}, ${esc(settings.area)}, ${esc(settings.city)} – ${esc(settings.pincode)}</span></div>
          <div style="font-size:0.78rem; color:var(--sun); margin-top:0.4rem;">Affiliated to the Early Childhood Association (ECA India)</div>
        </div>

        <div class="footer-col">
          <h4>Programmes</h4>
          <ul class="footer-links-list">
            <li><a href="/programmes/toddler-playgroup/">Toddler &amp; Playgroup</a></li>
            <li><a href="/programmes/nursery/">Nursery / Pre-KG</a></li>
            <li><a href="/programmes/kindergarten/">Kindergarten (LKG &amp; UKG)</a></li>
            <li><a href="/programmes/daycare/">Daycare &amp; Extended Care</a></li>
            <li><a href="/our-approach/">Curriculum &amp; Approach</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul class="footer-links-list">
            <li><a href="/about/">About Our School</a></li>
            <li><a href="/admissions/">Admissions 2026–27</a></li>
            <li><a href="/facilities-safety/">Facilities &amp; Safety</a></li>
            <li><a href="/gallery/">Photo Gallery</a></li>
            <li><a href="/circulars/">Circulars &amp; Notices</a></li>
            <li><a href="/parent-corner/">Parent Corner</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Contact &amp; Hours</h4>
          <div class="footer-contact-item">${icons.phone}<a href="tel:${esc(settings.phone_e164)}">${esc(settings.phone_display)}</a></div>
          <div class="footer-contact-item">${icons.mail}<a href="mailto:${esc(settings.email)}">${esc(settings.email)}</a></div>
          <div class="footer-contact-item">${icons.clock}<span>${esc(settings.hours_text)}</span></div>
          <div style="margin-top:1rem;">
            <a href="${esc(settings.maps_url)}" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-sm">Get Directions</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div>&copy; ${new Date().getFullYear()} ${esc(settings.school_name)}. All rights reserved.</div>
        <ul class="footer-legal-links">
          <li><a href="/privacy-policy/">Privacy Policy</a></li>
          <li><a href="/terms/">Terms of Service</a></li>
          <li><a href="/photo-child-safety-policy/">Child Safety &amp; Photo Policy</a></li>
        </ul>
      </div>
    </div>
  </footer>`;
}

/* ------------------------------------------------------------------ *
 * Small content helpers
 * ------------------------------------------------------------------ */

function sectionHeader(eyebrow, title, text = '', center = false) {
  return `<header class="section-header${center ? ' text-center' : ''} reveal-item">
    <span class="eyebrow">${eyebrow}</span>
    <h2>${title}</h2>
    ${text ? `<p>${text}</p>` : ''}
  </header>`;
}

function breadcrumbs(trail) {
  const parts = trail.map((item, i) => {
    const last = i === trail.length - 1;
    return last
      ? `<span class="current">${item[0]}</span>`
      : `<a href="${item[1]}">${item[0]}</a> <span aria-hidden="true">/</span>`;
  }).join(' ');
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">${parts}</nav>`;
}

function pageBanner(title, subtitle, trail) {
  return `<section class="page-banner">
    <div class="container">
      ${breadcrumbs(trail)}
      <h1>${title}</h1>
      ${subtitle ? `<p>${subtitle}</p>` : ''}
    </div>
  </section>`;
}

function ctaBand() {
  return `<section class="section-cta">
    <div class="container">
      <div>
        <h2>Ready to see our campus in person?</h2>
        <p>Admissions for the 2026–27 academic year are open. Book a guided visit and meet our educators.</p>
      </div>
      <div class="cta-actions">
        <a href="/admissions/#visit" class="btn btn-gold">Book a Campus Visit</a>
        <a href="${wa()}" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
      </div>
    </div>
  </section>`;
}

function enquiryForm(formTitle, formIntro, opts = {}) {
  const selected = opts.selected || '';
  return `<form action="/submit-enquiry" method="POST" class="gk-form" data-gk-validate="true">
    <input type="text" name="website_url" style="display:none;" tabindex="-1" autocomplete="off">
    <input type="hidden" name="form_timestamp" value="${Date.now()}">
    <div class="form-group">
      <label class="form-label" for="${opts.idPrefix || 'e'}_name">Parent / Guardian Name <span class="required">*</span></label>
      <input type="text" id="${opts.idPrefix || 'e'}_name" name="parent_name" class="form-control" required placeholder="e.g. Anand Sharma">
      <span class="form-error-msg">Please enter your name.</span>
    </div>
    <div class="form-grid-2">
      <div class="form-group">
        <label class="form-label" for="${opts.idPrefix || 'e'}_phone">Mobile Number <span class="required">*</span></label>
        <input type="tel" id="${opts.idPrefix || 'e'}_phone" name="phone" class="form-control" required placeholder="10-digit mobile" pattern="[0-9]{10}">
        <span class="form-error-msg">Please enter a valid 10-digit mobile number.</span>
      </div>
      <div class="form-group">
        <label class="form-label" for="${opts.idPrefix || 'e'}_email">Email (optional)</label>
        <input type="email" id="${opts.idPrefix || 'e'}_email" name="email" class="form-control" placeholder="you@email.com">
      </div>
    </div>
    <div class="form-grid-2">
      <div class="form-group">
        <label class="form-label" for="${opts.idPrefix || 'e'}_prog">Programme of Interest <span class="required">*</span></label>
        <select id="${opts.idPrefix || 'e'}_prog" name="programme" class="form-control" required>
          <option value="">Select programme</option>
          ${content.programmes.map((p) => `<option value="${esc(p.title)}"${selected.includes(p.title) ? ' selected' : ''}>${esc(p.title)} (${esc(p.age_band)})</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="${opts.idPrefix || 'e'}_date">Preferred Visit Date</label>
        <input type="date" id="${opts.idPrefix || 'e'}_date" name="visit_date" class="form-control">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label" for="${opts.idPrefix || 'e'}_msg">Questions (optional)</label>
      <textarea id="${opts.idPrefix || 'e'}_msg" name="message" class="form-control" placeholder="Timings, transport, dietary needs, settling routines..."></textarea>
    </div>
    <label class="consent-checkbox-row">
      <input type="checkbox" name="consent" required value="1">
      <span class="consent-text">I agree to the <a href="/privacy-policy/">Privacy Policy</a> and consent to ${esc(settings.school_name)} contacting me about my enquiry. We never share your details. <span class="required">*</span></span>
    </label>
    <button type="submit" class="btn btn-primary" style="width:100%;">${formTitle} ${icons.arrowRight}</button>
  </form>`;
}

/* ------------------------------------------------------------------ *
 * Page assembly
 * ------------------------------------------------------------------ */

function renderPage({ title, active, contentHtml, description = '', breadcrumbTrail = [] }) {
  const pageTitle = title === 'Home'
    ? `${esc(settings.school_name)} · Preschool in ${esc(settings.area)}, ${esc(settings.city)}`
    : `${title} · ${esc(settings.school_name)}, ${esc(settings.city)}`;
  const metaDesc = description || `${esc(settings.school_name)} — a child-centred preschool in ${esc(settings.area)}, ${esc(settings.city)}. Programmes for ages 1.5 to 6 with caring educators and a safe, joyful campus.`;

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Preschool',
    name: settings.school_name,
    description: settings.tagline,
    url: SITE_URL,
    telephone: settings.phone_e164,
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address_line1,
      addressLocality: settings.city,
      addressRegion: settings.state,
      postalCode: settings.pincode,
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: settings.lat, longitude: settings.lng },
    openingHours: 'Mo-Fr 08:30-18:30, Sa 09:00-13:00',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${esc(metaDesc)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/src/css/main.css">
  <script type="application/ld+json">${schema}</script>
</head>
<body class="has-sticky-bar">
  <a class="skip-link" href="#main-content">Skip to main content</a>

  ${settings.announce_enabled ? `<aside class="announcement-bar" role="complementary" aria-label="School announcement">
    <div><strong>Notice:</strong> <span>${esc(settings.announce_text)}</span> <a href="${esc(settings.announce_url)}">Details →</a></div>
    <button class="announcement-dismiss" type="button" aria-label="Dismiss announcement">${icons.close}</button>
  </aside>` : ''}

  ${renderUtilityBar()}
  ${renderHeader(active)}
  ${renderMobileNav(active)}

  <main id="main-content" tabindex="-1">
    ${contentHtml}
  </main>

  ${renderFooter()}

  <aside class="sticky-action-bar" aria-label="Quick contact">
    <a href="tel:${esc(settings.phone_e164)}" class="btn btn-call" aria-label="Call the school">${icons.phone}<span>Call</span></a>
    <a href="${wa()}" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">${icons.whatsapp}<span>WhatsApp</span></a>
    <a href="/admissions/#visit" class="btn btn-primary" aria-label="Book a campus visit">${icons.calendar}<span>Book Visit</span></a>
  </aside>

  <dialog class="gk-lightbox" aria-label="Image preview">
    <div class="lightbox-content">
      <button class="lightbox-close-btn" type="button" aria-label="Close preview">&times;</button>
      <img class="lightbox-img" src="" alt="">
      <p class="lightbox-caption"></p>
    </div>
  </dialog>

  <a href="${wa()}" class="floating-whatsapp-btn" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">${icons.whatsapp}</a>

  <aside class="consent-banner hidden" role="dialog" aria-label="Cookie and analytics consent">
    <p>We use privacy-friendly analytics to understand how families find our school and improve our campus visit information. We never track children or share personal data. <a href="/privacy-policy/">Read our Privacy Policy</a>.</p>
    <div class="consent-banner-actions">
      <button type="button" class="btn btn-primary btn-sm" data-consent-action="accept">Accept Analytics</button>
      <button type="button" class="btn btn-secondary btn-sm" data-consent-action="decline">Decline</button>
    </div>
  </aside>

  <script src="/assets/src/js/main.js" defer></script>
</body>
</html>`;
}

/* ------------------------------------------------------------------ *
 * Home page
 * ------------------------------------------------------------------ */

function getHomeHtml() {
  const quicklinks = [
    ['Admissions 2026–27', '/admissions/', 'Process, eligibility, documents & fees', icons.file],
    ['Our Programmes', '/programmes/', 'Toddler, nursery, kindergarten & daycare', icons.graduation],
    ['Facilities & Safety', '/facilities-safety/', 'Campus infrastructure and child safety', icons.shield],
    ['Book a Campus Visit', '/admissions/#visit', 'Meet our educators in person', icons.calendar],
  ].map(([title, href, text, icon]) => `<a class="quicklink-card" href="${href}">
      <span class="ql-icon">${icon}</span>
      <span><h3>${title}</h3><p>${text}</p></span>
    </a>`).join('');

  const programmes = content.programmes.slice(0, 4).map((p) => `
    <a class="stage-card reveal-item" href="${programmeHref(p.slug)}">
      <span class="stage-age">${esc(p.age_band)}</span>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.summary)}</p>
      <span class="stage-foot"><span>Ratio ${esc(p.ratio)}</span><span>${esc(p.timings)}</span></span>
    </a>`).join('');

  const usps = [
    [icons.heart, 'Joy-Led Learning', 'Children learn best through play. We build curiosity, confidence and a genuine love for school.'],
    [icons.users, 'Small Groups', 'Thoughtful educator-to-child ratios so every child is seen, heard and supported every day.'],
    [icons.shield, 'Safety First', 'Verified staff, CCTV-monitored premises and a strict authorised pick-up protocol.'],
    [icons.book, 'Ready for Primary', 'A structured literacy and numeracy foundation that prepares children for formal schooling.'],
    [icons.leaf, 'Holistic Growth', 'Music, movement, art, nature and social-emotional learning woven into every week.'],
    [icons.sparkles, 'Family Partnership', 'Regular, transparent updates so parents are true partners in their child’s early years.'],
  ].map(([icon, title, text]) => `<div class="feature-card reveal-item">
      <div class="feature-icon-circle tint-sky">${icon}</div>
      <h3>${title}</h3><p>${text}</p>
    </div>`).join('');

  const facilities = [
    ['/assets/images/hero-classroom.jpg', 'Learning Classrooms', 'Bright, naturally lit rooms with child-height shelving and hands-on Montessori materials.'],
    ['/assets/images/outdoor-play.jpg', 'Outdoor Play Area', 'A soft-lawn play arena with sandpit, climbing frames and shaded seating.'],
    ['/assets/images/library-story.jpg', 'Reading Corner', 'A cosy story nook with picture books, puppets and daily reading circles.'],
  ].map(([img, title, text]) => `<div class="campus-gallery-card reveal-item">
      <img src="${img}" alt="${esc(title)} at ${esc(settings.school_name)}">
      <div class="campus-gallery-body"><h4>${title}</h4><p>${text}</p></div>
    </div>`).join('');

  const notices = [
    ['12 OCT 2026', 'Admissions 2026–27 now open', 'Applications for Toddler, Nursery and KG batches are open. Limited seats per batch.', '/admissions/', true],
    ['05 OCT 2026', 'Parent orientation schedule', 'A staggered settling timetable to help new children transition comfortably.', '/circulars/', false],
    ['28 SEP 2026', 'Monsoon health advisory', 'Daily temperature checks and campus sanitisation are in effect.', '/circulars/', false],
  ].map(([date, title, text, href, isNew]) => `<div class="notice-item">
      <div class="notice-date-badge">${date}</div>
      <div class="notice-info">
        <h4><a href="${href}">${title}</a>${isNew ? ' <span class="notice-pill-new">NEW</span>' : ''}</h4>
        <p>${text}</p>
      </div>
    </div>`).join('');

  const events = [
    ['25', 'OCT', 'Grandparents’ Day', '9:30 AM – 11:30 AM · Storytelling, music and clay art with grandparents.'],
    ['08', 'NOV', 'Sensory Open Day', '10:00 AM – 1:00 PM · Families explore our Montessori materials with educators.'],
    ['22', 'NOV', 'Annual Movement Gala', '8:30 AM – 11:00 AM · Non-competitive games and a music celebration.'],
  ].map(([day, month, title, text]) => `<div class="notice-item">
      <div class="event-date-block"><span class="event-day">${day}</span><span class="event-month">${month}</span></div>
      <div class="notice-info"><h4>${title}</h4><p>${text}</p></div>
    </div>`).join('');

  const testimonials = content.testimonials.map((t) => `<div class="testimonial-card reveal-item">
      <p class="testimonial-quote">&ldquo;${esc(t.quote)}&rdquo;</p>
      <div class="testimonial-author">
        <div class="author-avatar">${esc(t.name.charAt(0))}</div>
        <div class="author-meta"><span class="author-name">${esc(t.name)}</span><span class="author-sub">${esc(t.programme)}</span></div>
      </div>
    </div>`).join('');

  return `
  <section class="home-hero">
    <div class="home-hero-media"><img src="/assets/images/hero-classroom.jpg" alt="Children learning together at ${esc(settings.school_name)}" fetchpriority="high"></div>
    <div class="container">
      <div class="home-hero-inner reveal-item">
        <span class="eyebrow">Admissions Open · Academic Year 2026–27</span>
        <h1>Where joyful curiosity becomes a lifelong love of learning</h1>
        <p class="lead">${esc(settings.school_name)} is a child-centred preschool in ${esc(settings.area)}, ${esc(settings.city)}, nurturing confident, kind and curious children aged 1.5 to 6 through play-based and Montessori-inspired learning.</p>
        <div class="hero-actions">
          <a href="/admissions/#visit" class="btn btn-gold">Book a Campus Visit</a>
          <a href="/programmes/" class="btn btn-secondary">Explore Programmes</a>
        </div>
        <div class="hero-trust-row">
          <div class="ht"><strong>${esc(settings.years_running)}</strong><span>Years of early learning</span></div>
          <div class="ht"><strong>${esc(settings.children_taught)}</strong><span>Happy little alumni</span></div>
          <div class="ht"><strong>1:8</strong><span>Educator-to-child ratio</span></div>
          <div class="ht"><strong>${esc(settings.google_rating)} ★</strong><span>Google rating (${esc(settings.google_review_count)} reviews)</span></div>
        </div>
      </div>
    </div>
  </section>

  <div class="container quicklinks-wrap">
    <div class="quicklinks-grid">${quicklinks}</div>
  </div>

  <section class="section">
    <div class="container split-grid">
      <div class="reveal-item">
        <span class="eyebrow">Welcome to our school</span>
        <h2>A warm, secure start to a child’s education</h2>
        <p style="margin-bottom:1rem;">Founded in ${esc(settings.est_year)}, ${esc(settings.school_name)} was created on a simple belief: early childhood should be joyful, unhurried and rooted in care. We blend Montessori self-discovery, structured play and early literacy so children build confidence at their own pace.</p>
        <p>Today our classrooms welcome children from across ${esc(settings.city)}, supported by experienced educators and a campus designed entirely around little learners.</p>
        <ul class="value-list">
          <li>${icons.check}<span>Age-appropriate curriculum aligned to developmental milestones</span></li>
          <li>${icons.check}<span>Continuous parent communication and progress sharing</span></li>
          <li>${icons.check}<span>Nutritious snack routines and hygienic child-height facilities</span></li>
        </ul>
        <div style="margin-top:1.5rem;"><a href="/about/" class="btn btn-secondary">Read Our Story ${icons.arrowRight}</a></div>
      </div>
      <div class="split-media reveal-item">
        <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=900&q=80" alt="An educator guiding preschool children during an activity">
      </div>
    </div>
  </section>

  <section class="section tint-sky">
    <div class="container">
      ${sectionHeader('Academic Programmes', 'Programmes for every stage of early childhood', 'From gentle first steps to confident primary-school readiness, each stage is designed for the way young children learn.', true)}
      <div class="stage-grid">${programmes}</div>
      <div style="text-align:center; margin-top:2.5rem;"><a href="/programmes/" class="btn btn-primary">View All Programmes &amp; Comparison ${icons.arrowRight}</a></div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHeader('Why Families Choose Us', 'A thoughtful foundation for the early years', '', true)}
      <div class="cards-grid">${usps}</div>
    </div>
  </section>

  <section class="section tint-mint">
    <div class="container">
      ${sectionHeader('Campus & Facilities', 'Spaces built for safety and discovery', 'Purpose-designed rooms and outdoor areas that let children explore confidently.', true)}
      <div class="campus-gallery-grid">${facilities}</div>
      <div style="text-align:center; margin-top:2.5rem;"><a href="/facilities-safety/" class="btn btn-secondary">Explore Campus &amp; Safety ${icons.arrowRight}</a></div>
    </div>
  </section>

  <section class="section school-notice-section" style="background:var(--surface);">
    <div class="container">
      ${sectionHeader('School Communications', 'Notice board &amp; upcoming events', '', true)}
      <div class="notice-columns-grid">
        <div class="notice-col-card">
          <div class="notice-col-header"><h3>Circulars &amp; Announcements</h3><a href="/circulars/" style="font-size:0.8rem; font-weight:700;">View all →</a></div>
          ${notices}
        </div>
        <div class="notice-col-card">
          <div class="notice-col-header"><h3>Upcoming Events</h3><a href="/school-calendar/" style="font-size:0.8rem; font-weight:700;">Full calendar →</a></div>
          ${events}
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHeader('Recognition', 'Affiliations &amp; recognition', '', true)}
      <div class="stat-strip reveal-item">
        <div class="stat"><strong>${esc(settings.years_running)}</strong><span>Years of service</span></div>
        <div class="stat"><strong>${esc(settings.children_taught)}</strong><span>Children taught</span></div>
        <div class="stat"><strong>1:8</strong><span>Educator ratio</span></div>
        <div class="stat"><strong>${esc(settings.google_rating)} ★</strong><span>${esc(settings.google_review_count)} parent reviews</span></div>
      </div>
    </div>
  </section>

  <section class="section tint-blush">
    <div class="container">
      ${sectionHeader('Parent Voices', 'Trusted by families across Chennai', '', true)}
      <div class="testimonials-grid">${testimonials}</div>
      <div style="text-align:center; margin-top:2rem;"><a href="/reviews/" class="btn btn-secondary">Read All Reviews ${icons.arrowRight}</a></div>
    </div>
  </section>

  ${ctaBand()}`;
}

/* ------------------------------------------------------------------ *
 * About family
 * ------------------------------------------------------------------ */

function getAboutHtml() {
  return `
  ${pageBanner('Our Story &amp; Heritage', `Nurturing confident little learners in ${esc(settings.city)} since ${esc(settings.est_year)}.`, [['Home', '/'], ['About', '/about/'], ['Our Story', '/about/']])}
  <section class="section">
    <div class="container split-grid">
      <div class="reveal-item">
        <span class="eyebrow">Who we are</span>
        <h2>A school built on empathy, safety and wonder</h2>
        <p style="margin-bottom:1rem;">${esc(settings.school_name)} was founded in ${esc(settings.est_year)} after recognising that early education had become hurried and test-driven. We set out to create the opposite — a calm, joyful place where young children explore, play and grow at their own pace.</p>
        <p style="margin-bottom:1rem;">Across ${esc(settings.years_running)} years in ${esc(settings.area)}, we have combined Montessori self-discovery, structured play and early literacy. Our educators are trained in early childhood practice and every classroom is designed around the child.</p>
        <p>Over ${esc(settings.children_taught)} children have begun their learning journey with us and moved on to leading primary schools with confidence.</p>
      </div>
      <div class="split-media reveal-item">
        <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80" alt="Children reading together in a bright classroom">
      </div>
    </div>
  </section>

  <section class="section tint-sky">
    <div class="container">
      ${sectionHeader('Guiding Principles', 'What we stand for', '', true)}
      <div class="cards-grid">
        <div class="feature-card reveal-item"><div class="feature-icon-circle tint-mint">${icons.heart}</div><h3>Joy before academics</h3><p>A child who feels safe and celebrated develops a genuine motivation to learn. We never use punitive measures or stressful rote testing.</p></div>
        <div class="feature-card reveal-item"><div class="feature-icon-circle tint-sky">${icons.shield}</div><h3>Uncompromising safety</h3><p>From non-toxic furnishings to verified staff and authorised pick-up protocols, child safety is non-negotiable at every step.</p></div>
        <div class="feature-card reveal-item"><div class="feature-icon-circle tint-blush">${icons.users}</div><h3>Partnership with families</h3><p>Parents are co-educators. We keep communication open through regular updates, milestones and parenting workshops.</p></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHeader('Milestones', 'Our journey so far')}
      <div class="process-steps reveal-item">
        <div class="process-step"><div class="ps-num">${esc(settings.est_year)}</div><div><h3>School founded</h3><p>${esc(settings.school_name)} opens its doors in ${esc(settings.area)} with a play-based philosophy.</p></div></div>
        <div class="process-step"><div class="ps-num">1</div><div><h3>Programmes expanded</h3><p>Toddler, nursery and kindergarten stages introduced with age-appropriate curricula.</p></div></div>
        <div class="process-step"><div class="ps-num">2</div><div><h3>Campus enhancements</h3><p>New sensory rooms, an outdoor play arena and a reading corner added across the campus.</p></div></div>
        <div class="process-step"><div class="ps-num">3</div><div><h3>${esc(settings.children_taught)} alumni</h3><p>Thousands of families have trusted us with their child’s first learning years.</p></div></div>
      </div>
    </div>
  </section>
  ${ctaBand()}`;
}

function getPrincipalsMessageHtml() {
  return `
  ${pageBanner("Principal's Message", 'A warm welcome from our Head of School.', [['Home', '/'], ['About', '/about/'], ["Principal's Message", '/principals-message/']])}
  <section class="section">
    <div class="container split-grid">
      <div class="split-media reveal-item">
        <img src="/assets/images/principal-welcome.jpg" alt="Head of School at Global Kids Preschool">
      </div>
      <div class="reveal-item">
        <span class="eyebrow">From the Head of School</span>
        <h2>Every child deserves a joyful beginning</h2>
        <p style="margin-bottom:1rem;">At ${esc(settings.school_name)}, we believe the early years are not a race. They are the window in which a child forms their first relationship with learning — and with themselves.</p>
        <p style="margin-bottom:1rem;">Our educators are trained to observe, encourage and gently guide. We create classrooms where a child can ask questions freely, make friends, and discover that effort and curiosity are celebrated.</p>
        <p style="margin-bottom:1rem;">We work closely with families because a child thrives when home and school move together. When you visit, you will see children who are settled, engaged and genuinely happy to be at school.</p>
        <p>We would be delighted to welcome you to our campus and to be part of your child’s most formative years.</p>
        <div class="principals-signature-block">
          <div class="principals-name-title">
            <strong>${esc(content.teachers[0].name)}</strong>
            <span>${esc(content.teachers[0].role)}</span>
          </div>
          <a href="/faculty/" class="btn btn-secondary btn-sm">Meet Our Faculty ${icons.arrowRight}</a>
        </div>
      </div>
    </div>
  </section>
  ${ctaBand()}`;
}

function getVisionMissionHtml() {
  return `
  ${pageBanner('Vision &amp; Mission', 'The principles that guide every classroom.', [['Home', '/'], ['About', '/about/'], ['Vision & Mission', '/vision-mission/']])}
  <section class="section">
    <div class="container">
      <div class="split-grid">
        <div class="side-card reveal-item" style="border-top:4px solid var(--navy);">
          <span class="eyebrow">Our Vision</span>
          <h2 style="font-size:var(--fs-xl);">To be a school where every child’s first learning years are joyful, secure and meaningful.</h2>
          <p>We want children to leave us confident in themselves, curious about the world and kind to others — ready not just for primary school, but for life.</p>
        </div>
        <div class="side-card reveal-item" style="border-top:4px solid var(--sun);">
          <span class="eyebrow">Our Mission</span>
          <h2 style="font-size:var(--fs-xl);">Child-centred learning, delivered with warmth and rigour.</h2>
          <p>We deliver a developmentally appropriate curriculum, maintain small groups, keep families involved, and hold child safety and wellbeing above everything else.</p>
        </div>
      </div>
    </div>
  </section>
  <section class="section tint-sky">
    <div class="container">
      ${sectionHeader('Core Values', 'What we practise every day', '', true)}
      <div class="cards-grid">
        <div class="feature-card reveal-item"><div class="feature-icon-circle tint-mint">${icons.heart}</div><h3>Care</h3><p>Warm, patient relationships are the foundation of everything we do.</p></div>
        <div class="feature-card reveal-item"><div class="feature-icon-circle tint-sky">${icons.sparkles}</div><h3>Curiosity</h3><p>We protect a child’s natural desire to explore and ask.</p></div>
        <div class="feature-card reveal-item"><div class="feature-icon-circle tint-blush">${icons.shield}</div><h3>Safety</h3><p>A secure, hygienic and predictable environment in which children relax and learn.</p></div>
        <div class="feature-card reveal-item"><div class="feature-icon-circle tint-lilac">${icons.users}</div><h3>Respect</h3><p>For each child’s pace, personality and individual strengths.</p></div>
        <div class="feature-card reveal-item"><div class="feature-icon-circle tint-sky">${icons.book}</div><h3>Foundations</h3><p>Strong early literacy and numeracy built through play and discovery.</p></div>
        <div class="feature-card reveal-item"><div class="feature-icon-circle tint-mint">${icons.users}</div><h3>Partnership</h3><p>An open, trusting relationship with every family.</p></div>
      </div>
    </div>
  </section>
  ${ctaBand()}`;
}

function getFacultyHtml() {
  const faculty = content.teachers.map((t) => `<div class="faculty-card reveal-item">
      <div class="faculty-avatar">${esc(t.name.split(' ')[0].charAt(0))}</div>
      <h3>${esc(t.name)}</h3>
      <span class="role">${esc(t.role)}</span>
      <p>${esc(t.qualification)}</p>
      <p style="margin-top:0.5rem;">${esc(t.bio)}</p>
    </div>`).join('');

  return `
  ${pageBanner('Faculty &amp; Staff', 'Experienced, trained and genuinely caring early years educators.', [['Home', '/'], ['About', '/about/'], ['Faculty', '/faculty/']])}
  <section class="section">
    <div class="container">
      ${sectionHeader('Our Team', 'The people your child will learn with', 'All our educators hold relevant early childhood qualifications and undergo background verification before joining.', true)}
      <div class="faculty-grid">${faculty}</div>
    </div>
  </section>
  <section class="section tint-mint">
    <div class="container">
      <div class="stat-strip reveal-item">
        <div class="stat"><strong>1:8</strong><span>Maximum educator ratio</span></div>
        <div class="stat"><strong>100%</strong><span>Background-verified staff</span></div>
        <div class="stat"><strong>CPR</strong><span>Paediatric first-aid trained</span></div>
        <div class="stat"><strong>CPD</strong><span>Ongoing staff training</span></div>
      </div>
    </div>
  </section>
  ${ctaBand()}`;
}

function getAwardsHtml() {
  const items = [
    [icons.award, 'Early Childhood Association (ECA India)', 'Member institution committed to nationally recognised early years standards and teacher training.'],
    [icons.star, 'Google Parent Rating — ' + esc(settings.google_rating) + ' ★', `Rated ${esc(settings.google_rating)} out of 5 across ${esc(settings.google_review_count)} verified parent reviews.`],
    [icons.shield, 'Child Safety Verified Campus', 'Recognised for CCTV coverage, authorised pick-up protocols and child-safe infrastructure.'],
    [icons.heart, 'Community Recognition', `Serving families across ${esc(settings.city)} for ${esc(settings.years_running)} years.`],
  ].map(([icon, title, text]) => `<div class="accreditation-card reveal-item">
      <div class="accreditation-seal">${icon}</div>
      <div class="accreditation-info"><h4>${title}</h4><p>${text}</p></div>
    </div>`).join('');

  return `
  ${pageBanner('Awards &amp; Recognition', 'Memberships, affiliations and the trust of our families.', [['Home', '/'], ['About', '/about/'], ['Recognition', '/awards/']])}
  <section class="section">
    <div class="container">
      ${sectionHeader('Recognition', 'Recognition &amp; affiliations', 'We participate in recognised early childhood standards and are transparent about what we publish.', true)}
      <div class="accreditation-grid">${items}</div>
      <div class="prose" style="margin:3rem auto 0; max-width:74ch;">
        <p style="font-size:var(--fs-sm);">Recognition listed here reflects the school’s memberships and verified parent feedback. Specific award certificates and affiliations can be inspected during a campus visit.</p>
      </div>
    </div>
  </section>
  ${ctaBand()}`;
}

/* ------------------------------------------------------------------ *
 * Programmes
 * ------------------------------------------------------------------ */

function getProgrammesHtml() {
  const stages = content.programmes.map((p) => `<a class="stage-card reveal-item" href="${programmeHref(p.slug)}">
      <span class="stage-age">${esc(p.age_band)}</span>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.summary)}</p>
      <span class="stage-foot"><span>Ratio ${esc(p.ratio)}</span><span>${esc(p.timings)}</span></span>
    </a>`).join('');

  const rows = content.programmes.map((p) => `<tr>
      <td>${esc(p.title)}</td>
      <td>${esc(p.age_band)}</td>
      <td>${esc(p.timings)}</td>
      <td>${esc(p.ratio)}</td>
      <td>On request</td>
    </tr>`).join('');

  return `
  ${pageBanner('Programmes', 'Developmentally designed programmes for ages 1.5 to 6 years.', [['Home', '/'], ['Programmes', '/programmes/']])}
  <section class="section">
    <div class="container">
      ${sectionHeader('Academic Framework', 'A programme for every stage', 'Each stage is calibrated to the sensory, emotional, linguistic and cognitive milestones of that age.', true)}
      <div class="stage-grid">${stages}</div>
    </div>
  </section>

  <section class="section tint-sky">
    <div class="container">
      ${sectionHeader('Programmes at a Glance', 'Compare our programmes')}
      <div class="table-scroll reveal-item">
        <table class="data-table">
          <thead><tr><th>Programme</th><th>Age Band</th><th>Timings</th><th>Educator Ratio</th><th>Fees</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <p style="font-size:var(--fs-xs); color:var(--ink-soft); margin-top:1rem;">Detailed, itemised fee prospectus is shared during your campus visit. Fees are term-wise and include curriculum materials, activity kits and insurance.</p>
    </div>
  </section>
  ${ctaBand()}`;
}

const PROGRAMME_META = {
  'toddler-playgroup': {
    title: 'Toddler &amp; Playgroup',
    slugs: ['toddler', 'playgroup'],
    banner: 'Gentle, nurturing first steps into school for children aged 1.5 to 3 years.',
  },
  nursery: {
    title: 'Nursery / Pre-KG',
    slugs: ['nursery'],
    banner: 'Building language, number sense and social confidence for children aged 3 to 4 years.',
  },
  kindergarten: {
    title: 'Kindergarten (LKG &amp; UKG)',
    slugs: ['kindergarten'],
    banner: 'Comprehensive primary-school readiness for children aged 4 to 6 years.',
  },
  daycare: {
    title: 'Daycare &amp; Extended Care',
    slugs: ['daycare'],
    banner: 'A safe, caring second home with meals, rest and structured evening activities.',
  },
};

function getProgrammeSingleHtml(key) {
  const meta = PROGRAMME_META[key];
  const programmes = content.programmes.filter((p) => meta.slugs.includes(p.slug));
  const primary = programmes[0];

  const blocks = programmes.map((p) => `
    <div style="margin-bottom:2.5rem;" class="reveal-item">
      <span class="eyebrow">${esc(p.age_band)} · Ratio ${esc(p.ratio)}</span>
      <h2 style="margin-bottom:0.75rem;">${esc(p.title)}</h2>
      <p style="margin-bottom:1rem;">${esc(p.summary)}</p>
      <div class="split-grid" style="align-items:start;">
        <div>
          <h3 style="font-size:var(--fs-lg); margin-bottom:0.5rem;">What children learn</h3>
          <ul class="value-list">
            ${p.curriculum.map((c) => `<li>${icons.check}<span>${esc(c)}</span></li>`).join('')}
          </ul>
        </div>
        <div class="side-card">
          <h3>Programme details</h3>
          <ul class="value-list" style="gap:0.6rem;">
            <li><strong>Age band:</strong>&nbsp;${esc(p.age_band)}</li>
            <li><strong>Timings:</strong>&nbsp;${esc(p.timings)}</li>
            <li><strong>Educator ratio:</strong>&nbsp;${esc(p.ratio)}</li>
          </ul>
          <p style="font-size:var(--fs-xs); color:var(--ink-soft); margin-top:1rem;"><strong>Sample day:</strong> ${esc(p.schedule)}</p>
          <a href="/admissions/?programme=${encodeURIComponent(p.title)}#visit" class="btn btn-primary" style="width:100%; margin-top:1rem;">Enquire for this Programme</a>
        </div>
      </div>
    </div>`).join('');

  return `
  ${pageBanner(meta.title, meta.banner, [['Home', '/'], ['Programmes', '/programmes/'], [meta.title, `/programmes/${key}/`]])}
  <section class="section">
    <div class="container">${blocks}</div>
  </section>
  ${ctaBand()}`;
}

function getCurriculumHtml() {
  const pillars = [
    [icons.sparkles, 'Language &amp; Phonemic Awareness', 'Letter sounds discovered through stories, rhymes, sandpaper tracing and vocabulary-rich conversation — never rote chanting.'],
    [icons.puzzle, 'Numeracy &amp; Logical Thinking', 'Counting beads, pattern blocks, sorting and spatial puzzles that build concrete mathematical understanding.'],
    [icons.palette, 'Fine &amp; Gross Motor Skills', 'Clay, threading, scissor practice and balance games that build the muscles essential for writing and coordination.'],
    [icons.heart, 'Social-Emotional Learning', 'Naming feelings, sharing, taking turns and resolving small conflicts with calm adult scaffolding.'],
    [icons.leaf, 'Discovery &amp; Nature', 'Gardening, nature walks, water play and simple science experiments that spark curiosity.'],
    [icons.users, 'Family Partnership', 'Termly developmental portfolio reviews covering cognitive, motor and emotional progress — without high-stakes testing.'],
  ].map(([icon, title, text]) => `<div class="feature-card reveal-item">
      <div class="feature-icon-circle tint-sky">${icon}</div>
      <h3>${title}</h3><p>${text}</p>
    </div>`).join('');

  return `
  ${pageBanner('Curriculum &amp; Approach', 'How children learn joyfully at ' + esc(settings.school_name) + '.', [['Home', '/'], ['Programmes', '/programmes/'], ['Curriculum & Approach', '/our-approach/']])}
  <section class="section">
    <div class="container split-grid">
      <div class="reveal-item">
        <span class="eyebrow">Our Pedagogy</span>
        <h2>Play is the work of childhood</h2>
        <p style="margin-bottom:1rem;">Our approach draws on Montessori self-discovery, structured play and early literacy practice. Children learn by handling real materials, asking questions and working alongside caring adults.</p>
        <p>We plan around themes and children’s interests, then observe and record progress across language, numeracy, motor skills and social-emotional growth.</p>
      </div>
      <div class="split-media reveal-item"><img src="/assets/images/library-story.jpg" alt="Children engaged in a guided reading activity"></div>
    </div>
    <div class="container" style="margin-top:3rem;">
      <div class="cards-grid">${pillars}</div>
    </div>
  </section>
  ${ctaBand()}`;
}

/* ------------------------------------------------------------------ *
 * Admissions
 * ------------------------------------------------------------------ */

function getAdmissionsHtml(queryParams = {}) {
  const selected = queryParams.programme || '';
  return `
  ${pageBanner('Admissions 2026–27', 'We welcome you to visit our campus, meet our educators and begin your child’s admission.', [['Home', '/'], ['Admissions', '/admissions/']])}
  <section class="section">
    <div class="container sidebar-layout">
      <div class="reveal-item">
        <span class="eyebrow">How to apply</span>
        <h2>A simple, parent-friendly admission process</h2>
        <div class="process-steps" style="margin-top:1.5rem;">
          <div class="process-step"><div class="ps-num">1</div><div><h3>Enquire or book a visit</h3><p>Submit the enquiry form or call us to schedule a guided campus tour.</p></div></div>
          <div class="process-step"><div class="ps-num">2</div><div><h3>Tour the campus</h3><p>Observe a classroom in session and discuss your child’s needs with our team.</p></div></div>
          <div class="process-step"><div class="ps-num">3</div><div><h3>Submit documents</h3><p>Complete the admission form and provide the required documents in person.</p></div></div>
          <div class="process-step"><div class="ps-num">4</div><div><h3>Confirm enrolment</h3><p>On seat allocation, confirm enrolment and complete the fee formalities.</p></div></div>
        </div>
        <div class="quicklinks-grid" style="margin-top:2rem;">
          <a class="quicklink-card" href="/admissions/eligibility/"><span class="ql-icon">${icons.calendar}</span><span><h3>Age Criteria</h3><p>Check eligibility by age</p></span></a>
          <a class="quicklink-card" href="/admissions/documents/"><span class="ql-icon">${icons.file}</span><span><h3>Documents</h3><p>What to bring along</p></span></a>
          <a class="quicklink-card" href="/admissions/fees/"><span class="ql-icon">${icons.award}</span><span><h3>Fees</h3><p>Transparent fee structure</p></span></a>
          <a class="quicklink-card" href="/admissions/faqs/"><span class="ql-icon">${icons.book}</span><span><h3>FAQs</h3><p>Common questions</p></span></a>
        </div>
      </div>
      <div class="side-card reveal-item" id="visit">
        <span class="eyebrow">Book a Visit</span>
        <h2 style="font-size:var(--fs-xl); margin-bottom:0.5rem;">Schedule a campus tour</h2>
        <p style="font-size:var(--fs-sm); margin-bottom:1.25rem;">Fill in your details and our admissions team will call within one working day to confirm your slot.</p>
        ${enquiryForm('Confirm &amp; Book Visit', '', { selected, idPrefix: 'adm' })}
      </div>
    </div>
  </section>
  ${ctaBand()}`;
}

function getAdmissionsProcessHtml() {
  return `
  ${pageBanner('Admission Process', 'Four clear steps from your first enquiry to enrolment.', [['Home', '/'], ['Admissions', '/admissions/'], ['Process', '/admissions/process/']])}
  <section class="section">
    <div class="container">
      <div class="process-steps reveal-item" style="max-width:820px;">
        <div class="process-step"><div class="ps-num">1</div><div><h3>Enquiry &amp; first contact</h3><p>Share your details through our form or call the admissions line. We will call you back the same working day to understand your requirements and answer initial questions.</p></div></div>
        <div class="process-step"><div class="ps-num">2</div><div><h3>Campus visit &amp; interaction</h3><p>Visit the campus, see a live classroom and meet the educators. This helps both families and teachers understand how we work.</p></div></div>
        <div class="process-step"><div class="ps-num">3</div><div><h3>Admission form &amp; documents</h3><p>Complete the admission form and submit the required documents in person. Documents are verified on site and never uploaded online.</p></div></div>
        <div class="process-step"><div class="ps-num">4</div><div><h3>Enrolment confirmation</h3><p>On allocation of a seat, confirm enrolment, complete the fee formalities and receive the welcome handbook and calendar.</p></div></div>
      </div>
    </div>
  </section>
  ${ctaBand()}`;
}

function getAdmissionsEligibilityHtml() {
  const rows = content.programmes.map((p) => `<tr><td>${esc(p.title)}</td><td>${esc(p.age_band)}</td></tr>`).join('');
  return `
  ${pageBanner('Age Criteria &amp; Eligibility', 'Age bands for each programme for the 2026–27 academic year.', [['Home', '/'], ['Admissions', '/admissions/'], ['Eligibility', '/admissions/eligibility/']])}
  <section class="section">
    <div class="container">
      <div class="prose">
        <p>${esc(settings.admission_cutoff_text)} The table below shows the indicative age band for each programme. Where a child is close to a boundary, our admissions team will guide you to the most suitable group.</p>
      </div>
      <div class="table-scroll reveal-item" style="margin-top:1.5rem;">
        <table class="data-table">
          <thead><tr><th>Programme</th><th>Indicative Age Band</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <p style="font-size:var(--fs-sm); color:var(--ink-soft); margin-top:1rem;">Not sure which programme fits your child? <a href="/contact/">Talk to our admissions team</a> or <a href="${wa('Hi! I would like help choosing the right programme for my child.')}">message us on WhatsApp</a>.</p>
    </div>
  </section>
  ${ctaBand()}`;
}

function getAdmissionsDocumentsHtml() {
  const docs = [
    'Copy of the child’s municipal birth certificate',
    'Updated immunisation / paediatric health record',
    'Proof of residence (Aadhaar, utility bill or passport)',
    'Four passport-size photographs of the child',
    'Two passport-size photographs of parents / guardians',
  ].map((d) => `<li>${icons.check}<span>${d}</span></li>`).join('');
  return `
  ${pageBanner('Documents Checklist', 'What to bring for your campus visit and registration.', [['Home', '/'], ['Admissions', '/admissions/'], ['Documents', '/admissions/documents/']])}
  <section class="section">
    <div class="container" style="max-width:820px;">
      <ul class="value-list reveal-item" style="gap:0.9rem;">${docs}</ul>
      <div style="background:var(--tint-sun); border-left:4px solid var(--sun); padding:1.25rem; margin-top:2rem;" class="reveal-item">
        <p style="margin:0; font-size:var(--fs-sm); color:var(--ink);"><strong>Privacy note:</strong> As per our child privacy policy and the DPDP Act 2023, documents are inspected in person during your visit and are never required to be uploaded online.</p>
      </div>
    </div>
  </section>
  ${ctaBand()}`;
}

function getAdmissionsFeesHtml() {
  const rows = content.programmes.map((p) => `<tr><td>${esc(p.title)}</td><td>${esc(p.age_band)}</td><td>Shared on request</td></tr>`).join('');
  return `
  ${pageBanner('Fee Structure', 'Transparent, term-wise fees with no hidden charges.', [['Home', '/'], ['Admissions', '/admissions/'], ['Fees', '/admissions/fees/']])}
  <section class="section">
    <div class="container">
      <div class="prose">
        <p>Our fee structure is transparent and shared in full during your campus visit. Fees are term-wise and include curriculum materials, activity kits, student insurance and daily fruit snacks. There are no mid-term surprise charges.</p>
      </div>
      <div class="table-scroll reveal-item" style="margin-top:1.5rem;">
        <table class="data-table">
          <thead><tr><th>Programme</th><th>Age Band</th><th>Fees</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div style="margin-top:1.5rem;">
        <a href="${wa('Hi! I would like to request the fee schedule for Global Kids Preschool.')}" class="btn btn-whatsapp">Request Fee Schedule on WhatsApp</a>
      </div>
    </div>
  </section>
  ${ctaBand()}`;
}

function getAdmissionsFaqsHtml() {
  const faqs = content.faqs.map((f) => `<details class="faq-item reveal-item">
      <summary class="faq-summary">${esc(f.question)} <span class="faq-icon">+</span></summary>
      <div class="faq-content">${esc(f.answer)}</div>
    </details>`).join('');
  return `
  ${pageBanner('Frequently Asked Questions', 'Answers to the questions families ask us most.', [['Home', '/'], ['Admissions', '/admissions/'], ['FAQs', '/admissions/faqs/']])}
  <section class="section">
    <div class="container" style="max-width:880px;">
      <div class="faq-list">${faqs}</div>
      <div style="margin-top:2rem; text-align:center;">
        <p style="margin-bottom:1rem;">Didn’t find your answer?</p>
        <a href="/contact/" class="btn btn-primary">Contact Our Admissions Team</a>
      </div>
    </div>
  </section>
  ${ctaBand()}`;
}

/* ------------------------------------------------------------------ *
 * Campus
 * ------------------------------------------------------------------ */

function getFacilitiesSafetyHtml() {
  const facilities = [
    ['/assets/images/hero-classroom.jpg', 'Bright Learning Classrooms', 'Naturally lit rooms with child-height shelving and hands-on Montessori materials.'],
    ['/assets/images/outdoor-play.jpg', 'Outdoor Play Arena', 'Soft-safety lawn, sandpit, climbing frames and shaded seating.'],
    ['/assets/images/library-story.jpg', 'Reading & Story Corner', 'A cosy nook for daily reading circles, puppets and picture books.'],
  ].map(([img, title, text]) => `<div class="campus-gallery-card reveal-item"><img src="${img}" alt="${esc(title)}"><div class="campus-gallery-body"><h4>${title}</h4><p>${text}</p></div></div>`).join('');

  const safety = [
    ['100% CCTV surveillance', 'Monitored cameras across classrooms, corridors, play areas and gates.'],
    ['Police-verified staff', 'Background and credential verification for all teaching and support staff.'],
    ['Authorised pick-up protocol', 'Children are released only to registered guardians with the school ID badge.'],
    ['Child-safe architecture', 'Rounded edges, finger-pinch guards, socket covers and non-slip flooring.'],
    ['Paediatric first aid', 'Staff trained in basic paediatric first aid with a clear emergency protocol.'],
    ['Sanitised washrooms', 'Child-height washrooms cleaned and sanitised daily with touchless dispensers.'],
    ['Clean drinking water', 'Multi-stage purified drinking water tested and maintained regularly.'],
    ['Natural light & ventilation', 'Well-ventilated classrooms with provision for air filtration during peak seasons.'],
  ].map(([title, text]) => `<div class="safety-item reveal-item"><div class="safety-check-icon">${icons.check}</div><div class="safety-text"><h4>${title}</h4><p>${text}</p></div></div>`).join('');

  return `
  ${pageBanner('Facilities &amp; Child Safety', 'A campus designed around the safety and comfort of young children.', [['Home', '/'], ['Campus', '/facilities-safety/'], ['Facilities & Safety', '/facilities-safety/']])}
  <section class="section">
    <div class="container">
      ${sectionHeader('Facilities', 'Purpose-built learning spaces', '', true)}
      <div class="campus-gallery-grid">${facilities}</div>
    </div>
  </section>
  <section class="section tint-mint">
    <div class="container">
      ${sectionHeader('Child Safety', 'Our safety standards', 'Every protocol on campus is designed to protect children and give parents peace of mind.', true)}
      <div class="safety-grid" style="margin-top:2rem;">${safety}</div>
    </div>
  </section>
  ${ctaBand()}`;
}

function getSafetyHtml() {
  const safety = [
    ['CCTV coverage', 'Complete camera coverage across classrooms, corridors and outdoor areas.'],
    ['Visitor management', 'All visitors sign in, wear a badge and are escorted on campus.'],
    ['Verified staff', 'Background verification for every member of teaching and support staff.'],
    ['Secure pick-up', 'A strict, authorised guardian release protocol with no exceptions.'],
    ['Hygiene routines', 'Daily sanitisation of toys, surfaces and washrooms.'],
    ['Emergency readiness', 'First-aid trained staff and a documented emergency response plan.'],
  ].map(([title, text]) => `<div class="safety-item reveal-item"><div class="safety-check-icon">${icons.check}</div><div class="safety-text"><h4>${title}</h4><p>${text}</p></div></div>`).join('');
  return `
  ${pageBanner('Child Safety &amp; Security', 'Safety is built into our campus, our training and our daily routines.', [['Home', '/'], ['Campus', '/facilities-safety/'], ['Safety', '/safety/']])}
  <section class="section">
    <div class="container">
      ${sectionHeader('Safeguarding', 'How we keep children safe')}
      <div class="safety-grid">${safety}</div>
      <div style="margin-top:2rem;"><a href="/photo-child-safety-policy/" class="btn btn-secondary">Read Child Safety &amp; Photo Policy ${icons.arrowRight}</a></div>
    </div>
  </section>
  ${ctaBand()}`;
}

function getGalleryHtml() {
  const album = content.albums[0];
  const images = [
    ['https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=900&q=80', 'Water and sensory play'],
    ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=900&q=80', 'Hands-on shape and sorting centre'],
    ['https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80', 'Storytelling circle'],
    ['/assets/images/outdoor-play.jpg', 'Outdoor play and movement'],
    ['/assets/images/hero-classroom.jpg', 'Guided classroom activity'],
    ['/assets/images/library-story.jpg', 'Reading and picture books'],
  ];
  const thumbs = images.map(([src, caption]) => `<div>
      <img class="gallery-thumbnail" src="${src}" alt="${esc(caption)}" data-lightbox-src="${src}" data-lightbox-alt="${esc(caption)}">
      <p style="font-size:var(--fs-xs); margin-top:0.5rem; color:var(--ink-soft);">${esc(caption)}</p>
    </div>`).join('');

  return `
  ${pageBanner('Photo Gallery', 'Moments of learning, play and celebration on campus.', [['Home', '/'], ['Campus', '/facilities-safety/'], ['Gallery', '/gallery/']])}
  <section class="section">
    <div class="container">
      <div class="side-card reveal-item" style="margin-bottom:2rem;">
        <h3>${esc(album.title)}</h3>
        <p style="font-size:var(--fs-sm);">${esc(album.description)}</p>
        <span style="font-size:var(--fs-xs); color:var(--ok); font-weight:600;">Verified parental photo consent on record</span>
      </div>
      <div class="gallery-grid">${thumbs}</div>
    </div>
  </section>
  ${ctaBand()}`;
}

function getEventsHtml() {
  const events = [
    ['25 OCT 2026', 'Grandparents’ Day', 'A morning of storytelling, music and clay art celebrating grandparents.'],
    ['08 NOV 2026', 'Montessori Sensory Open Day', 'Families explore our hands-on materials alongside our educators.'],
    ['22 NOV 2026', 'Annual Movement Gala', 'Non-competitive games, balance activities and a music celebration.'],
    ['15 DEC 2026', 'Annual Day & Cultural Fest', 'Children showcase rhymes, dance and collaborative performances.'],
  ].map(([date, title, text]) => `<div class="notice-item"><div class="notice-date-badge">${date}</div><div class="notice-info"><h4>${title}</h4><p>${text}</p></div></div>`).join('');
  return `
  ${pageBanner('Events &amp; Activities', 'Celebrations, workshops and activities through the school year.', [['Home', '/'], ['Campus', '/facilities-safety/'], ['Events', '/events/']])}
  <section class="section">
    <div class="container" style="max-width:900px;">
      ${sectionHeader('School Calendar Highlights', 'Upcoming events')}
      <div class="notice-col-card">${events}</div>
    </div>
  </section>
  ${ctaBand()}`;
}

function getNewsHtml() {
  const items = [
    ['12 OCT 2026', 'Admissions 2026–27 now open', 'Applications for Toddler, Nursery and KG batches are open. Limited seats per batch.', '/admissions/'],
    ['05 OCT 2026', 'Parent orientation & settling schedule', 'A staggered settling timetable to help new children transition comfortably.', '/circulars/'],
    ['28 SEP 2026', 'Monsoon health advisory', 'Daily temperature checks and enhanced campus sanitisation are in effect.', '/circulars/'],
    ['20 SEP 2026', 'New reading corner opens', 'Our expanded story nook is now open for daily reading circles.', '/gallery/'],
  ].map(([date, title, text, href]) => `<div class="notice-item"><div class="notice-date-badge">${date}</div><div class="notice-info"><h4><a href="${href}">${title}</a></h4><p>${text}</p></div></div>`).join('');
  return `
  ${pageBanner('Notice Board', 'Official announcements, circulars and school updates.', [['Home', '/'], ['Campus', '/facilities-safety/'], ['Notice Board', '/news/']])}
  <section class="section">
    <div class="container" style="max-width:900px;">
      <div class="notice-col-card reveal-item">${items}</div>
      <div style="margin-top:1.5rem;"><a href="/circulars/" class="btn btn-secondary">View Circulars &amp; Downloads ${icons.arrowRight}</a></div>
    </div>
  </section>
  ${ctaBand()}`;
}

/* ------------------------------------------------------------------ *
 * Parents
 * ------------------------------------------------------------------ */

function getParentCornerHtml() {
  const downloads = [
    ['Term 1 Calendar & Holiday Schedule 2026–27', 'PDF · Updated June 2026', '/school-calendar/'],
    ['Monthly Snack & Fruit Menu', 'PDF · Reviewed by a paediatric nutritionist', '/downloads/'],
    ['Annual Day Costume & Schedule Guide', 'PDF · Circular No. 4', '/downloads/'],
  ].map(([title, meta, href]) => `<li style="display:flex; justify-content:space-between; align-items:center; gap:1rem; padding:1rem; background:var(--bg); border-left:3px solid var(--navy);">
      <div><strong>${title}</strong><br><small style="color:var(--ink-soft);">${meta}</small></div>
      <a href="${href}" class="btn btn-secondary btn-sm">Open</a>
    </li>`).join('');

  return `
  ${pageBanner('Parent Corner', 'A private space for enrolled families to access circulars, menus and calendars.', [['Home', '/'], ['Parents', '/parents/'], ['Parent Corner', '/parent-corner/']])}
  <section class="section">
    <div class="container container-narrow">
      <div class="side-card reveal-item">
        <div style="background:var(--tint-sky); padding:1rem 1.25rem; border-left:4px solid var(--navy); margin-bottom:1.5rem; font-size:var(--fs-sm);">
          <strong>Access:</strong> The shared parent passcode is distributed through our official school WhatsApp group at the start of each term.
        </div>
        <h3>Recent Circulars &amp; Downloads</h3>
        <ul style="list-style:none; display:flex; flex-direction:column; gap:0.75rem; margin-top:1rem;">${downloads}</ul>
        <div style="margin-top:1.5rem;">
          <a href="${wa('Hello! I am an enrolled parent and need the Parent Corner passcode.')}" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">Request Access via WhatsApp</a>
        </div>
      </div>
    </div>
  </section>`;
}

function getCircularsHtml() {
  const items = [
    ['12 OCT 2026', 'Admissions 2026–27 — guidelines & document checklist', '/admissions/documents/'],
    ['05 OCT 2026', 'Parent orientation & phased settling schedule', '/admissions/process/'],
    ['28 SEP 2026', 'Health advisory: monsoon sanitation routine', '/safety/'],
    ['14 SEP 2026', 'Annual Day — costume and schedule circular', '/events/'],
  ].map(([date, title, href]) => `<div class="notice-item"><div class="notice-date-badge">${date}</div><div class="notice-info"><h4><a href="${href}">${title}</a></h4></div></div>`).join('');
  return `
  ${pageBanner('Circulars &amp; Notices', 'Downloadable circulars and official school notices.', [['Home', '/'], ['Parents', '/parents/'], ['Circulars', '/circulars/']])}
  <section class="section">
    <div class="container" style="max-width:900px;">
      <div class="notice-col-card reveal-item">${items}</div>
      <p style="font-size:var(--fs-xs); color:var(--ink-soft); margin-top:1rem;">Circulars are also shared through the official school communication channels.</p>
    </div>
  </section>
  ${ctaBand()}`;
}

function getSchoolCalendarHtml() {
  const rows = [
    ['Term 1', 'June – September 2026', 'School reopens, settling weeks, orientation'],
    ['Term 2', 'October – December 2026', 'Festivals, Annual Day, term assessments (portfolio)'],
    ['Term 3', 'January – April 2027', 'Movement Gala, graduation, summer break'],
  ].map(([term, months, notes]) => `<tr><td>${term}</td><td>${months}</td><td>${notes}</td></tr>`).join('');
  return `
  ${pageBanner('School Calendar', 'The academic year at a glance for 2026–27.', [['Home', '/'], ['Parents', '/parents/'], ['Calendar', '/school-calendar/']])}
  <section class="section">
    <div class="container" style="max-width:900px;">
      <div class="table-scroll reveal-item">
        <table class="data-table">
          <thead><tr><th>Term</th><th>Period</th><th>Key Highlights</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <p style="font-size:var(--fs-sm); color:var(--ink-soft); margin-top:1rem;">Term dates, holidays and event schedules are updated in the Parent Corner and shared via circulars.</p>
    </div>
  </section>
  ${ctaBand()}`;
}

function getDownloadsHtml() {
  const files = [
    ['Admissions Brochure 2026–27', 'Programme overview, fees and process'],
    ['Parent Handbook', 'Policies, routines and school guidelines'],
    ['Snack & Nutrition Menu', 'Monthly fruit and snack planner'],
    ['School Calendar 2026–27', 'Terms, holidays and key events'],
  ].map(([title, meta]) => `<div style="display:flex; justify-content:space-between; align-items:center; gap:1rem; padding:1.25rem; border:1px solid var(--line); background:var(--surface);">
      <div style="display:flex; gap:0.85rem; align-items:center;"><span class="ql-icon" style="width:42px;height:42px;background:var(--tint-sky);color:var(--navy);display:flex;align-items:center;justify-content:center;">${icons.file}</span><div><strong>${title}</strong><br><small style="color:var(--ink-soft);">${meta}</small></div></div>
      <a href="${wa('Hello! I would like to receive the ' + title + '.')}" class="btn btn-secondary btn-sm">Request</a>
    </div>`).join('');
  return `
  ${pageBanner('Downloads &amp; Handbooks', 'Key documents for prospective and enrolled families.', [['Home', '/'], ['Parents', '/parents/'], ['Downloads', '/downloads/']])}
  <section class="section">
    <div class="container" style="max-width:900px;">
      <div style="display:flex; flex-direction:column; gap:0.75rem;" class="reveal-item">${files}</div>
      <p style="font-size:var(--fs-xs); color:var(--ink-soft); margin-top:1rem;">Some documents are issued in person or through the Parent Corner to protect family privacy.</p>
    </div>
  </section>
  ${ctaBand()}`;
}

function getReviewsHtml() {
  const testimonials = content.testimonials.map((t) => `<div class="testimonial-card reveal-item">
      <p class="testimonial-quote">&ldquo;${esc(t.quote)}&rdquo;</p>
      <div class="testimonial-author"><div class="author-avatar">${esc(t.name.charAt(0))}</div><div class="author-meta"><span class="author-name">${esc(t.name)}</span><span class="author-sub">${esc(t.programme)}</span></div></div>
    </div>`).join('');
  return `
  ${pageBanner('Parent Reviews', 'What families say about their experience at ' + esc(settings.school_name) + '.', [['Home', '/'], ['Parents', '/parents/'], ['Reviews', '/reviews/']])}
  <section class="section">
    <div class="container">
      <div class="stat-strip reveal-item" style="margin-bottom:2.5rem;">
        <div class="stat"><strong>${esc(settings.google_rating)} ★</strong><span>Average rating</span></div>
        <div class="stat"><strong>${esc(settings.google_review_count)}</strong><span>Verified reviews</span></div>
        <div class="stat"><strong>${esc(settings.years_running)}</strong><span>Years of service</span></div>
        <div class="stat"><strong>${esc(settings.children_taught)}</strong><span>Children taught</span></div>
      </div>
      <div class="testimonials-grid">${testimonials}</div>
      <div style="text-align:center; margin-top:2.5rem;"><a href="${esc(settings.google_review_url)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">View on Google Business Profile ${icons.arrowRight}</a></div>
    </div>
  </section>
  ${ctaBand()}`;
}

/* ------------------------------------------------------------------ *
 * Contact + legal + utility pages
 * ------------------------------------------------------------------ */

function getContactHtml() {
  return `
  ${pageBanner('Contact Us', 'We would be glad to welcome you to our campus.', [['Home', '/'], ['Contact', '/contact/']])}
  <section class="section">
    <div class="container sidebar-layout">
      <div class="reveal-item">
        <div class="contact-details">
          <div class="contact-detail"><div class="cd-icon">${icons.mapPin}</div><div><h4>Campus Address</h4><p>${esc(settings.address_line1)}, ${esc(settings.address_line2)}, ${esc(settings.area)}, ${esc(settings.city)} – ${esc(settings.pincode)}</p></div></div>
          <div class="contact-detail"><div class="cd-icon">${icons.phone}</div><div><h4>Admissions Line</h4><a href="tel:${esc(settings.phone_e164)}">${esc(settings.phone_display)}</a></div></div>
          <div class="contact-detail"><div class="cd-icon">${icons.whatsapp}</div><div><h4>WhatsApp Helpdesk</h4><a href="${wa()}" target="_blank" rel="noopener noreferrer">Chat with us on WhatsApp</a></div></div>
          <div class="contact-detail"><div class="cd-icon">${icons.mail}</div><div><h4>Email</h4><a href="mailto:${esc(settings.email)}">${esc(settings.email)}</a></div></div>
          <div class="contact-detail"><div class="cd-icon">${icons.clock}</div><div><h4>Office &amp; Visiting Hours</h4><p>${esc(settings.hours_text)}</p></div></div>
        </div>
        <div style="margin-top:1.5rem;">
          <a href="${esc(settings.maps_url)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Get Directions ${icons.arrowRight}</a>
        </div>
        <div class="map-facade" data-map-url="${esc(settings.maps_url)}" style="margin-top:1.5rem; border:1px solid var(--line); background:var(--tint-sky); padding:2.5rem 1.5rem; text-align:center; cursor:pointer;">
          <div style="color:var(--navy); margin-bottom:0.5rem;">${icons.mapPin}</div>
          <strong style="display:block;">View us on Google Maps</strong>
          <span style="font-size:var(--fs-xs); color:var(--ink-soft);">Click to open directions</span>
        </div>
      </div>
      <div class="side-card reveal-item" id="visit">
        <span class="eyebrow">Enquiry</span>
        <h2 style="font-size:var(--fs-xl); margin-bottom:0.5rem;">Send an enquiry</h2>
        <p style="font-size:var(--fs-sm); margin-bottom:1.25rem;">Have a question about admissions, timings or transport? Reach out and we will respond promptly.</p>
        ${enquiryForm('Send Enquiry', '', { idPrefix: 'contact' })}
      </div>
    </div>
  </section>`;
}

function getThankYouHtml(refId = 'GK-VISIT-2026') {
  return `
  <section class="section" style="text-align:center;">
    <div class="container container-narrow">
      <div class="side-card reveal-item" style="padding:3rem 2rem;">
        <div style="width:64px; height:64px; background:var(--tint-mint); color:var(--ok); display:flex; align-items:center; justify-content:center; margin:0 auto 1.5rem;">${icons.check}</div>
        <h1>Thank you — your enquiry is received</h1>
        <p style="font-size:var(--fs-lg); color:var(--ink); margin:1rem auto; max-width:52ch;">We have recorded your enquiry under reference number <strong>${esc(refId)}</strong>.</p>
        <p style="color:var(--ink-soft); margin:0 auto 2rem; max-width:52ch;">Our admissions coordinator will contact you by phone within one working day to confirm your campus tour slot and share directions.</p>
        <div style="display:flex; gap:1rem; justify-content:center; flex-wrap:wrap;">
          <a href="${wa('Hi! I just submitted an enquiry on your website with reference ' + refId + '.')}" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a>
          <a href="/" class="btn btn-secondary">Return to Homepage</a>
        </div>
      </div>
    </div>
  </section>`;
}

function getPrivacyPolicyHtml() {
  return `
  ${pageBanner('Privacy Policy', 'Last updated: June 2026. Compliant with the DPDP Act 2023.', [['Home', '/'], ['Privacy Policy', '/privacy-policy/']])}
  <section class="section">
    <div class="container">
      <article class="prose">
        <h2>1. Our commitment</h2>
        <p>${esc(settings.school_name)} (“we”, “our”, “the school”) is committed to safeguarding personal information and practises strict data minimisation.</p>
        <h2>2. Data we collect</h2>
        <p>Through this website we collect only minimal prospective-parent enquiry data: parent or guardian name, a 10-digit mobile number, an optional email address, programme of interest and preferred visit time.</p>
        <p><strong>We do not collect children’s names, dates of birth or photographs through our online forms.</strong></p>
        <h2>3. Parental photo consent</h2>
        <p>Photographs published in our gallery or social channels are used only after obtaining signed written consent from parents. We never publish a child’s full name alongside a photograph.</p>
        <h2>4. Retention &amp; deletion</h2>
        <p>Prospective-parent enquiries are retained securely in our private administrative system for a maximum of ${esc(settings.retention_months)} months, after which they are purged. Parents may request immediate deletion of their contact record at any time by emailing <a href="mailto:${esc(settings.email)}">${esc(settings.email)}</a>.</p>
        <h2>5. Consent &amp; contact</h2>
        <p>By submitting an enquiry you consent to being contacted about your enquiry. You may withdraw consent at any time. For any privacy request, contact us at <a href="mailto:${esc(settings.email)}">${esc(settings.email)}</a>.</p>
      </article>
    </div>
  </section>`;
}

function getTermsHtml() {
  return `
  ${pageBanner('Terms of Service', 'The terms that govern the use of this website.', [['Home', '/'], ['Terms of Service', '/terms/']])}
  <section class="section">
    <div class="container">
      <article class="prose">
        <p>Welcome to the official website of ${esc(settings.school_name)}. By browsing this website, scheduling a visit or using our enquiry services, you agree to these terms.</p>
        <h2>1. Informational content</h2>
        <p>Programme descriptions, curriculum outlines and schedules reflect our ongoing educational framework. Final terms of enrolment, policies and fee structures are formalised in writing during campus registration.</p>
        <h2>2. Child protection</h2>
        <p>Users may not scrape, reproduce or reuse photographs or materials from this site.</p>
        <h2>3. Acceptable use</h2>
        <p>You agree not to misuse this website, submit false information or attempt to disrupt its operation.</p>
        <h2>4. Changes</h2>
        <p>We may update these terms from time to time. Continued use of the website constitutes acceptance of the revised terms.</p>
      </article>
    </div>
  </section>`;
}

function getChildSafetyPolicyHtml() {
  return `
  ${pageBanner('Child Safety &amp; Photo Policy', 'How we protect children’s privacy and digital identity.', [['Home', '/'], ['Child Safety Policy', '/photo-child-safety-policy/']])}
  <section class="section">
    <div class="container">
      <article class="prose">
        <h2>1. No online child identity exposure</h2>
        <p>We safeguard the privacy and digital identity of every child. Children’s full names, home addresses and pick-up routes are never shared online or in public materials.</p>
        <h2>2. Written parental consent</h2>
        <p>Before any group activity or celebration photograph is considered for publication, written consent from the parents of participating children is verified and logged.</p>
        <h2>3. Safe photography guidelines</h2>
        <p>Photographs focus on educational engagement, creative work and collaborative play. Staff and visitor personal devices are not used to photograph children during school hours.</p>
        <h2>4. Reporting a concern</h2>
        <p>Any child-safety concern may be raised directly with the school office at <a href="tel:${esc(settings.phone_e164)}">${esc(settings.phone_display)}</a> or <a href="mailto:${esc(settings.email)}">${esc(settings.email)}</a>.</p>
      </article>
    </div>
  </section>`;
}

function get404Html() {
  return `
  <section class="section" style="text-align:center;">
    <div class="container container-narrow">
      <div class="reveal-item">
        <span style="font-size:4.5rem; font-family:var(--font-head); font-weight:800; color:var(--navy); line-height:1;">404</span>
        <h1 style="margin:1rem 0;">Page not found</h1>
        <p style="margin:0 auto 2rem;">The page you are looking for may have moved or no longer exists. Let’s get you back on track.</p>
        <div style="display:flex; gap:1rem; justify-content:center; flex-wrap:wrap;">
          <a href="/" class="btn btn-primary">Return to Homepage</a>
          <a href="/programmes/" class="btn btn-secondary">Explore Programmes</a>
          <a href="/admissions/#visit" class="btn btn-whatsapp">Book a Visit</a>
        </div>
      </div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ *
 * Router
 * ------------------------------------------------------------------ */

const ROUTES = {
  '/': () => ({ title: 'Home', active: 'home', html: getHomeHtml() }),

  '/about': () => ({ title: 'About Our School', active: 'about', html: getAboutHtml() }),
  '/principals-message': () => ({ title: "Principal's Message", active: 'principals-message', html: getPrincipalsMessageHtml() }),
  '/vision-mission': () => ({ title: 'Vision & Mission', active: 'vision-mission', html: getVisionMissionHtml() }),
  '/faculty': () => ({ title: 'Faculty & Staff', active: 'faculty', html: getFacultyHtml() }),
  '/awards': () => ({ title: 'Awards & Recognition', active: 'awards', html: getAwardsHtml() }),

  '/programmes': () => ({ title: 'Early Childhood Programmes', active: 'programmes', html: getProgrammesHtml() }),
  '/programmes/toddler-playgroup': () => ({ title: 'Toddler & Playgroup', active: '', html: getProgrammeSingleHtml('toddler-playgroup') }),
  '/programmes/nursery': () => ({ title: 'Nursery / Pre-KG', active: '', html: getProgrammeSingleHtml('nursery') }),
  '/programmes/kindergarten': () => ({ title: 'Kindergarten (LKG & UKG)', active: '', html: getProgrammeSingleHtml('kindergarten') }),
  '/programmes/daycare': () => ({ title: 'Daycare & Extended Care', active: '', html: getProgrammeSingleHtml('daycare') }),
  '/our-approach': () => ({ title: 'Curriculum & Approach', active: 'our-approach', html: getCurriculumHtml() }),

  '/admissions': () => ({ title: 'Admissions 2026–27', active: 'admissions', html: getAdmissionsHtml(currentQuery) }),
  '/admissions/process': () => ({ title: 'Admission Process', active: '', html: getAdmissionsProcessHtml() }),
  '/admissions/eligibility': () => ({ title: 'Age Criteria & Eligibility', active: '', html: getAdmissionsEligibilityHtml() }),
  '/admissions/documents': () => ({ title: 'Documents Checklist', active: '', html: getAdmissionsDocumentsHtml() }),
  '/admissions/fees': () => ({ title: 'Fee Structure', active: '', html: getAdmissionsFeesHtml() }),
  '/admissions/faqs': () => ({ title: 'Frequently Asked Questions', active: '', html: getAdmissionsFaqsHtml() }),

  '/facilities-safety': () => ({ title: 'Facilities & Child Safety', active: 'facilities-safety', html: getFacilitiesSafetyHtml() }),
  '/safety': () => ({ title: 'Child Safety & Security', active: 'safety', html: getSafetyHtml() }),
  '/gallery': () => ({ title: 'Photo Gallery', active: 'gallery', html: getGalleryHtml() }),
  '/events': () => ({ title: 'Events & Activities', active: 'events', html: getEventsHtml() }),
  '/news': () => ({ title: 'Notice Board', active: 'news', html: getNewsHtml() }),

  '/parents': () => ({ title: 'Parents', active: 'parents', html: getNewsHtml() }),
  '/parent-corner': () => ({ title: 'Parent Corner', active: 'parent-corner', html: getParentCornerHtml() }),
  '/circulars': () => ({ title: 'Circulars & Notices', active: 'circulars', html: getCircularsHtml() }),
  '/school-calendar': () => ({ title: 'School Calendar', active: 'school-calendar', html: getSchoolCalendarHtml() }),
  '/downloads': () => ({ title: 'Downloads & Handbooks', active: 'downloads', html: getDownloadsHtml() }),
  '/reviews': () => ({ title: 'Parent Reviews', active: 'reviews', html: getReviewsHtml() }),

  '/contact': () => ({ title: 'Contact Us', active: 'contact', html: getContactHtml() }),
  '/thank-you': () => ({ title: 'Thank You', active: 'thank-you', html: getThankYouHtml(currentQuery.ref) }),
  '/privacy-policy': () => ({ title: 'Privacy Policy', active: 'privacy-policy', html: getPrivacyPolicyHtml() }),
  '/terms': () => ({ title: 'Terms of Service', active: 'terms', html: getTermsHtml() }),
  '/photo-child-safety-policy': () => ({ title: 'Child Safety & Photo Policy', active: 'safety-policy', html: getChildSafetyPolicyHtml() }),
};

let currentQuery = {};

function resolvePage(pathname, query = {}) {
  currentQuery = query;
  const route = ROUTES[pathname];
  let status = 200;
  let result;

  if (route) {
    result = route();
  } else {
    status = 404;
    result = { title: 'Page Not Found', active: '404', html: get404Html() };
  }

  const html = renderPage({
    title: result.title,
    active: result.active,
    contentHtml: result.html,
  });

  return { html, status };
}

module.exports = { ROUTES, resolvePage };

/* ------------------------------------------------------------------ *
 * Static assets
 * ------------------------------------------------------------------ */

const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

/* ------------------------------------------------------------------ *
 * Server
 * ------------------------------------------------------------------ */

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/';

  if (req.method === 'POST' && pathname === '/submit-enquiry') {
    let body = '';
    req.on('data', (chunk) => { body += chunk.toString(); });
    req.on('end', () => {
      const params = new URLSearchParams(body);
      if (params.get('website_url')) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        return res.end('Spam detected.');
      }
      const refId = 'GK-' + Math.floor(100000 + Math.random() * 900000);
      res.writeHead(302, { Location: `/thank-you/?ref=${refId}` });
      return res.end();
    });
    return;
  }

  if (pathname.startsWith('/assets/')) {
    const filePath = path.join(ROOT_DIR, 'wp-content/themes/gk-theme', pathname);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
      return fs.createReadStream(filePath).pipe(res);
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Asset not found');
  }

  currentQuery = Object.fromEntries(parsedUrl.searchParams);

  const { html, status } = resolvePage(pathname, currentQuery);

  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log('\n======================================================');
    console.log('  Global Kids Preschool — Preview Server Running');
    console.log(`  http://localhost:${PORT}`);
    console.log('======================================================\n');
  });
}
