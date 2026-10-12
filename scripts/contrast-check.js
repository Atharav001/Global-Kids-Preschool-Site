/**
 * WCAG 2.2 AA Contrast Verification Script
 * Validates design token combinations from DESIGN.md §2.1
 */

function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

function luminance(r, g, b) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const colors = {
  bg: '#FFF8EC',
  surface: '#FFFFFF',
  ink: '#2B2A35',
  inkSoft: '#5B596A',
  sun: '#FFC93C',
  onSun: '#2B2A35',
  blue: '#2A62D8',
  tintSky: '#E6F3FF',
  tintMint: '#E3F6EA',
  tintBlush: '#FFE7DF',
  tintLilac: '#EEE8FF',
  tintSun: '#FFF0BF'
};

const checks = [
  { name: 'Ink on Cream BG (body)', fg: colors.ink, bg: colors.bg, min: 4.5 },
  { name: 'Ink on White Surface (body)', fg: colors.ink, bg: colors.surface, min: 4.5 },
  { name: 'Ink Soft on Cream BG (secondary)', fg: colors.inkSoft, bg: colors.bg, min: 4.5 },
  { name: 'Ink Soft on White Surface (secondary)', fg: colors.inkSoft, bg: colors.surface, min: 4.5 },
  { name: 'On-Sun Text on Sun Button', fg: colors.onSun, bg: colors.sun, min: 4.5 },
  { name: 'Trust Blue on Cream BG (headings/links)', fg: colors.blue, bg: colors.bg, min: 4.5 },
  { name: 'Trust Blue on White Surface', fg: colors.blue, bg: colors.surface, min: 4.5 },
  { name: 'White Text on Dark Footer Ink', fg: '#FFFFFF', bg: colors.ink, min: 4.5 },
  { name: 'Ink on Sky Tint', fg: colors.ink, bg: colors.tintSky, min: 4.5 },
  { name: 'Ink on Mint Tint', fg: colors.ink, bg: colors.tintMint, min: 4.5 },
  { name: 'Ink on Blush Tint', fg: colors.ink, bg: colors.tintBlush, min: 4.5 },
  { name: 'Ink on Lilac Tint', fg: colors.ink, bg: colors.tintLilac, min: 4.5 },
  { name: 'Ink on Sun Tint', fg: colors.ink, bg: colors.tintSun, min: 4.5 }
];

console.log('=== WCAG 2.2 AA Contrast Verification ===');
let failed = 0;

checks.forEach((item) => {
  const ratio = contrast(item.fg, item.bg);
  const passed = ratio >= item.min;
  const status = passed ? 'PASS' : 'FAIL';
  console.log(`[${status}] ${item.name}: ${ratio.toFixed(2)}:1 (Requires >= ${item.min}:1)`);
  if (!passed) failed++;
});

if (failed > 0) {
  console.error(`\nFailed ${failed} contrast checks!`);
  process.exit(1);
} else {
  console.log('\nAll contrast checks PASSED successfully!');
}
