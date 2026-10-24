import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: 1,
  reporter: [['html', { open: 'never' }]],

  use: {
    baseURL: 'https://restful-booker.herokuapp.com',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },

  projects: [
    {
      name: 'api',
      testMatch: '**/API/**/*.spec.ts',
    },
    {
      name: 'ui',
      testMatch: '**/UI/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://automationintesting.online',
      },
    },
  ],
});