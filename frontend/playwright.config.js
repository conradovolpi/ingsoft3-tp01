import { defineConfig } from '@playwright/test'

if (!process.env.API_BASE_URL || !process.env.E2E_BASE_URL) {
  throw new Error('Faltan API_BASE_URL y/o E2E_BASE_URL de QA')
}

export default defineConfig({
  testDir: './e2e',
  timeout: 120_000,
  expect: {
    timeout: 60_000,
  },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    actionTimeout: 60_000,
    navigationTimeout: 90_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    ignoreHTTPSErrors: false,
  },

  projects: [
    {
      name: 'integracion',
      testMatch: 'api.spec.js',
      use: {
        baseURL: process.env.API_BASE_URL,
      },
    },
    {
      name: 'e2e',
      testMatch: 'expenses.spec.js',
      use: {
        baseURL: process.env.E2E_BASE_URL,
        browserName: 'chromium',
      },
    },
  ],
})