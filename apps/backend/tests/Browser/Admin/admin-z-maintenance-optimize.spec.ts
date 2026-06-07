import { test, expect } from '@playwright/test';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertNoServerErrors } from './helpers/admin-auth';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

test.describe('Admin maintenance optimize (browser)', () => {
    test('can run optimize action and admin remains reachable', async ({ page }) => {
        await page.goto('/admin/system/maintenance');
        await assertNoServerErrors(page);

        await page.locator('form[action*="/admin/system/optimize"] button[type="submit"]').click();
        await assertNoServerErrors(page);
        await expect(page).toHaveURL(/\/admin\/system\/maintenance/);

        await page.goto('/admin');
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toBeVisible();
    });

    test.afterAll(() => {
        execSync('php artisan optimize:clear', { cwd: backendRoot, stdio: 'pipe' });
    });
});
