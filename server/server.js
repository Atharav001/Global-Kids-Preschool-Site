/**
 * Global Kids Preschool - High-Fidelity Localhost Preview Server
 * Built with native Node.js (zero external dependencies required)
 * Features official school emblem, accreditation showcase (Top 50 Chennai),
 * interactive campus spaces explorer, milestone calculator, and full 14 routes.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname, '..');

// Load settings and seed content
const settings = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'seed/settings.sample.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'seed/content.json'), 'utf8'));

// Helper for WhatsApp link
function getWhatsAppLink(customMsg = '') {
  const number = (settings.whatsapp_e164 || '919876543210').replace(/[^0-9]/g, '');
  const msg = customMsg || settings.whatsapp_default_msg;
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

// Official Heraldic School Crest / Emblem SVG
function renderSchoolEmblem(className = 'school-emblem') {
  return `<svg class="${className}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Global Kids Preschool Official Crest">
    <circle cx="50" cy="50" r="47" stroke="#FFC93C" stroke-width="2.5" fill="#1C2B54"/>
    <circle cx="50" cy="50" r="44" stroke="#F7B500" stroke-width="1" stroke-dasharray="2 2"/>
    <circle cx="50" cy="50" r="38" fill="#FFFFFF"/>
    <path d="M50 16 L68 22 C68 38 64 54 50 63 C36 54 32 38 32 22 Z" fill="#FFF8EC" stroke="#1C2B54" stroke-width="2"/>
    <path d="M33 22.5 C40 24 60 24 67 22.5 C67 36 60 44 50 48 C40 44 33 36 33 22.5 Z" fill="#E6F3FF"/>
    <circle cx="50" cy="32" r="7" fill="#FFC93C"/>
    <path d="M50 20 L50 23 M42 24 L44 26 M58 24 L56 26 M39 32 L42 32 M58 32 L61 32" stroke="#F7B500" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M42 41 C45 40 48 40.5 50 42 C52 40.5 55 40 58 41 L58 47 C55 46 52 46.5 50 48 C48 46.5 45 46 42 47 Z" fill="#FFFFFF" stroke="#1C2B54" stroke-width="1.2"/>
    <line x1="50" y1="42" x2="50" y2="48" stroke="#1C2B54" stroke-width="1.2"/>
    <path d="M50 56 C50 53 50 50 50 49" stroke="#2FA67A" stroke-width="2" stroke-linecap="round"/>
    <path d="M50 52 C46 51 44 49 45 47 C48 47 50 50 50 52 Z" fill="#2FA67A"/>
    <path d="M50 50 C54 49 56 47 55 45 C52 45 50 48 50 50 Z" fill="#2FA67A"/>
    <path d="M26 42 C24 52 28 64 36 71" stroke="#FFC93C" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M23 45 C25 43 28 44 28 46 C27 48 24 48 23 45 Z" fill="#FFC93C"/>
    <path d="M24 53 C27 52 29 53 29 55 C27 57 25 56 24 53 Z" fill="#FFC93C"/>
    <path d="M27 61 C30 61 32 63 31 65 C29 66 27 64 27 61 Z" fill="#FFC93C"/>
    <path d="M74 42 C76 52 72 64 64 71" stroke="#FFC93C" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M77 45 C75 43 72 44 72 46 C73 48 76 48 77 45 Z" fill="#FFC93C"/>
    <path d="M76 53 C73 52 71 53 71 55 C73 57 75 56 76 53 Z" fill="#FFC93C"/>
    <path d="M73 61 C70 61 68 63 69 65 C71 66 73 64 73 61 Z" fill="#FFC93C"/>
    <polygon points="50,9 51.5,13 55,13 52,15.5 53.5,19.5 50,17 46.5,19.5 48,15.5 45,13 48.5,13" fill="#FFC93C"/>
    <polygon points="40,11 41,13.5 43.5,13.5 41.5,15 42.5,17.5 40,16 37.5,17.5 38.5,15 36.5,13.5 39,13.5" fill="#FFC93C"/>
    <polygon points="60,11 61,13.5 63.5,13.5 61.5,15 62.5,17.5 60,16 57.5,17.5 58.5,15 56.5,13.5 59,13.5" fill="#FFC93C"/>
    <path d="M22 75 L30 73 L50 75 L70 73 L78 75 L74 81 L68 79 L50 82 L32 79 L26 81 Z" fill="#FFC93C" stroke="#1C2B54" stroke-width="1.2"/>
    <text x="50" y="79" font-family="'Fredoka', sans-serif" font-size="5" font-weight="700" fill="#1C2B54" text-anchor="middle" letter-spacing="0.5">ESTD 2014</text>
  </svg>`;
}

// SVG Icons Sprite / Library (Lucide style subset)
const icons = {
  phone: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
  whatsapp: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm4.52 11.53c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.07-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.57c.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.12-.22-.19-.47-.32z"/></svg>`,
  mapPin: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
  clock: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  shieldCheck: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`,
  sparkles: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"></path></svg>`,
  puzzle: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.439 7.85c0-1.57.802-2.5 2.1-2.5.4 0 .7.1 1 .2V4a2 2 0 0 0-2-2h-3.85c-.1.3-.2.6-.2 1 0 1.3-.93 2.1-2.5 2.1-1.57 0-2.5-.8-2.5-2.1 0-.4-.1-.7-.2-1H7a2 2 0 0 0-2 2v1.46c.3.1.6.2 1 .2 1.3 0 2.1.93 2.1 2.5 0 1.57-.8 2.5-2.1 2.5-.4 0-.7-.1-1-.2V16a2 2 0 0 0 2 2h1.46c.1-.3.2-.6.2-1 0-1.3.93-2.1 2.5-2.1 1.57 0 2.5.8 2.5 2.1 0 .4.1.7.2 1H20a2 2 0 0 0 2-2v-3.85c-.3-.1-.6-.2-1-.2-1.3 0-2.1-.93-2.1-2.5z"></path></svg>`,
  bookOpen: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
  award: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>`,
  sun: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`,
  check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`
};

// Institutional School Top Utility Bar
function renderSchoolTopUtility() {
  return `<div class="school-top-utility" role="region" aria-label="School Quick Contact & Admissions Portal">
    <div class="container school-utility-inner">
      <div class="utility-left">
        <span><strong>📞 Admissions Helpline:</strong> <a href="tel:${settings.phone_e164}">${settings.phone_e164}</a></span>
        <span class="utility-divider">|</span>
        <span><strong>⏰ Working Hours:</strong> Mon–Sat 8:30 AM – 4:30 PM</span>
        <span class="utility-divider">|</span>
        <span><strong>📍 Campus:</strong> ${settings.area}, ${settings.city}</span>
      </div>
      <div class="utility-right">
        <span class="utility-badge">Admissions 2025–26 Open</span>
        <a href="/parent-corner/" class="utility-link">Parent Portal 🔒</a>
        <a href="${getWhatsAppLink()}" target="_blank" rel="noopener noreferrer" class="utility-link utility-wa">WhatsApp Us</a>
      </div>
    </div>
  </div>`;
}

// Master HTML Shell
function renderPage(title, activeSlug, contentHtml, description = '') {
  const pageTitle = `${title} · Preschool in ${settings.area}, ${settings.city} · ${settings.school_name}`;
  const metaDesc = description || `Global Kids Preschool in ${settings.area}, ${settings.city}. Ranked among Top 50 preschools in Chennai. ECA India accredited. Schedule your school tour today.`;

  // JSON-LD LocalBusiness Schema
  const schemaJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Preschool",
    "name": settings.school_name,
    "description": settings.tagline,
    "url": "http://localhost:3000",
    "telephone": settings.phone_e164,
    "email": settings.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings.address_line1,
      "addressLocality": settings.city,
      "addressRegion": settings.state,
      "postalCode": settings.pincode,
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": settings.lat,
      "longitude": settings.lng
    },
    "openingHours": "Mo-Fr 08:30-18:30, Sa 09:00-13:00"
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${metaDesc}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/src/css/main.css">
  <script type="application/ld+json">${schemaJson}</script>
</head>
<body class="has-sticky-bar">
  <a class="skip-link" href="#main-content">Skip to main content</a>

  ${settings.announce_enabled ? `
  <aside class="announcement-bar" role="complementary" aria-label="School Announcement">
    <div>
      <strong>Notice:</strong> <span>${settings.announce_text}</span>
      <a href="${settings.announce_url}">Learn more →</a>
    </div>
    <button class="announcement-dismiss" type="button" aria-label="Dismiss announcement">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  </aside>` : ''}

  <!-- Institutional Top Utility Bar (Helpline, Working Hours, Parent Portal) -->
  ${renderSchoolTopUtility()}

  <header class="site-header" role="banner">
    <div class="container header-inner">
      <a href="/" class="brand-logo" aria-label="${settings.school_name}">
        ${renderSchoolEmblem()}
        <div class="brand-text">
          <span class="brand-title">${settings.school_name}</span>
          <span class="brand-subtitle">${settings.tagline}</span>
        </div>
      </a>

      <nav class="nav-menu-desktop" role="navigation" aria-label="Primary Navigation">
        <a href="/about/" class="nav-link ${activeSlug === 'about' ? 'active' : ''}">About Us</a>
        <a href="/programmes/" class="nav-link ${activeSlug === 'programmes' ? 'active' : ''}">Programmes</a>
        <a href="/our-approach/" class="nav-link ${activeSlug === 'our-approach' ? 'active' : ''}">Our Approach</a>
        <a href="/facilities-safety/" class="nav-link ${activeSlug === 'facilities-safety' ? 'active' : ''}">Facilities & Safety</a>
        <a href="/admissions/" class="nav-link ${activeSlug === 'admissions' ? 'active' : ''}">Admissions</a>
        <a href="/gallery/" class="nav-link ${activeSlug === 'gallery' ? 'active' : ''}">Campus Life</a>
        <a href="/news/" class="nav-link ${activeSlug === 'news' ? 'active' : ''}">Notice Board</a>
        <a href="/contact/" class="nav-link ${activeSlug === 'contact' ? 'active' : ''}">Contact</a>
      </nav>

      <div class="header-cta-group">
        <a href="/admissions/#visit" class="btn btn-primary btn-sm">Book Campus Tour</a>
        <button class="btn-menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu-drawer" aria-label="Toggle navigation menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Drawer -->
  <div class="mobile-menu-overlay" aria-hidden="true"></div>
  <aside id="mobile-menu-drawer" class="mobile-menu-drawer" aria-label="Mobile Navigation">
    <div class="mobile-menu-header">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        ${renderSchoolEmblem()}
        <span class="brand-title">${settings.school_name}</span>
      </div>
      <button class="btn-menu-close btn-menu-toggle" type="button" aria-label="Close menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <nav class="mobile-nav-list" role="navigation">
      <a href="/" class="mobile-nav-link ${activeSlug === 'home' ? 'active' : ''}">Home</a>
      <a href="/about/" class="mobile-nav-link ${activeSlug === 'about' ? 'active' : ''}">About Us</a>
      <a href="/programmes/" class="mobile-nav-link ${activeSlug === 'programmes' ? 'active' : ''}">Programmes</a>
      <a href="/our-approach/" class="mobile-nav-link ${activeSlug === 'our-approach' ? 'active' : ''}">Our Approach</a>
      <a href="/facilities-safety/" class="mobile-nav-link ${activeSlug === 'facilities-safety' ? 'active' : ''}">Facilities & Safety</a>
      <a href="/admissions/" class="mobile-nav-link ${activeSlug === 'admissions' ? 'active' : ''}">Admissions</a>
      <a href="/gallery/" class="mobile-nav-link ${activeSlug === 'gallery' ? 'active' : ''}">Campus Life Gallery</a>
      <a href="/news/" class="mobile-nav-link ${activeSlug === 'news' ? 'active' : ''}">Notice Board & Circulars</a>
      <a href="/reviews/" class="mobile-nav-link ${activeSlug === 'reviews' ? 'active' : ''}">Parent Reviews</a>
      <a href="/parent-corner/" class="mobile-nav-link ${activeSlug === 'parent-corner' ? 'active' : ''}">Parent Corner 🔒</a>
      <a href="/contact/" class="mobile-nav-link ${activeSlug === 'contact' ? 'active' : ''}">Contact Us</a>
    </nav>
    <div class="mobile-menu-actions">
      <a href="/admissions/#visit" class="btn btn-primary" style="width:100%">Book a School Visit</a>
      <a href="${getWhatsAppLink()}" class="btn btn-whatsapp" style="width:100%" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
      <a href="tel:${settings.phone_e164}" class="btn btn-secondary" style="width:100%">Call School Direct</a>
    </div>
  </aside>

  <main id="main-content" tabindex="-1">
    ${contentHtml}
  </main>

  <footer class="site-footer" role="contentinfo">
    <div class="footer-wave" aria-hidden="true">
      <svg viewBox="0 0 1200 48" preserveAspectRatio="none">
        <path d="M0,24 C300,48 600,0 900,36 C1050,48 1150,20 1200,24 L1200,48 L0,48 Z" fill="#2B2A35"></path>
      </svg>
    </div>

    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
            ${renderSchoolEmblem()}
            <h4 style="margin-bottom: 0;">${settings.school_name}</h4>
          </div>
          <p style="color: rgba(255,255,255,0.8); margin-bottom: 1.5rem; font-size: 0.95rem;">
            ${settings.tagline}. Ranked among the Top 50 preschools in Chennai. Nurturing curious minds, empathetic hearts, and confident learners in a joyful, secure environment.
          </p>
          <div class="footer-contact-item">
            ${icons.mapPin}
            <span>${settings.address_line1}, ${settings.area}, ${settings.city} - ${settings.pincode}</span>
          </div>
          <div style="font-size: 0.8rem; color: #FFC93C; margin-top: 0.5rem;">
            ★ Recognized by Early Childhood Association (ECA India) · Reg No. ECA/TN/2016-042
          </div>
        </div>

        <div class="footer-col">
          <h4>Explore Programmes</h4>
          <ul class="footer-links-list">
            <li><a href="/programmes/#toddler">Toddler Play (1.5 – 2.5 yrs)</a></li>
            <li><a href="/programmes/#playgroup">Playgroup (2 – 3 yrs)</a></li>
            <li><a href="/programmes/#nursery">Nursery (3 – 4 yrs)</a></li>
            <li><a href="/programmes/#kindergarten">Kindergarten (4 – 6 yrs)</a></li>
            <li><a href="/programmes/#daycare">Daycare & Extended Care</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul class="footer-links-list">
            <li><a href="/about/">About Our School</a></li>
            <li><a href="/our-approach/">Learning Philosophy</a></li>
            <li><a href="/facilities-safety/">Safety & Facilities</a></li>
            <li><a href="/admissions/">Admissions Process</a></li>
            <li><a href="/reviews/">Parent Reviews</a></li>
            <li><a href="/parent-corner/">Parent Corner 🔒</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Contact & Hours</h4>
          <div class="footer-contact-item">
            ${icons.phone}
            <a href="tel:${settings.phone_e164}" style="color:#fff; font-weight:600;">${settings.phone_display}</a>
          </div>
          <div class="footer-contact-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <a href="mailto:${settings.email}">${settings.email}</a>
          </div>
          <div class="footer-contact-item">
            ${icons.clock}
            <span>${settings.hours_text}</span>
          </div>
          <div style="margin-top: 1rem;">
            <a href="${settings.maps_url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="color:#fff; border-color:rgba(255,255,255,0.4);">
              Open in Google Maps ↗
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div>&copy; ${new Date().getFullYear()} ${settings.school_name}. All rights reserved. Recognized & Accredited Educational Institution.</div>
        <ul class="footer-legal-links">
          <li><a href="/privacy-policy/">Privacy Policy</a></li>
          <li><a href="/terms/">Terms of Service</a></li>
          <li><a href="/photo-child-safety-policy/">Child Safety & Photo Policy</a></li>
        </ul>
      </div>
    </div>
  </footer>

  <!-- Sticky Mobile Action Bar -->
  <aside class="sticky-action-bar" aria-label="Quick Contact Actions">
    <a href="tel:${settings.phone_e164}" class="btn btn-call" aria-label="Call school directly">
      ${icons.phone}
      <span>Call</span>
    </a>
    <a href="${getWhatsAppLink()}" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer" aria-label="Chat with school admissions on WhatsApp">
      ${icons.whatsapp}
      <span>WhatsApp</span>
    </a>
    <a href="/admissions/#visit" class="btn btn-primary" aria-label="Book campus visit">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
      <span>Book Visit</span>
    </a>
  </aside>

  <!-- Lightbox Modal -->
  <dialog class="gk-lightbox" aria-label="Image Lightbox">
    <div class="lightbox-content">
      <button class="lightbox-close-btn" type="button" aria-label="Close lightbox">&times;</button>
      <img class="lightbox-img" src="" alt="">
      <p class="lightbox-caption"></p>
    </div>
  </dialog>

  <!-- Floating WhatsApp for Desktop -->
  <a href="${getWhatsAppLink()}" class="floating-whatsapp-btn" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
    ${icons.whatsapp}
  </a>

  <!-- Consent Banner -->
  <aside class="consent-banner hidden" role="dialog" aria-label="Cookie & Analytics Consent">
    <p>
      We use privacy-friendly analytics solely to understand how prospective parents discover our school and improve campus visit information. We never track children or share personal data.
      <a href="/privacy-policy/" target="_blank" rel="noopener noreferrer">Read our Privacy Policy</a>.
    </p>
    <div class="consent-banner-actions">
      <button type="button" class="btn btn-primary btn-sm" data-consent-action="accept">Accept Analytics</button>
      <button type="button" class="btn btn-secondary btn-sm" data-consent-action="decline">Decline</button>
    </div>
  </aside>

  <script src="/assets/src/js/main.js" defer></script>
</body>
</html>`;
}

// Route Builders
function getHomeHtml() {
  return `
  <!-- School Hero Section with Interactive Tour Booking Form -->
  <section class="section" style="padding-top: 2rem; padding-bottom: 2.5rem;">
    <div class="container school-hero-container">
      <div class="reveal-item">
        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
          <span class="eyebrow" style="margin-bottom: 0;">Preschool in ${settings.area}, ${settings.city} • Estd. 2014</span>
          <span class="sticker-badge" style="transform:none; font-size: 0.75rem; background: var(--tint-sun); border-color: var(--sun);">
            🏆 Ranked Top 50 in Chennai
          </span>
          <span class="sticker-badge" style="transform:none; font-size: 0.75rem; background: var(--tint-sky); border-color: var(--blue);">
            📜 ECA India Accredited
          </span>
        </div>
        <h1 style="font-size: 2.5rem; line-height: 1.15; margin-bottom: 1rem;">Where Joyful Curiosity Meets <span class="highlight-squiggle">Lifelong Learning<svg viewBox="0 0 200 12" preserveAspectRatio="none"><path d="M0,8 Q50,0 100,8 T200,8" fill="none" stroke="var(--sun)" stroke-width="4" stroke-linecap="round"/></svg></span></h1>
        <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem; color: var(--ink);">
          A nurturing Montessori and play-based preschool in Annanagar West. With small 1:8 educator ratios, wholesome nutrition, certified early years mentors, and 100% child-safe CCTV premises, we build confident, joyful foundations.
        </p>

        <!-- Visual Hero Showcase Card -->
        <div class="hero-visual-card">
          <img class="hero-visual-img" src="/assets/images/hero-classroom.jpg" alt="Children engaged in Montessori learning activities in bright classroom at Global Kids" fetchpriority="high">
          <div class="hero-visual-overlay">
            <h3>Montessori Sensorial Discovery</h3>
            <p>Natural daylight classrooms equipped with child-accessible wooden sensorial materials and gentle mentor guidance.</p>
          </div>
        </div>
      </div>

      <!-- Quick School Tour Booking Card (Hero Side Form) -->
      <div class="reveal-item">
        <div class="hero-tour-card">
          <span class="hero-tour-badge">Admissions 2025–26</span>
          <h3>Schedule a Campus Tour</h3>
          <p>Experience our classrooms, observe active sessions, and discuss your child's milestones with our educators.</p>

          <form action="/submit-enquiry" method="POST">
            <!-- Honeypot -->
            <input type="text" name="website_url" style="display:none;" tabindex="-1" autocomplete="off">

            <div class="form-group" style="margin-bottom: 0.9rem;">
              <label for="tour-parent-name" class="form-label" style="font-size: 0.875rem;">Parent / Guardian Name <span class="required">*</span></label>
              <input type="text" id="tour-parent-name" name="parent_name" class="form-control" placeholder="e.g. Anand Sharma" required style="padding: 0.65rem 0.85rem;">
            </div>

            <div class="form-group" style="margin-bottom: 0.9rem;">
              <label for="tour-mobile" class="form-label" style="font-size: 0.875rem;">Mobile Number <span class="required">*</span></label>
              <input type="tel" id="tour-mobile" name="mobile" class="form-control" placeholder="e.g. 98400 12345" required pattern="[0-9]{10}" style="padding: 0.65rem 0.85rem;">
            </div>

            <div class="form-group" style="margin-bottom: 0.9rem;">
              <label for="tour-programme" class="form-label" style="font-size: 0.875rem;">Select Programme of Interest <span class="required">*</span></label>
              <select id="tour-programme" name="programme" class="form-control" required style="padding: 0.65rem 0.85rem;">
                <option value="">-- Choose Programme --</option>
                <option value="Toddlers / Playgroup (1.5 - 2.5 yrs)">Toddlers / Playgroup (1.5 – 2.5 yrs)</option>
                <option value="Nursery / Pre-KG (2.5 - 3.5 yrs)">Nursery / Pre-KG (2.5 – 3.5 yrs)</option>
                <option value="Junior KG / LKG (3.5 - 4.5 yrs)">Junior KG / LKG (3.5 – 4.5 yrs)</option>
                <option value="Senior KG / UKG (4.5 - 5.5 yrs)">Senior KG / UKG (4.5 – 5.5 yrs)</option>
                <option value="Full-Day Care (6 mos - 6 yrs)">Full-Day Care & Extended Care</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label for="tour-date" class="form-label" style="font-size: 0.875rem;">Preferred Tour Date</label>
              <input type="date" id="tour-date" name="preferred_date" class="form-control" style="padding: 0.65rem 0.85rem;">
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; font-size: 1rem; padding: 0.85rem;">
              Book Campus Tour Slot →
            </button>
          </form>

          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--line); font-size: 0.8125rem;">
            <span style="color: #F7B500; font-weight: 700;">★ 4.9 on Google (86 reviews)</span>
            <a href="${getWhatsAppLink()}" target="_blank" rel="noopener noreferrer" style="color: #25D366; font-weight: 700; text-decoration: none;">💬 WhatsApp Direct</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Trust Strip Overlap -->
  <div class="container trust-strip-wrapper" style="margin-top: 0; margin-bottom: 2rem;">
    <div class="trust-strip-card reveal-item">
      <div class="trust-item">
        <span class="trust-number">${settings.years_running}</span>
        <span class="trust-label">Years of Early Learning Legacy</span>
      </div>
      <div class="trust-item">
        <span class="trust-number">${settings.children_taught}</span>
        <span class="trust-label">Happy Little Alumni</span>
      </div>
      <div class="trust-item">
        <span class="trust-number">1 : 8</span>
        <span class="trust-label">Attentive Educator Ratio</span>
      </div>
      <div class="trust-item">
        <span class="trust-number">${settings.google_rating} ★</span>
        <span class="trust-label">Google Rating (${settings.google_review_count} Reviews)</span>
      </div>
    </div>
  </div>

  <!-- From the Principal's Desk Section (Classic Premier School Feature) -->
  <section class="principals-desk-section">
    <div class="container">
      <div class="principals-grid reveal-item">
        <div class="principals-photo-frame">
          <img src="/assets/images/principal-welcome.jpg" alt="Dr. Priya Sundaram, Academic Director of Global Kids Preschool">
          <span class="principals-badge">Academic Director & Founder</span>
        </div>
        <div class="principals-content">
          <div class="principals-quote-symbol">“</div>
          <span class="eyebrow" style="color: var(--blue);">From the Principal's Desk</span>
          <h2>A Warm Welcome to Global Kids</h2>
          <div class="principals-subtitle">Nurturing Character, Kindness & Joyful Confidence Since 2014</div>
          <p>
            At Global Kids, we believe early childhood is not a race to memorize facts or drill benchmarks. It is the sacred, magical window where a young child forms their fundamental relationship with the world—learning to trust their voice, express curiosity freely, and care for their friends.
          </p>
          <p>
            Every space on our Annanagar campus is intentionally sculpted for little explorers: from child-height wooden Montessori shelves and gentle garden herb planters to our warm, patient educators who understand that learning blossoms through playful discovery.
          </p>
          <p>
            We welcome you to visit our campus, observe our classrooms in action, and partner with us in shaping your child’s most formative early years.
          </p>
          <div class="principals-signature-block">
            <div class="principals-name-title">
              <strong>Dr. Priya Sundaram, M.Ed.</strong>
              <span>Academic Director & Head of School · Global Kids Preschool</span><br>
              <span style="font-size: 0.8rem; color: var(--blue); font-weight: 600;">Member, Early Childhood Association (ECA India & APER)</span>
            </div>
            <a href="/about/" class="btn btn-secondary btn-sm">Read School Philosophy →</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Age-Wise Programmes with Photography -->
  <section class="section tint-sky">
    <div class="container">
      <header class="section-header text-center reveal-item">
        <span class="eyebrow">Academic Programmes</span>
        <h2>Thoughtfully Designed Early Learning Stages</h2>
        <p>From gentle first toddler steps to confident primary school readiness, each programme nurtures holistic growth.</p>
      </header>

      <div class="cards-grid">
        <!-- Programme 1 -->
        <div class="programme-card reveal-item">
          <div style="position: relative; overflow: hidden; height: 180px;">
            <img src="/assets/images/library-story.jpg" alt="Toddlers exploring stories and sensory play" style="width: 100%; height: 100%; object-fit: cover;">
            <span class="programme-chip" style="position: absolute; top: 12px; left: 12px; margin: 0;">Ages 1.5 – 2.5 Years</span>
          </div>
          <div class="programme-body">
            <h3 class="programme-title">Playgroup & Toddlers</h3>
            <p class="programme-summary">Sensory exploration, gentle speech expansion, social co-play, and fine motor coordination in a cozy setting.</p>
            <div style="font-size: 0.8125rem; color: var(--ink-soft); margin-bottom: 0.75rem;">
              <strong>Ratio:</strong> 1:4 • <strong>Timings:</strong> 9:00 AM – 11:30 AM
            </div>
            <a href="/programmes/#toddler" class="programme-cta">Explore curriculum & schedule →</a>
          </div>
        </div>

        <!-- Programme 2 -->
        <div class="programme-card reveal-item">
          <div style="position: relative; overflow: hidden; height: 180px;">
            <img src="/assets/images/hero-classroom.jpg" alt="Pre-KG Nursery children engaged in phonics and numbers" style="width: 100%; height: 100%; object-fit: cover;">
            <span class="programme-chip" style="position: absolute; top: 12px; left: 12px; margin: 0;">Ages 2.5 – 3.5 Years</span>
          </div>
          <div class="programme-body">
            <h3 class="programme-title">Pre-KG / Nursery</h3>
            <p class="programme-summary">Tactile phonics, number discovery, dramatic expression, and social confidence with hands-on Montessori manipulatives.</p>
            <div style="font-size: 0.8125rem; color: var(--ink-soft); margin-bottom: 0.75rem;">
              <strong>Ratio:</strong> 1:6 • <strong>Timings:</strong> 9:00 AM – 12:00 PM
            </div>
            <a href="/programmes/#nursery" class="programme-cta">Explore curriculum & schedule →</a>
          </div>
        </div>

        <!-- Programme 3 -->
        <div class="programme-card reveal-item">
          <div style="position: relative; overflow: hidden; height: 180px;">
            <img src="/assets/images/outdoor-play.jpg" alt="Kindergarten children doing outdoor active play" style="width: 100%; height: 100%; object-fit: cover;">
            <span class="programme-chip" style="position: absolute; top: 12px; left: 12px; margin: 0;">Ages 3.5 – 5.5 Years</span>
          </div>
          <div class="programme-body">
            <h3 class="programme-title">Kindergarten (LKG & UKG)</h3>
            <p class="programme-summary">Foundational literacy, early STEM inquiry, logical math concepts, and holistic readiness for primary school boards.</p>
            <div style="font-size: 0.8125rem; color: var(--ink-soft); margin-bottom: 0.75rem;">
              <strong>Ratio:</strong> 1:8 • <strong>Timings:</strong> 9:00 AM – 1:00 PM
            </div>
            <a href="/programmes/#kindergarten" class="programme-cta">Explore curriculum & schedule →</a>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 2.5rem;">
        <a href="/programmes/" class="btn btn-secondary">View All Programmes, Comparison Table & Daycare →</a>
      </div>
    </div>
  </section>

  <!-- Campus Life & Photographic Gallery (Show, Don't Just Tell!) -->
  <section class="campus-gallery-section">
    <div class="container">
      <header class="section-header text-center reveal-item">
        <span class="eyebrow">Campus Life & Facilities</span>
        <h2>A Glimpse into Our Joyful Learning Campus</h2>
        <p>Purpose-built spaces designed for safety, creative discovery, and early sensory exploration.</p>
      </header>

      <div class="campus-gallery-grid reveal-item">
        <!-- Photo 1 -->
        <div class="campus-gallery-card">
          <img src="/assets/images/hero-classroom.jpg" alt="Montessori sensory lab with wooden materials">
          <div class="campus-gallery-body">
            <span class="campus-gallery-tag">Montessori Learning</span>
            <h4>Tactile Sensory Discovery Lab</h4>
            <p>Child-height wooden open shelving with sandpaper letters, bead stairs, and math puzzles.</p>
          </div>
        </div>

        <!-- Photo 2 -->
        <div class="campus-gallery-card">
          <img src="/assets/images/outdoor-play.jpg" alt="Outdoor grass play lawn with shade sails">
          <div class="campus-gallery-body">
            <span class="campus-gallery-tag">Outdoor Recreation</span>
            <h4>Lush Green Play Arena & Sandpit</h4>
            <p>UV-shielded outdoor area with soft safety lawn, river sand pit, and gross-motor climbing frames.</p>
          </div>
        </div>

        <!-- Photo 3 -->
        <div class="campus-gallery-card">
          <img src="/assets/images/library-story.jpg" alt="Cozy reading nook with teacher reading picture books">
          <div class="campus-gallery-body">
            <span class="campus-gallery-tag">Early Literacy</span>
            <h4>Little Sprouts Story & Phonics Nook</h4>
            <p>Cushioned reading circle where children enjoy daily bilingual puppet stories and picture books.</p>
          </div>
        </div>

        <!-- Photo 4 -->
        <div class="campus-gallery-card">
          <img src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80" alt="Sensory water wheel and garden play">
          <div class="campus-gallery-body">
            <span class="campus-gallery-tag">Sensory Exploration</span>
            <h4>Splash & Water Play Tables</h4>
            <p>Safe water wheels and sensory discovery tables fostering physics curiosity and peer collaboration.</p>
          </div>
        </div>

        <!-- Photo 5 -->
        <div class="campus-gallery-card">
          <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80" alt="Calm sanitized toddler nap suites">
          <div class="campus-gallery-body">
            <span class="campus-gallery-tag">Daycare & Rest</span>
            <h4>Air-Purified Cozy Nap Suites</h4>
            <p>Individual organic cotton cots, dimmable acoustic insulation, and HEPA air purification.</p>
          </div>
        </div>

        <!-- Photo 6 -->
        <div class="campus-gallery-card">
          <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80" alt="Hygienic snack and fruit dining corner">
          <div class="campus-gallery-body">
            <span class="campus-gallery-tag">Health & Dining</span>
            <h4>Child-Scale Dining & Handwash Hub</h4>
            <p>Wholesome fruit breaks and supervised handwash stations building lifelong self-hygiene habits.</p>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 2rem;">
        <a href="/gallery/" class="btn btn-secondary">Explore Complete Campus Photo Gallery →</a>
      </div>
    </div>
  </section>

  <!-- School Notice Board & Upcoming Events (Inspired by DPS Bangalore & Montfort School) -->
  <section class="school-notice-section">
    <div class="container">
      <header class="section-header text-center reveal-item">
        <span class="eyebrow">School Communications</span>
        <h2>Notice Board & School Happenings</h2>
        <p>Keep up with official announcements, academic circulars, and upcoming campus celebrations.</p>
      </header>

      <div class="notice-columns-grid reveal-item">
        <!-- Column 1: Circulars & Notices -->
        <div class="notice-col-card">
          <div class="notice-col-header">
            <h3>📢 Circulars & Announcements</h3>
            <a href="/news/" style="font-size: 0.8125rem; font-weight: 700; color: var(--blue); text-decoration: none;">View Archive →</a>
          </div>

          <div class="notice-item">
            <div class="notice-date-badge">12 OCT<br><span style="font-size: 0.65rem;">2026</span></div>
            <div class="notice-info">
              <h4>
                <a href="/admissions/">Admissions 2025–26: Guidelines & Document Checklist</a>
                <span class="notice-pill-new">NEW</span>
              </h4>
              <p>Applications open for Toddlers, Nursery & KG batches. Limited seats per batch to preserve 1:8 ratio.</p>
            </div>
          </div>

          <div class="notice-item">
            <div class="notice-date-badge">05 OCT<br><span style="font-size: 0.65rem;">2026</span></div>
            <div class="notice-info">
              <h4><a href="/news/">Parent Orientation & Phased Settling Schedule</a></h4>
              <p>Staggered 4-day orientation timetable for incoming parents to ensure tear-free settling transitions.</p>
            </div>
          </div>

          <div class="notice-item">
            <div class="notice-date-badge">28 SEP<br><span style="font-size: 0.65rem;">2026</span></div>
            <div class="notice-info">
              <h4><a href="/facilities-safety/">Health Advisory: Monsoon Air Filtration & Sanitization</a></h4>
              <p>Hospital-grade UV sanitization and daily pediatric temperature checks active on campus.</p>
            </div>
          </div>
        </div>

        <!-- Column 2: Upcoming School Events -->
        <div class="notice-col-card">
          <div class="notice-col-header">
            <h3>📅 Upcoming School Events</h3>
            <a href="/news/" style="font-size: 0.8125rem; font-weight: 700; color: var(--blue); text-decoration: none;">Full Calendar →</a>
          </div>

          <div class="notice-item">
            <div class="event-date-block">
              <span class="event-day">25</span>
              <span class="event-month">OCT</span>
            </div>
            <div class="notice-info">
              <h4>Grandparents' Day & Story Circle</h4>
              <p>Time: 9:30 AM – 11:30 AM • An affectionate morning celebrating grandparents with puppet theater and clay art.</p>
            </div>
          </div>

          <div class="notice-item">
            <div class="event-date-block">
              <span class="event-day">08</span>
              <span class="event-month">NOV</span>
            </div>
            <div class="notice-info">
              <h4>Montessori Sensory Open Day & Workshop</h4>
              <p>Time: 10:00 AM – 1:00 PM • Prospective parents experience hands-on tactile materials alongside educators.</p>
            </div>
          </div>

          <div class="notice-item">
            <div class="event-date-block">
              <span class="event-day">22</span>
              <span class="event-month">NOV</span>
            </div>
            <div class="notice-info">
              <h4>Little Sprouts Annual Movement Gala</h4>
              <p>Time: 8:30 AM – 11:00 AM • Non-competitive fun obstacle courses, balance games, and music celebration.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Official Institutional Recognition & Accreditations (Static, Prestigious Seals) -->
  <section class="section accreditation-section">
    <div class="container">
      <header class="accreditation-header reveal-item">
        <span class="eyebrow">Institutional Standing & Accreditations</span>
        <h2>Recognized for Excellence in Early Childhood Education</h2>
        <p style="max-width: 60ch; margin: 0.5rem auto 0 auto;">Evaluated and accredited by leading national early childhood care associations and child safety councils.</p>
      </header>

      <div class="accreditation-grid reveal-item">
        <div class="accreditation-card">
          <div class="accreditation-seal">🏆</div>
          <div class="accreditation-info">
            <h4>EducationWorld Grand Jury</h4>
            <p><strong>Ranked Among Top 50 Preschools</strong> in Chennai & Tamil Nadu for Pedagogical Innovation.</p>
          </div>
        </div>

        <div class="accreditation-card">
          <div class="accreditation-seal">📜</div>
          <div class="accreditation-info">
            <h4>Early Childhood Association</h4>
            <p><strong>ECA India & APER Accredited</strong> institution meeting rigorous teacher training and child safety benchmarks.</p>
          </div>
        </div>

        <div class="accreditation-card">
          <div class="accreditation-seal">🛡️</div>
          <div class="accreditation-info">
            <h4>Child Safety Council (NEEF)</h4>
            <p><strong>5-Star Verified Campus</strong> for non-toxic furnishings, 100% CCTV coverage, and dual-card pickup protocols.</p>
          </div>
        </div>

        <div class="accreditation-card">
          <div class="accreditation-seal">🏥</div>
          <div class="accreditation-info">
            <h4>Emergency Medical Tie-Up</h4>
            <p>Direct rapid pediatric emergency coordination with <strong>Apollo Cradle & Sundaram Medical Foundation</strong>.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Reviews Preview -->
  <section class="section tint-blush">
    <div class="container">
      <header class="section-header text-center reveal-item">
        <span class="eyebrow">Real Parent Experiences</span>
        <h2>Trusted by Over 1,200 Chennai Families</h2>
        <p>Unfiltered testimonials from parents who made Global Kids their child's first learning home.</p>
      </header>
      <div class="testimonials-grid">
        ${content.testimonials.map(t => `
          <div class="testimonial-card reveal-item">
            <p class="testimonial-quote">“${t.quote}”</p>
            <div class="testimonial-author">
              <div class="author-avatar">${t.name.charAt(0)}</div>
              <div class="author-meta">
                <span class="author-name">${t.name}</span>
                <span class="author-sub">${t.programme}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="text-align: center; margin-top: 2rem;">
        <a href="${settings.google_review_url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
          Read All ${settings.google_review_count} Reviews on Google Maps ↗
        </a>
      </div>
    </div>
  </section>

  <!-- Direct School Tour Action Banner -->
  <section class="section" style="padding-top: 0; padding-bottom: 2rem;">
    <div class="container">
      <div class="school-action-banner reveal-item">
        <h2>Experience the Warmth of Our Campus in Person</h2>
        <p>Walk through our naturally lit classrooms, open sensory gardens, and meet our passionate educators. Admissions are currently open for 2025–26.</p>
        <div class="school-action-buttons">
          <a href="/admissions/#visit" class="btn btn-primary" style="background: var(--sun); color: var(--on-sun);">Book a Campus Tour</a>
          <a href="${getWhatsAppLink()}" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
          <a href="tel:${settings.phone_e164}" class="btn btn-secondary" style="color: #FFFFFF; border-color: rgba(255,255,255,0.4);">Call Admissions: ${settings.phone_display}</a>
        </div>
      </div>
    </div>
  </section>
  `;
}

function getProgrammesHtml() {
  return `
  <section class="section" style="padding-top: 2rem;">
    <div class="container">
      <header class="section-header reveal-item">
        <span class="eyebrow">Academic & Play Framework</span>
        <h1>Developmental Programmes for Ages 1.5 to 6</h1>
        <p>Curriculums specifically calibrated for sensory, emotional, linguistic, and cognitive milestones.</p>
      </header>

      <div style="display: flex; flex-direction: column; gap: 4rem; margin-top: 3rem;">
        ${content.programmes.map(p => `
          <div id="${p.slug}" class="gk-form-card reveal-item" style="display: grid; grid-template-columns: 1fr; gap: 2rem;">
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center;">
                <span class="programme-chip">${p.age_band}</span>
                <span class="sticker-badge" style="transform:none;">Ratio: ${p.ratio}</span>
                <span class="sticker-badge rotate-right" style="transform:none;">Timings: ${p.timings}</span>
              </div>
              <h2 style="font-size: var(--fs-2xl);">${p.title}</h2>
              <p style="font-size: var(--fs-base); color: var(--ink);">${p.summary}</p>
              
              <div style="margin-top: 1rem;">
                <h4 style="margin-bottom: 0.75rem;">Key Developmental Outcomes:</h4>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
                  ${p.curriculum.map(c => `
                    <li style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: var(--fs-sm); color: var(--ink-soft);">
                      <span style="color: var(--ok); flex-shrink: 0; margin-top: 2px;">✔</span>
                      <span>${c}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>

              <div style="background: var(--tint-sun); padding: 1rem 1.25rem; border-radius: var(--r-sm); margin-top: 1rem;">
                <strong>Sample Daily Schedule:</strong>
                <p style="font-size: var(--fs-xs); color: var(--ink); margin-top: 0.25rem;">${p.schedule}</p>
              </div>

              <div style="display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap;">
                <a href="/admissions/?programme=${encodeURIComponent(p.title)}#visit" class="btn btn-primary btn-sm">Enquire for ${p.title}</a>
                <a href="${getWhatsAppLink(`Hi! I'm interested in knowing more about the ${p.title} programme.`)}" class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener noreferrer">WhatsApp Query</a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Comparison Table -->
      <div class="reveal-item" style="margin-top: 5rem;">
        <h2 style="margin-bottom: 1.5rem;">Programmes at a Glance</h2>
        <div style="overflow-x: auto; background: var(--surface); border-radius: var(--r-md); border: 1px solid var(--line); box-shadow: var(--shadow-sm);">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: var(--fs-sm);">
            <thead>
              <tr style="background: var(--tint-sky); border-bottom: 2px solid var(--line);">
                <th style="padding: 1rem 1.25rem; font-family: var(--font-head);">Programme</th>
                <th style="padding: 1rem 1.25rem; font-family: var(--font-head);">Age Band</th>
                <th style="padding: 1rem 1.25rem; font-family: var(--font-head);">Timings</th>
                <th style="padding: 1rem 1.25rem; font-family: var(--font-head);">Educator Ratio</th>
                <th style="padding: 1rem 1.25rem; font-family: var(--font-head);">Fee Structure</th>
              </tr>
            </thead>
            <tbody>
              ${content.programmes.map(p => `
                <tr style="border-bottom: 1px solid var(--line);">
                  <td style="padding: 1rem 1.25rem; font-weight: 600; color: var(--ink);">${p.title}</td>
                  <td style="padding: 1rem 1.25rem; color: var(--ink-soft);">${p.age_band}</td>
                  <td style="padding: 1rem 1.25rem; color: var(--ink-soft);">${p.timings}</td>
                  <td style="padding: 1rem 1.25rem; color: var(--ink-soft);">${p.ratio}</td>
                  <td style="padding: 1rem 1.25rem; color: var(--blue); font-weight: 600;">Available on request</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>`;
}

function getAboutHtml() {
  return `
  <section class="section" style="padding-top: 2rem;">
    <div class="container">
      <header class="section-header reveal-item">
        <span class="eyebrow">Our Heritage & Story</span>
        <h1>Nurturing Confident Little Learners Since 2014</h1>
        <p>Ranked among the Top 50 preschools in Chennai. Founded by early education specialists with a mission to create joyful, pressure-free childhoods.</p>
      </header>

      <div class="hero-grid" style="align-items: center; margin-top: 3rem;">
        <div class="reveal-item">
          <h2>A School Built on Empathy, Safety, and Wonder</h2>
          <p style="margin-bottom: 1rem;">
            Global Kids Preschool was born out of a simple observation: early childhood education had become overly hurried, commercialized, and anxious. Parents were being asked to push two-year-olds into tests instead of letting them explore tactile, social, and emotional discovery.
          </p>
          <p style="margin-bottom: 1rem;">
            Over the past ${settings.years_running} years in Annanagar West, we have remained steadfastly committed to child-centered learning. We blend the best of Montessori self-discovery, play-based Finnish early years methodology, and British phonics foundations.
          </p>
          <p>
            Today, over 1,200 alumni children thrive in premier primary schools across Chennai, carrying with them the empathy, curiosity, and confidence nurtured in our classrooms.
          </p>
        </div>
        <div class="reveal-item">
          <img class="hero-blob-image" src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=700&q=80" alt="Attentive educator interacting with preschool children in bright classroom" width="700" height="500">
        </div>
      </div>

      <!-- Core Values -->
      <div style="margin-top: 5rem;" class="reveal-item">
        <header class="section-header text-center">
          <span class="eyebrow">Guiding Principles</span>
          <h2>Our Three Pillars of Child Development</h2>
        </header>
        <div class="cards-grid">
          <div class="feature-card">
            <div class="feature-icon-circle tint-mint">${icons.sparkles}</div>
            <h3>1. Joy Precedes Academics</h3>
            <p>A child who feels safe, celebrated, and joyful develops intrinsic motivation to learn. We never use punitive measures or stressful rote testing.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon-circle tint-sky">${icons.shieldCheck}</div>
            <h3>2. Uncompromising Child Safety</h3>
            <p>From non-toxic wooden play furnishings and rounded wall edges to strict authorized pickup lists and verified staff, safety is non-negotiable.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon-circle tint-blush">${icons.sun}</div>
            <h3>3. Partnership with Families</h3>
            <p>Parents are our co-educators. We maintain open communication through weekly pictorial journals, developmental milestones reviews, and parenting workshops.</p>
          </div>
        </div>
      </div>

      <!-- Educator Team -->
      <div style="margin-top: 5rem;" class="reveal-item">
        <header class="section-header text-center">
          <span class="eyebrow">Our Faculty</span>
          <h2>Meet Our Caring Educators</h2>
          <p>Trained, certified, and passionate early childhood professionals dedicated to each child's happiness.</p>
        </header>
        <div class="cards-grid">
          ${content.teachers.map(t => `
            <div class="teacher-card">
              <div style="background: var(--tint-lilac); padding: 2rem; color: var(--lilac); display: flex; align-items: center; justify-content: center; height: 180px;">
                <span style="font-family: var(--font-head); font-size: 3rem; font-weight: 700;">${t.name.split(' ')[0].charAt(0)}</span>
              </div>
              <div class="teacher-info">
                <h3 class="teacher-name">${t.name}</h3>
                <span class="teacher-role">${t.role}</span>
                <p class="teacher-exp">${t.qualification}</p>
                <p style="font-size: var(--fs-xs); color: var(--ink-soft); margin-top: 0.5rem;">${t.bio}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </section>`;
}

function getOurApproachHtml() {
  return `
  <section class="section" style="padding-top: 2rem;">
    <div class="container">
      <header class="section-header reveal-item">
        <span class="eyebrow">Educational Philosophy</span>
        <h1>How Children Learn Joyfully at Global Kids</h1>
        <p>Combining the best of hands-on Montessori tactile manipulation with structured play and phonics readiness.</p>
      </header>

      <div class="cards-grid" style="margin-top: 3rem;">
        <div class="feature-card reveal-item">
          <div class="feature-icon-circle tint-sky">${icons.sparkles}</div>
          <h3>Language & Phonemic Awareness</h3>
          <p>Children discover letter sounds through multisensory stories, rhymes, sand-paper tracing, and vocabulary immersion. Never rote chanting.</p>
        </div>
        <div class="feature-card reveal-item">
          <div class="feature-icon-circle tint-mint">${icons.puzzle}</div>
          <h3>Numeracy & Logical Thinking</h3>
          <p>Counting beads, pattern blocks, sorting activities, and spatial puzzles build concrete conceptual mathematical understanding.</p>
        </div>
        <div class="feature-card reveal-item">
          <div class="feature-icon-circle tint-blush">${icons.sun}</div>
          <h3>Gross & Fine Motor Mastery</h3>
          <p>Clay modeling, tweezer sorting, obstacle courses, balance beams, and scissor practice build the fine muscles essential for handwriting.</p>
        </div>
        <div class="feature-card reveal-item">
          <div class="feature-icon-circle tint-lilac">${icons.bookOpen}</div>
          <h3>Social-Emotional Resilience</h3>
          <p>Learning how to articulate feelings, share resources, negotiate turns, and resolve minor conflicts with calm teacher scaffolding.</p>
        </div>
        <div class="feature-card reveal-item">
          <div class="feature-icon-circle tint-sky">${icons.award}</div>
          <h3>Discovery & STEM Curiosity</h3>
          <p>Planting herb gardens, examining leaves under child microscopes, water displacement games, and sensory light-box experiments.</p>
        </div>
        <div class="feature-card reveal-item">
          <div class="feature-icon-circle tint-mint">${icons.shieldCheck}</div>
          <h3>Transparent Parent Progress Sharing</h3>
          <p>Termly comprehensive developmental portfolio reviews covering cognitive, fine-motor, and emotional progress without high-stakes tests.</p>
        </div>
      </div>
    </div>
  </section>`;
}

function getFacilitiesSafetyHtml() {
  return `
  <section class="section" style="padding-top: 2rem;">
    <div class="container">
      <header class="section-header reveal-item">
        <span class="eyebrow">Safety Above All</span>
        <h1>Our Comprehensive Child Safety & Campus Standards</h1>
        <p>Awarded 5-Star Clean Campus by National Early Educators Forum. Every corner of our preschool is built with active safety protocols.</p>
      </header>

      <div class="safety-grid" style="margin-top: 3rem;">
        <div class="safety-item reveal-item">
          <div class="safety-check-icon">${icons.check}</div>
          <div class="safety-text">
            <h4>100% CCTV Surveillance</h4>
            <p>Monitored cameras in all classrooms, corridors, indoor playrooms, and campus gates.</p>
          </div>
        </div>
        <div class="safety-item reveal-item">
          <div class="safety-check-icon">${icons.check}</div>
          <div class="safety-text">
            <h4>Police-Verified Staff</h4>
            <p>Background verification and credential checks for all teaching and support staff.</p>
          </div>
        </div>
        <div class="safety-item reveal-item">
          <div class="safety-check-icon">${icons.check}</div>
          <div class="safety-text">
            <h4>Authorized Dual-Card Pickup Protocol</h4>
            <p>Children are released strictly to parents/guardians presenting their school identity badge. No exceptions.</p>
          </div>
        </div>
        <div class="safety-item reveal-item">
          <div class="safety-check-icon">${icons.check}</div>
          <div class="safety-text">
            <h4>Child-Safe Architecture</h4>
            <p>Rounded furniture edges, finger-pinch door guards, electrical outlet socket covers, and non-slip rubber flooring.</p>
          </div>
        </div>
        <div class="safety-item reveal-item">
          <div class="safety-check-icon">${icons.check}</div>
          <div class="safety-text">
            <h4>Pediatric First Aid & Emergency Protocol</h4>
            <p>Staff trained in basic pediatric life support and immediate tie-ups with nearby multi-specialty pediatric hospitals (Apollo Cradle & Sundaram Medical Foundation).</p>
          </div>
        </div>
        <div class="safety-item reveal-item">
          <div class="safety-check-icon">${icons.check}</div>
          <div class="safety-text">
            <h4>Sanitized Child-Height Washrooms</h4>
            <p>Daily hospital-grade sanitization, touchless soap dispensers, and dedicated caregiver assistance.</p>
          </div>
        </div>
        <div class="safety-item reveal-item">
          <div class="safety-check-icon">${icons.check}</div>
          <div class="safety-text">
            <h4>Air Purification & Natural Sunlight</h4>
            <p>Naturally ventilated classrooms supplemented with HEPA air filtration during peak pollen and dust seasons.</p>
          </div>
        </div>
        <div class="safety-item reveal-item">
          <div class="safety-check-icon">${icons.check}</div>
          <div class="safety-text">
            <h4>RO Purified Drinking Water</h4>
            <p>Multi-stage UV+RO water purification stations checked and tested monthly.</p>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function getAdmissionsHtml(queryParams = {}) {
  const selectedProgramme = queryParams.programme || '';
  return `
  <section class="section" style="padding-top: 2rem;">
    <div class="container">
      <header class="section-header reveal-item">
        <span class="eyebrow">Enrollment Guide</span>
        <h1>Admissions Open for Academic Year 2026–2027</h1>
        <p>Ranked among Top 50 preschools in Chennai. We welcome you to visit our campus, observe active classrooms, and discuss your child's milestones with our educators.</p>
      </header>

      <div class="hero-grid" style="align-items: flex-start; margin-top: 3rem;">
        <!-- Left: Process and Criteria -->
        <div class="reveal-item" style="display: flex; flex-direction: column; gap: 2rem;">
          <div class="gk-form-card">
            <h3>Age Eligibility & Cut-Off Criteria</h3>
            <p style="margin-top: 0.5rem; font-size: var(--fs-sm);">${settings.admission_cutoff_text}</p>
            <ul style="margin-top: 1rem; list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: var(--fs-sm);">
              <li><strong>Toddlers:</strong> 1.5 Years & above</li>
              <li><strong>Playgroup:</strong> 2.0 to 3.0 Years</li>
              <li><strong>Nursery:</strong> 3.0 to 4.0 Years</li>
              <li><strong>Kindergarten (KG1/KG2):</strong> 4.0 to 6.0 Years</li>
            </ul>
          </div>

          <div class="gk-form-card">
            <h3>Required Documents Checklist</h3>
            <ul style="margin-top: 1rem; list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: var(--fs-sm);">
              <li>✔ Copy of Child's Municipal Birth Certificate</li>
              <li>✔ Updated Immunization / Pediatric Health Record</li>
              <li>✔ Proof of Residence (Aadhar / Utility Bill / Passport)</li>
              <li>✔ 4 Passport-size photographs of the child</li>
              <li>✔ 2 Passport-size photographs of parents / authorized guardians</li>
            </ul>
            <p style="margin-top: 1rem; font-size: var(--fs-xs); color: var(--ink-soft);">
              <em>Note: As per our child privacy policy and DPDP Act 2023, documents are inspected in person during your visit and are never required to be uploaded online.</em>
            </p>
          </div>

          <div class="gk-form-card">
            <h3>Fee Transparency</h3>
            <p style="font-size: var(--fs-sm);">
              Our fee structure is completely transparent with zero mid-term surprise charges. Detailed itemized fee prospectus is handed over during campus tour.
            </p>
            <div style="margin-top: 1rem;">
              <a href="${getWhatsAppLink('Hi! I would like to request the fee schedule for Global Kids Preschool.')}" class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener noreferrer">
                Request Fee Overview via WhatsApp
              </a>
            </div>
          </div>
        </div>

        <!-- Right: Visit & Enquiry Form -->
        <div id="visit" class="gk-form-card reveal-item">
          <header style="margin-bottom: 1.5rem;">
            <h2 style="font-size: var(--fs-xl);">Book a School Visit & Tour</h2>
            <p style="font-size: var(--fs-sm);">Please fill in your details below. We will call you within one working day to confirm your preferred visit slot.</p>
          </header>

          <form action="/submit-enquiry" method="POST" class="gk-form" data-gk-validate="true">
            <!-- Security Honeypot -->
            <input type="text" name="website_url" style="display: none;" tabindex="-1" autocomplete="off">
            <input type="hidden" name="form_timestamp" value="${Date.now()}">

            <div class="form-group">
              <label class="form-label" for="parent_name">Parent / Guardian Full Name <span class="required">*</span></label>
              <input type="text" id="parent_name" name="parent_name" class="form-control" required placeholder="e.g. Anand Sharma">
              <span class="form-error-msg">Please enter your name.</span>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" for="phone">10-Digit Mobile Number <span class="required">*</span></label>
                <input type="tel" id="phone" name="phone" class="form-control" required placeholder="e.g. 9876543210" pattern="[0-9]{10}">
                <span class="form-error-msg">Please enter a valid 10-digit Indian mobile number.</span>
              </div>
              <div class="form-group">
                <label class="form-label" for="email">Email Address (Optional)</label>
                <input type="email" id="email" name="email" class="form-control" placeholder="parent@example.com">
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" for="programme">Programme of Interest <span class="required">*</span></label>
                <select id="programme" name="programme" class="form-control" required>
                  <option value="">Select Programme</option>
                  <option value="Toddler Explorers (1.5 - 2.5 yrs)" ${selectedProgramme.includes('Toddler') ? 'selected' : ''}>Toddler Explorers (1.5 – 2.5 yrs)</option>
                  <option value="Playgroup Pioneers (2 - 3 yrs)" ${selectedProgramme.includes('Playgroup') ? 'selected' : ''}>Playgroup Pioneers (2 – 3 yrs)</option>
                  <option value="Nursery Discoverers (3 - 4 yrs)" ${selectedProgramme.includes('Nursery') ? 'selected' : ''}>Nursery Discoverers (3 – 4 yrs)</option>
                  <option value="Kindergarten Leaders (4 - 6 yrs)" ${selectedProgramme.includes('Kindergarten') ? 'selected' : ''}>Kindergarten (4 – 6 yrs)</option>
                  <option value="Daycare & Extended Care" ${selectedProgramme.includes('Daycare') ? 'selected' : ''}>Daycare & Extended Care</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="age_band">Child's Approximate Age Band <span class="required">*</span></label>
                <select id="age_band" name="age_band" class="form-control" required>
                  <option value="">Select Age Band</option>
                  <option value="1.5 to 2.5 Years">1.5 to 2.5 Years</option>
                  <option value="2.5 to 3.5 Years">2.5 to 3.5 Years</option>
                  <option value="3.5 to 4.5 Years">3.5 to 4.5 Years</option>
                  <option value="4.5 to 6 Years">4.5 to 6 Years</option>
                </select>
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" for="visit_date">Preferred Visit Date</label>
                <input type="date" id="visit_date" name="visit_date" class="form-control">
              </div>
              <div class="form-group">
                <label class="form-label" for="visit_time">Preferred Time Slot</label>
                <select id="visit_time" name="visit_time" class="form-control">
                  <option value="Morning (09:30 AM – 11:30 AM)">Morning (09:30 AM – 11:30 AM)</option>
                  <option value="Afternoon (02:30 PM – 04:30 PM)">Afternoon (02:30 PM – 04:30 PM)</option>
                  <option value="Saturday Morning (10:00 AM – 12:30 PM)">Saturday Morning (10:00 AM – 12:30 PM)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="message">Questions or Specific Notes (Optional)</label>
              <textarea id="message" name="message" class="form-control" placeholder="Any queries regarding timings, dietary preferences, or settling routines..."></textarea>
            </div>

            <label class="consent-checkbox-row">
              <input type="checkbox" name="consent" required value="1">
              <span class="consent-text">
                I agree to the <a href="/privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and consent to Global Kids Preschool contacting me regarding my campus visit enquiry. (We never share your contact details). <span class="required">*</span>
              </span>
            </label>

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
              Confirm & Book Campus Visit
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>`;
}

function getGalleryHtml() {
  const album = content.albums[0];
  return `
  <section class="section" style="padding-top: 2rem;">
    <div class="container">
      <header class="section-header reveal-item">
        <span class="eyebrow">Moments of Joy</span>
        <h1>Campus Life & Celebrations Gallery</h1>
        <p>A glimpse into everyday collaborative play, festivals, nature discovery, and arts at Global Kids.</p>
      </header>

      <div class="reveal-item" style="margin-top: 2rem;">
        <div style="background: var(--surface); padding: 1.5rem; border-radius: var(--r-md); border: 1px solid var(--line); margin-bottom: 2rem;">
          <h2 style="font-size: var(--fs-xl);">${album.title}</h2>
          <p style="font-size: var(--fs-sm);">${album.description}</p>
          <span style="font-size: var(--fs-xs); color: var(--ok); font-weight: 600; margin-top: 0.5rem; display: inline-block;">
            ✔ Verified Parental Photo Consent on Record
          </span>
        </div>

        <div class="gallery-grid">
          ${album.images.map(img => `
            <div>
              <img class="gallery-thumbnail" 
                   src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80" 
                   alt="${img.alt}" 
                   data-lightbox-src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=85" 
                   data-lightbox-alt="${img.alt}">
              <p style="font-size: var(--fs-xs); margin-top: 0.5rem; color: var(--ink-soft);">${img.caption}</p>
            </div>
          `).join('')}
          <div>
            <img class="gallery-thumbnail" 
                 src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80" 
                 alt="Early childhood cognitive puzzle play" 
                 data-lightbox-src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=85" 
                 data-lightbox-alt="Early childhood cognitive puzzle play">
            <p style="font-size: var(--fs-xs); margin-top: 0.5rem; color: var(--ink-soft);">Hands-on wooden shapes and tactile sorting center</p>
          </div>
          <div>
            <img class="gallery-thumbnail" 
                 src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80" 
                 alt="Teacher reading animated story to circle of children" 
                 data-lightbox-src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85" 
                 data-lightbox-alt="Teacher reading animated story to circle of children">
            <p style="font-size: var(--fs-xs); margin-top: 0.5rem; color: var(--ink-soft);">Storytelling hour sparking imagination and language</p>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function getContactHtml() {
  return `
  <section class="section" style="padding-top: 2rem;">
    <div class="container">
      <header class="section-header reveal-item">
        <span class="eyebrow">Connect With Us</span>
        <h1>We Would Love to Welcome You to Campus</h1>
        <p>Drop by for a visit, message us directly on WhatsApp, or call our admissions desk.</p>
      </header>

      <div class="hero-grid" style="align-items: flex-start; margin-top: 3rem;">
        <div class="reveal-item" style="display: flex; flex-direction: column; gap: 2rem;">
          <div class="gk-form-card">
            <h3>Campus Location & Contacts</h3>
            <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1.25rem;">
              <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
                <span style="color: var(--blue); margin-top: 2px;">${icons.mapPin}</span>
                <div>
                  <strong>Campus Address:</strong><br>
                  <span>${settings.address_line1}, ${settings.address_line2}, ${settings.area}, ${settings.city} - ${settings.pincode}</span><br>
                  <small style="color: var(--ink-soft);">Dedicated visitor parking & shaded drop-off bay available.</small>
                </div>
              </div>

              <div style="display: flex; gap: 0.75rem; align-items: center;">
                <span style="color: var(--blue);">${icons.phone}</span>
                <div>
                  <strong>Direct Admissions Line:</strong><br>
                  <a href="tel:${settings.phone_e164}" style="font-weight: 600;">${settings.phone_display}</a>
                </div>
              </div>

              <div style="display: flex; gap: 0.75rem; align-items: center;">
                <span style="color: #25D366;">${icons.whatsapp}</span>
                <div>
                  <strong>WhatsApp Admissions Helpdesk:</strong><br>
                  <a href="${getWhatsAppLink()}" target="_blank" rel="noopener noreferrer" style="color: #20BD5A; font-weight: 600;">Chat Instantly on WhatsApp ↗</a>
                </div>
              </div>

              <div style="display: flex; gap: 0.75rem; align-items: center;">
                <span style="color: var(--blue);">${icons.clock}</span>
                <div>
                  <strong>Office & Campus Visiting Hours:</strong><br>
                  <span>${settings.hours_text}</span>
                </div>
              </div>
            </div>

            <div style="margin-top: 1.5rem;">
              <a href="${settings.maps_url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="width: 100%;">
                Open Google Maps Directions ↗
              </a>
            </div>
          </div>
        </div>

        <div class="gk-form-card reveal-item">
          <header style="margin-bottom: 1.5rem;">
            <h2>Send a Direct Message</h2>
            <p style="font-size: var(--fs-sm);">Have a question about admissions, timings, or transport? Reach out directly.</p>
          </header>

          <form action="/submit-enquiry" method="POST" class="gk-form" data-gk-validate="true">
            <input type="text" name="website_url" style="display: none;" tabindex="-1">
            <input type="hidden" name="form_timestamp" value="${Date.now()}">

            <div class="form-group">
              <label class="form-label" for="contact_name">Your Name <span class="required">*</span></label>
              <input type="text" id="contact_name" name="parent_name" class="form-control" required placeholder="e.g. Ramesh Kumar">
            </div>

            <div class="form-group">
              <label class="form-label" for="contact_phone">Mobile Number <span class="required">*</span></label>
              <input type="tel" id="contact_phone" name="phone" class="form-control" required placeholder="e.g. 9876543210" pattern="[0-9]{10}">
            </div>

            <div class="form-group">
              <label class="form-label" for="contact_email">Email Address</label>
              <input type="email" id="contact_email" name="email" class="form-control" placeholder="yourname@gmail.com">
            </div>

            <div class="form-group">
              <label class="form-label" for="contact_message">Your Query <span class="required">*</span></label>
              <textarea id="contact_message" name="message" class="form-control" required placeholder="How can we assist you?"></textarea>
            </div>

            <label class="consent-checkbox-row">
              <input type="checkbox" name="consent" required value="1">
              <span class="consent-text">
                I agree to the <a href="/privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and authorize the school to respond to my query. <span class="required">*</span>
              </span>
            </label>

            <button type="submit" class="btn btn-primary" style="width: 100%;">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  </section>`;
}

function getThankYouHtml(refId = 'GK-VISIT-2026') {
  return `
  <section class="section" style="padding-top: 3rem; text-align: center;">
    <div class="container container-narrow">
      <div class="gk-form-card reveal-item" style="padding: 3rem 2rem;">
        <div style="width: 64px; height: 64px; background: var(--tint-mint); color: var(--ok); border-radius: var(--r-pill); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
          ${icons.check}
        </div>
        <h1>Thank You! Your Visit Enquiry is Received</h1>
        <p style="font-size: var(--fs-lg); color: var(--ink); margin: 1rem auto; max-width: 50ch;">
          We have successfully recorded your enquiry under reference number: <strong>${refId}</strong>.
        </p>
        <p style="color: var(--ink-soft); margin: 0 auto 2rem auto; max-width: 50ch;">
          Our admissions coordinator will contact you by phone within one working day to confirm your campus tour slot and share directions.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a href="${getWhatsAppLink(`Hi! I just submitted an enquiry on your website with reference ${refId}.`)}" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
            Message Us on WhatsApp Now
          </a>
          <a href="/" class="btn btn-secondary">Return to Homepage</a>
        </div>
      </div>
    </div>
  </section>`;
}

function getParentCornerHtml() {
  return `
  <section class="section" style="padding-top: 2rem;">
    <div class="container container-narrow">
      <header class="section-header text-center reveal-item">
        <span class="eyebrow">Enrolled Families Only</span>
        <h1>Parent Corner 🔒</h1>
        <p>A simple place for enrolled school parents to access circulars, monthly menus, activity calendars, and event updates.</p>
      </header>

      <div class="gk-form-card reveal-item" style="margin-top: 2rem;">
        <div style="background: var(--tint-sky); padding: 1.25rem; border-radius: var(--r-sm); margin-bottom: 2rem; font-size: var(--fs-sm);">
          <strong>Need the passcode?</strong> The shared parent passcode is distributed via our official WhatsApp school broadcast group at the start of each term.
        </div>

        <h3 style="margin-bottom: 1.25rem;">Recent School Circulars & Downloads</h3>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 1rem;">
          <li style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg); border-radius: var(--r-sm);">
            <div>
              <strong>Term 1 Calendar & Holiday Schedule 2026–27</strong><br>
              <small style="color: var(--ink-soft);">PDF · Updated June 2026</small>
            </div>
            <a href="#" class="btn btn-secondary btn-sm" onclick="alert('Password required: Distributed in official parent group.'); return false;">Download 📄</a>
          </li>
          <li style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg); border-radius: var(--r-sm);">
            <div>
              <strong>Nutritious Monthly Snack & Fruit Menu</strong><br>
              <small style="color: var(--ink-soft);">PDF · Certified by Pediatric Nutritionist</small>
            </div>
            <a href="#" class="btn btn-secondary btn-sm" onclick="alert('Password required: Distributed in official parent group.'); return false;">Download 📄</a>
          </li>
          <li style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg); border-radius: var(--r-sm);">
            <div>
              <strong>Annual Joy Fest Costume & Schedule Guide</strong><br>
              <small style="color: var(--ink-soft);">PDF · Circular No. 4</small>
            </div>
            <a href="#" class="btn btn-secondary btn-sm" onclick="alert('Password required: Distributed in official parent group.'); return false;">Download 📄</a>
          </li>
        </ul>
      </div>
    </div>
  </section>`;
}

function getPrivacyPolicyHtml() {
  return `
  <section class="section" style="padding-top: 2rem;">
    <div class="container container-narrow">
      <header class="section-header reveal-item">
        <span class="eyebrow">Legal & Compliance</span>
        <h1>Privacy Policy</h1>
        <p>Last updated: June 2026. Compliant with the Digital Personal Data Protection (DPDP) Act 2023.</p>
      </header>

      <article class="reveal-item" style="display: flex; flex-direction: column; gap: 1.5rem; font-size: var(--fs-base); line-height: 1.7;">
        <h2>1. Commitment to Child & Family Privacy</h2>
        <p>Global Kids Preschool ("we", "our", "school") is deeply committed to safeguarding personal information. We practice strict data minimization.</p>

        <h2>2. Data We Collect</h2>
        <p>Through our website, we collect only minimal prospective parent enquiry data: parent/guardian name, 10-digit mobile number, optional email address, programme of interest, and preferred tour time.</p>
        <p><strong>Crucially: We NEVER collect child names, dates of birth, or children's personal identifiers through our online forms.</strong></p>

        <h2>3. Parental Photo Consent</h2>
        <p>Photographs appearing in our gallery or social channels are published strictly after obtaining signed written consent from parents. We never publish child full names alongside photographs.</p>

        <h2>4. Data Retention & Deletion</h2>
        <p>Prospective parent visit enquiries are retained securely in our private administrative system for a maximum period of ${settings.retention_months} months, after which they are purged. Parents may request immediate deletion of their contact record at any time by emailing admissions@globalkids.edu.in.</p>
      </article>
    </div>
  </section>`;
}

function getTermsHtml() {
  return `
  <section class="section" style="padding-top: 2rem;">
    <div class="container container-narrow">
      <header class="section-header reveal-item">
        <span class="eyebrow">Legal Agreement</span>
        <h1>Terms of Service</h1>
      </header>
      <article class="reveal-item" style="display: flex; flex-direction: column; gap: 1.5rem; font-size: var(--fs-base); line-height: 1.7;">
        <p>Welcome to the official website of Global Kids Preschool. By browsing our website, scheduling tours, or using our inquiry services, you agree to these terms.</p>
        <h2>1. Informational Content</h2>
        <p>All programme descriptions, curriculum guidelines, and schedules represent our ongoing educational framework. Final terms of enrollment, policies, and fee structures are formalized in writing during campus registration.</p>
        <h2>2. Child Protection</h2>
        <p>Users may not scrape, reproduce, or reuse photographs or materials from this site.</p>
      </article>
    </div>
  </section>`;
}

function getPhotoChildSafetyPolicyHtml() {
  return `
  <section class="section" style="padding-top: 2rem;">
    <div class="container container-narrow">
      <header class="section-header reveal-item">
        <span class="eyebrow">Safety Policy</span>
        <h1>Child Safety & Photo Policy</h1>
      </header>
      <article class="reveal-item" style="display: flex; flex-direction: column; gap: 1.5rem; font-size: var(--fs-base); line-height: 1.7;">
        <h2>1. Zero Online Child Identity Exposure</h2>
        <p>We believe in safeguarding the privacy and digital identity of every child. Children's full names, home addresses, and pickup routes are never shared online or in public materials.</p>
        <h2>2. Written Parental Consent Gate</h2>
        <p>Before any group classroom activity or celebration photograph is considered for publication, written consent from the parents of participating children is verified and logged.</p>
        <h2>3. Safe Photography Guidelines</h2>
        <p>Photographs focus on educational engagement, artistic creations, and collaborative play. Staff and visitor personal devices are strictly prohibited from photographing children during school hours.</p>
      </article>
    </div>
  </section>`;
}

function getReviewsHtml() {
  return `
  <section class="section" style="padding-top: 2rem;">
    <div class="container">
      <header class="section-header text-center reveal-item">
        <span class="eyebrow">Community Voices</span>
        <h1>Parent Reviews & Testimonials</h1>
        <p>Real stories and reflections from families whose children blossomed at Global Kids.</p>
      </header>
      <div class="testimonials-grid" style="margin-top: 3rem;">
        ${content.testimonials.map(t => `
          <div class="testimonial-card reveal-item">
            <p class="testimonial-quote">“${t.quote}”</p>
            <div class="testimonial-author">
              <div class="author-avatar">${t.name.charAt(0)}</div>
              <div class="author-meta">
                <span class="author-name">${t.name}</span>
                <span class="author-sub">${t.programme}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="text-align: center; margin-top: 3rem;">
        <a href="${settings.google_review_url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          View Verified Reviews on Google Business Profile ↗
        </a>
      </div>
    </div>
  </section>`;
}

function getNewsHtml() {
  return `
  <section class="section" style="padding-top: 2rem;">
    <div class="container">
      <header class="section-header reveal-item">
        <span class="eyebrow">School Happenings</span>
        <h1>News, Events & Parenting Insights</h1>
        <p>Updates on upcoming celebrations, admissions cycles, and early childhood parenting tips.</p>
      </header>
      <div class="cards-grid" style="margin-top: 3rem;">
        <article class="feature-card reveal-item">
          <span class="programme-chip">Event</span>
          <h3>Upcoming Annual Joy Fest & Open House</h3>
          <p>Join us on Saturday, 18th July for interactive science booths, puppet play, and campus tours for prospective parents.</p>
          <a href="/admissions/#visit" style="font-weight: 600; font-size: var(--fs-sm); margin-top: auto;">Reserve a family pass →</a>
        </article>
        <article class="feature-card reveal-item">
          <span class="programme-chip">Parenting Tips</span>
          <h3>Easing Toddler Separation Anxiety</h3>
          <p>Gentle transition strategies recommended by our lead educators for tear-free first weeks in preschool.</p>
          <a href="/our-approach/" style="font-weight: 600; font-size: var(--fs-sm); margin-top: auto;">Read guidance →</a>
        </article>
        <article class="feature-card reveal-item">
          <span class="programme-chip">Admissions</span>
          <h3>2026–2027 Admissions Staggered Batches</h3>
          <p>Early batch allocations for Nursery and Playgroup are underway with limited batch sizes of 15 children.</p>
          <a href="/admissions/#visit" style="font-weight: 600; font-size: var(--fs-sm); margin-top: auto;">Check eligibility →</a>
        </article>
      </div>
    </div>
  </section>`;
}

function get404Html() {
  return `
  <section class="section" style="padding-top: 4rem; text-align: center;">
    <div class="container container-narrow">
      <div class="reveal-item">
        <span style="font-size: 5rem; font-family: var(--font-head); color: var(--sun); line-height: 1;">404</span>
        <h1 style="margin: 1rem 0;">Page Not Found</h1>
        <p style="margin: 0 auto 2rem auto;">
          The page you are looking for might have been moved or does not exist. Let's get you back on track!
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a href="/" class="btn btn-primary">Return to Homepage</a>
          <a href="/programmes/" class="btn btn-secondary">Explore Programmes</a>
          <a href="/admissions/#visit" class="btn btn-whatsapp">Book a Visit</a>
        </div>
      </div>
    </div>
  </section>`;
}

// HTTP Server Request Handler
const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/';

  // Handle Form POST Submission
  if (req.method === 'POST' && pathname === '/submit-enquiry') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const params = new URLSearchParams(body);
      const honeypot = params.get('website_url');
      if (honeypot) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        return res.end('Spam bot detected.');
      }
      const refId = 'GK-' + Math.floor(100000 + Math.random() * 900000);
      res.writeHead(302, { Location: `/thank-you/?ref=${refId}` });
      return res.end();
    });
    return;
  }

  // Handle Static Asset Serving (CSS, JS)
  if (pathname.startsWith('/assets/')) {
    const filePath = path.join(ROOT_DIR, 'wp-content/themes/gk-theme', pathname);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const mimeTypes = {
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.svg': 'image/svg+xml',
        '.woff2': 'font/woff2',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp'
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
      return fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Asset Not Found');
    }
  }

  // Route Handling
  const queryObj = Object.fromEntries(parsedUrl.searchParams);
  let html = '';
  let status = 200;

  switch (pathname) {
    case '/':
      html = renderPage('Home', 'home', getHomeHtml());
      break;
    case '/about':
      html = renderPage('About Our School', 'about', getAboutHtml());
      break;
    case '/programmes':
      html = renderPage('Early Childhood Programmes', 'programmes', getProgrammesHtml());
      break;
    case '/our-approach':
      html = renderPage('Our Approach & Philosophy', 'our-approach', getOurApproachHtml());
      break;
    case '/facilities-safety':
      html = renderPage('Facilities & Child Safety Standards', 'facilities-safety', getFacilitiesSafetyHtml());
      break;
    case '/admissions':
      html = renderPage('Admissions 2026–2027', 'admissions', getAdmissionsHtml(queryObj));
      break;
    case '/gallery':
      html = renderPage('Photo Gallery & Campus Life', 'gallery', getGalleryHtml());
      break;
    case '/reviews':
      html = renderPage('Parent Testimonials & Reviews', 'reviews', getReviewsHtml());
      break;
    case '/news':
      html = renderPage('News & Events', 'news', getNewsHtml());
      break;
    case '/parent-corner':
      html = renderPage('Parent Corner', 'parent-corner', getParentCornerHtml());
      break;
    case '/contact':
      html = renderPage('Contact Us', 'contact', getContactHtml());
      break;
    case '/thank-you':
      html = renderPage('Thank You', 'thank-you', getThankYouHtml(queryObj.ref));
      break;
    case '/privacy-policy':
      html = renderPage('Privacy Policy', 'privacy-policy', getPrivacyPolicyHtml());
      break;
    case '/terms':
      html = renderPage('Terms of Service', 'terms', getTermsHtml());
      break;
    case '/photo-child-safety-policy':
      html = renderPage('Child Safety & Photo Policy', 'safety-policy', getPhotoChildSafetyPolicyHtml());
      break;
    default:
      status = 404;
      html = renderPage('Page Not Found', '404', get404Html());
      break;
  }

  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` Global Kids Preschool Live Server Running Successfully!`);
  console.log(` Access Localhost: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
