import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const assetsDir = path.join(distDir, 'assets');

const files = fs.readdirSync(assetsDir);
const cssFile = files.find(f => f.endsWith('.css'));
const jsFile = files.find(f => f.endsWith('.js'));

if (!cssFile || !jsFile) {
  console.error('CSS or JS bundle not found in dist/assets!');
  process.exit(1);
}

const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8');
const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf-8');

const targets = [
  { file: 'index1_v1.html', site: 'octen', version: 'v1', title: 'Octen Search Infrastructure — Result 1 (Pure MD+JSON Spec)' },
  { file: 'index1_v2.html', site: 'octen', version: 'v2', title: 'Octen Search Infrastructure — Result 2 (Vision Corrected High-Fidelity)' },
  { file: 'index1_v3.html', site: 'octen', version: 'v3', title: 'Octen Search Infrastructure — Result 3 (UI/UX Pro Max Design Upgrade)' },
  { file: 'index2_v1.html', site: 'vercel', version: 'v1', title: 'Vercel Agentic Infrastructure — Result 1 (Pure MD+JSON Spec)' },
  { file: 'index2_v2.html', site: 'vercel', version: 'v2', title: 'Vercel Agentic Infrastructure — Result 2 (Vision Corrected High-Fidelity)' },
  { file: 'index2_v3.html', site: 'vercel', version: 'v3', title: 'Vercel Agentic Infrastructure — Result 3 (UI/UX Pro Max Design Upgrade)' },
];

targets.forEach(({ file, site, version, title }) => {
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
${cssContent}
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script>
      (function() {
        try {
          var url = new URL(window.location.href);
          url.searchParams.set('site', '${site}');
          url.searchParams.set('v', '${version}');
          window.history.replaceState({}, '', url.toString());
        } catch(e) {}
      })();
    </script>
    <script>
${jsContent}
    </script>
  </body>
</html>`;

  fs.writeFileSync(path.join(rootDir, file), html, 'utf-8');
  console.log(`Generated standalone single HTML: ${file}`);
});
