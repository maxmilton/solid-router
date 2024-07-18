import { expect, test } from '@playwright/test';
import { type FixtureContext, connectPage, destroyFixture, loadFixture, sleep } from './utils';

let context: FixtureContext;
test.beforeAll(() => {
  context = loadFixture('minimal');
});
test.afterAll(() => {
  destroyFixture(context);
});
test.beforeEach(({ page }) => {
  connectPage(context, page);
});

test('renders app', async ({ page }) => {
  await page.goto(`http://localhost:${String(context.port)}`);
  const html = await page.innerHTML('html');
  expect(html.length > 230).toBe(true);
  expect(await page.$('nav')).not.toBeNull();
  expect(await page.$('main')).not.toBeNull();
  await sleep(200);
  expect(context.consoleMessages).toHaveLength(0);
  expect(context.unhandledErrors).toHaveLength(0);
});

test('updates URL when clicking nav items', async ({ page }) => {
  const urlBase = `http://localhost:${String(context.port)}`;
  await page.goto(urlBase);
  await expect(page).toHaveURL(`${urlBase}/`);
  await page.click('nav>.page1');
  await expect(page).toHaveURL(`${urlBase}/page1`);
  await page.click('nav>.page2');
  await expect(page).toHaveURL(`${urlBase}/page2`);
  await page.click('nav>.home');
  await expect(page).toHaveURL(`${urlBase}/`);
  expect(context.consoleMessages).toHaveLength(0);
  expect(context.unhandledErrors).toHaveLength(0);
});

test('updates content when clicking nav items', async ({ page }) => {
  await page.goto(`http://localhost:${String(context.port)}`);
  await expect(page.locator('main')).toHaveText('Home');
  await page.click('nav>.page1');
  await expect(page.locator('main')).toHaveText('Page 1');
  await page.click('nav>.page2');
  await expect(page.locator('main')).toHaveText('Page 2');
  await page.click('nav>.home');
  await expect(page.locator('main')).toHaveText('Home');
  expect(context.consoleMessages).toHaveLength(0);
  expect(context.unhandledErrors).toHaveLength(0);
});
