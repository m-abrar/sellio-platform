import { test, expect } from '@playwright/test';
import { assertNoServerErrors, loginAsAdmin } from './helpers/admin-auth';

test.describe('Admin bookings (browser)', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
    });

    test('unified bookings index loads', async ({ page }) => {
        await page.goto('/admin/bookings');
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(/booking|inquiry|application/i);
    });

    test('property bookings vertical page loads', async ({ page }) => {
        await page.goto('/admin/bookings/properties');
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(/property|booking/i);
    });
});
