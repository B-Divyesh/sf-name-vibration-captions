import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = process.env.AUDIT_URL ?? 'https://name-vibration-captions.sociobot.in';
const browser = await chromium.launch();

async function freshPage(viewport = { width: 390, height: 844 }) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  return { context, page, errors };
}

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
  const { context, page, errors } = await freshPage(viewport);
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  const box = await page.locator('.demo-sample').boundingBox();
  assert(box && box.y < viewport.height && box.y + box.height > 0, `sample missed ${viewport.width}×${viewport.height}`);
  assert.equal(await page.getByRole('heading', { level: 1, name: 'Maya was heard' }).count(), 1);
  assert.deepEqual(errors, []);
  await context.close();
}

{
  const { context, page, errors } = await freshPage();
  const offOrigin = [];
  page.on('request', (request) => { if (new URL(request.url()).origin !== new URL(base).origin) offOrigin.push(request.url()); });
  await page.goto(`${base}/`);
  await page.getByLabel('Name or phrase, with other spellings').fill('REAL PRIVATE PHRASE');
  await page.getByRole('button', { name: 'Add phrase' }).click();
  await page.goto(`${base}/?demo=1`);
  assert.equal(await page.getByText('REAL PRIVATE PHRASE').count(), 0);
  await page.getByRole('button', { name: 'Remove Maya' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  assert.equal(await page.getByText('Maya', { exact: true }).count(), 1);
  await page.getByRole('button', { name: 'Replay sample alert' }).click();
  assert.match(await page.locator('.demo-sample').getAttribute('class'), /cue-active/);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.getByText('REAL PRIVATE PHRASE').waitFor();
  assert.equal(await page.getByText('REAL PRIVATE PHRASE').count(), 1);
  assert.deepEqual(offOrigin, []);
  assert.deepEqual(errors, []);
  await context.close();
}

{
  const { context, page } = await freshPage();
  await page.addInitScript(() => {
    window.__supportCalls = [];
    class LocalRecognition extends EventTarget {
      static available({ langs }) {
        const language = langs[0];
        window.__supportCalls.push(language);
        if (language === 'en-US') return Promise.resolve('available');
        if (language === 'en-IN') return Promise.resolve('downloadable');
        if (language === 'en-GB') return Promise.resolve('unavailable');
        if (language === 'hi-IN') return Promise.reject(new Error('fixture rejection'));
        return Promise.resolve('available');
      }
      processLocally = true;
      start() {}
      stop() {}
      abort() {}
    }
    LocalRecognition.prototype.processLocally = true;
    Object.defineProperty(window, 'SpeechRecognition', { value: LocalRecognition, configurable: true });
  });
  await page.goto(`${base}/?demo=1`);
  await page.locator('[data-support="ready"]').waitFor();
  await page.getByLabel('Conversation language').selectOption('en-IN');
  await page.locator('[data-support="downloadable"]').waitFor();
  await page.getByLabel('Conversation language').selectOption('en-GB');
  await page.locator('[data-support="unavailable"]').waitFor();
  assert.equal(await page.getByText('Local captions are available').count(), 0);
  await page.getByLabel('Conversation language').selectOption('hi-IN');
  await page.locator('[data-support="unknown"]').waitFor();
  await page.getByLabel('Conversation language').selectOption('fr-FR');
  await page.locator('[data-support="ready"]').waitFor();
  assert.deepEqual(await page.evaluate(() => window.__supportCalls), ['en-US', 'en-IN', 'en-GB', 'hi-IN', 'fr-FR']);
  await context.close();
}

{
  const { context, page } = await freshPage();
  await page.goto(`${base}/?demo=1`);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  assert.equal(await page.getByText('Demo — sample data, nothing is saved').count(), 1);
  assert.equal(await page.getByRole('heading', { level: 1, name: 'Maya was heard' }).count(), 1);
  await context.close();
}

{
  const { context, page, errors } = await freshPage({ width: 1440, height: 1000 });
  const routes = [
    ['/', 'Name Tap — alerts when your phrase is spoken'],
    ['/?demo=1', 'Demo — Name Tap'],
    ['/privacy', 'Privacy — Name Tap'],
    ['/terms', 'Terms — Name Tap']
  ];
  for (const [path, title] of routes) {
    await page.goto(`${base}${path}`);
    assert.equal(await page.title(), title);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('main').count(), 1);
    const axe = await new AxeBuilder({ page }).analyze();
    assert.deepEqual(axe.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical'), []);
  }
  await page.goto(`${base}/privacy`);
  assert.equal(await page.getByRole('heading', { level: 1 }).textContent(), 'How Name Tap handles your data');
  assert.doesNotMatch(await page.locator('main').textContent(), /license token|prior purchase|short security logs/i);
  assert.deepEqual(errors, []);
  const response = await page.goto(`${base}/does-not-exist`);
  assert.equal(response?.status(), 404);
  assert.equal(await page.getByRole('heading', { level: 1 }).textContent(), 'Page not found');
  assert.deepEqual(errors.filter((message) => !message.includes('status of 404')), []);
  await context.close();
}

await browser.close();
console.log(`Live cold audit passed: ${base}`);
