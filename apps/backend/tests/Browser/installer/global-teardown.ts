import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const envFile = path.join(backendRoot, '.env');
const envBackup = path.join(backendRoot, '.env.bak');
const lockFile = path.join(backendRoot, 'installed.lock');
const lockBackup = path.join(backendRoot, 'installed.lock.bak');

export default async function globalTeardown(): Promise<void> {
    if (fs.existsSync(envBackup)) {
        fs.copyFileSync(envBackup, envFile);
    }

    if (fs.existsSync(lockBackup)) {
        fs.copyFileSync(lockBackup, lockFile);
    } else if (fs.existsSync(lockFile)) {
        fs.unlinkSync(lockFile);
    }
}
