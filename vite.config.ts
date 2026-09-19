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

export default defineConfig({
  plugins: [htmlPartialsPlugin(), react(), localNextImageProxy(), liveReloadPlugin()],
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
      },
    },
  },
});
