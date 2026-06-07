import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export default async function globalSetup(): Promise<void> {
    if (process.env.PW_SKIP_DB_SETUP) {
        return;
    }

    execSync(
        'php artisan migrate:fresh --seeder=Database\\Seeders\\AdminTestSeeder --env=testing --force',
        { cwd: backendRoot, stdio: 'inherit' },
    );
}
