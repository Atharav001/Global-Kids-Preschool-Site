/**
 * Pre-render all preview routes into public/ for Vercel static deployment.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public');
const ASSETS_SRC = path.join(ROOT, 'wp-content/themes/gk-theme/assets');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

function routeToFile(routePath) {
  if (routePath === '/') {
    return path.join(OUT, 'index.html');
  }
  return path.join(OUT, routePath.slice(1), 'index.html');
}

function main() {
  if (!process.env.SITE_URL) {
    const vercelHost = process.env.VERCEL_URL;
    process.env.SITE_URL = vercelHost ? `https://${vercelHost}` : 'https://global-kids-preschool.vercel.app';
  }

  // eslint-disable-next-line global-require
  const { ROUTES, resolvePage } = require('../server/server.js');

  if (fs.existsSync(OUT)) {
    fs.rmSync(OUT, { recursive: true, force: true });
  }
  fs.mkdirSync(OUT, { recursive: true });

  copyDir(ASSETS_SRC, path.join(OUT, 'assets'));

  let count = 0;
  for (const routePath of Object.keys(ROUTES)) {
    const { html, status } = resolvePage(routePath, {});
    const outFile = routeToFile(routePath);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, html, 'utf8');
    count += 1;
    if (status !== 200) {
      console.warn(`Warning: route ${routePath} returned status ${status}`);
    }
  }

  const notFound = resolvePage('/__static-export-404__', {});
  fs.writeFileSync(path.join(OUT, '404.html'), notFound.html, 'utf8');

  console.log(`Static export: ${count} pages → ${OUT}`);
}

main();
