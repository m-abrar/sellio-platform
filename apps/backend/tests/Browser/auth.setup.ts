import { test as setup } from '@playwright/test';
import { loginAsAdmin } from './Admin/helpers/admin-auth';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const authDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.auth');
const authFile = path.join(authDir, 'admin.json');

setup('authenticate admin', async ({ page }) => {
    fs.mkdirSync(authDir, { recursive: true });
    await loginAsAdmin(page);
    await page.context().storageState({ path: authFile });
});
