import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

const imageMime: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function localNextImageProxy() {
  const handler = (req: any, res: any, next: any) => {
    try {
      const requestUrl = new URL(req.url || '/', 'http://localhost');
      const source = requestUrl.searchParams.get('url');
      if (!source || !source.startsWith('/_next/static/')) return next();

      const relative = source.replace(/^\//, '').replaceAll('/', path.sep);
      const filePath = path.resolve(process.cwd(), 'public', relative);
      const publicRoot = path.resolve(process.cwd(), 'public') + path.sep;
      if (!filePath.startsWith(publicRoot) || !fs.existsSync(filePath)) return next();

      res.statusCode = 200;
      res.setHeader('Content-Type', imageMime[path.extname(filePath).toLowerCase()] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      fs.createReadStream(filePath).pipe(res);
    } catch {
      next();
    }
  };

  return {
    name: 'local-next-image-proxy',
    configureServer(server: any) {
      server.middlewares.use('/_next/image', handler);
    },
    configurePreviewServer(server: any) {
      server.middlewares.use('/_next/image', handler);
    },
  };
}

function htmlPartialsPlugin() {
  return {
    name: 'html-partials-plugin',
    transformIndexHtml: {
      order: 'pre' as const,
      handler(html: string) {
        const includeRegex = /<include\s+src=["']([^"']+)["']\s*(?:\/>|><\/include>)/g;
        let depth = 0;
        while (includeRegex.test(html) && depth < 10) {
          depth++;
          html = html.replace(includeRegex, (_match, srcPath) => {
            const resolvedPath = path.resolve(process.cwd(), srcPath);
            if (fs.existsSync(resolvedPath)) {
              return fs.readFileSync(resolvedPath, 'utf8');
            }
            console.warn(`[html-partials] Missing partial file: ${srcPath} (resolved: ${resolvedPath})`);
            return _match;
          });
        }
        return html;
      },
    },
  };
}

function liveReloadPlugin() {
  return {
    name: 'live-reload-public-and-assets',
    configureServer(server: any) {
      const publicPath = path.resolve(process.cwd(), 'public');
      const sectionsPath = path.resolve(process.cwd(), 'src', 'sections');
      server.watcher.add(publicPath);
      server.watcher.add(sectionsPath);
      server.watcher.on('change', (changedFile: string) => {
        if (
          changedFile.includes('public') ||
          changedFile.includes('index.html') ||
          changedFile.includes('sections')
        ) {
          server.ws.send({ type: 'full-reload', path: '*' });
        }
      });
    },
  };
}

function verticalSearchPlugin() {
  return {
    name: 'vertical-search-support',
    configureServer(server: any) {
      server.middlewares.use((req: any, _res: any, next: any) => {
        const url = req.url || '';
        if (url === '/vertical-search' || url === '/vertical-search/' || url.startsWith('/vertical-search?')) {
          req.url = '/vertical search/index.html' + (url.includes('?') ? url.slice(url.indexOf('?')) : '');
        } else if (url.startsWith('/vertical-search/')) {
          req.url = '/vertical search/' + url.slice('/vertical-search/'.length);
        }
        next();
      });
    },
    closeBundle() {
      const srcDir = path.resolve(process.cwd(), 'vertical search', 'images');
      const destDir = path.resolve(process.cwd(), 'dist', 'vertical search', 'images');
      if (fs.existsSync(srcDir)) {
        fs.mkdirSync(destDir, { recursive: true });
        fs.cpSync(srcDir, destDir, { recursive: true });
      }

      // Mirror to dist/vertical-search to allow clean, space-free URL routing on Vercel
      const vsSrc = path.resolve(process.cwd(), 'dist', 'vertical search');
      const vsDest = path.resolve(process.cwd(), 'dist', 'vertical-search');
      if (fs.existsSync(vsSrc)) {
        fs.mkdirSync(vsDest, { recursive: true });
        fs.cpSync(vsSrc, vsDest, { recursive: true });
      }
    },
  };
}

export default defineConfig({
  plugins: [htmlPartialsPlugin(), react(), localNextImageProxy(), liveReloadPlugin(), verticalSearchPlugin()],
  server: {
    port: 3001,
    strictPort: true,
    host: '0.0.0.0',
    open: false,
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(process.cwd(), 'index.html'),
        backup: path.resolve(process.cwd(), 'backup-modules.html'),
        verticalSearch: path.resolve(process.cwd(), 'vertical search', 'index.html'),
      },
    },
  },
});
