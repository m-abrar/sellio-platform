<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Faker\Factory as Faker;
use App\Models\Blog;

/**
 * Class BlogSeeder
 *
 * Seeds the database with sample Blog posts, including editorial content,
 * author assignments, and polymorphic relationships (Tags/Features).
 */
class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $totalBlogsToCreate = 20;

        // Counters for tracking seeding results
        $totalBlogsCreated = 0;
        $totalTagsAttached = 0;

        // 🎯 Header Line
        $this->command->line("📝 Seeding Blog posts and tag data (**$totalBlogsToCreate** total)...");

        // 1. Fetch Necessary IDs from Related Tables
        $userIds = DB::table('users')->pluck('id')->toArray();
        $categoryIds = DB::table('categories')->where('is_blog', true)->pluck('id')->toArray();
        // Assuming tags use a morphToMany relationship as per your Model
        $tagIds = DB::table('tags')->pluck('id')->toArray();

        $maxUsers = count($userIds);
        $maxCategories = count($categoryIds);
        $maxTags = count($tagIds);

        // Fail-safe check
        if ($maxUsers === 0 || $maxCategories === 0) {
            $this->command->error('❌ Skipping BlogSeeder: Missing dependencies (Users or Blog Categories).');
            return;
        }

        // 2. Create sample blogs
        foreach (range(1, $totalBlogsToCreate) as $index) {
            $title = $faker->sentence(6);
            $createdAt = $faker->dateTimeThisYear();

            // Video Data (Matching your property logic)
            $videoData = $faker->boolean(40) ? $faker->randomElement([
                '<iframe width="560" height="315" src="https://www.youtube.com/embed/'. $faker->bothify('???????????') .'" frameborder="0" allowfullscreen></iframe>',
                'https://www.youtube.com/watch?v=' . $faker->bothify('???????????'),
            ]) : null;

            // --- Create Blog record ---
            $blog = Blog::create([
                // Foreign Keys
                'user_id'     => $faker->randomElement($userIds),
                'category_id' => $faker->randomElement($categoryIds),

                // Content
                'title'       => $title,
                'slug'        => Str::slug($title) . '-' . Str::random(5),
                'subtitle'    => $faker->sentence(10),
                'content'     => $faker->paragraphs(8, true),
                
                // Blog Specifics
                'reading_time' => $faker->numberBetween(3, 15),
                'view_count'   => $faker->numberBetween(50, 5000),
                'video'        => $videoData,

                // Hardened Moderation & Status
                'status'                => 'published',
                'admin_note'            => 'Automatically approved editorial post.',
                'is_verified_author'    => $faker->boolean(70),

                // Status Flags
                'is_published'   => true,
                'is_featured'    => $faker->boolean(20),
                'allow_comments' => $faker->boolean(80),

                // SEO
                'meta_title'       => $title,
                'meta_description' => $faker->sentence(20),

                // Timestamp Consistency
                'published_at' => now(),
                'created_at'   => $createdAt,
                'updated_at'   => $createdAt, 
            ]);

            $totalBlogsCreated++;

            // 3. Attach Tags (MorphToMany)
            if ($maxTags > 0) {
                $tagCount = $faker->numberBetween(2, min(5, $maxTags));
                $randomTagIds = $faker->randomElements($tagIds, $tagCount);
                $blog->tags()->attach($randomTagIds);
                $totalTagsAttached += count($randomTagIds);
            }
        }
        
        // 4. Seeding Summary
        $this->command->newLine();
        $this->command->info('--- Blog Seeding Summary ---');
        $this->command->info("   > **$totalBlogsCreated** Blog records created.");
        $this->command->info("   > **$totalTagsAttached** Tags attached via polymorphic pivot.");

        // 🎉 Success Footer
        $this->command->line('✅ Blog Seeder finished.');
    }
}