import { mkdir, readFile, writeFile } from 'node:fs/promises';
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

const routeMeta = {
  demo: ['Demo — Name Tap', 'Try Name Tap with isolated sample phrases and captions. Nothing is saved.'],
  privacy: ['Privacy — Name Tap', 'How Name Tap keeps phrases and temporary captions on your device.'],
  terms: ['Terms — Name Tap', 'Terms for using Name Tap as an assistive phrase alert.'],
  '404': ['Page not found — Name Tap', 'This Name Tap page does not exist. Return home or try the sample.']
};

for (const route of Object.keys(routeMeta)) {
  const [title, description] = routeMeta[route];
  const routeHtml = index
    .replace(/<title>[^<]+<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]+" \/>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical" href="[^"]+" \/>/, `<link rel="canonical" href="https://name-vibration-captions.sociobot.in/${route}" />`)
    .replace(/<meta property="og:title" content="[^"]+" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]+" \/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url" content="[^"]+" \/>/, `<meta property="og:url" content="https://name-vibration-captions.sociobot.in/${route}" />`)
    .replace(/<meta name="twitter:title" content="[^"]+" \/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]+" \/>/, `<meta name="twitter:description" content="${description}" />`);
  if (route === '404') {
    await writeFile(new URL('not-found.html', dist), routeHtml);
  } else {
    await mkdir(new URL(`${route}/`, dist), { recursive: true });
    await writeFile(new URL(`${route}/index.html`, dist), routeHtml);
  }
}

console.log(`Static routes created; service worker cache ${buildVersion}.`);
