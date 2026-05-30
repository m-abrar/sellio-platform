import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertNoServerErrors, loginAsAdmin } from './helpers/admin-auth';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test.describe('Admin system (browser)', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
    });

    test('permissions index loads', async ({ page }) => {
        await page.goto('/admin/permissions');
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(/permission/i);
    });

    test('payment gateways index loads seeded providers', async ({ page }) => {
        await page.goto('/admin/payment-gateways');
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(/stripe/i);
    });

    test('reports hub loads analytical entry points', async ({ page }) => {
        await page.goto('/admin/reports');
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(/report/i);
    });

    test('payments report page loads with date filters', async ({ page }) => {
        const endDate = new Date().toISOString().slice(0, 10);
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

        await page.goto(`/admin/reports/payments?start_date=${startDate}&end_date=${endDate}`);
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(/revenue|payment/i);
    });

    test('system maintenance page loads', async ({ page }) => {
        await page.goto('/admin/system/maintenance');
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(/system maintenance/i);
    });

    test('system status page loads environment report', async ({ page }) => {
        await page.goto('/admin/system/status');
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(/php version/i);
    });

    test('can purge application cache from maintenance dashboard', async ({ page }) => {
        await page.goto('/admin/system/maintenance');
        await assertNoServerErrors(page);

        await page.locator('form[action*="/admin/system/cache/clear"] button[type="submit"]').click();
        await assertNoServerErrors(page);
        await expect(page).toHaveURL(/\/admin\/system\/maintenance/);
    });

    test('can run storage link action from maintenance dashboard', async ({ page }) => {
        await page.goto('/admin/system/maintenance');
        await assertNoServerErrors(page);

        await page.locator('form[action*="/admin/system/storage-link"] button[type="submit"]').click();
        await assertNoServerErrors(page);
        await expect(page).toHaveURL(/\/admin\/system\/maintenance/);
    });
});

test.describe('Admin gallery operations (browser)', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
    });

    test('can delete a disposable gallery asset', async ({ page }) => {
        const uniqueFile = `delete-gallery-${Date.now()}.png`;
        const fixtureBuffer = fs.readFileSync(path.join(__dirname, 'fixtures', 'test-image.png'));

        await page.goto('/admin/gallery');
        await page.getByRole('button', { name: /add standalone asset/i }).click();
        await page.locator('#uploadModal input[name="image"]').setInputFiles({
            name: uniqueFile,
            mimeType: 'image/png',
            buffer: fixtureBuffer,
        });
        await page.locator('#uploadModal input[name="title"]').fill(`Delete Gallery ${Date.now()}`);
        await page.locator('#uploadModal button[type="submit"]').click();
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(uniqueFile);

        const card = page.locator('.card', { hasText: uniqueFile }).first();
        await card.locator('[data-action="delete-trigger"]').click();

        const confirmDialog = page.locator('.swal2-popup');
        await expect(confirmDialog).toBeVisible();
        await confirmDialog.getByRole('button', { name: /yes, delete/i }).click();

        await assertNoServerErrors(page);
        await expect(page.locator('body')).not.toContainText(uniqueFile);
    });
});
