import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.ADMIN_BASE_URL ?? 'http://127.0.0.1:8000';

export default defineConfig({
    testDir: './tests/Browser',
    testIgnore: ['**/installer/**'],
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: 1,
    timeout: 60_000,
    reporter: 'list',
    use: {
        baseURL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'setup',
            testMatch: /auth\.setup\.ts/,
        },
        {
            name: 'chromium',
            dependencies: ['setup'],
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'tests/Browser/.auth/admin.json',
            },
        },
    ],
    globalSetup: './tests/Browser/global-setup.ts',
    webServer: process.env.PW_SKIP_WEBSERVER
        ? undefined
        : {
              command: 'php artisan serve --env=testing --host=127.0.0.1 --port=8000',
              url: baseURL,
              reuseExistingServer: false,
              timeout: 120_000,
          },
});
