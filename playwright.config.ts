import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

function integerEnv(name: string, fallback: number, minimum: number): number {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value < minimum) {
    throw new Error(`${name} must be an integer >= ${minimum}`);
  }
  return value;
}

export default defineConfig({
  testDir: './tests',
  globalSetup: './utils/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: integerEnv('RETRIES', process.env.CI ? 1 : 0, 0),
  workers: integerEnv('WORKERS', 2, 1),
  timeout: 90_000,
  expect: { timeout: 15_000 },
  outputDir: 'test-results',
  reporter: process.argv.includes('--list') ? [['list']] : [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results', detail: true }],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.automationexercise.com',
    headless: process.env.HEADLESS !== 'false',
    testIdAttribute: 'data-qa',
    locale: 'en-US',
    actionTimeout: 15_000,
    navigationTimeout: 45_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
