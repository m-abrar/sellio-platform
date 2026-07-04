<?php

namespace Database\Seeders;

use Database\Seeders\Concerns\ChecksEnabledModules;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use App\Models\Tag;

/**
 * Class TagSeeder
 *
 * Seeds the polymorphic tag taxonomy with module-specific flags, color tokens,
 * and sort orders for use across all marketplace verticals via the taggables pivot.
 */
class TagSeeder extends Seeder
{
    use ChecksEnabledModules;

    /**
     * Maps each tag flag to its `is_section.*` settings key.
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

    public function run(): void
    {
        $this->command->info('Preparing to clear Tags and Taggables tables...');

        Schema::disableForeignKeyConstraints();
        DB::table('taggables')->delete();
        DB::table('tags')->delete();
        
        $this->command->newLine();

        // Define tags with additional UI metadata
        $tagsData = [
            // --- UNIVERSAL Tags ---
            [
                'title' => 'New Listing', 'color' => '#17a2b8', 'sort_order' => 10,
                'is_property' => true, 'is_event' => true, 'is_job' => true, 
                'is_auto' => true, 'is_service' => true, 'is_classified' => true,
                'is_product' => true, 'is_blog' => true,
            ],
            [
                'title' => 'Urgent', 'color' => '#dc3545', 'sort_order' => 5,
                'is_job' => true, 'is_auto' => true, 'is_product' => true, 'is_blog' => true,
            ],
            [
                'title' => 'Trending', 'color' => '#ffc107', 'sort_order' => 15,
                'is_blog' => true, 'is_product' => true, 'is_classified' => true,
            ],
            [
                'title' => 'Expert Advice', 'color' => '#28a745', 'sort_order' => 20,
                'is_blog' => true, 'is_service' => true,
            ],
            [
                'title' => 'Luxury', 'color' => '#6f42c1', 'sort_order' => 25,
                'is_property' => true, 'is_auto' => true, 'is_product' => true,
            ],
            [
                'title' => 'Best Seller', 'color' => '#fd7e14', 'sort_order' => 30,
                'is_product' => true,
            ],
            [
                'title' => 'On Sale', 'color' => '#e83e8c', 'sort_order' => 35,
                'is_product' => true, 'is_auto' => true, 'is_classified' => true,
            ],
        ];

        $count = 0;
        foreach ($tagsData as $data) {
            $flags = [
                'is_property'   => ($data['is_property'] ?? false) && $this->isFlagEnabled('is_property'),
                'is_event'      => ($data['is_event'] ?? false) && $this->isFlagEnabled('is_event'),
                'is_job'        => ($data['is_job'] ?? false) && $this->isFlagEnabled('is_job'),
                'is_auto'       => ($data['is_auto'] ?? false) && $this->isFlagEnabled('is_auto'),
                'is_service'    => ($data['is_service'] ?? false) && $this->isFlagEnabled('is_service'),
                'is_classified' => ($data['is_classified'] ?? false) && $this->isFlagEnabled('is_classified'),
                'is_product'    => ($data['is_product'] ?? false) && $this->isFlagEnabled('is_product'),
                'is_blog'       => ($data['is_blog'] ?? false) && $this->isFlagEnabled('is_blog'),
            ];

            // Skip tags that end up with no enabled module left to belong to.
            if (! in_array(true, $flags, true)) {
                continue;
            }

            Tag::updateOrCreate(
                ['slug' => Str::slug($data['title']) . '-' . Str::random(5)],
                array_merge([
                    'title'         => $data['title'],
                    'color'         => $data['color'] ?? '#6c757d',
                    'sort_order'    => $data['sort_order'] ?? 0,
                    'status'        => 'active',
                    'admin_note'    => 'System default tag.',
                    'is_premium'    => false,
                    'is_published'  => true,
                ], $flags)
            );
            $count++;
        }

        Schema::enableForeignKeyConstraints();

        $this->command->info("✅ Tag seeding complete! {$count} tags created/updated.");
    }

    /**
     * Whether the module a given `is_*` flag belongs to is enabled.
     */
    private function isFlagEnabled(string $flag): bool
    {
        $moduleKey = self::MODULE_KEYS[$flag] ?? null;

        return $moduleKey === null || $this->isModuleEnabled($moduleKey);
    }
}