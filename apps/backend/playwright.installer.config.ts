import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.INSTALLER_BASE_URL ?? 'http://127.0.0.1:8000';

export default defineConfig({
    testDir: './tests/Browser/installer',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: 1,
    timeout: 1_800_000,
    reporter: 'list',
    use: {
        baseURL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    globalSetup: './tests/Browser/installer/global-setup.ts',
    globalTeardown: './tests/Browser/installer/global-teardown.ts',
    webServer: process.env.PW_SKIP_WEBSERVER
        ? undefined
        : {
              command: 'php artisan serve --host=127.0.0.1 --port=8000',
              url: baseURL,
              reuseExistingServer: !process.env.CI,
              timeout: 120_000,
          },
});
