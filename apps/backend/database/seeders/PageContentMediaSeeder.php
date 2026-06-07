<?php

namespace Database\Seeders;

use App\Models\PageContent;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

/**
 * Attaches demo images to theme CMS slots from database/seeders/images/.
 * Replaces legacy /themes/... static paths — no public/themes bundle required.
 */
class PageContentMediaSeeder extends Seeder
{
    /** @var array<string, string> */
    protected array $themePrefixFolders = [
        'properties' => 'property',
        'property' => 'property',
        'events' => 'event',
        'event' => 'event',
        'autos' => 'auto',
        'auto' => 'auto',
        'jobs' => 'joblisting',
        'job' => 'joblisting',
        'ecommerce' => 'product',
        'products' => 'product',
        'product' => 'product',
        'services' => 'service',
        'service' => 'service',
        'classifieds' => 'classified',
        'classified' => 'classified',
        'unifieds' => 'property',
        'unified' => 'property',
        'blogs' => 'blog',
        'blog' => 'blog',
    ];

    public function run(): void
    {
        config(['app.skip_media_conversions' => true]);

        $basePath = database_path('seeders/images');
        $supportedExtensions = '*.{jpg,jpeg,png,gif,webp,bmp}';
        $attached = 0;
        $skipped = 0;

        $slots = PageContent::query()
            ->whereIn('input_type', ['image', 'logo', 'file'])
            ->get();

        $this->command->info("Attaching seeder images to {$slots->count()} CMS media slots...");

        foreach ($slots as $slot) {
            if ($slot->hasMedia(PageContent::PRIMARY_MEDIA)) {
                continue;
            }

            $folder = $this->resolveImageFolder($slot->theme_key);
            $folderPath = $basePath . DIRECTORY_SEPARATOR . $folder;
            $files = is_dir($folderPath)
                ? glob($folderPath . '/' . $supportedExtensions, GLOB_BRACE) ?: []
                : [];

            if ($files === []) {
                $files = glob($basePath . '/' . $supportedExtensions, GLOB_BRACE) ?: [];
            }

            if ($files === []) {
                $skipped++;
                continue;
            }

            $imagePath = $files[$slot->id % count($files)];

            if (! File::exists($imagePath)) {
                $skipped++;
                continue;
            }

            $slot->addMedia($imagePath)
                ->preservingOriginal()
                ->toMediaCollection(PageContent::PRIMARY_MEDIA);

            if ($slot->value && str_starts_with((string) $slot->value, '/themes/')) {
                $slot->forceFill(['value' => null])->save();
            }

            $attached++;
        }

        $this->command->info("✅ CMS media attached: {$attached}. Skipped (no source file): {$skipped}.");
    }

    protected function resolveImageFolder(string $themeKey): string
    {
        $prefix = strtolower(explode('_', $themeKey)[0] ?? '');

        return $this->themePrefixFolders[$prefix] ?? 'property';
    }
}
