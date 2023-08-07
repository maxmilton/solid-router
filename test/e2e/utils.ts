import type { ConsoleMessage, Page } from '@playwright/test';
import http, { type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { dirname, join } from 'node:path';
import sirv from 'sirv';

export interface FixtureContext {
  dir: string;
  name: string;
  port: number;
  server: Server;
  consoleMessages: ConsoleMessage[];
  unhandledErrors: Error[];
}

// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
const __dirname = dirname(new URL(import.meta.url).pathname);

export function loadFixture(name: string): FixtureContext {
  const dir = join(__dirname, '../fixtures/dist', name);
  const server = http.createServer(
    sirv(dir, {
      onNoMatch(request) {
        throw new Error(`No matching URL: ${request.url}`);
      },
    }),
  );
  server.on('error', (error) => {
    throw error;
  });
  server.listen(0);

  return {
    dir,
    name,
    port: (server.address() as AddressInfo).port,
    server,
    consoleMessages: [],
    unhandledErrors: [],
  };
}

export function connectPage(context: FixtureContext, page: Page): void {
  context.consoleMessages.length = 0;
  context.unhandledErrors.length = 0;

  page.on('console', (message) => {
    context.consoleMessages.push(message);
  });
  page.on('pageerror', (error) => {
    context.unhandledErrors.push(error);
  });
}

export function destroyFixture(context: FixtureContext): void {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!context.server) {
    throw new Error('Invalid server, did you forget to call "loadFixture()"?');
  }

  context.server.close();
}

/** @deprecated - FIXME: Refactor out the need for this completely. */
// FIXME: https://playwright.dev/docs/best-practices#use-web-first-assertions
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
