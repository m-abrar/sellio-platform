<?php

// File: database/seeders/FavoriteSeeder.php

namespace Database\Seeders;

use App\Models\Auto;
use App\Models\Blog;
use App\Models\Classified;
use App\Models\Event;
use App\Models\Favorite;
use App\Models\JobListing;
use App\Models\Product;
use App\Models\Property;
use App\Models\Service;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Class FavoriteSeeder
 *
 * Creates dummy 'favorite' records to establish a test base of user preferences
 * across different modules using polymorphic relationships.
 */
class FavoriteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Iterates through available listings of multiple types and assigns 1-3 random
     * users to "favorite" them, simulating user activity.
     *
     * @return void
     */
    public function run(): void
    {
        // ❤️ Header Line with Emoji (Yellow Text)
        $this->command->line('❤️ Seeding Favorites (Polymorphic Relationships)...');
        
        // Initial count before seeding
        $initialCount = DB::table('favorites')->count();

        $faker = Faker::create();
        $userIds = User::pluck('id')->toArray();
        
        // Ensure there are enough users to create meaningful favorites
        if (count($userIds) < 2) {
            // ⚠️ Use warn() for a non-critical skip scenario
            $this->command->line('⚠️ Skipping FavoriteSeeder: Not enough users (requires 2 or more).');
            // 🎉 Success Footer (Still print a footer even on skip)
            $this->command->line('✅ Favorites Seeding finished (Skipped).');
            return;
        }

        // Collect all models that can be favorited using their fully qualified class names.
        $favoritableModels = [
            'App\Models\Property' => Property::all(),
            'App\Models\JobListing' => JobListing::all(),
            'App\Models\Service' => Service::all(),
            'App\Models\Classified' => Classified::all(),
            'App\Models\Auto' => Auto::all(),
            'App\Models\Event' => Event::all(),
            'App\Models\Product' => Product::all(),
            'App\Models\Blog' => Blog::all(),
        ];

        // Store all favorite records to insert in bulk
        $favoriteRecords = [];
        
        foreach ($favoritableModels as $type => $listings) {
            
            // Skip if no listings of this type exist
            if ($listings->isEmpty()) continue;

            foreach ($listings as $listing) {
                
                // Exclude the listing owner from the list of users who can favorite it 
                $availableUsers = array_diff($userIds, [$listing->user_id]);
                
                if (empty($availableUsers)) continue;

                // Determine a random number of favorites for this specific listing (1 to 3)
                $numFavorites = $faker->numberBetween(1, min(3, count($availableUsers)));
                
                // Select random users to favorite this listing
                $favoriterIds = $faker->randomElements($availableUsers, $numFavorites);

                foreach ($favoriterIds as $favoriterId) {
                    $favoriteRecords[] = [
                        'user_id' => $favoriterId,
                        // Polymorphic ID and Type columns
                        'favoritable_id' => $listing->id,
                        'favoritable_type' => $type,
                        // Ensure created_at is after the listing itself was created
                        'created_at' => $faker->dateTimeBetween($listing->created_at, 'now'),
                        'updated_at' => now(),
                    ];
                }
            }
        }

        // Insert all collected records in a single batch
        if (!empty($favoriteRecords)) {
            // Use DB::table for efficiency in bulk insertion into the pivot table.
            // Note: array_unique is kept, but it uses SORT_REGULAR which is less efficient
            // than ensuring uniqueness by design. For simplicity, we keep the original logic.
            DB::table('favorites')->insert(array_unique($favoriteRecords, SORT_REGULAR));

            // Final count after seeding
            $finalCount = DB::table('favorites')->count();
            $recordsCreated = $finalCount - $initialCount;

            // 🔢 Count Display (Green Text)
            $this->command->info("   > **$recordsCreated** new favorite records created.");
            
        } else {
             // ℹ️ Use info() if there are enough users but no listings to favorite
             $this->command->info('   > No listings found to seed favorite records.');
        }

        // 🎉 Success Footer (Yellow Text with Emoji)
        $this->command->line('✅ Favorites Seeding finished.');
    }
}