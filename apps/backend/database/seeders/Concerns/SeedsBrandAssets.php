<?php

namespace Database\Seeders\Concerns;

use Illuminate\Support\Facades\File;

trait SeedsBrandAssets
{
    /**
     * Copy default logo/favicon from database/seeders/images into public storage.
     */
    protected function seedBrandAssetsFromSeederImages(): void
    {
        $sourceDir = database_path('seeders/images');
        $destDir = storage_path('app/public/settings');

        if (! is_dir($destDir)) {
            File::makeDirectory($destDir, 0755, true);
        }

        $assets = [
            ['site_logo', ['logo.png', 'logo.webp'], 'settings/logo.png'],
            ['site_favicon', ['favicon.ico'], 'settings/favicon.ico'],
        ];

        foreach ($assets as [$settingKey, $candidates, $storagePath]) {
            $source = null;

            foreach ($candidates as $candidate) {
                $path = $sourceDir . DIRECTORY_SEPARATOR . $candidate;

                if (is_file($path)) {
                    $source = $path;
                    break;
                }
            }

            if (! $source) {
                $this->command?->warn("Brand asset not found for {$settingKey} in database/seeders/images/");

                continue;
            }

            $destination = $destDir . DIRECTORY_SEPARATOR . basename($storagePath);
            File::copy($source, $destination);

            $this->command?->line("Copied brand asset: {$storagePath}");
        }
    }
}
