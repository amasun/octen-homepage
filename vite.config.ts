import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { zipSync } from 'fflate';

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

/**
 * 源码下载:把当前方案的源码(含 HANDOVER.md、CLAUDE.md)打成 zip,供左侧方案切换浮窗的下载按钮使用。
 *  - 开发:中间件 /octen-homepage-source.zip 实时打包;构建:输出到 dist/octen-homepage-source.zip
 *  - 文件清单优先取 git(已跟踪 + 未忽略的新文件),没有 git(如部署环境)时遍历目录;
 *    始终排除 node_modules、dist、.git、.vite*、.vercel、feedback、*.zip、.DS_Store
 */
const SOURCE_ZIP = 'octen-homepage-source.zip';
function listSourceFiles(): string[] {
  const root = process.cwd();
  const skipDir = /(^|\/)(node_modules|dist|\.git|\.vercel|feedback|\.vite[^/]*|\.pnpm-store)(\/|$)/;
  const skipFile = /(^|\/)\.DS_Store$|\.zip$/;
  let files: string[] = [];
  try {
    files = execSync('git ls-files -co --exclude-standard', { cwd: root, stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 })
      .toString().split('\n').filter(Boolean);
  } catch {
    const walk = (dir: string) => {
      for (const ent of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
        const rel = dir ? `${dir}/${ent.name}` : ent.name;
        if (skipDir.test(rel)) continue;
        if (ent.isDirectory()) walk(rel); else files.push(rel);
      }
    };
    walk('');
  }
  return files.filter((f) => !skipDir.test(f) && !skipFile.test(f) && fs.existsSync(path.join(root, f)));
}
function buildSourceZip(): Uint8Array {
  const root = process.cwd();
  const stored = /\.(png|jpe?g|webp|gif|avif|mp4|webm|woff2?|zip)$/i;   // 已压缩的媒体不再压缩,加快打包
  const data: Record<string, [Uint8Array, { level: 0 | 6 }]> = {};
  for (const f of listSourceFiles()) {
    data[`octen-homepage/${f}`] = [new Uint8Array(fs.readFileSync(path.join(root, f))), { level: stored.test(f) ? 0 : 6 }];
  }
  return zipSync(data);
}
function sourceZipPlugin() {
  return {
    name: 'source-zip',
    configureServer(server: any) {
      server.middlewares.use(`/${SOURCE_ZIP}`, (_req: any, res: any) => {
        try {
          const buf = Buffer.from(buildSourceZip());
          res.setHeader('Content-Type', 'application/zip');
          res.setHeader('Content-Length', String(buf.length));
          res.setHeader('Content-Disposition', `attachment; filename="${SOURCE_ZIP}"`);
          res.end(buf);
        } catch (e) {
          res.statusCode = 500;
          res.end('source zip failed');
        }
      });
    },
    generateBundle(this: any) {
      this.emitFile({ type: 'asset', fileName: SOURCE_ZIP, source: buildSourceZip() });
    },
  };
}

function detectGitPlan(): 'A' | 'B' | 'C' {
  let branch = process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH || '';
  if (!branch) {
    try {
      branch = execSync('git rev-parse --abbrev-ref HEAD', {
        cwd: process.cwd(),
        stdio: ['ignore', 'pipe', 'ignore'],
      })
        .toString()
        .trim();
    } catch {
      branch = '';
    }
  }
  const normalized = branch.toLowerCase();
  if (normalized.includes('planb')) return 'B';
  if (normalized.includes('planc')) return 'C';
  return 'A';
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
        return html.replaceAll('__OCTEN_PLAN__', detectGitPlan());
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
      server.middlewares.use((req: any, res: any, next: any) => {
        const rawUrl = req.url || '';
        const [pathname, search] = rawUrl.split('?');
        const query = search ? `?${search}` : '';

        // 规范化：无尾部斜杠时 301 重定向，保证浏览器解析 ./css/... 与 ./js/... 的 Base URL 正确
        if (pathname === '/vertical-search') {
          res.statusCode = 301;
          res.setHeader('Location', `/vertical-search/${query}`);
          res.end();
          return;
        }

        if (pathname === '/vertical-search/' || pathname === '/vertical-search/index.html') {
          req.url = `/vertical search/index.html${query}`;
        } else if (rawUrl.startsWith('/vertical-search/')) {
          req.url = '/vertical search/' + rawUrl.slice('/vertical-search/'.length);
        }
        next();
      });
    },
    configurePreviewServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const rawUrl = req.url || '';
        const [pathname, search] = rawUrl.split('?');
        const query = search ? `?${search}` : '';

        if (pathname === '/vertical-search') {
          res.statusCode = 301;
          res.setHeader('Location', `/vertical-search/${query}`);
          res.end();
          return;
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
  // 换一个缓存目录名:依赖 URL 随之改变,绕开浏览器里缓存的旧依赖块(否则会出现两份 React,React 组件如 Search Plan 渲染为空)
  cacheDir: 'node_modules/.vite-v2',
  plugins: [htmlPartialsPlugin(), react(), localNextImageProxy(), liveReloadPlugin(), verticalSearchPlugin(), sourceZipPlugin()],
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
        benchmarks: path.resolve(process.cwd(), 'benchmarks.html'),
        verticalSearch: path.resolve(process.cwd(), 'vertical search', 'index.html'),
      },
    },
  },
});
