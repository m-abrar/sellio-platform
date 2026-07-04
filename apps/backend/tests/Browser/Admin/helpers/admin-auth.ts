import { expect, Page } from '@playwright/test';

const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@example.com';
const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';

export async function loginAsAdmin(page: Page): Promise<void> {
    await page.goto('/login');
    await page.locator('#email').fill(adminEmail);
    await page.locator('#password').fill(adminPassword);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(/\/admin/, { timeout: 30_000 });
}

export async function assertNoServerErrors(page: Page): Promise<void> {
    const body = await page.content();
    expect(body).not.toContain('SQLSTATE');
    expect(body).not.toContain('Undefined variable');
    expect(body).not.toMatch(/500\s+Server\s+Error/i);
}
