import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const installDb = process.env.INSTALL_TEST_DB ?? 'sellio_install_test';
const adminEmail = 'install-admin@sellio.test';
const adminPassword = 'install12345';
const adminName = 'Install Admin';

async function assertNoInstallerErrors(page: import('@playwright/test').Page): Promise<void> {
    const body = await page.content();
    expect(body).not.toContain('SQLSTATE');
    expect(body).not.toMatch(/❌/);
}

test.describe('Installer smoke', () => {
    test('runs the full web installer against a fresh database', async ({ page }) => {
        test.setTimeout(1_800_000);

        await page.goto('/install/');
        await expect(page.getByRole('heading', { name: /welcome to the sellio installer/i })).toBeVisible();
        await page.getByRole('link', { name: /begin setup wizard/i }).click();

        await page.waitForURL(/step=requirements/);
        await expect(page.getByText('PASS').first()).toBeVisible();
        await page.getByRole('link', { name: /continue setup/i }).click();

        await page.waitForURL(/step=environment/);
        await page.locator('#db_name').fill(installDb);
        if (await page.locator('#overwrite_env_check').isVisible()) {
            await page.locator('#overwrite_env_check').check();
        }
        await page.getByRole('button', { name: /connect & initialize/i }).click();
        await page.waitForURL(/step=packages/);
        await assertNoInstallerErrors(page);

        const vendorExists = fs.existsSync(path.join(backendRoot, 'vendor', 'autoload.php'));
        if (vendorExists) {
            // Dev trees already have vendor/; web SAPI composer autoload regen can hang for minutes.
            await page.goto('/install/?step=migration');
        } else {
            await expect(page.getByRole('button', { name: /execute package installation/i })).toBeVisible();
            await page.getByRole('button', { name: /execute package installation/i }).click();
            await expect(
                page.getByRole('link', { name: /next: data structure import/i }),
            ).toBeVisible({ timeout: 600_000 });
            await page.getByRole('link', { name: /next: data structure import/i }).click();
        }

        await page.waitForURL(/step=migration/);
        await page.getByRole('button', { name: /deploy schema architecture/i }).click();
        await expect(
            page.getByRole('link', { name: /next: configure modules/i }),
        ).toBeVisible({ timeout: 600_000 });
        await page.getByRole('link', { name: /next: configure modules/i }).click();

        await page.waitForURL(/step=modules/);
        await page.getByRole('button', { name: /finalize configuration/i }).click();
        await page.waitForURL(/step=seeding/);

        await page.getByRole('button', { name: /launch data import pipeline/i }).click();
        await expect(page.getByText('SEEDING PIPELINE FINISHED')).toBeVisible({ timeout: 1_500_000 });
        await page.goto('/install/?step=admin');

        await page.waitForURL(/step=admin/);
        await page.locator('input[name="name"]').fill(adminName);
        await page.locator('input[name="email"]').fill(adminEmail);
        await page.locator('input[name="password"]').fill(adminPassword);
        await page.locator('input[name="password_confirmation"]').fill(adminPassword);
        await page.getByRole('button', { name: /create account & finish setup/i }).click();

        await page.waitForURL(/step=platform_urls/);
        await page.locator('#api_url_copied').check();
        await page.getByRole('button', { name: /save & continue/i }).click();

        await page.waitForURL(/step=finished/);
        await expect(page.getByRole('heading', { name: /system online & ready/i })).toBeVisible();
        expect(fs.existsSync(path.join(backendRoot, 'installed.lock'))).toBeTruthy();

        await page.goto('/install/');
        await page.waitForURL(/\/($|\?)/);

        await page.goto('/login');
        await page.locator('#email').fill(adminEmail);
        await page.locator('#password').fill(adminPassword);
        await page.getByRole('button', { name: /sign in/i }).click();
        await page.waitForURL(/\/admin/);

        await page.goto('/');
        await assertNoInstallerErrors(page);
    });
});
