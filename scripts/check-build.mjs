import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('../dist/', import.meta.url);
const index = await readFile(new URL('index.html', root), 'utf8');
if (!index.includes('<html lang="en">') || !index.includes('<title>')) throw new Error('Built HTML is missing title or language.');

const assets = join(root.pathname, 'assets');
for (const filename of await readdir(assets)) {
  const size = (await stat(join(assets, filename))).size;
  if (/\.js$/.test(filename) && size > 200 * 1024) throw new Error(`${filename} exceeds the 200 KB JS budget.`);
  if (/\.css$/.test(filename) && size > 50 * 1024) throw new Error(`${filename} exceeds the 50 KB CSS budget.`);
}
console.log('Build budgets passed.');
