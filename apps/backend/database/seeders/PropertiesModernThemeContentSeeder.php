<?php

namespace Database\Seeders;

use App\Models\PageContent;
use Illuminate\Database\Seeder;

/**
 * Updates properties_modern homepage CMS copy without re-running the full ThemeSeeder.
 */
class PropertiesModernThemeContentSeeder extends Seeder
{
    public function run(): void
    {
        $slots = require __DIR__ . '/data/properties_modern_home_content.php';

        foreach ($slots as $slot) {
            PageContent::updateOrCreate([
                'theme_key' => 'properties_modern',
                'page' => 'home',
                'section' => $slot['section'],
                'content_key' => $slot['content_key'],
            ], [
                'input_type' => $slot['input_type'],
                'value' => $slot['value'],
            ]);
        }
    }
}
