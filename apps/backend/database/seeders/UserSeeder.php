<?php

// database/seeders/UserSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Faker\Factory as Faker;
use App\Models\User; // REQUIRED: Import the User Model for creation and lookups
use App\Models\Review; // REQUIRED: Import the Review Model for polymorphic relations
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;

/**
 * Seeds the database with various types of users (Admin, Partner, Buyer, Regular)
 * and attaches sample polymorphic reviews to them.
 *
 * This seeder is fundamental for setting up a functional development environment
 * with pre-defined credentials and roles.
 */
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Creates specific test users (Admin, Partner, Buyer) and a batch of
     * randomized regular users, then generates sample reviews between them.
     *
     * @return void
     */
    public function run(): void
    {
        $initialUserCount = User::count();
        $initialReviewCount = Review::count();

        // 1. Display the Header Line
        $this->command->info('👤✨ Starting **User Seeder**...');
        $this->command->line("Existing Users: {$initialUserCount} | Existing Reviews: {$initialReviewCount}");
        $this->command->newLine();

        // Initialize Faker instance for generating random data
        $faker = Faker::create();

        /** @var User[]|Collection $users Array to hold User model instances for later use (e.g., reviews). */
        $users = [];

        /**
         * Helper function to create a unique, slugified username.
         *
         * It takes a name string, slugifies it, and appends a numeric suffix
         * if a user with that username already exists.
         *
         * @param string $name The base name to derive the username from.
         * @return string The unique, generated username.
         */
        $generateUniqueUsername = function (string $name) {
            // Convert the name to a slug (e.g., 'John Doe' -> 'john_doe').
            $baseUsername = Str::slug($name, '_');
            $username = $baseUsername;
            $i = 1;

            // Check if the generated username already exists in the database.
            while (User::where('username', $username)->exists()) {
                // If it exists, append a counter (e.g., 'john_doe_1', 'john_doe_2').
                $username = $baseUsername . '_' . $i++;
            }
            return $username;
        };

        // --- Seeding Logic Start ---
        $this->command->line('Creating core test users (Admin, Partner, Buyer)...');

        // 1. Create a Primary Admin User for system management
        $adminName = 'Alexander Thorne';
        $admin = User::create([
            'name' => $adminName,
            'email' => 'admin@sellio-platform.test',
            'email_verified_at' => now(),
            // Securely hash a standard password for easy development access.
            'password' => Hash::make('admin123'),
            'phone' => '+1 (555) 012-3456',
            'is_admin' => true, // Flag this user as a system administrator

            'username' => 'super_admin', // Fixed, non-generated username for easy recall
            'bio' => 'Senior Platform Administrator with over 15 years of experience in marketplace orchestration and digital ecosystem management. Overseeing global operations and system integrity.',
            'status' => 'active',
            'is_premium' => true,
            'admin_note' => 'System root administrator.',
            'is_partner' => false,
            'is_verified' => true, // Admins are automatically verified
            'date_of_birth' => '1985-05-15',
            'years_of_experience' => 15,

            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $users[] = $admin;
        $this->command->info('  - Created Admin User: admin@sellio-platform.test (admin123)');

        // 2. Create a Key Partner User for testing commission and marketplace features
        $partnerName = 'Julian Sterling';
        $partner = User::create([
            'name' => $partnerName,
            'email' => 'partner@sellio-platform.test',
            'email_verified_at' => now(),
            'password' => Hash::make('partner123'),
            'phone' => '+1 (555) 987-6543',
            'is_admin' => false,

            'username' => 'sterling_global',
            // Partner users have an associated company name
            'company' => 'Sterling Global Real Estate',
            'bio' => 'Founder of Sterling Global, specialized in luxury property acquisitions and high-end automotive trading. A premier partner since platform inception.',
            'status' => 'active',
            'is_premium' => true,
            'admin_note' => 'Verified VIP marketplace partner.',
            'is_partner' => true, // Explicitly set as a partner
            'is_verified' => true,
            'date_of_birth' => '1978-11-22',
            'years_of_experience' => 22,

            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $users[] = $partner;
        $this->command->info('  - Created Partner User: partner@sellio-platform.test (partner123)');

        // 3. Create a Key Buyer User for testing purchase and review features
        $buyerName = 'Eleanor Vance';
        $buyer = User::create([
            'name' => $buyerName,
            'email' => 'buyer@sellio-platform.test',
            'email_verified_at' => now(),
            'password' => Hash::make('buyer123'),
            'phone' => '+1 (555) 444-5555',
            'is_admin' => false,

            'username' => 'vance_curator',
            'company' => 'Vance Design Studio', // High-end buyers can have companies
            'bio' => 'International design consultant and frequent collector of premium digital assets and luxury lifestyle products.',
            'status' => 'active',
            'is_premium' => false,
            'admin_note' => 'High-value marketplace buyer.',
            'is_partner' => false,
            'is_buyer' => true, // Flag this user as a primary buyer
            'is_verified' => true,
            'date_of_birth' => '1992-03-08',
            'years_of_experience' => 8,

            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $users[] = $buyer;
        $this->command->info('  - Created Buyer User: buyer@sellio-platform.test (buyer123)');
        $this->command->newLine();

        // 4. Create 10 Regular Users with randomized attributes
        $this->command->line('Creating 20 Regular Users...');
        $regularUserCount = 0;
        foreach (range(1, 20) as $index) {
            $userName = $faker->name;
            // 30% chance of being a partner for mixed data
            $isPartner = $faker->boolean(30);

            $regularUser = User::create([
                'name' => $userName,
                'email' => 'user' . $index . '@sellio-platform.test',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'phone' => $faker->phoneNumber,
                'is_admin' => false,

                'username' => $generateUniqueUsername($userName),
                // Only partners receive a company attribute
                'company' => $isPartner ? $faker->unique()->company() : null,
                'bio' => $faker->paragraph(2),
                'status' => 'active',
                'is_premium' => $faker->boolean(10),
                'admin_note' => 'Randomized marketplace user.',
                'is_partner' => $isPartner,
                'is_buyer' => $faker->boolean(70),
                'is_verified' => $faker->boolean(80),
                'date_of_birth' => $faker->dateTimeBetween('-40 years', '-18 years')->format('Y-m-d'),
                // Experience is only relevant and populated for partner users
                'years_of_experience' => $isPartner ? $faker->numberBetween(1, 15) : 0,

                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $users[] = $regularUser;
            $regularUserCount++;
        }
        $this->command->info("  - **{$regularUserCount}** randomized users created.");
        $this->command->newLine();

        // 5. Attach Polymorphic Reviews to all created users
        $this->command->line('Generating polymorphic Reviews...');
        $reviewStatuses = ['approved', 'pending'];
        // Get an array of all user IDs to select reviewers from
        $userIds = collect($users)->pluck('id')->toArray();
        $totalReviewsCreated = 0;

        /** @var User $reviewedUser */
        foreach ($users as $reviewedUser) {
            // Ensure the reviewer cannot be the user being reviewed
            $availableReviewers = array_diff($userIds, [$reviewedUser->id]);

            $maxPossibleReviews = count($availableReviewers);
            // Skip review creation if no other users exist to review this user
            if ($maxPossibleReviews < 1) continue;

            // Generate a random number of reviews (1 to 5) from the available pool.
            $numReviews = $faker->numberBetween(1, min(5, $maxPossibleReviews));

            // Randomly select keys (indices) from the available reviewers array.
            $randomKeys = (array) array_rand($availableReviewers, $numReviews);
            // Map the selected keys back to the actual User IDs.
            $reviewerIds = array_map(fn($key) => $availableReviewers[$key], $randomKeys);

            /** @var int $reviewerId */
            foreach ($reviewerIds as $reviewerId) {

                // Create a polymorphic Review record linked to the User model.
                $reviewedUser->reviews()->create([
                    'user_id' => $reviewerId, // The ID of the user submitting the review
                    'rating' => $faker->numberBetween(1, 5),
                    'comment' => $faker->paragraphs(1, true),
                    'status' => $faker->randomElement($reviewStatuses), // Mix of approved and pending reviews
                    // Ensure the review creation date is after the user's creation date
                    'created_at' => $faker->dateTimeBetween($reviewedUser->created_at, 'now'),
                ]);
                $totalReviewsCreated++;
            }
        }
        $this->command->info("  - **{$totalReviewsCreated}** polymorphic reviews created.");
        // --- Seeding Logic End ---

        // 6. Display the Count and Success Footer
        $finalUserCount = User::count();
        $finalReviewCount = Review::count();
        $usersCreated = $finalUserCount - $initialUserCount;
        $reviewsCreated = $finalReviewCount - $initialReviewCount;

        $this->command->newLine();
        $this->command->info("📊 **Summary of Created Records**:");
        $this->command->info(" - Users Created: **{$usersCreated}**");
        $this->command->info(" - Reviews Created: **{$reviewsCreated}**");
        $this->command->line("Total Users: {$finalUserCount} | Total Reviews: {$finalReviewCount}");

        $this->command->newLine();
        $this->command->info('✅ User Seeder finished successfully!');
    }
}