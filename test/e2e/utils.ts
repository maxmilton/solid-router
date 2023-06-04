// import type { ConsoleMessage } from '@playwright/test';
import http, { type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import path from 'node:path';
import sirv from 'sirv';

export interface FixtureContext {
  dir: string;
  name: string;
  port: number;
  server: Server;
  // consoleMessages: ConsoleMessage[];
  // unhandledErrors: Error[];
}

// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export function loadFixture(name: string): FixtureContext {
  const dir = path.join(__dirname, '../fixtures/dist', name);
  const server = http.createServer(
    sirv(dir, {
      onNoMatch(req) {
        throw new Error(`No matching URL: ${req.url!}`);
      },
    }),
  );
  server.on('error', (err) => {
    if (err) throw err;
  });
  server.listen(0);

  return {
    dir,
    name,
    port: (server.address() as AddressInfo).port,
    server,
    // consoleMessages: [],
    // unhandledErrors: [],
  };
}

// export function resetFixture(context: FixtureContext): void {
//   context.consoleMessages = [];
//   context.unhandledErrors = [];
// }

export function destroyFixture(context: FixtureContext): void {
  if (!context.server) {
    throw new Error(
      'No file server exists, did you forget to call "loadFixture()"?',
    );
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
