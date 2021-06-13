/* eslint-disable no-console, no-multi-assign */

import getPort from 'get-port';
import http, { Server } from 'http';
import * as colors from 'kleur';
import path from 'path';
import {
  Browser, chromium, ConsoleMessage, Page,
} from 'playwright-chromium';
import sirv from 'sirv';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      browser: Browser;
    }
  }
}

export interface TestContext {
  consoleMessages: ConsoleMessage[];
  dir: string;
  name: string;
  page: Page | null;
  port: number;
  server: Server;
  unhandledErrors: Error[];
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function setup(): Promise<void> {
  if (global.browser) {
    throw new Error(
      'Browser instance already exists, did you forget to call cleanup()?',
    );
  }

  global.browser = await chromium.launch();
}

export async function teardown(): Promise<void> {
  await global.browser.close();
  // @ts-expect-error - destroy browser reference
  global.browser = null;
}

export async function loadFixture(name: string): Promise<TestContext> {
  const filesDir = path.join(__dirname, '../fixtures/dist', name);
  const port = await getPort();
  const server = http.createServer(
    sirv(filesDir, {
      onNoMatch(req) {
        throw new Error(`No matching URL: ${req.url!}`);
      },
    }),
  );
  server.on('error', (err) => {
    if (err) throw err;
  });
  server.listen(port);

  return {
    consoleMessages: [],
    dir: filesDir,
    name,
    page: null,
    port,
    server,
    unhandledErrors: [],
  };
}

export function destroyFixture(context: TestContext): void {
  if (!context.server) {
    throw new Error(
      'No file server exists, did you forget to call loadFixture()?',
    );
  }

  context.server.close();
}

export async function createPage(context: TestContext): Promise<Page> {
  if (context.page) {
    throw new Error(
      'Page already exists, did you forget to call cleanupEach()?',
    );
  }

  const page = await global.browser.newPage();
  context.page = page;
  context.unhandledErrors = [];
  context.consoleMessages = [];
  page.on('crash', (crashedPage) => {
    throw new Error(`Page crashed: ${crashedPage.url()}`);
  });
  page.on('pageerror', (err) => {
    console.error(colors.red('Page Error:'), err);
    context.unhandledErrors.push(err);
  });
  page.on('console', (msg) => {
    const loc = msg.location();
    console.log(
      colors.dim(
        `${loc.url}:${loc.lineNumber}:${loc.columnNumber} [${msg.type()}]`,
      ),
      msg.text(),
    );
    context.consoleMessages.push(msg);
  });
  await page.goto(`http://localhost:${context.port}`);
  return page;
}

export async function cleanupPage(context: TestContext): Promise<void> {
  if (context.page) {
    await context.page.close();
    // @ts-expect-error - reset for next createPage
    context.unhandledErrors = context.consoleMessages = context.page = null;
  }
}
