import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

const demo = '/?demo=1';

test('landing sample action opens the matched board inside the first viewport', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Maya was heard' })).toBeVisible();
  const sample = await page.locator('.demo-sample').boundingBox();
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  expect(sample).not.toBeNull();
  expect(sample!.y).toBeLessThan(viewportHeight);
  expect(sample!.y + sample!.height).toBeGreaterThan(0);
});

test('@claim:vibration-on-match requests a vibration and shows the matched phrase', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, 'vibrate', { value: (pattern: number[]) => { (window as any).__vibration = pattern; return true; }, configurable: true }); });
  await page.goto(demo);
  await page.getByRole('button', { name: 'Replay sample alert' }).click();
  await expect(page.getByRole('heading', { name: 'Maya was heard' })).toBeVisible();
  expect(await page.evaluate(() => (window as any).__vibration)).toEqual([220, 90, 320]);
});

test('@claim:no-recording completes the sample session without recording media', async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).__recordings = 0;
    Object.defineProperty(window, 'MediaRecorder', { value: class { constructor() { (window as any).__recordings += 1; } }, configurable: true });
  });
  await page.goto(demo);
  await page.getByLabel(/I told people nearby/).check();
  await page.getByRole('button', { name: /Start listening/ }).click();
  await page.getByRole('button', { name: 'Stop listening' }).click();
  expect(await page.evaluate(() => (window as any).__recordings)).toBe(0);
  expect(await page.evaluate(async () => (await indexedDB.databases()).some((db) => db.name?.includes('record')))).toBe(false);
});

test('@claim:no-account runs the sample without authentication traffic', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto(demo);
  await page.getByRole('button', { name: 'Replay sample alert' }).click();
  expect(requests.some((url) => /login|auth|account|session\/token/i.test(url))).toBe(false);
});

test('@claim:spelling-variants parses Maya, Maia and matches the entered alternate spelling', async ({ page }) => {
  await page.addInitScript(() => {
    class LocalRecognition extends EventTarget {
      static available = async () => 'available';
      processLocally = true;
      lang = '';
      continuous = false;
      interimResults = false;
      maxAlternatives = 1;
      onresult: ((event: any) => void) | null = null;
      onerror = null;
      onend = null;
      start() {
        window.setTimeout(() => this.onresult?.({
          resultIndex: 0,
          results: { 0: { 0: { transcript: 'Can Maia bring the blue folder?', confidence: 1 }, isFinal: true, length: 1 }, length: 1 }
        }), 0);
      }
      stop() {}
      abort() {}
    }
    (LocalRecognition.prototype as any).processLocally = true;
    Object.defineProperty(window, 'SpeechRecognition', { value: LocalRecognition, configurable: true });
  });
  await page.goto(demo);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.getByLabel('Name or phrase, with other spellings').fill('Maya, Maia');
  await page.getByRole('button', { name: 'Add phrase' }).click();
  await expect(page.getByText('Maya', { exact: true })).toBeVisible();
  await expect(page.getByText('Other spellings: Maia')).toBeVisible();
  await page.getByLabel(/I told people nearby/).check();
  await page.getByRole('button', { name: /Start listening/ }).click();
  await expect(page.getByText('Can Maia bring the blue folder?')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: 'Maya' })).toBeVisible();
});

test('@claim:device-only-data sends no phrase or caption off origin', async ({ page }) => {
  const offOrigin: string[] = [];
  page.on('request', (request) => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') offOrigin.push(request.url()); });
  await page.goto(demo);
  await page.getByRole('button', { name: 'Replay sample alert' }).click();
  await page.getByLabel('Name or phrase, with other spellings').fill('Blue folder');
  await page.getByRole('button', { name: 'Add phrase' }).click();
  expect(offOrigin).toEqual([]);
});

test('@claim:free-tier allows three phrases, alerts, and export at no charge', async ({ page, context }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, 'vibrate', { value: () => true, configurable: true }); });
  await page.goto(demo);
  await context.setOffline(true);
  await page.getByLabel('Name or phrase, with other spellings').fill('Blue folder');
  await page.getByRole('button', { name: 'Add phrase' }).click();
  await expect(page.getByText('3 / 3 phrases')).toBeVisible();
  await page.getByRole('button', { name: 'Test vibration for Blue folder' }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export settings' }).click();
  expect((await download).suggestedFilename()).toBe('name-tap-settings.json');
});

test('@claim:local-only-recognition sets the local flag and refuses a remote-only browser', async ({ page }) => {
  await page.addInitScript(() => {
    class RemoteOnlyRecognition extends EventTarget { start() {} stop() {} abort() {} }
    Object.defineProperty(window, 'SpeechRecognition', { value: RemoteOnlyRecognition, configurable: true });
  });
  await page.goto(demo);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.getByLabel('Name or phrase, with other spellings').fill('Maya');
  await page.getByRole('button', { name: 'Add phrase' }).click();
  await page.getByLabel(/I told people nearby/).check();
  await page.getByRole('button', { name: /Start listening/ }).click();
  await expect(page.getByRole('alert')).toContainText('cannot guarantee on-device captions');
});

test('@claim:support-detection handles every language-aware capability result without a false positive', async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).__supportCalls = [];
    class LocalRecognition extends EventTarget {
      static available({ langs }: { langs: string[] }) {
        const language = langs[0];
        (window as any).__supportCalls.push(language);
        if (language === 'en-US') return new Promise((resolve) => { (window as any).__resolveSupport = resolve; });
        if (language === 'en-IN') return Promise.resolve('downloadable');
        if (language === 'en-GB') return Promise.resolve('unavailable');
        if (language === 'hi-IN') return Promise.reject(new Error('probe failed'));
        return Promise.resolve('available');
      }
      processLocally = true;
      start() {}
      stop() {}
      abort() {}
    }
    (LocalRecognition.prototype as any).processLocally = true;
    Object.defineProperty(window, 'SpeechRecognition', { value: LocalRecognition, configurable: true });
  });
  await page.goto(demo);
  await expect(page.locator('[data-support="checking"]')).toContainText('Checking local captions');
  await page.evaluate(() => (window as any).__resolveSupport('available'));
  await expect(page.locator('[data-support="ready"]')).toHaveText(/Local captions are available/);
  await page.getByLabel('Conversation language').selectOption('en-IN');
  await expect(page.locator('[data-support="downloadable"]')).toContainText('need a language download');
  await page.getByLabel('Conversation language').selectOption('en-GB');
  await expect(page.locator('[data-support="unavailable"]')).toContainText('unavailable for this language');
  await expect(page.getByText('Local captions are available')).toHaveCount(0);
  await page.getByLabel('Conversation language').selectOption('hi-IN');
  await expect(page.locator('[data-support="unknown"]')).toContainText('cannot confirm');
  await page.getByLabel('Conversation language').selectOption('fr-FR');
  await expect(page.locator('[data-support="ready"]')).toContainText('available');
  expect(await page.evaluate(() => (window as any).__supportCalls)).toEqual(['en-US', 'en-IN', 'en-GB', 'hi-IN', 'fr-FR']);
});

test('@claim:explicit-session does not start recognition before consent and Start listening', async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).__starts = 0;
    class LocalRecognition extends EventTarget { processLocally = true; start() { (window as any).__starts += 1; } stop() {} abort() {} }
    (LocalRecognition.prototype as any).processLocally = true;
    Object.defineProperty(window, 'SpeechRecognition', { value: LocalRecognition, configurable: true });
  });
  await page.goto('/');
  await page.getByLabel('Name or phrase, with other spellings').fill('Maya');
  await page.getByRole('button', { name: 'Add phrase' }).click();
  expect(await page.evaluate(() => (window as any).__starts)).toBe(0);
  await expect(page.getByRole('button', { name: /Start listening/ })).toBeDisabled();
});

test('@claim:captions-cleared removes temporary captions on stop', async ({ page }) => {
  await page.goto(demo);
  await page.getByLabel(/I told people nearby/).check();
  await page.getByRole('button', { name: /Start listening/ }).click();
  await expect(page.getByText('Could Maia bring the blue folder?')).toBeVisible();
  await page.getByRole('button', { name: 'Stop listening' }).click();
  await expect(page.getByText('Could Maia bring the blue folder?')).toHaveCount(0);
  expect(await page.evaluate(() => JSON.stringify({ ...localStorage }).includes('Could Maia'))).toBe(false);
});

test('@claim:local-settings keeps real phrases local and keeps demo changes in memory', async ({ page }) => {
  await page.goto(demo);
  await page.getByRole('button', { name: 'Remove Maya' }).click();
  await page.reload();
  await expect(page.getByText('Maya', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:')))).toEqual([]);
});

test('@claim:export-no-captions excludes temporary captions from settings JSON', async ({ page }) => {
  await page.goto(demo);
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export settings' }).click();
  const path = await (await downloadEvent).path();
  expect(path).toBeTruthy();
  const file = await readFile(path!, 'utf8');
  expect(file).toContain('Maya');
  expect(file).not.toContain('Can Maia bring the blue folder');
  expect(file).not.toContain('captions');
});

test('@claim:haptics requests the documented vibration pattern', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, 'vibrate', { value: (pattern: number[]) => { (window as any).__pattern = pattern; return true; }, configurable: true }); });
  await page.goto(demo);
  await page.getByRole('button', { name: 'Test vibration for Maya' }).click();
  expect(await page.evaluate(() => (window as any).__pattern)).toEqual([220, 90, 320]);
});

test('@claim:visual-alert shows a high-contrast matched state', async ({ page }) => {
  await page.goto(demo);
  await expect(page.getByText('High-contrast visual alert')).toBeVisible();
  await page.getByRole('button', { name: 'Replay sample alert' }).click();
  await expect(page.locator('.demo-sample')).toHaveClass(/cue-active/);
  const colors = await page.locator('.demo-sample').evaluate((element) => { const style = getComputedStyle(element); return [style.backgroundColor, style.color]; });
  expect(colors).toEqual(['rgb(201, 255, 56)', 'rgb(23, 23, 19)']);
  const contrast = await page.locator('.demo-sample').evaluate((element) => {
    const channel = (value: number) => { const normalized = value / 255; return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4; };
    const luminance = (rgb: number[]) => 0.2126 * channel(rgb[0]!) + 0.7152 * channel(rgb[1]!) + 0.0722 * channel(rgb[2]!);
    const parse = (value: string) => (value.match(/\d+/g) ?? []).slice(0, 3).map(Number);
    const style = getComputedStyle(element);
    const values = [luminance(parse(style.backgroundColor)), luminance(parse(style.color))].sort((a, b) => b - a);
    return (values[0]! + 0.05) / (values[1]! + 0.05);
  });
  expect(contrast).toBeGreaterThanOrEqual(4.5);
});

test('@claim:settings-round-trip exports in demo and imports into a clean real workspace', async ({ page }) => {
  await page.goto(demo);
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export settings' }).click();
  const path = await (await downloadEvent).path();
  const exported = await readFile(path!);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.locator('#import-file').setInputFiles({ name: 'name-tap-settings.json', mimeType: 'application/json', buffer: exported });
  await expect(page.getByText('Other spellings: Maia')).toBeVisible();
});

test('@claim:offline-reload opens the isolated sample after going offline', async ({ page, context }) => {
  await page.goto(demo);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('Maya was heard')).toBeVisible();
});

test('@claim:unsupported-browser explains why local captions cannot start', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'SpeechRecognition', { value: undefined, configurable: true });
    Object.defineProperty(window, 'webkitSpeechRecognition', { value: undefined, configurable: true });
  });
  await page.goto(demo);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.getByLabel('Name or phrase, with other spellings').fill('Maya');
  await page.getByRole('button', { name: 'Add phrase' }).click();
  await page.getByLabel(/I told people nearby/).check();
  await page.getByRole('button', { name: /Start listening/ }).click();
  await expect(page.getByRole('alert')).toContainText('Live captions are not available in this browser');
});

test('@claim:no-analytics loads and exercises demo with same-origin requests only', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto(demo);
  await page.getByRole('button', { name: 'Replay sample alert' }).click();
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  expect(await page.locator('script[src*="analytics"],script[src*="tracker"],script[src^="http"]').count()).toBe(0);
});

test('@claim:non-goals exposes no recording, speaker-identification, or emergency action', async ({ page }) => {
  await page.goto(demo);
  await expect(page.getByRole('heading', { name: 'Not a recorder or emergency service' })).toBeVisible();
  const actionNames = await page.locator('button,a').allTextContents();
  expect(actionNames.join(' ')).not.toMatch(/record meeting|identify speaker|call emergency/i);
});

test('demo never reads real IndexedDB data and reset restores its seed', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Name or phrase, with other spellings').fill('REAL PRIVATE PHRASE');
  await page.getByRole('button', { name: 'Add phrase' }).click();
  await page.goto(demo);
  await expect(page.getByText('REAL PRIVATE PHRASE')).toHaveCount(0);
  await page.getByRole('button', { name: 'Remove Maya' }).click();
  await expect(page.getByText('Maya', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('Maya', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page.getByText('REAL PRIVATE PHRASE')).toBeVisible();
});

test('routes set metadata, shared chrome, focus, and a designed not-found page', async ({ page }) => {
  const routes = [
    ['/', 'Name Tap — alerts when your phrase is spoken', 'Feel a tap when someone says your name'],
    ['/demo', 'Demo — Name Tap', 'Maya was heard'],
    ['/privacy', 'Privacy — Name Tap', 'How Name Tap handles your data'],
    ['/terms', 'Terms — Name Tap', 'Use Name Tap as an alert, not a guarantee']
  ] as const;
  for (const [route, title, heading] of routes) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(route === '/' ? '/$' : `${route}$`));
    await expect(page.getByRole('link', { name: 'Privacy', exact: true }).last()).toHaveAttribute('href', '/privacy');
    await expect(page.getByRole('link', { name: 'Terms', exact: true }).last()).toHaveAttribute('href', '/terms');
  }
  await page.goto('/privacy');
  await expect(page.getByRole('link', { name: 'Sociobot privacy policy (external site)' })).toHaveAttribute('href', 'https://sociobot.in/privacy');
  await expect(page.locator('main')).not.toContainText(/license token|prior purchase/i);
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  await expect(page).toHaveTitle('Privacy — Name Tap');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.getByText(/Built by Param Factory/)).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.goto('/does-not-exist');
  await expect(page).toHaveTitle('Page not found — Name Tap');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('meets accessibility, mobile touch-target, overflow, and metadata checks', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  for (const route of ['/', demo, '/privacy', '/terms', '/does-not-exist']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? '')), route).toEqual([]);
    expect(await page.locator('h1').count(), route).toBe(1);
    expect(await page.locator('main').count(), route).toBe(1);
  }
  await page.goto(demo);
  for (const element of await page.locator('a:visible, button:visible, input:not([type="checkbox"]):not([type="file"]):visible, select:visible, summary:visible').all()) {
    const box = await element.boundingBox();
    if (box) expect(box.height, await element.getAttribute('aria-label') ?? await element.textContent() ?? 'target').toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(await page.evaluate(() => document.documentElement.clientWidth));
  expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toContain('/demo');
  expect(await page.locator('meta[property="og:image"]').getAttribute('content')).toContain('name-tap-social.webp');
  expect(errors).toEqual([]);
});

test('rejects malformed imports without persisting a broken render state', async ({ page }) => {
  const errors: Error[] = []; page.on('pageerror', (error) => errors.push(error)); await page.goto('/');
  await page.locator('#import-file').setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ format: 'name-tap-settings', settings: { phrases: [{ id: 'bad', label: 'Broken', variants: 'string', pattern: 'tap', createdAt: 1 }] } })) });
  await expect(page.getByRole('alert')).toContainText('invalid phrase data'); await page.reload(); await expect(page.getByLabel('Name or phrase, with other spellings')).toBeVisible(); expect(errors).toEqual([]);
});

test('ships a content-versioned service worker and direct static routes', async ({ page }) => {
  await page.goto('/');
  const [worker, manifest] = await Promise.all([page.request.get('/sw.js').then((r) => r.text()), page.request.get('/manifest.webmanifest').then((r) => r.json() as Promise<{ start_url: string }>)]);
  const version = worker.match(/name-tap-shell-([a-f0-9]{12})/)?.[1]; expect(version).toBeTruthy(); expect(manifest.start_url).toContain(`v=${version}`);
  for (const route of ['/demo/', '/privacy/', '/terms/', '/not-found.html']) expect((await page.request.get(route)).ok()).toBe(true);
});
