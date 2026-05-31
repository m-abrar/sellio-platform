import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const envFile = path.join(backendRoot, '.env');
const envBackup = path.join(backendRoot, '.env.bak');
const lockFile = path.join(backendRoot, 'installed.lock');
const lockBackup = path.join(backendRoot, 'installed.lock.bak');

export default async function globalSetup(): Promise<void> {
    if (!fs.existsSync(envBackup) && fs.existsSync(envFile)) {
        fs.copyFileSync(envFile, envBackup);
    }

    if (fs.existsSync(lockFile) && !fs.existsSync(lockBackup)) {
        fs.copyFileSync(lockFile, lockBackup);
    }

    execSync('php scripts/reset-installer-state.php', { cwd: backendRoot, stdio: 'inherit' });
}
