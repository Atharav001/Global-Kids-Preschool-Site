/**
 * Package WordPress Theme & Plugin into deployable zip files
 * Generates dist/gk-theme.zip and dist/gk-core.zip
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

console.log('Building dist/gk-theme.zip...');
try {
  execSync(`cd "${path.join(rootDir, 'wp-content/themes')}" && zip -r -q "${path.join(distDir, 'gk-theme.zip')}" gk-theme -x "*.DS_Store*"`);
  console.log('✓ Created dist/gk-theme.zip');
} catch (e) {
  console.warn('Zip command fallback:', e.message);
}

console.log('Building dist/gk-core.zip...');
try {
  execSync(`cd "${path.join(rootDir, 'wp-content/plugins')}" && zip -r -q "${path.join(distDir, 'gk-core.zip')}" gk-core -x "*.DS_Store*"`);
  console.log('✓ Created dist/gk-core.zip');
} catch (e) {
  console.warn('Zip command fallback:', e.message);
}
