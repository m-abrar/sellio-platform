import { test, expect } from '@playwright/test';
import { assertNoServerErrors, loginAsAdmin } from './helpers/admin-auth';

test.describe('Admin CRUD (browser)', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
    });

    test('can create a category from the admin form', async ({ page }) => {
        const title = `Browser Category ${Date.now()}`;

        await page.goto('/admin/categories/create');
        await assertNoServerErrors(page);

        const form = page.locator('#categoryMainForm');
        await form.locator('input[name="title"]').fill(title);
        await form.locator('textarea[name="description"]').fill('Created by Playwright admin CRUD test.');
        await form.locator('button[type="submit"]').click();

        await page.waitForURL(/\/admin\/categories\/\d+\/edit/);
        await assertNoServerErrors(page);
        await expect(page.locator('#categoryMainForm input[name="title"]')).toHaveValue(title);
    });

    test('product index loads and shows seeded inventory', async ({ page }) => {
        await page.goto('/admin/products');
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText('Test Product');
    });

    test('subscriptions index loads seeded enrollment', async ({ page }) => {
        await page.goto('/admin/subscriptions');
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText('Test Plan');
    });

    test('can create a product from the admin form', async ({ page }) => {
        const title = `Browser Product ${Date.now()}`;

        await page.goto('/admin/products/create');
        await assertNoServerErrors(page);

        const form = page.locator('#productMainForm');
        await form.locator('input[name="title"]').fill(title);
        await form.locator('select[name="category_id"]').selectOption({ index: 1 });
        await form.locator('input[name="base_price"]').fill('29.99');
        await form.locator('textarea[name="description"]').fill('Created by Playwright product CRUD test.');
        await form.locator('button[type="submit"]').click();

        await page.waitForURL(/\/admin\/products/);
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(title);
    });

    test('product form shows validation feedback when required fields are missing', async ({ page }) => {
        await page.goto('/admin/products/create');
        await assertNoServerErrors(page);

        await page.locator('#productMainForm button[type="submit"]').click();

        const titleField = page.locator('#productMainForm input[name="title"]');
        await expect(titleField).toBeFocused();
    });

    test('category delete confirmation removes a disposable category', async ({ page }) => {
        const title = `Delete Me Category ${Date.now()}`;

        await page.goto('/admin/categories/create');
        await page.locator('#categoryMainForm input[name="title"]').fill(title);
        await page.locator('#categoryMainForm textarea[name="description"]').fill('Temporary category for delete confirmation test.');
        await page.locator('#categoryMainForm button[type="submit"]').click();
        await page.waitForURL(/\/admin\/categories\/\d+\/edit/);

        await page.goto('/admin/categories');
        const row = page.locator('tr', { hasText: title });
        await row.locator('[data-action="delete-trigger"]').click();

        const confirmDialog = page.locator('.swal2-popup');
        await expect(confirmDialog).toBeVisible();
        await confirmDialog.getByRole('button', { name: /yes, delete/i }).click();

        await page.waitForURL(/\/admin\/categories/);
        await assertNoServerErrors(page);
        await expect(page.locator('body')).not.toContainText(title);
    });

    test('settings explorer loads', async ({ page }) => {
        await page.goto('/admin/settings');
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText('Sellio');
    });

    test('email templates index loads', async ({ page }) => {
        await page.goto('/admin/email-templates');
        await assertNoServerErrors(page);
    });

    test('dashboard renders on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto('/admin');
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toBeVisible();
    });

    test('can update an existing category from the admin form', async ({ page }) => {
        const title = `Edit Me Category ${Date.now()}`;
        const updatedTitle = `${title} Updated`;

        await page.goto('/admin/categories/create');
        await page.locator('#categoryMainForm input[name="title"]').fill(title);
        await page.locator('#categoryMainForm textarea[name="description"]').fill('Temporary category for edit test.');
        await page.locator('#categoryMainForm button[type="submit"]').click();
        await page.waitForURL(/\/admin\/categories\/\d+\/edit/);
        await assertNoServerErrors(page);

        const categoryId = page.url().match(/\/categories\/(\d+)\/edit/)?.[1];
        expect(categoryId).toBeTruthy();

        await page.locator('#categoryMainForm input[name="title"]').fill(updatedTitle);
        await page.locator('#categoryMainForm button[type="submit"]').click();
        await page.waitForURL((url) => new URL(url).pathname === '/admin/categories');
        await assertNoServerErrors(page);

        await page.goto(`/admin/categories/${categoryId}/edit`);
        await assertNoServerErrors(page);
        await expect(page.locator('#categoryMainForm input[name="title"]')).toHaveValue(updatedTitle);
    });
});
