<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('page_contents')) {
            return;
        }

        $this->replaceThemeContent([
            ['header', 'brand_label', 'OrthoForge Instruments', 'Aadab International'],
            ['hero', 'eyebrow', 'ISO 13485-aligned orthopedic instrument manufacturing', 'Manufacturers & Exporters - Sialkot, Pakistan'],
            ['hero', 'description', 'We manufacture and export reusable orthopedic surgical instruments for hospitals, distributors, importers, and OEM buyers. Browse the catalog, shortlist items, and request export pricing directly from the factory.', 'Aadab International manufactures and exports reusable orthopedic surgical instruments from Sialkot, Pakistan for hospitals, distributors, importers, and OEM buyers. Browse the catalog, shortlist items, and request export pricing directly from the factory.'],
            ['footer', 'brand_label', 'OrthoForge Instruments', 'Aadab International'],
            ['footer', 'description', 'We manufacture and export reusable orthopedic surgical instruments for hospitals, importers, distributors, and OEM buyers. Browse the catalog and request pricing directly from the factory.', 'Aadab International is a Sialkot, Pakistan based manufacturer and exporter of reusable orthopedic surgical instruments for hospitals, importers, distributors, and OEM buyers.'],
            ['footer', 'copyright', '(c) 2026 OrthoForge Instruments. All rights reserved.', '(c) 2026 Aadab International. All rights reserved.'],
        ]);
    }

    public function down(): void
    {
        if (! Schema::hasTable('page_contents')) {
            return;
        }

        $this->replaceThemeContent([
            ['header', 'brand_label', 'Aadab International', 'OrthoForge Instruments'],
            ['hero', 'eyebrow', 'Manufacturers & Exporters - Sialkot, Pakistan', 'ISO 13485-aligned orthopedic instrument manufacturing'],
            ['hero', 'description', 'Aadab International manufactures and exports reusable orthopedic surgical instruments from Sialkot, Pakistan for hospitals, distributors, importers, and OEM buyers. Browse the catalog, shortlist items, and request export pricing directly from the factory.', 'We manufacture and export reusable orthopedic surgical instruments for hospitals, distributors, importers, and OEM buyers. Browse the catalog, shortlist items, and request export pricing directly from the factory.'],
            ['footer', 'brand_label', 'Aadab International', 'OrthoForge Instruments'],
            ['footer', 'description', 'Aadab International is a Sialkot, Pakistan based manufacturer and exporter of reusable orthopedic surgical instruments for hospitals, importers, distributors, and OEM buyers.', 'We manufacture and export reusable orthopedic surgical instruments for hospitals, importers, distributors, and OEM buyers. Browse the catalog and request pricing directly from the factory.'],
            ['footer', 'copyright', '(c) 2026 Aadab International. All rights reserved.', '(c) 2026 OrthoForge Instruments. All rights reserved.'],
        ]);
    }

    private function replaceThemeContent(array $replacements): void
    {
        foreach ($replacements as [$section, $key, $from, $to]) {
            DB::table('page_contents')
                ->where('theme_key', 'ecommerce_b2b')
                ->where('page', 'home')
                ->where('section', $section)
                ->where('content_key', $key)
                ->where('value', $from)
                ->update([
                    'value' => $to,
                    'updated_at' => now(),
                ]);
        }
    }
};
