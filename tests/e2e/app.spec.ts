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
  await page.getByLabel(/I have told people nearby/).check();
  await expect(page.getByRole('button', { name: /Start listening/ })).toBeEnabled();
});

test('has no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze();
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
