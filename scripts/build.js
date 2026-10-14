/**
 * Build Script - Prepares distribution assets and runs packaging
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('--- Starting Global Kids Preschool Build ---');

// 1. Run contrast check
console.log('Running contrast verification...');
execSync('node scripts/contrast-check.js', { stdio: 'inherit' });

// 2. Package zips
console.log('\nPackaging WordPress Theme & Plugin distribution archives...');
require('./package-zips.js');

// 3. Static site for Vercel / static hosts
console.log('\nExporting static preview site to public/...');
require('./export-static.js');

console.log('\nBuild completed successfully!');
