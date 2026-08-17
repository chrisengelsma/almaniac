import { createServer } from 'node:http';
import { readFile, mkdir, copyFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const storeDir = path.join(repoRoot, 'store');
const assetsDir = path.join(storeDir, 'assets');
const siteAssets = path.resolve(repoRoot, '../../box/dev/public/apps/almaniac/assets');
const siteFonts = path.join(siteAssets, 'fonts');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

async function ensureAssets() {
  await mkdir(assetsDir, { recursive: true });

  const copies = [
    ['distinct-waves.svg', path.join(siteAssets, 'distinct-waves.svg')],
    ['device-android.png', path.join(siteAssets, 'device-android.png')],
    ['pacifico-latin.woff2', path.join(siteFonts, 'pacifico-latin.woff2')],
  ];

  for (const [name, source] of copies) {
    const dest = path.join(assetsDir, name);
    try {
      await access(source);
      await copyFile(source, dest);
    } catch {
      throw new Error(`Missing asset: ${source}`);
    }
  }
}

function startServer() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      const relative = urlPath === '/' ? 'feature-graphic.html' : urlPath.replace(/^\//, '');
      const filePath = path.join(storeDir, relative);

      if (!filePath.startsWith(storeDir)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      try {
        const data = await readFile(filePath);
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

async function generate() {
  await ensureAssets();

  const server = await startServer();
  const { port } = server.address();
  const url = `http://127.0.0.1:${port}/feature-graphic.html`;
  const outPath = path.join(storeDir, 'google-play', 'en-US', 'feature-graphic.png');

  await mkdir(path.dirname(outPath), { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1024, height: 500 },
    deviceScaleFactor: 1,
  });

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  await page.screenshot({
    path: outPath,
    type: 'png',
    clip: { x: 0, y: 0, width: 1024, height: 500 },
  });

  await browser.close();
  server.close();

  console.log(`Feature graphic saved to ${outPath}`);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
