import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/offline',
  fullyParallel: false,
  workers: 1,
  timeout: 240_000,
  expect: { timeout: 30_000 },
  reporter: 'list',
  outputDir: 'tmp/offline-test-results',
  use: {
    browserName: 'chromium',
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
    headless: true,
    serviceWorkers: 'allow',
    viewport: {width: 1280, height: 900},
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});
