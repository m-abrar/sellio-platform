<?php

namespace Database\Seeders;

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
            Tag::updateOrCreate(
                ['slug' => Str::slug($data['title']) . '-' . Str::random(5)],
                [
                    'title'         => $data['title'],
                    'color'         => $data['color'] ?? '#6c757d',
                    'sort_order'    => $data['sort_order'] ?? 0,
                    'status'        => 'active',
                    'admin_note'    => 'System default tag.',
                    'is_premium'    => false,
                    'is_published'  => true,
                    'is_property'   => $data['is_property'] ?? false,
                    'is_event'      => $data['is_event'] ?? false,
                    'is_job'        => $data['is_job'] ?? false,
                    'is_auto'       => $data['is_auto'] ?? false,
                    'is_service'    => $data['is_service'] ?? false,
                    'is_classified' => $data['is_classified'] ?? false,
                    'is_product'    => $data['is_product'] ?? false,
                    'is_blog'       => $data['is_blog'] ?? false,
                ]
            );
            $count++;
        }

        Schema::enableForeignKeyConstraints();

        $this->command->info("✅ Tag seeding complete! {$count} tags created/updated.");
    }
}