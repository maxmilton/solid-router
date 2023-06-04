import { expect, test } from '@playwright/test';
import {
  destroyFixture,
  loadFixture,
  //  resetFixture,
  sleep,
  type FixtureContext,
} from './utils';

let context: FixtureContext;
test.beforeAll(() => {
  context = loadFixture('minimal');
});
test.afterAll(() => destroyFixture(context));
// test.afterEach(() => resetFixture(context));

test('renders app', async ({ page }) => {
  await page.goto(`http://localhost:${context.port}`);
  const html = await page.innerHTML('html');
  expect(html.length > 230).toBe(true);
  expect(await page.$('nav')).not.toBeNull();
  expect(await page.$('main')).not.toBeNull();
  await sleep(200);
  // expect(context.consoleMessages).toHaveLength(0);
  // expect(context.unhandledErrors).toHaveLength(0);
});

test('updates URL when clicking nav items', async ({ page }) => {
  const urlBase = `http://localhost:${context.port}`;
  await page.goto(urlBase);
  expect(page.url()).toBe(`${urlBase}/`);
  await page.click('nav>.page1');
  expect(page.url()).toBe(`${urlBase}/page1`);
  await page.click('nav>.page2');
  expect(page.url()).toBe(`${urlBase}/page2`);
  await page.click('nav>.home');
  expect(page.url()).toBe(`${urlBase}/`);
  // expect(context.consoleMessages).toHaveLength(0);
  // expect(context.unhandledErrors).toHaveLength(0);
});

test('updates content when clicking nav items', async ({ page }) => {
  await page.goto(`http://localhost:${context.port}`);
  expect(await page.textContent('main')).toBe('Home');
  await page.click('nav>.page1');
  expect(await page.textContent('main')).toBe('Page 1');
  await page.click('nav>.page2');
  expect(await page.textContent('main')).toBe('Page 2');
  await page.click('nav>.home');
  expect(await page.textContent('main')).toBe('Home');
  // expect(context.consoleMessages).toHaveLength(0);
  // expect(context.unhandledErrors).toHaveLength(0);
});
