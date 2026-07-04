<?php

namespace Database\Seeders;

use Database\Seeders\Concerns\ChecksEnabledModules;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Class FeatureSeeder
 *
 * Populates the 'features' table with characteristics for listings,
 * now including Shop/Product module features.
 */
class FeatureSeeder extends Seeder
{
    use ChecksEnabledModules;

    /**
     * Maps each feature flag to its `is_section.*` settings key.
     */
    private const MODULE_KEYS = [
        'is_property'   => 'properties',
        'is_auto'       => 'autos',
        'is_event'      => 'events',
        'is_job'        => 'jobs',
        'is_service'    => 'services',
        'is_classified' => 'classifieds',
        'is_product'    => 'products',
        'is_blog'       => 'blog',
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $this->command->line('🛠️ Seeding Features (Lookup Table)...');

        $initialCount = DB::table('features')->count();

        // 1. Define module-specific features
        $moduleFeatures = [
            'is_property' => [
                'Waterfront View',
                'Energy Star Certified',
                'Smart Home Integration',
                'Central Air Conditioning',
            ],
            'is_auto' => [
                'Heated Seats',
                'Backup Camera',
                'Sunroof/Moonroof',
                'Four-Wheel Drive (4WD)',
            ],
            'is_classified' => [
                '4K Entertainment System', 
                'Original Box Included',
                'Like New Condition',
            ],
            'is_product' => [
                'Gift Wrap Available',
                'Eco-Friendly Packaging',
                'International Warranty',
                'Bulk Discount Available',
            ],
            'is_blog' => [
                'Interactive Media',
                'Guest Author',
                'Video Transcript Included',
                'Downloadable Assets',
                'Editor\'s Choice',
            ],
        ];

        // 2. Define generic features that apply to multiple modules
        $genericFeatures = [
            'Keyless Entry' => ['is_property', 'is_auto', 'is_service', 'is_classified'], 
            'Handicap Accessible' => ['is_property', 'is_event', 'is_job', 'is_service'], 
            'Voice Control' => ['is_auto', 'is_classified', 'is_product'],
            'Water Resistant' => ['is_auto', 'is_classified', 'is_product'],
            'Premium Content' => ['is_blog', 'is_product', 'is_service'],
        ];

        $featuresToInsert = [];

        // 3. Process Module-Specific Features
        foreach ($moduleFeatures as $moduleFlag => $featureNames) {
            if (! $this->isFlagEnabled($moduleFlag)) {
                continue;
            }

            foreach ($featureNames as $title) {
                $data = $this->getBaseFeatureData($title);

                // Set the specific module flag to true
                $data[$moduleFlag] = true;

                $featuresToInsert[] = $data;
            }
        }

        // 4. Process Generic/Multi-Module Features
        foreach ($genericFeatures as $title => $flags) {
            $enabledFlags = array_filter($flags, fn (string $flag) => $this->isFlagEnabled($flag));

            if ($enabledFlags === []) {
                continue;
            }

            $data = $this->getBaseFeatureData($title);

            // Set only the enabled-module flags to true
            foreach ($enabledFlags as $flag) {
                $data[$flag] = true;
            }

            $featuresToInsert[] = $data;
        }

        if ($featuresToInsert !== []) {
            DB::table('features')->insert($featuresToInsert);
        }

        $finalCount = DB::table('features')->count();
        $recordsCreated = $finalCount - $initialCount;

        $this->command->info("   > **$recordsCreated** new features created.");
        $this->command->line('✅ Features Seeding finished.');
    }

    /**
     * Whether the module a given `is_*` flag belongs to is enabled.
     */
    private function isFlagEnabled(string $flag): bool
    {
        $moduleKey = self::MODULE_KEYS[$flag] ?? null;

        return $moduleKey === null || $this->isModuleEnabled($moduleKey);
    }

    /**
     * Returns the base array for a feature with all module flags set to false.
     * Use this to keep the code DRY and ensure is_product is always present.
     */
    private function getBaseFeatureData(string $title): array
    {
        $colors = ['#1e4d4e', '#3949ab', '#ff7043', '#0891b2', '#059669', '#d4af37'];
        
        return [
            'title'         => $title,
            'slug'          => Str::slug($title) . '-' . Str::random(5),
            'color'         => collect($colors)->random(),
            'status'        => 'active',
            'admin_note'    => 'System default feature.',
            'is_premium'    => false,
            'is_property'   => false,
            'is_event'      => false,
            'is_job'        => false,
            'is_auto'       => false,
            'is_service'    => false,
            'is_classified' => false,
            'is_product'    => false,
            'is_blog'       => false,
            'is_published'  => true,
            'created_at'    => now(),
            'updated_at'    => now(),
        ];
    }
}