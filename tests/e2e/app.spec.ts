import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('sets up a phrase with keyboard-accessible controls', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Name Tap/);
  await expect(page.locator('h1')).toHaveCount(1);
  await page.getByLabel('Phrase and spelling variants').fill('Maya, Maia');
  await page.getByRole('button', { name: 'Add phrase' }).click();
  await expect(page.getByText('Maya', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Test cue for Maya' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Test cue' })).toBeVisible();
  await page.getByRole('button', { name: 'Remove Maya' }).click();
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page.getByText('Maya', { exact: true })).toBeVisible();
  await page.getByLabel(/I have told people nearby/).check();
  await expect(page.getByRole('button', { name: /Start listening/ })).toBeEnabled();
});

test('valid lifetime unlock exposes unlimited haptic choices', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:name-vibration-captions', 'test-license');
    localStorage.setItem('sb_license:name-vibration-captions:verdict', JSON.stringify({ valid: true, checkedAt: Date.now() }));
  });
  await page.goto('/');
  await page.getByLabel('Phrase and spelling variants').fill('Maya');
  await page.getByRole('button', { name: 'Add phrase' }).click();
  await expect(page.getByLabel('Vibration for Maya')).toBeVisible();
  await page.getByLabel('Vibration for Maya').selectOption('urgent');
  await expect(page.getByText('Vibration pattern updated')).toBeVisible();
});

test('has no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('privacy page has one clear heading', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Privacy');
});

test('app shell reloads offline after installation', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Feel your name');
  await expect(page.locator('body')).toContainText('Offline');
});

test('rejects malformed imports without persisting a broken render state', async ({ page }) => {
  const pageErrors: Error[] = [];
  page.on('pageerror', (error) => pageErrors.push(error));
  await page.goto('/');
  await page.locator('#import-file').setInputFiles({
    name: 'broken-settings.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({
      format: 'name-tap-settings',
      settings: { phrases: [{ id: 'bad', label: 'Broken', variants: 'string', pattern: 'tap', createdAt: 1 }] }
    }))
  });
  await expect(page.getByRole('alert')).toContainText('invalid phrase data');
  await expect(page.getByLabel('Phrase and spelling variants')).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Phrase and spelling variants')).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('ships a content-versioned service worker and install start URL', async ({ page }) => {
  await page.goto('/');
  const [serviceWorker, manifest] = await Promise.all([
    page.request.get('/sw.js').then((response) => response.text()),
    page.request.get('/manifest.webmanifest').then((response) => response.json() as Promise<{ start_url: string }>)
  ]);
  const version = serviceWorker.match(/name-tap-shell-([a-f0-9]{12})/)?.[1];
  expect(version).toBeTruthy();
  expect(serviceWorker).not.toContain('__BUILD_VERSION__');
  expect(manifest.start_url).toContain(`v=${version}`);
});
