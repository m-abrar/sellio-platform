import { test, expect } from '@playwright/test';

test.describe('Admin permissions (browser)', () => {
    test('partner user cannot access admin dashboard', async ({ page }) => {
        await page.goto('/login');
        await page.locator('#email').fill(process.env.PARTNER_EMAIL ?? 'partner@test.test');
        await page.locator('#password').fill(process.env.PARTNER_PASSWORD ?? 'password');
        await page.getByRole('button', { name: /sign in/i }).click();
        await page.waitForURL(/\/(?!admin\/welcome)/);

        await page.goto('/admin');
        await expect(page).not.toHaveURL(/\/admin\/welcome/);
        const bodyText = (await page.locator('body').innerText()).toLowerCase();
        expect(bodyText).toMatch(/403|forbidden|unauthorized|login|not found|404/i);
    });
});
