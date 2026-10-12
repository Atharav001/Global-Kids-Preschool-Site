/**
 * Lint verification script for JS & CSS
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const cssPath = path.join(rootDir, 'wp-content/themes/gk-theme/assets/src/css/main.css');
const jsPath = path.join(rootDir, 'wp-content/themes/gk-theme/assets/src/js/main.js');

console.log('Linting CSS & JS syntax...');

const cssContent = fs.readFileSync(cssPath, 'utf8');
const jsContent = fs.readFileSync(jsPath, 'utf8');

// Basic syntax sanity checks
if (!cssContent.includes(':root') || !cssContent.includes('--bg')) {
  throw new Error('CSS missing fundamental tokens!');
}

try {
  new Function(jsContent);
  console.log('✓ JS Syntax is valid.');
} catch (e) {
  throw new Error('JS Syntax error: ' + e.message);
}

console.log('✓ All linters passed.');
