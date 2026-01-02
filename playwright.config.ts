import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

if (!process.env.CI) {
  dotenv.config();
}


/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 50000,
  globalSetup: 'tests/auth/global-setup.ts',

  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  reporter: [
    ['list'],
    ['allure-playwright', {
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: false,
    }]
  ],


  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 0 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 4 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */


  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'supervisor',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     storageState: './tests/auth/supervisor.json'
    //   }
    // },
    // {
    //   name: 'director',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     storageState: './tests/auth/director.json'
    //   }
    // },
    // {
    //   name: 'hr',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     storageState: './tests/auth/hr.json'
    //   }
    // }

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },


    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop  Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
  // Optional: convenience suites grouping. These are not a CLI flag by themselves,
  // but useful as documentation and for other tools. Prefer running suites via
  // npm scripts that point to these folders (examples in package.json).
  metadata: {
    suites: {
      AspekPage: 'tests/aspekmenu/*.spec.ts',
      Authentication: 'tests/authentication/*.spec.ts',
      Karyawan: 'tests/karyawanmenu/*.spec.ts',
      Pengaturan: 'tests/pengaturan/*.spec.ts',
    },
  },
});
