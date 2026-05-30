import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/admin-auth';

test.describe('Admin dashboard', () => {
    test('shows command center after login', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/admin/welcome');

        await expect(page.getByRole('heading', { name: /command center/i })).toBeVisible();
        await expect(page.locator('body')).toContainText(/welcome back/i);
    });

    test('login form shows validation for empty submit', async ({ page }) => {
        await page.goto('/login');
        await page.getByRole('button', { name: /sign in/i }).click();

        const email = page.locator('#email');
        await expect(email).toBeFocused();
    });
});
