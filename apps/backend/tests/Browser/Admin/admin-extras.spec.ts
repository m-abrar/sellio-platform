import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertNoServerErrors, loginAsAdmin } from './helpers/admin-auth';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test.describe('Admin extras (browser)', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
    });

    test('addons index loads', async ({ page }) => {
        await page.goto('/admin/addons');
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(/addon/i);
    });

    test('can create an addon from the admin form', async ({ page }) => {
        const name = `Browser Addon ${Date.now()}`;

        await page.goto('/admin/addons/create');
        await assertNoServerErrors(page);

        await page.locator('input[name="name"]').fill(name);
        await page.locator('input[name="price"]').fill('12.50');
        await page.locator('textarea[name="description"]').fill('Created by Playwright addon CRUD test.');
        await page.locator('form button[type="submit"]').first().click();

        await page.waitForURL(/\/admin\/addons/);
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(name);
    });

    test('can upload a gallery asset via modal', async ({ page }) => {
        const title = `Browser Gallery ${Date.now()}`;

        await page.goto('/admin/gallery');
        await assertNoServerErrors(page);

        await page.getByRole('button', { name: /add standalone asset/i }).click();
        await expect(page.locator('#uploadModal')).toBeVisible();

        const fixturePath = path.join(__dirname, 'fixtures', 'test-image.png');
        await page.locator('#uploadModal input[name="image"]').setInputFiles(fixturePath);
        await page.locator('#uploadModal input[name="title"]').fill(title);
        await page.locator('#uploadModal button[type="submit"]').click();

        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText('test-image.png');
    });

    test('can create a blog post from the admin form', async ({ page }) => {
        const title = `Browser Blog ${Date.now()}`;

        await page.goto('/admin/blogs/create');
        await assertNoServerErrors(page);

        await page.locator('input[name="title"]').fill(title);
        await page.locator('select[name="category_id"]').selectOption({ index: 1 });
        await page.locator('textarea#content').fill('Created by Playwright blog CRUD test.');
        await page.locator('button[type="submit"]').click();

        await page.waitForURL(/\/admin\/blogs/);
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(title);
    });

    test('menu architect page loads for seeded menu', async ({ page }) => {
        await page.goto('/admin/menu/unifieds_default');
        await assertNoServerErrors(page);

        const editLink = page.locator('a[href*="/admin/menu/"][href*="/edit"]').first();
        await expect(editLink).toBeVisible();
        await editLink.click();

        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(/navigation architect|main menu/i);
    });

    test('can add and synchronize a new menu link', async ({ page }) => {
        const label = `Browser Menu ${Date.now()}`;

        await page.goto('/admin/menu/unifieds_default');
        const editLink = page.locator('a[href*="/admin/menu/"][href*="/edit"]').first();
        await editLink.click();
        await assertNoServerErrors(page);

        await page.locator('#new_title').fill(label);
        await page.locator('#new_url').fill('/browser-menu-link');
        await page.locator('#add-new-item').click();
        await expect(page.locator('.dd-item', { hasText: label })).toBeVisible();

        await page.getByRole('button', { name: /synchronize structure/i }).click();
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(label);

        await page.reload();
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(label);
    });

    test('can reorder menu items and synchronize structure', async ({ page }) => {
        const firstLabel = `Reorder First ${Date.now()}`;
        const secondLabel = `Reorder Second ${Date.now()}`;

        await page.goto('/admin/menu/unifieds_default');
        await page.locator('a[href*="/admin/menu/"][href*="/edit"]').first().click();
        await assertNoServerErrors(page);

        await page.locator('#new_title').fill(firstLabel);
        await page.locator('#new_url').fill('/reorder-first');
        await page.locator('#add-new-item').click();

        await page.locator('#new_title').fill(secondLabel);
        await page.locator('#new_url').fill('/reorder-second');
        await page.locator('#add-new-item').click();

        await page.getByRole('button', { name: /synchronize structure/i }).click();
        await assertNoServerErrors(page);
        await page.reload();
        await assertNoServerErrors(page);

        await page.evaluate(({ firstLabel, secondLabel }) => {
            const items = Array.from(document.querySelectorAll('#menu-items-list .dd-list > .dd-item'));
            const findItem = (label: string) =>
                items.find((item) => item.querySelector('.item-title')?.textContent?.includes(label));
            const first = findItem(firstLabel);
            const second = findItem(secondLabel);
            if (first && second && second.parentElement) {
                second.parentElement.insertBefore(second, first);
            }
        }, { firstLabel, secondLabel });

        await page.getByRole('button', { name: /synchronize structure/i }).click();
        await assertNoServerErrors(page);
        await page.reload();

        const titles = await page.locator('#menu-items-list .dd-list > .dd-item > .dd-handle .item-title').allTextContents();
        const secondIndex = titles.findIndex((text) => text.includes(secondLabel));
        const firstIndex = titles.findIndex((text) => text.includes(firstLabel));

        expect(secondIndex).toBeGreaterThan(-1);
        expect(firstIndex).toBeGreaterThan(-1);
        expect(secondIndex).toBeLessThan(firstIndex);
    });

    test('can replace a gallery asset via modal', async ({ page }) => {
        const uniqueFile = `replace-before-${Date.now()}.png`;
        const replacementFile = `replace-after-${Date.now()}.png`;
        const fixtureBuffer = fs.readFileSync(path.join(__dirname, 'fixtures', 'test-image.png'));

        await page.goto('/admin/gallery');
        await page.getByRole('button', { name: /add standalone asset/i }).click();
        await page.locator('#uploadModal input[name="image"]').setInputFiles({
            name: uniqueFile,
            mimeType: 'image/png',
            buffer: fixtureBuffer,
        });
        await page.locator('#uploadModal button[type="submit"]').click();
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(uniqueFile);

        const card = page.locator('.card', { hasText: uniqueFile }).first();
        const replaceButton = card.locator('[data-target^="#replaceModal"]');
        const modalSelector = await replaceButton.getAttribute('data-target');
        await replaceButton.click();

        const replaceModal = page.locator(modalSelector!);
        await expect(replaceModal).toBeVisible();
        await replaceModal.locator('input[name="image"]').setInputFiles({
            name: replacementFile,
            mimeType: 'image/png',
            buffer: fixtureBuffer,
        });
        await replaceModal.locator('button[type="submit"]').click();

        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(replacementFile);
        await expect(page.locator('body')).not.toContainText(uniqueFile);
    });
});
