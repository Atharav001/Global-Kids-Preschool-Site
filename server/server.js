/**
 * Global Kids Preschool - High-Fidelity Localhost Preview Server
 * Built with native Node.js (zero external dependencies required)
 * Renders all 14 site routes + dynamic forms + schema + design tokens
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

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

function renderWaveDivider(fillColor = '#FFF8EC', flip = false) {
  const transform = flip ? 'transform="rotate(180 600 24)"' : '';
  return `<div class="wave-divider" aria-hidden="true">
    <svg viewBox="0 0 1200 48" preserveAspectRatio="none">
      <path ${transform} d="M0,0 C150,38 350,48 600,24 C850,0 1050,36 1200,24 L1200,48 L0,48 Z" fill="${fillColor}"></path>
    </svg>
  </div>`;
}

// Master HTML Shell
function renderPage(title, activeSlug, contentHtml, description = '') {
  const pageTitle = `${title} · Preschool in ${settings.area}, ${settings.city} · ${settings.school_name}`;
  const metaDesc = description || `Global Kids Preschool in ${settings.area}, ${settings.city}. Nurturing early learning, toddler play, nursery, kindergarten, and daycare. Schedule your school tour today.`;

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

  <header class="site-header" role="banner">
    <div class="container header-inner">
      <a href="/" class="brand-logo" aria-label="${settings.school_name}">
        <div class="logo-icon-badge" aria-hidden="true">GK</div>
        <div class="brand-text">
          <span class="brand-title">${settings.school_name}</span>
          <span class="brand-subtitle">${settings.tagline}</span>
        </div>
      </a>

      <nav class="nav-menu-desktop" role="navigation" aria-label="Primary Navigation">
        <a href="/about/" class="nav-link ${activeSlug === 'about' ? 'active' : ''}">About</a>
        <a href="/programmes/" class="nav-link ${activeSlug === 'programmes' ? 'active' : ''}">Programmes</a>
        <a href="/our-approach/" class="nav-link ${activeSlug === 'our-approach' ? 'active' : ''}">Our Approach</a>
        <a href="/facilities-safety/" class="nav-link ${activeSlug === 'facilities-safety' ? 'active' : ''}">Facilities & Safety</a>
        <a href="/admissions/" class="nav-link ${activeSlug === 'admissions' ? 'active' : ''}">Admissions</a>
        <a href="/gallery/" class="nav-link ${activeSlug === 'gallery' ? 'active' : ''}">Gallery</a>
        <a href="/contact/" class="nav-link ${activeSlug === 'contact' ? 'active' : ''}">Contact</a>
      </nav>

      <div class="header-cta-group">
        <a href="/admissions/#visit" class="btn btn-primary btn-sm">Book a Visit</a>
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
      <span class="brand-title">${settings.school_name}</span>
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
      <a href="/gallery/" class="mobile-nav-link ${activeSlug === 'gallery' ? 'active' : ''}">Photo Gallery</a>
      <a href="/news/" class="mobile-nav-link ${activeSlug === 'news' ? 'active' : ''}">News & Events</a>
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
          <h4>${settings.school_name}</h4>
          <p style="color: rgba(255,255,255,0.8); margin-bottom: 1.5rem; font-size: 0.95rem;">
            ${settings.tagline}. Nurturing curious minds, empathetic hearts, and confident learners in a joyful, secure environment.
          </p>
          <div class="footer-contact-item">
            ${icons.mapPin}
            <span>${settings.address_line1}, ${settings.area}, ${settings.city} - ${settings.pincode}</span>
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
        <div>&copy; ${new Date().getFullYear()} ${settings.school_name}. All rights reserved. Designed for child safety & joy.</div>
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
  <!-- Hero Section -->
  <section class="section" style="padding-top: 2rem;">
    <div class="container hero-grid">
      <div class="hero-content reveal-item">
        <span class="eyebrow">Preschool in ${settings.area}, ${settings.city}</span>
        <h1>Where Early Curiosity Turns into <span class="highlight-squiggle">Lifelong Wonder<svg viewBox="0 0 200 12" preserveAspectRatio="none"><path d="M0,8 Q50,0 100,8 T200,8" fill="none" stroke="var(--sun)" stroke-width="4" stroke-linecap="round"/></svg></span></h1>
        <p>A warm, child-centered preschool and daycare providing evidence-backed early childhood education, patient guidance, and 100% child-safe premises.</p>
        <div class="hero-actions">
          <a href="/admissions/#visit" class="btn btn-primary">Book a School Visit</a>
          <a href="${getWhatsAppLink()}" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
        </div>
        <div class="hero-micro-proof">
          <span style="color: #F7B500; font-size: 1.2rem;">★★★★★</span>
          <strong>${settings.google_rating} on Google</strong>
          <span>(${settings.google_review_count} verified parent reviews)</span>
        </div>
      </div>
      <div class="hero-media-wrapper reveal-item">
        <img class="hero-blob-image" src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80" alt="Smiling children exploring creative sensory blocks with attentive teacher" fetchpriority="high" width="800" height="600">
        <span class="sticker-badge hero-sticker-1">${settings.years_running} Years of Joyful Care</span>
        <span class="sticker-badge hero-sticker-2 rotate-right">${settings.ratio_text}</span>
      </div>
    </div>
  </section>

  <!-- Trust Strip Overlap -->
  <div class="container trust-strip-wrapper">
    <div class="trust-strip-card reveal-item">
      <div class="trust-item">
        <span class="trust-number">${settings.years_running}</span>
        <span class="trust-label">Years of Early Learning</span>
      </div>
      <div class="trust-item">
        <span class="trust-number">${settings.children_taught}</span>
        <span class="trust-label">Happy Little Alumni</span>
      </div>
      <div class="trust-item">
        <span class="trust-number">1 : 8</span>
        <span class="trust-label">Attentive Child-Educator Ratio</span>
      </div>
      <div class="trust-item">
        <span class="trust-number">${settings.google_rating} ★</span>
        <span class="trust-label">Google Rating (${settings.google_review_count} Reviews)</span>
      </div>
    </div>
  </div>

  <!-- Programmes Overview -->
  <section class="section tint-sky" style="margin-top: 3rem;">
    <div class="container">
      <header class="section-header text-center reveal-item">
        <span class="eyebrow">Age-Appropriate Learning</span>
        <h2>Thoughtfully Designed Early Programmes</h2>
        <p>From gentle first toddler steps to confident primary school readiness, each programme nurtures holistic growth.</p>
      </header>
      <div class="cards-grid">
        ${content.programmes.slice(0, 3).map(p => `
          <a href="/programmes/#${p.slug}" class="programme-card reveal-item">
            <div style="background: var(--tint-sky); padding: 1.5rem; display: flex; align-items: center; justify-content: center; height: 160px; color: var(--blue);">
              ${icons[p.icon] || icons.sparkles}
            </div>
            <div class="programme-body">
              <span class="programme-chip">${p.age_band}</span>
              <h3 class="programme-title">${p.title}</h3>
              <p class="programme-summary">${p.summary}</p>
              <span class="programme-cta">Explore schedule & curriculum →</span>
            </div>
          </a>
        `).join('')}
      </div>
      <div style="text-align: center; margin-top: 2.5rem;">
        <a href="/programmes/" class="btn btn-secondary">View All Programmes & Comparison Table</a>
      </div>
    </div>
  </section>

  <!-- Why Global Kids (USPs) -->
  <section class="section">
    <div class="container">
      <header class="section-header text-center reveal-item">
        <span class="eyebrow">Why Parents Trust Us</span>
        <h2>Built for Peace of Mind & Child Wellbeing</h2>
        <p>Specific, evidence-based commitments we stand behind every single day.</p>
      </header>
      <div class="cards-grid">
        <div class="feature-card reveal-item">
          <div class="feature-icon-circle">${icons.shieldCheck}</div>
          <h3>100% CCTV & Dual-Card Pickup</h3>
          <p>Continuous monitoring in classrooms and outdoor play zones. Children are released only to verified guardians with physical photo authorization badges.</p>
        </div>
        <div class="feature-card reveal-item">
          <div class="feature-icon-circle tint-mint">${icons.sparkles}</div>
          <h3>Low Ratios (Max 1:8 in Class)</h3>
          <p>Every child is noticed, heard, and gently encouraged. No crowd overwhelm or lost voices during formative years.</p>
        </div>
        <div class="feature-card reveal-item">
          <div class="feature-icon-circle tint-blush">${icons.sun}</div>
          <h3>Nutritious Hot Snack Routine</h3>
          <p>Daily fruit intervals and balanced hygienic warm snacks planned under pediatric nutritional guidelines.</p>
        </div>
        <div class="feature-card reveal-item">
          <div class="feature-icon-circle tint-lilac">${icons.bookOpen}</div>
          <h3>Experiential Phonics & Math</h3>
          <p>Multisensory Jolly Phonics methodology and manipulative-based numeracy creating fluent early readers without rote pressure.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Day Timeline -->
  <section class="section tint-mint">
    <div class="container">
      <header class="section-header text-center reveal-item">
        <span class="eyebrow">Daily Rhythm</span>
        <h2>A Typical Morning at Global Kids</h2>
        <p>Predictable routines foster emotional security and joyful active engagement.</p>
      </header>
      <div class="timeline-container reveal-item">
        <div class="timeline-step">
          <span class="timeline-time">08:30 AM</span>
          <h4>Warm Welcome & Circle</h4>
          <p>Gentle greetings, morning songs, and emotional check-in with lead teachers.</p>
        </div>
        <div class="timeline-step">
          <span class="timeline-time">09:15 AM</span>
          <h4>Phonics & Discovery</h4>
          <p>Hands-on literacy activities, tactile phonics cards, and language discovery.</p>
        </div>
        <div class="timeline-step">
          <span class="timeline-time">10:15 AM</span>
          <h4>Hygiene & Fruit Break</h4>
          <p>Supervised handwashing, wholesome fruit snack, and joyful table manners.</p>
        </div>
        <div class="timeline-step">
          <span class="timeline-time">10:45 AM</span>
          <h4>Outdoor Sand & Motor Play</h4>
          <p>Gross motor coordination, sensory water table, and active climbing frames.</p>
        </div>
        <div class="timeline-step">
          <span class="timeline-time">11:45 AM</span>
          <h4>Story & Reflection</h4>
          <p>Interactive puppet storytelling, rhyme recap, and peaceful pack-up time.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Founder Note -->
  <section class="section">
    <div class="container">
      <div class="hero-grid" style="align-items: center;">
        <div class="reveal-item">
          <img class="hero-blob-image" src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80" alt="Shanmuga Praba S, Founder of Global Kids Preschool" width="600" height="600">
        </div>
        <div class="reveal-item">
          <span class="eyebrow">A Note from Our Founder</span>
          <h2>"Early childhood is not a race; it is a sacred window of discovery."</h2>
          <p style="margin-bottom: 1rem;">
            When we founded Global Kids in 2014, our promise was clear: create an environment where children feel as secure and deeply loved as they do at home, while providing world-class early pedagogical stimulation.
          </p>
          <p style="margin-bottom: 1.5rem;">
            Every educator on our team is handpicked for patience, warmth, and genuine joy in guiding young children through their first triumphs.
          </p>
          <div>
            <strong style="font-family: var(--font-head); font-size: 1.15rem; color: var(--ink);">Shanmuga Praba S., M.Ed</strong><br>
            <span style="font-size: var(--fs-sm); color: var(--ink-soft);">Founder & Head of School · Global Kids Preschool</span>
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

  <!-- 4-Step Admissions -->
  <section class="section tint-sun">
    <div class="container">
      <header class="section-header text-center reveal-item">
        <span class="eyebrow">Simple Enrollment</span>
        <h2>Admissions in 4 Thoughtful Steps</h2>
        <p>No stressful entrance exams. We prioritize understanding your child and family values.</p>
      </header>
      <div class="steps-grid">
        <div class="step-card reveal-item">
          <div class="step-num-badge">1</div>
          <h3>Schedule Campus Visit</h3>
          <p>Book a slot online or connect on WhatsApp. See live classes and meet teachers.</p>
        </div>
        <div class="step-card reveal-item">
          <div class="step-num-badge">2</div>
          <h3>Interactive Orientation</h3>
          <p>Gentle meeting between child, parents, and Head of School to assess child readiness.</p>
        </div>
        <div class="step-card reveal-item">
          <div class="step-num-badge">3</div>
          <h3>Registration & Docs</h3>
          <p>Submit basic documents (birth certificate & immunization record). Zero hidden fees.</p>
        </div>
        <div class="step-card reveal-item">
          <div class="step-num-badge">4</div>
          <h3>Gradual Settling In</h3>
          <p>Staggered 60-minute settling sessions to ensure tear-free joyful transitions.</p>
        </div>
      </div>
      <div style="text-align: center; margin-top: 2.5rem;">
        <a href="/admissions/#visit" class="btn btn-primary">Start Admission Process Today</a>
      </div>
    </div>
  </section>

  <!-- Top FAQs -->
  <section class="section">
    <div class="container container-narrow">
      <header class="section-header text-center reveal-item">
        <span class="eyebrow">Frequently Answered</span>
        <h2>Common Questions from Parents</h2>
      </header>
      <div class="faq-list reveal-item">
        ${content.faqs.slice(0, 5).map(f => `
          <details class="faq-item">
            <summary class="faq-summary">
              <span>${f.question}</span>
              <span class="faq-icon" aria-hidden="true">+</span>
            </summary>
            <div class="faq-content">
              <p>${f.answer}</p>
            </div>
          </details>
        `).join('')}
      </div>
      <div style="text-align: center; margin-top: 2rem;">
        <a href="/admissions/#faq" class="btn btn-secondary">Read Comprehensive Admissions FAQs</a>
      </div>
    </div>
  </section>

  <!-- Final CTA Band -->
  <section class="section" style="padding-top: 0;">
    <div class="container">
      <div class="cta-band reveal-item">
        <h2>Experience the Warmth of Our Campus in Person</h2>
        <p style="max-width: 50ch;">Walk through our naturally lit classrooms, open sensory gardens, and meet our passionate educators.</p>
        <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;">
          <a href="/admissions/#visit" class="btn btn-primary">Book a Campus Tour</a>
          <a href="${getWhatsAppLink()}" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
          <a href="tel:${settings.phone_e164}" class="btn btn-secondary">Call ${settings.phone_display}</a>
        </div>
      </div>
    </div>
  </section>`;
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
        <p>Founded by early education specialists with a mission to create joyful, pressure-free childhoods.</p>
      </header>

      <div class="hero-grid" style="align-items: center; margin-top: 3rem;">
        <div class="reveal-item">
          <h2>A School Built on Empathy, Safety, and Wonder</h2>
          <p style="margin-bottom: 1rem;">
            Global Kids Preschool was born out of a simple observation: early childhood education had become overly hurried, commercialized, and anxious. Parents were being asked to push two-year-olds into tests instead of letting them explore tactile, social, and emotional discovery.
          </p>
          <p style="margin-bottom: 1rem;">
            Over the past ${settings.years_running} years in Annanagar, we have remained steadfastly committed to child-centered learning. We blend the best of Montessori self-discovery, play-based Finnish early years methodology, and British phonics foundations.
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
        <p>Every corner of our preschool is designed with active safety protocols to protect curious toddlers.</p>
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
            <p>Staff trained in basic pediatric life support and immediate tie-ups with nearby multi-specialty pediatric hospitals.</p>
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
        <p>We welcome you to visit our campus, observe active classrooms, and discuss your child's milestones with our educators.</p>
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

          <form action="/submit-enquiry/" method="POST" class="gk-form" data-gk-validate="true">
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

          <form action="/submit-enquiry/" method="POST" class="gk-form" data-gk-validate="true">
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
              <small style="color: var(--ink-soft);">PDF · Updated Weekly</small>
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
  const parsedUrl = url.parse(req.url, true);
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
      res.end();
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
        '.woff2': 'font/woff2'
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
      return fs.createReadStream(filePath).pipe(res);
    }
  }

  // Routes
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  switch (pathname) {
    case '/':
      res.end(renderPage('Home', 'home', getHomeHtml()));
      break;
    case '/about':
      res.end(renderPage('About Our School', 'about', getAboutHtml()));
      break;
    case '/programmes':
      res.end(renderPage('Early Childhood Programmes', 'programmes', getProgrammesHtml()));
      break;
    case '/our-approach':
      res.end(renderPage('Our Approach & Philosophy', 'our-approach', getOurApproachHtml()));
      break;
    case '/facilities-safety':
      res.end(renderPage('Facilities & Child Safety Standards', 'facilities-safety', getFacilitiesSafetyHtml()));
      break;
    case '/admissions':
      res.end(renderPage('Admissions 2026–2027', 'admissions', getAdmissionsHtml(parsedUrl.query)));
      break;
    case '/gallery':
      res.end(renderPage('Photo Gallery & Campus Life', 'gallery', getGalleryHtml()));
      break;
    case '/reviews':
      res.end(renderPage('Parent Testimonials & Reviews', 'reviews', getReviewsHtml()));
      break;
    case '/news':
      res.end(renderPage('News & Events', 'news', getNewsHtml()));
      break;
    case '/parent-corner':
      res.end(renderPage('Parent Corner', 'parent-corner', getParentCornerHtml()));
      break;
    case '/contact':
      res.end(renderPage('Contact Us', 'contact', getContactHtml()));
      break;
    case '/thank-you':
      res.end(renderPage('Thank You', 'thank-you', getThankYouHtml(parsedUrl.query.ref)));
      break;
    case '/privacy-policy':
      res.end(renderPage('Privacy Policy', 'privacy-policy', getPrivacyPolicyHtml()));
      break;
    case '/terms':
      res.end(renderPage('Terms of Service', 'terms', getTermsHtml()));
      break;
    case '/photo-child-safety-policy':
      res.end(renderPage('Child Safety & Photo Policy', 'safety-policy', getPhotoChildSafetyPolicyHtml()));
      break;
    default:
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(renderPage('Page Not Found', '404', get404Html()));
      break;
  }
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` Global Kids Preschool Live Server Running Successfully!`);
  console.log(` Access Localhost: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
