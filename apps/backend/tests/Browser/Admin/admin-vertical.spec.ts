import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertNoServerErrors, loginAsAdmin } from './helpers/admin-auth';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function localDateTimeInput(offsetHours = 168): string {
    const date = new Date(Date.now() + offsetHours * 60 * 60 * 1000);
    date.setMinutes(0, 0, 0);
    return date.toISOString().slice(0, 16);
}

test.describe('Admin verticals (browser)', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
    });

    test('properties index shows seeded listing', async ({ page }) => {
        await page.goto('/admin/properties');
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(/property|listing/i);
    });

    test('can create a property from the admin form', async ({ page }) => {
        const title = `Browser Property ${Date.now()}`;

        await page.goto('/admin/properties/create');
        await assertNoServerErrors(page);

        const form = page.locator('#propertyMainForm');
        await form.locator('input[name="title"]').fill(title);
        await form.locator('textarea[name="description"]').fill('Created by Playwright property CRUD test.');
        await form.locator('input[name="base_price"]').fill('350000');
        await form.locator('input[name="number_of_bedrooms"]').fill('3');
        await form.locator('input[name="number_of_bathrooms"]').fill('2');
        await form.locator('input[name="city"]').fill('Austin');
        await form.locator('input[name="country"]').fill('USA');
        await form.locator('select[name="category_id"]').selectOption({ index: 1 });
        await form.locator('.btn-submit-premium').click();

        await page.waitForURL(/\/admin\/properties\/\d+\/edit/);
        await assertNoServerErrors(page);
        await expect(page.locator('input[name="title"]')).toHaveValue(title);
    });

    test('events index loads', async ({ page }) => {
        await page.goto('/admin/events');
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(/event/i);
    });

    test('can create an event from the admin form', async ({ page }) => {
        const title = `Browser Event ${Date.now()}`;
        const start = localDateTimeInput(168);
        const end = localDateTimeInput(171);

        await page.goto('/admin/events/create');
        await assertNoServerErrors(page);

        await page.locator('input[name="title"]').fill(title);
        await page.locator('textarea[name="description"]').fill('Created by Playwright event CRUD test.');
        await page.locator('select[name="category_id"]').selectOption({ index: 1 });
        await page.locator('input[name="start_date_time"]').fill(start);
        await page.locator('input[name="end_date_time"]').fill(end);
        await page.locator('input[name="base_price"]').fill('49.99');
        await page.locator('form[action*="/admin/events"]').locator('button[type="submit"]').click();

        await page.waitForURL(/\/admin\/events\/\d+\/edit/);
        await assertNoServerErrors(page);
        await expect(page.locator('input[name="title"]')).toHaveValue(title);
    });

    test('jobs index loads', async ({ page }) => {
        await page.goto('/admin/jobs');
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(/job/i);
    });

    test('services index loads', async ({ page }) => {
        await page.goto('/admin/services');
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(/service/i);
    });

    test('autos index loads', async ({ page }) => {
        await page.goto('/admin/autos');
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(/auto/i);
    });

    test('can create an auto from the admin form', async ({ page }) => {
        const title = `Browser Auto ${Date.now()}`;

        await page.goto('/admin/autos/create');
        await assertNoServerErrors(page);

        const form = page.locator('form[action*="/admin/autos"]');
        await form.locator('input[name="title"]').fill(title);
        await form.locator('textarea[name="description"]').fill('Created by Playwright auto CRUD test.');
        await form.locator('input[name="make"]').fill('Toyota');
        await form.locator('input[name="model"]').fill('Camry');
        await form.locator('input[name="year"]').fill('2020');
        await form.locator('input[name="engine_type"]').fill('Inline-4');
        await form.locator('input[name="transmission"]').fill('automatic');
        await form.locator('input[name="fuel_economy"]').fill('petrol');
        await form.locator('input[name="drivetrain"]').fill('fwd');
        await form.locator('input[name="exterior_color"]').fill('Blue');
        await form.locator('input[name="mileage_value"]').fill('50000');
        await form.locator('input[name="stock_quantity"]').fill('1');
        await form.locator('input[name="base_price"]').fill('25000');
        await form.locator('select[name="category_id"]').selectOption({ index: 1 });
        await form.locator('.btn-submit-premium').click();

        await page.waitForURL(/\/admin\/autos\/\d+\/edit/);
        await assertNoServerErrors(page);
        await expect(page.locator('input[name="title"]')).toHaveValue(title);
    });

    test('classifieds index loads', async ({ page }) => {
        await page.goto('/admin/classifieds');
        await assertNoServerErrors(page);
        await expect(page.locator('body')).toContainText(/classified/i);
    });

    test('can create a classified from the admin form', async ({ page }) => {
        const title = `Browser Classified ${Date.now()}`;

        await page.goto('/admin/classifieds/create');
        await assertNoServerErrors(page);

        const form = page.locator('form[action*="/admin/classifieds"]');
        await form.locator('input[name="title"]').fill(title);
        await form.locator('textarea[name="description"]').fill('Created by Playwright classified CRUD test.');
        await form.locator('input[name="base_price"]').fill('150');
        await form.locator('select[name="category_id"]').selectOption({ index: 1 });
        await form.locator('.btn-submit-premium').click();

        await page.waitForURL(/\/admin\/classifieds\/\d+\/edit/);
        await assertNoServerErrors(page);
        await expect(page.locator('input[name="title"]')).toHaveValue(title);
    });

    test('can create a job from the admin form', async ({ page }) => {
        const title = `Browser Job ${Date.now()}`;

        await page.goto('/admin/jobs/create');
        await assertNoServerErrors(page);

        const form = page.locator('form[action*="/admin/jobs"]');
        await form.locator('input[name="title"]').fill(title);
        await form.locator('textarea[name="description"]').fill('Created by Playwright job CRUD test.');
        await form.locator('input[name="experience_level"]').fill('2');
        await form.locator('select[name="category_id"]').selectOption({ index: 1 });
        await form.locator('.btn-submit-premium').click();

        await page.waitForURL(/\/admin\/jobs\/\d+\/edit/);
        await assertNoServerErrors(page);
        await expect(page.locator('input[name="title"]')).toHaveValue(title);
    });
});
