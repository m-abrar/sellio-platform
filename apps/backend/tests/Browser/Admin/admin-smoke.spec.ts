import { test } from '@playwright/test';
import { assertNoServerErrors, loginAsAdmin } from './helpers/admin-auth';

test.describe('Admin smoke', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
    });

    test('dashboard loads without server errors', async ({ page }) => {
        await page.goto('/admin/welcome');
        await assertNoServerErrors(page);
        await page.getByRole('heading', { name: /command center/i }).waitFor();
    });

    test('core admin index pages load', async ({ page }) => {
        const paths = [
            '/admin/categories',
            '/admin/products',
            '/admin/properties',
            '/admin/events',
            '/admin/services',
            '/admin/tickets',
            '/admin/users',
        ];

        for (const path of paths) {
            await page.goto(path);
            await assertNoServerErrors(page);
        }
    });
});
