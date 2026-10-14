/**
 * Launch Gate Verification Test Suite
 * Strictly enforces PRD §9 & AGENTS.md Launch Check Requirements
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('======================================================');
console.log(' Starting Global Kids Preschool Launch Gate Checks');
console.log('======================================================\n');

let errors = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`[FAIL] ${message}`);
    errors++;
  } else {
    console.log(`[PASS] ${message}`);
  }
}

const rootDir = path.resolve(__dirname, '..');
const settings = JSON.parse(fs.readFileSync(path.join(rootDir, 'seed/settings.sample.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(rootDir, 'seed/content.json'), 'utf8'));

// 1. Required Settings
console.log('--- 1. Single Source of Truth Settings Validation ---');
assert(settings.school_name && settings.school_name.length > 3, 'School name is set');
assert(settings.phone_e164 && settings.phone_e164.startsWith('+91'), 'Phone number is in valid E.164 Indian format (+91...)');
assert(settings.whatsapp_e164 && settings.whatsapp_e164.startsWith('+91'), 'WhatsApp number is in valid E.164 format (+91...)');
assert(settings.email && settings.email.includes('@'), 'Admissions email address is set');
assert(settings.address_line1 && settings.area && settings.city && settings.pincode, 'Full postal address is set');
assert(settings.maps_url && settings.maps_url.startsWith('https://'), 'Google Maps URL is configured');
assert(settings.hours_text && settings.hours_text.length > 10, 'Operating hours are structured');

// 2. Child Privacy & Data Minimization (DPDP Act 2023)
console.log('\n--- 2. Child Privacy & DPDP Act 2023 Compliance ---');
const serverCode = fs.readFileSync(path.join(rootDir, 'server/server.js'), 'utf8');
const admissionsCode = fs.readFileSync(path.join(rootDir, 'wp-content/themes/gk-theme/page-templates/admissions.php'), 'utf8');

assert(!serverCode.includes('name="child_name"'), 'Forms DO NOT collect child\'s full name');
assert(!serverCode.includes('name="child_dob"'), 'Forms DO NOT collect child\'s date of birth');
assert(!serverCode.includes('name="child_photo"'), 'Forms DO NOT collect child\'s photograph online');
assert(serverCode.includes('name="consent" required'), 'Mandatory parental privacy consent checkbox is present on forms');
assert(admissionsCode.includes('name="consent" required'), 'WordPress Admissions template has mandatory consent checkbox');

// 3. Zero Dead Links (#) in Navigation & Main Templates
console.log('\n--- 3. Hyperlink Integrity Check ---');
const headerCode = fs.readFileSync(path.join(rootDir, 'wp-content/themes/gk-theme/template-parts/header/site-header.php'), 'utf8');
const footerCode = fs.readFileSync(path.join(rootDir, 'wp-content/themes/gk-theme/template-parts/footer/site-footer.php'), 'utf8');

assert(!headerCode.includes('href="#"'), 'Header contains zero dead "#" links');
assert(!footerCode.includes('href="#"'), 'Footer contains zero dead "#" links');

// 4. Fixed Slugs Coverage
console.log('\n--- 4. Sitemap & Fixed Slugs Verification ---');
const requiredSlugs = [
  '/', '/about', '/programmes', '/our-approach', '/facilities-safety',
  '/admissions', '/gallery', '/reviews', '/news', '/parent-corner',
  '/contact', '/thank-you', '/privacy-policy', '/terms', '/photo-child-safety-policy'
];

requiredSlugs.forEach((slug) => {
  assert(serverCode.includes(`'${slug}':`), `Route ${slug} is mapped and handled`);
});

// 5. Run WCAG 2.2 AA Contrast Checks
console.log('\n--- 5. WCAG 2.2 AA Contrast Script ---');
try {
  execSync('node scripts/contrast-check.js', { stdio: 'inherit' });
  assert(true, 'All design token contrast ratios passed');
} catch (e) {
  assert(false, 'Design token contrast check failed');
}

// 6. Performance Asset Budgets
console.log('\n--- 6. Asset Performance Budget Validation ---');
const cssPath = path.join(rootDir, 'wp-content/themes/gk-theme/assets/src/css/main.css');
const jsPath = path.join(rootDir, 'wp-content/themes/gk-theme/assets/src/js/main.js');
const zlib = require('zlib');

const cssGz = zlib.gzipSync(fs.readFileSync(cssPath)).length / 1024;
const jsGz = zlib.gzipSync(fs.readFileSync(jsPath)).length / 1024;

assert(cssGz <= 25, `CSS bundle is ${cssGz.toFixed(2)} KB gz (Budget <= 25 KB)`);
assert(jsGz <= 40, `JS bundle is ${jsGz.toFixed(2)} KB gz (Budget <= 40 KB)`);

console.log('\n======================================================');
if (errors === 0) {
  console.log(' ALL LAUNCH GATE CHECKS PASSED: READY FOR PRODUCTION');
  console.log('======================================================\n');
  process.exit(0);
} else {
  console.error(` ${errors} LAUNCH GATE CHECKS FAILED!`);
  console.log('======================================================\n');
  process.exit(1);
}
