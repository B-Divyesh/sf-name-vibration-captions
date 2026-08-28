import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const dist = new URL('../dist/', import.meta.url);
const index = await readFile(new URL('index.html', dist), 'utf8');
const assetNames = [...index.matchAll(/(?:src|href)="(\/assets\/[^"?]+)/g)].map((match) => match[1]).sort().join('|');
const buildVersion = createHash('sha256').update(assetNames).digest('hex').slice(0, 12);
const serviceWorker = new URL('sw.js', dist);
const source = await readFile(serviceWorker, 'utf8');
if (!source.includes('__BUILD_VERSION__')) throw new Error('Service worker build version placeholder is missing.');
await writeFile(serviceWorker, source.replaceAll('__BUILD_VERSION__', buildVersion));
const manifest = new URL('manifest.webmanifest', dist);
const manifestSource = await readFile(manifest, 'utf8');
if (!manifestSource.includes('__BUILD_VERSION__')) throw new Error('Manifest build version placeholder is missing.');
await writeFile(manifest, manifestSource.replaceAll('__BUILD_VERSION__', buildVersion));

for (const route of ['privacy', 'terms']) {
  await mkdir(new URL(`${route}/`, dist), { recursive: true });
  await copyFile(new URL('index.html', dist), new URL(`${route}/index.html`, dist));
}

console.log(`Static legal routes created; service worker cache ${buildVersion}.`);
