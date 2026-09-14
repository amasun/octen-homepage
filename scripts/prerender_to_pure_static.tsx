import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import components
import { Navbar } from '../src/components/Navbar';
import { Hero } from '../src/components/Hero';
import { ArchitectureComparison } from '../src/components/ArchitectureComparison';
import { MultimodalShowcase } from '../src/components/MultimodalShowcase';
import { RetrievalStack } from '../src/components/RetrievalStack';
import { BuiltOnOcten } from '../src/components/BuiltOnOcten';
import { BenchmarkSection } from '../src/components/BenchmarkSection';
import { QuickstartSection } from '../src/components/QuickstartSection';
import { Footer } from '../src/components/Footer';

// Import Vercel components
import { VercelHero } from '../src/components/vercel/VercelHero';
import { VercelCaseStudies } from '../src/components/vercel/VercelCaseStudies';
import { VercelRecentlyShipped } from '../src/components/vercel/VercelRecentlyShipped';
import { VercelEcosystem } from '../src/components/vercel/VercelEcosystem';
import { VercelFooter } from '../src/components/vercel/VercelFooter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const assetsDir = path.join(distDir, 'assets');

// Read CSS file
const files = fs.readdirSync(assetsDir);
const cssFile = files.find(f => f.endsWith('.css'));
if (!cssFile) {
  console.error('CSS file not found in dist/assets!');
  process.exit(1);
}
const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8');

interface StaticPageProps {
  site: 'octen' | 'vercel';
  version: 'v1' | 'v2' | 'v3';
}

function StaticPage({ site, version }: StaticPageProps) {
  const isV2 = version === 'v2';
  const modeClass = version === 'v1' ? 'mode-v1-standard' : version === 'v3' ? 'mode-v3-pro-max' : 'mode-v2-vision-corrected';

  return (
    <div className={`app-root ${modeClass}`} style={{ minHeight: '100vh', backgroundColor: '#050806', color: '#fff', position: 'relative' }}>
      {isV2 && <div className="grid-overlay" />}
      <Navbar activeSite={site} onToggleSite={() => {}} />
      <main>
        {site === 'octen' ? (
          <>
            <Hero version={version} />
            <ArchitectureComparison />
            <MultimodalShowcase version={version} />
            <RetrievalStack version={version} />
            <BuiltOnOcten version={version} />
            <BenchmarkSection version={version} />
            <QuickstartSection version={version} />
            <Footer version={version} />
          </>
        ) : (
          <>
            <VercelHero version={version} />
            <VercelCaseStudies />
            <VercelRecentlyShipped version={version} />
            <VercelEcosystem version={version} />
            <QuickstartSection version={version} />
            <VercelFooter />
          </>
        )}
      </main>
    </div>
  );
}

const targets = [
  { file: 'index1_v1.html', site: 'octen', version: 'v1', title: 'Octen Search Infrastructure — Result 1 (Pure MD+JSON Spec)' },
  { file: 'index1_v2.html', site: 'octen', version: 'v2', title: 'Octen Search Infrastructure — Result 2 (Vision Corrected High-Fidelity)' },
  { file: 'index1_v3.html', site: 'octen', version: 'v3', title: 'Octen Search Infrastructure — Result 3 (UI/UX Pro Max Design Upgrade)' },
  { file: 'index2_v1.html', site: 'vercel', version: 'v1', title: 'Vercel Agentic Infrastructure — Result 1 (Pure MD+JSON Spec)' },
  { file: 'index2_v2.html', site: 'vercel', version: 'v2', title: 'Vercel Agentic Infrastructure — Result 2 (Vision Corrected High-Fidelity)' },
  { file: 'index2_v3.html', site: 'vercel', version: 'v3', title: 'Vercel Agentic Infrastructure — Result 3 (UI/UX Pro Max Design Upgrade)' },
] as const;

targets.forEach(({ file, site, version, title }) => {
  const markup = ReactDOMServer.renderToString(<StaticPage site={site} version={version} />);
  const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
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
    <div id="root">${markup}</div>
  </body>
</html>`;

  fs.writeFileSync(path.join(rootDir, file), fullHtml, 'utf-8');
  fs.writeFileSync(path.join(distDir, file), fullHtml, 'utf-8');
  console.log(`Pre-rendered pure static HTML (no JS/node needed to view): ${file}`);
});

// Copy comparison.html to dist/comparison.html and dist/index.html so Vercel root serves the dashboard directly
const comparisonContent = fs.readFileSync(path.join(rootDir, 'comparison.html'), 'utf-8');
fs.writeFileSync(path.join(distDir, 'comparison.html'), comparisonContent, 'utf-8');
fs.writeFileSync(path.join(distDir, 'index.html'), comparisonContent, 'utf-8');

// Copy reference screenshots & spec files to dist/
const filesToCopy = [
  'ref_part_1.png',
  'ref_part_2.png',
  'ref_part_3.png',
  'ref_part_4.png',
  'octen_website_content.md',
  'vercel_website_content.md',
  'octen_ui_spec.json',
  'octen_brand.json'
];

filesToCopy.forEach((fileName) => {
  const srcPath = path.join(rootDir, fileName);
  const destPath = path.join(distDir, fileName);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
  }
});

console.log('Successfully generated 100% self-contained dist/ folder ready to drag-and-drop onto Vercel!');
