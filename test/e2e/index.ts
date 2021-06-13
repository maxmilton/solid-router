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
    expect(context.consoleMessages).toHaveLength(0);
    expect(context.unhandledErrors).toHaveLength(0);
  });

  test('updates URL when clicking nav items', async () => {
    expect.assertions(6);
    const page = await createPage(context);
    const urlBase = `http://localhost:${context.port}`;
    expect(page.url()).toBe(`${urlBase}/`);
    await page.click('nav>a.page1');
    expect(page.url()).toBe(`${urlBase}/page1`);
    await page.click('nav>a.page2');
    expect(page.url()).toBe(`${urlBase}/page2`);
    await page.click('nav>a.home');
    expect(page.url()).toBe(`${urlBase}/`);
    expect(context.consoleMessages).toHaveLength(0);
    expect(context.unhandledErrors).toHaveLength(0);
  });

  test('updates content when clicking nav items', async () => {
    expect.assertions(6);
    const page = await createPage(context);
    expect(await page.innerText('main')).toBe('Home');
    await page.click('nav>a.page1');
    expect(await page.innerText('main')).toBe('Page 1');
    await page.click('nav>a.page2');
    expect(await page.innerText('main')).toBe('Page 2');
    await page.click('nav>a.home');
    expect(await page.innerText('main')).toBe('Home');
    expect(context.consoleMessages).toHaveLength(0);
    expect(context.unhandledErrors).toHaveLength(0);
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
    expect(context.consoleMessages).toHaveLength(0);
    expect(context.unhandledErrors).toHaveLength(0);
  });

  test('updates URL when clicking nav items', async () => {
    expect.assertions(6);
    const page = await createPage(context);
    const urlBase = `http://localhost:${context.port}`;
    expect(page.url()).toBe(`${urlBase}/`);
    await page.click('nav>a.page1');
    expect(page.url()).toBe(`${urlBase}/page1`);
    await page.click('nav>a.page2');
    expect(page.url()).toBe(`${urlBase}/page2`);
    await page.click('nav>a.home');
    expect(page.url()).toBe(`${urlBase}/`);
    expect(context.consoleMessages).toHaveLength(0);
    expect(context.unhandledErrors).toHaveLength(0);
  });

  test('updates content when clicking nav items', async () => {
    expect.assertions(6);
    const page = await createPage(context);
    expect(await page.innerText('main')).toBe('Home');
    await page.click('nav>a.page1');
    expect(await page.innerText('main')).toBe('Page 1');
    await page.click('nav>a.page2');
    expect(await page.innerText('main')).toBe('Page 2');
    await page.click('nav>a.home');
    expect(await page.innerText('main')).toBe('Home');
    expect(context.consoleMessages).toHaveLength(0);
    expect(context.unhandledErrors).toHaveLength(0);
  });
});
