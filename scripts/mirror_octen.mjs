import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const origin = 'https://octen.ai';
const publicDir = path.join(root, 'public');
const htmlPath = path.join(root, 'index.html');

const toLocalPath = (url) => {
  if (url.startsWith('/_next/image?')) {
    const params = new URLSearchParams(url.slice('/_next/image?'.length));
    const source = params.get('url');
    return source ? decodeURIComponent(source) : url;
  }
  return url.split('?')[0];
};

const assetUrls = (html) => {
  const values = new Set();
  const attrPattern = /(?:src|href|poster)=["']([^"']+)["']/g;
  for (const match of html.matchAll(attrPattern)) {
    const value = match[1];
    if (value.startsWith('/') && value !== '/') values.add(toLocalPath(value));
  }
  const cssPattern = /url\((['"]?)(\/[^)'"\s]+)\1\)/g;
  for (const match of html.matchAll(cssPattern)) {
    if (match[2] !== '/') values.add(toLocalPath(match[2]));
  }
  return [...values];
};

const download = async (urlPath) => {
  const target = path.join(publicDir, urlPath.replace(/^\//, '').replaceAll('/', path.sep));
  await fs.mkdir(path.dirname(target), { recursive: true });
  const response = await fetch(origin + urlPath);
  if (!response.ok) throw new Error(`${response.status} ${urlPath}`);
  await fs.writeFile(target, Buffer.from(await response.arrayBuffer()));
};

const response = await fetch(origin);
if (!response.ok) throw new Error(`Unable to fetch ${origin}: ${response.status}`);
let html = await response.text();
const urls = [
  ...assetUrls(html),
  // Loaded by the marketing page after hydration (Unicorn background scene).
  '/_next/static/chunks/be15096d.49ea0512e4559286.js',
  '/_next/static/media/crypto_wasm_bg.73da4988.wasm',
  '/_next/static/media/early-access-model-bg.42199ea6.svg',
  '/_next/static/media/icon-claude-code.5bebf761.svg',
  '/_next/static/media/icon-cli.90b74a96.svg',
  '/_next/static/media/icon-codex.4e8595e2.svg',
  '/_next/static/media/icon-cursor.d7473059.svg',
  '/_next/static/media/icon-gemini-dark.2e7a376a.svg',
  '/_next/static/media/icon-globe-gray.aa3d9c55.svg',
  '/_next/static/media/icon-star.608bb3a8.svg',
  '/_next/static/media/logo.2d668011.svg',
  '/_next/static/media/nav-book-icon.aea95dac.svg',
  '/_next/static/media/octen-cover.dc74905e.png',
];

await fs.rm(publicDir, { recursive: true, force: true });
await fs.mkdir(publicDir, { recursive: true });

const failures = [];
for (const urlPath of urls) {
  try {
    await download(urlPath);
  } catch (error) {
    failures.push(String(error));
  }
}

// Next's optimized image endpoint is replaced with the original local asset.
html = html.replace(/\/_next\/image\?([^"'\s>]+)/g, (_full, query) => {
  const params = new URLSearchParams(query);
  const source = params.get('url');
  return source ? decodeURIComponent(source) : _full;
});

// Keep the SSR markup and runtime completely on the local origin.
html = html.replace(/(["'(])\/_next\//g, '$1/_next/');
html = html.replace(/(["'(])\/static\//g, '$1/static/');
const navWidthFix = `<style id="octen-local-nav-width-fix">
/* Keep Radix navigation panels stable while their height/content changes. */
.pc-nav_Viewport__lDMhI {
  width: auto !important;
  min-width: 0 !important;
  transition: height 0.16s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.pc-nav_Viewport__lDMhI[data-state="open"] {
  animation: octen-nav-fade-in 0.15s ease-out forwards !important;
}
.pc-nav_Content__Dr4EA {
  width: auto !important;
  max-width: calc(100vw - 32px) !important;
}
.pc-nav_Content__Dr4EA:has(.min-w-70) {
  padding: 20px !important;
  box-sizing: border-box !important;
}
@keyframes octen-nav-fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>`;
html = html.replace('</head>', `${navWidthFix}</head>`);
await fs.writeFile(htmlPath, html, 'utf8');

console.log(`Mirrored ${urls.length - failures.length}/${urls.length} assets from ${origin}`);
if (failures.length) {
  console.warn('Some assets could not be mirrored:');
  for (const failure of failures) console.warn(failure);
}
