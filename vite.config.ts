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

function liveReloadPlugin() {
  return {
    name: 'live-reload-public-and-assets',
    configureServer(server: any) {
      const publicPath = path.resolve(process.cwd(), 'public');
      server.watcher.add(publicPath);
      server.watcher.on('change', (changedFile: string) => {
        if (changedFile.includes('public') || changedFile.includes('index.html')) {
          server.ws.send({ type: 'full-reload', path: '*' });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localNextImageProxy(), liveReloadPlugin()],
  server: {
    port: 3001,
    strictPort: true,
    host: '0.0.0.0',
    open: false,
  },
});
