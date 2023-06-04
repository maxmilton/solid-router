import { expect, test } from '@playwright/test';
import {
  destroyFixture,
  loadFixture,
  // resetFixture,
  sleep,
  type FixtureContext,
} from './utils';

let context: FixtureContext;
test.beforeAll(() => {
  context = loadFixture('full');
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

// FIXME: Solid suspense does not trigger when we want it
//  ↳ https://github.com/solidjs/solid/blob/main/packages/solid/src/static/rendering.ts#L406
test.fixme("renders loading state when loading a lazy route's bundle", async ({ page }) => {
  await page.goto(`http://localhost:${context.port}`);
  const client = await page.context().newCDPSession(page);
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (30 * 1024 * 1024) / 8,
    uploadThroughput: (15 * 1024 * 1024) / 8,
    latency: 100,
  });
  expect(await page.textContent('main')).toBe('Home');
  await page.click('nav>.page1');
  expect(await page.textContent('main')).toBe('Loading...');
  await sleep(150);
  expect(await page.textContent('main')).toBe('Page 1');
  // expect(context.consoleMessages).toHaveLength(0);
  // expect(context.unhandledErrors).toHaveLength(0);
});

test.fixme('renders fallback state when no matching route', async ({ page }) => {
  await page.goto(`http://localhost:${context.port}`);
  // expect(context.consoleMessages).toHaveLength(0);
  // expect(context.unhandledErrors).toHaveLength(0);
});
test.fixme('renders correct page when using browser forward/back buttons', async ({ page }) => {
  await page.goto(`http://localhost:${context.port}`);
  // expect(context.consoleMessages).toHaveLength(0);
  // expect(context.unhandledErrors).toHaveLength(0);
});
test.fixme(
  'provides component params prop with route params in dynamic route',
  async ({ page }) => {
    await page.goto(`http://localhost:${context.port}`);
    // expect(context.consoleMessages).toHaveLength(0);
    // expect(context.unhandledErrors).toHaveLength(0);
  },
);
test.fixme('provides component query prop with URL search query params', async ({ page }) => {
  await page.goto(`http://localhost:${context.port}`);
  // expect(context.consoleMessages).toHaveLength(0);
  // expect(context.unhandledErrors).toHaveLength(0);
});

// FIXME: Move to seperate file?
test.describe('NavLink', () => {
  test.fixme('has aria-current attribute when href matches URL path', async ({ page }) => {
    await page.goto(`http://localhost:${context.port}`);
    // expect(context.consoleMessages).toHaveLength(0);
    // expect(context.unhandledErrors).toHaveLength(0);
  });
  test.fixme(
    'has aria-current attribute when href matches URL path with deepMatch',
    async ({ page }) => {
      await page.goto(`http://localhost:${context.port}`);
      // expect(context.consoleMessages).toHaveLength(0);
      // expect(context.unhandledErrors).toHaveLength(0);
    },
  );
});
