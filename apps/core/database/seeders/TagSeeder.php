<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Tag;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Preparing to clear Tags and Taggables tables...');

        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('taggables')->delete();
        DB::table('tags')->delete();
        
        $this->command->newLine();

        $tagsData = [
            // --- UNIVERSAL Tags ---
            [
                'title' => 'New Listing',
                'is_property' => true, 'is_event' => true, 'is_job' => true, 
                'is_auto' => true, 'is_service' => true, 'is_classified' => true,
                'is_product' => true, 'is_blog' => true,
            ],
            [
                'title' => 'Urgent',
                'is_job' => true, 'is_auto' => true, 'is_product' => true, 'is_blog' => true,
                'is_property' => false, 'is_event' => false, 'is_service' => false, 'is_classified' => false,
            ],

            // --- BLOG Specific Tags (New) ---
            [
                'title' => 'Trending',
                'is_blog' => true, 'is_product' => true, 'is_classified' => true,
            ],
            [
                'title' => 'Expert Advice',
                'is_blog' => true, 'is_service' => true,
            ],
            [
                'title' => 'Long Read',
                'is_blog' => true,
            ],
            [
                'title' => 'Case Study',
                'is_blog' => true, 'is_job' => true, 'is_service' => true,
            ],
            [
                'title' => 'Interview',
                'is_blog' => true, 'is_event' => true,
            ],

            // --- PRODUCT / SHOP Tags ---
            [
                'title' => 'Best Seller',
                'is_product' => true,
            ],
            [
                'title' => 'On Sale',
                'is_product' => true, 'is_auto' => true, 'is_classified' => true,
            ],
            [
                'title' => 'Free Shipping',
                'is_product' => true, 'is_classified' => true,
            ],

            // --- PROPERTY Tags ---
            [
                'title' => 'Luxury',
                'is_property' => true, 'is_auto' => true, 'is_product' => true,
            ],
            [
                'title' => 'Pet-Friendly',
                'is_property' => true, 'is_event' => true, 'is_product' => true,
            ],
        ];

        // Prepare data for insertion
        $insertData = collect($tagsData)->map(function ($tag) {
            return [
                'title'         => $tag['title'],
                'slug'          => Str::slug($tag['title']),
                'is_published'  => true,
                'is_property'   => $tag['is_property'] ?? false,
                'is_event'      => $tag['is_event'] ?? false,
                'is_job'        => $tag['is_job'] ?? false,
                'is_auto'       => $tag['is_auto'] ?? false,
                'is_service'    => $tag['is_service'] ?? false,
                'is_classified' => $tag['is_classified'] ?? false,
                'is_product'    => $tag['is_product'] ?? false,
                'is_blog'       => $tag['is_blog'] ?? false,
                'created_at'    => now(),
                'updated_at'    => now(),
            ];
        })
        ->unique('slug')
        ->all();

        $this->command->info('Inserting ' . count($insertData) . ' tags into the database...');

        Tag::insert($insertData);
        
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->command->info('✅ Tag seeding complete! ' . count($insertData) . ' tags created.');
    }
}