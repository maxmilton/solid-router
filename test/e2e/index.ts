/* eslint-disable unicorn/no-await-expression-member */

import {
  cleanupPage,
  createPage,
  destroyFixture,
  loadFixture,
  setup,
  sleep,
  teardown,
  TestContext,
} from './utils';

beforeAll(setup);
afterAll(teardown);

describe('minimal fixture', () => {
  let context: TestContext;
  beforeAll(async () => {
    context = await loadFixture('minimal');
  });
  afterAll(() => destroyFixture(context));
  afterEach(() => cleanupPage(context));

  test('renders app', async () => {
    expect.assertions(5);
    const page = await createPage(context);
    expect((await page.innerHTML('html')).length > 230).toBe(true);
    expect(await page.$('nav')).not.toBeNull();
    expect(await page.$('main')).not.toBeNull();
    await sleep(200);
    expect(context.unhandledErrors).toHaveLength(0);
    expect(context.consoleMessages).toHaveLength(0);
  });

  test('updates URL when clicking nav items', async () => {
    expect.assertions(6);
    const page = await createPage(context);
    const urlBase = `http://localhost:${context.port}`;
    expect(page.url()).toBe(`${urlBase}/`);
    await page.click('nav>.page1');
    expect(page.url()).toBe(`${urlBase}/page1`);
    await page.click('nav>.page2');
    expect(page.url()).toBe(`${urlBase}/page2`);
    await page.click('nav>.home');
    expect(page.url()).toBe(`${urlBase}/`);
    expect(context.unhandledErrors).toHaveLength(0);
    expect(context.consoleMessages).toHaveLength(0);
  });

  test('updates content when clicking nav items', async () => {
    expect.assertions(6);
    const page = await createPage(context);
    expect(await page.textContent('main')).toBe('Home');
    await page.click('nav>.page1');
    expect(await page.textContent('main')).toBe('Page 1');
    await page.click('nav>.page2');
    expect(await page.textContent('main')).toBe('Page 2');
    await page.click('nav>.home');
    expect(await page.textContent('main')).toBe('Home');
    expect(context.unhandledErrors).toHaveLength(0);
    expect(context.consoleMessages).toHaveLength(0);
  });
});

describe('simple fixture', () => {
  let context: TestContext;
  beforeAll(async () => {
    context = await loadFixture('simple');
  });
  afterAll(() => destroyFixture(context));
  afterEach(() => cleanupPage(context));

  test('renders app', async () => {
    expect.assertions(5);
    const page = await createPage(context);
    expect((await page.innerHTML('html')).length > 230).toBe(true);
    expect(await page.$('nav')).not.toBeNull();
    expect(await page.$('main')).not.toBeNull();
    await sleep(200);
    expect(context.unhandledErrors).toHaveLength(0);
    expect(context.consoleMessages).toHaveLength(0);
  });

  test('updates URL when clicking nav items', async () => {
    expect.assertions(6);
    const page = await createPage(context);
    const urlBase = `http://localhost:${context.port}`;
    expect(page.url()).toBe(`${urlBase}/`);
    await page.click('nav>.page1');
    expect(page.url()).toBe(`${urlBase}/page1`);
    await page.click('nav>.page2');
    expect(page.url()).toBe(`${urlBase}/page2`);
    await page.click('nav>.home');
    expect(page.url()).toBe(`${urlBase}/`);
    expect(context.unhandledErrors).toHaveLength(0);
    expect(context.consoleMessages).toHaveLength(0);
  });

  test('updates content when clicking nav items', async () => {
    expect.assertions(6);
    const page = await createPage(context);
    expect(await page.textContent('main')).toBe('Home');
    await page.click('nav>.page1');
    expect(await page.textContent('main')).toBe('Page 1');
    await page.click('nav>.page2');
    expect(await page.textContent('main')).toBe('Page 2');
    await page.click('nav>.home');
    expect(await page.textContent('main')).toBe('Home');
    expect(context.unhandledErrors).toHaveLength(0);
    expect(context.consoleMessages).toHaveLength(0);
  });
});

describe('lazyload fixture', () => {
  let context: TestContext;
  beforeAll(async () => {
    context = await loadFixture('lazyload');
  });
  afterAll(() => destroyFixture(context));
  afterEach(() => cleanupPage(context));

  test('renders app', async () => {
    expect.assertions(5);
    const page = await createPage(context);
    expect((await page.innerHTML('html')).length > 230).toBe(true);
    expect(await page.$('nav')).not.toBeNull();
    expect(await page.$('main')).not.toBeNull();
    await sleep(200);
    expect(context.unhandledErrors).toHaveLength(0);
    expect(context.consoleMessages).toHaveLength(0);
  });

  test('updates URL when clicking nav items', async () => {
    expect.assertions(6);
    const page = await createPage(context);
    const urlBase = `http://localhost:${context.port}`;
    expect(page.url()).toBe(`${urlBase}/`);
    await page.click('nav>.page1');
    expect(page.url()).toBe(`${urlBase}/page1`);
    await page.click('nav>.page2');
    expect(page.url()).toBe(`${urlBase}/page2`);
    await page.click('nav>.home');
    expect(page.url()).toBe(`${urlBase}/`);
    expect(context.unhandledErrors).toHaveLength(0);
    expect(context.consoleMessages).toHaveLength(0);
  });

  test('updates content when clicking nav items', async () => {
    expect.assertions(6);
    const page = await createPage(context);
    expect(await page.textContent('main')).toBe('Home');
    await page.click('nav>.page1');
    expect(await page.textContent('main')).toBe('Page 1');
    await page.click('nav>.page2');
    expect(await page.textContent('main')).toBe('Page 2');
    await page.click('nav>.home');
    expect(await page.textContent('main')).toBe('Home');
    expect(context.unhandledErrors).toHaveLength(0);
    expect(context.consoleMessages).toHaveLength(0);
  });

  test("renders loading state when loading a lazy route's bundle", async () => {
    expect.assertions(3);
    const page = await createPage(context);
    const client = await page.context().newCDPSession(page);
    // throttle network speeds
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (30 * 1024 * 1024) / 8, // 30 MB/s
      uploadThroughput: (15 * 1024 * 1024) / 8, // 15 MB/s
      latency: 100,
    });
    expect(await page.textContent('main')).toBe('Home');
    await page.click('nav>.page1');
    expect(await page.textContent('main')).toBe('Loading...');
    await sleep(150);
    expect(await page.textContent('main')).toBe('Page 1');
  });
});

describe('full fixture', () => {
  let context: TestContext;
  beforeAll(async () => {
    context = await loadFixture('full');
  });
  afterAll(() => destroyFixture(context));
  afterEach(() => cleanupPage(context));

  test('renders app', async () => {
    expect.assertions(5);
    const page = await createPage(context);
    expect((await page.innerHTML('html')).length > 230).toBe(true);
    expect(await page.$('nav')).not.toBeNull();
    expect(await page.$('main')).not.toBeNull();
    await sleep(200);
    expect(context.unhandledErrors).toHaveLength(0);
    expect(context.consoleMessages).toHaveLength(0);
  });

  test('updates URL when clicking nav items', async () => {
    expect.assertions(6);
    const page = await createPage(context);
    const urlBase = `http://localhost:${context.port}`;
    expect(page.url()).toBe(`${urlBase}/`);
    await page.click('nav>.page1');
    expect(page.url()).toBe(`${urlBase}/page1`);
    await page.click('nav>.page2');
    expect(page.url()).toBe(`${urlBase}/page2`);
    await page.click('nav>.home');
    expect(page.url()).toBe(`${urlBase}/`);
    expect(context.unhandledErrors).toHaveLength(0);
    expect(context.consoleMessages).toHaveLength(0);
  });

  test('updates content when clicking nav items', async () => {
    expect.assertions(6);
    const page = await createPage(context);
    expect(await page.textContent('main')).toBe('Home');
    await page.click('nav>.page1');
    expect(await page.textContent('main')).toBe('Page 1');
    await page.click('nav>.page2');
    expect(await page.textContent('main')).toBe('Page 2');
    await page.click('nav>.home');
    expect(await page.textContent('main')).toBe('Home');
    expect(context.unhandledErrors).toHaveLength(0);
    expect(context.consoleMessages).toHaveLength(0);
  });

  test("renders loading state when loading a lazy route's bundle", async () => {
    expect.assertions(3);
    const page = await createPage(context);
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
  });

  test.todo('renders fallback state when no matching route');
  test.todo('renders correct page when using browser forward/back buttons');
  test.todo(
    'provides component params prop with route params in dynamic route',
  );
  test.todo('provides component query prop with URL search query params');

  describe('NavLink', () => {
    test.todo('has aria-current attribute when href matches URL path');
    test.todo(
      'has aria-current attribute when href matches URL path with deepMatch',
    );
  });
});
