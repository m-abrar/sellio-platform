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
        $blogTitles = [
            '10 Trends Shaping the Future of Marketplaces', 'Mastering the Art of Digital Property Investment',
            'The Ultimate Guide to Luxury Automotive Care', 'How to Build a High-Performing Remote Team',
            'Designing for the Modern User: A UX Masterclass', 'Maximizing Your ROI in a Global Economy',
            'The Rise of Sustainable Living and Eco-Homes', 'Cybersecurity Best Practices for 2024',
            'Exploring the New Frontier of AI in E-commerce', 'Lifestyle: The Best Travel Destinations for Founders',
            'The Evolution of Smart Home Technology', 'How to Negotiate Your Next Corporate Contract',
            'Creative Agency Secrets: Building Iconic Brands', 'Data-Driven Decision Making for Small Business',
            'The Future of Work: Hybrid Models and Beyond', 'Essential Tech Stacks for Modern Startups',
            'Navigating the Complexities of International Trade', 'The Art of Minimalist Living in a Busy World',
            'Health & Wellness: Productivity Hacks for Executives', 'The Impact of Blockchain on Real Estate'
        ];

        foreach (range(1, $totalBlogsToCreate) as $index) {
            $title = $blogTitles[$index - 1] ?? $faker->sentence(8);
            $createdAt = $faker->dateTimeThisYear();

            // Video Data
            $videoData = $faker->boolean(40) ? $faker->randomElement([
                '<iframe width="560" height="315" src="https://www.youtube.com/embed/ScMzIvxBSi4" frameborder="0" allowfullscreen></iframe>',
                'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            ]) : null;

            // --- Create Blog record ---
            $blog = Blog::create([
                // Foreign Keys
                'user_id'     => $faker->randomElement($userIds),
                'category_id' => $faker->randomElement($categoryIds),

                // Content
                'title'       => $title,
                'slug'        => Str::slug($title) . '-' . Str::random(5),
                'subtitle'    => $faker->realText(80),
                'content'     => $faker->realText(2000), // Immersive editorial content
                
                // Blog Specifics
                'reading_time' => $faker->numberBetween(5, 12),
                'view_count'   => $faker->numberBetween(100, 15000),
                'video'        => $videoData,

                // Hardened Moderation & Status
                'status'                => 'published',
                'admin_note'            => 'Editorial verified content.',
                'is_verified_author'    => true,

                // Status Flags
                'is_published'   => true,
                'is_featured'    => $faker->boolean(25),
                'allow_comments' => true,

                // SEO
                'meta_title'       => "$title | Sellio Insights",
                'meta_description' => $faker->realText(160),

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