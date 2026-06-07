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

        $admin = $this->seedCoreUser('admin@sellio-platform.test', 'admin123', [
            'name' => 'Alexander Thorne',
            'email_verified_at' => now(),
            'phone' => '+1 (555) 012-3456',
            'is_admin' => true,
            'username' => 'super_admin',
            'bio' => 'Senior Platform Administrator with over 15 years of experience in marketplace orchestration and digital ecosystem management. Overseeing global operations and system integrity.',
            'status' => 'active',
            'is_premium' => true,
            'admin_note' => 'System root administrator.',
            'is_partner' => false,
            'is_verified' => true,
            'date_of_birth' => '1985-05-15',
            'years_of_experience' => 15,
        ]);
        $users[] = $admin;
        $this->command->info('  - Core admin ready: admin@sellio-platform.test (admin123)');

        $partner = $this->seedCoreUser('partner@sellio-platform.test', 'partner123', [
            'name' => 'Julian Sterling',
            'email_verified_at' => now(),
            'phone' => '+1 (555) 987-6543',
            'is_admin' => false,
            'username' => 'sterling_global',
            'company' => 'Sterling Global Real Estate',
            'bio' => 'Founder of Sterling Global, specialized in luxury property acquisitions and high-end automotive trading. A premier partner since platform inception.',
            'status' => 'active',
            'is_premium' => true,
            'admin_note' => 'Verified VIP marketplace partner.',
            'is_partner' => true,
            'is_verified' => true,
            'date_of_birth' => '1978-11-22',
            'years_of_experience' => 22,
        ]);
        $users[] = $partner;
        $this->command->info('  - Core partner ready: partner@sellio-platform.test (partner123)');

        $buyer = $this->seedCoreUser('buyer@sellio-platform.test', 'buyer123', [
            'name' => 'Eleanor Vance',
            'email_verified_at' => now(),
            'phone' => '+1 (555) 444-5555',
            'is_admin' => false,
            'username' => 'vance_curator',
            'company' => 'Vance Design Studio',
            'bio' => 'International design consultant and frequent collector of premium digital assets and luxury lifestyle products.',
            'status' => 'active',
            'is_premium' => false,
            'admin_note' => 'High-value marketplace buyer.',
            'is_partner' => false,
            'is_buyer' => true,
            'is_verified' => true,
            'date_of_birth' => '1992-03-08',
            'years_of_experience' => 8,
        ]);
        $users[] = $buyer;
        $this->command->info('  - Core buyer ready: buyer@sellio-platform.test (buyer123)');
        $this->command->newLine();

        // 4. Create 20 Regular Users with randomized attributes
        $this->command->line('Creating 20 Regular Users...');
        $regularUserCount = 0;
        $batchUsers = [];
        $hashedPassword = Hash::make('password'); // Pre-hash for performance

        foreach (range(1, 20) as $index) {
            $userName = $faker->name;
            $isPartner = $faker->boolean(30);
            $slug = Str::slug($userName, '_');

            $batchUsers[] = [
                'uuid' => Str::uuid(),
                'name' => $userName,
                'email' => 'user' . $index . '@sellio-platform.test',
                'email_verified_at' => now(),
                'password' => $hashedPassword,
                'phone' => $faker->phoneNumber,
                'is_admin' => false,
                'username' => $slug . '_' . $faker->unique()->numberBetween(1000, 9999),
                'company' => $isPartner ? $faker->unique()->company() : null,
                'bio' => $faker->paragraph(2),
                'status' => 'active',
                'is_premium' => $faker->boolean(10),
                'admin_note' => 'Randomized marketplace user.',
                'is_partner' => $isPartner,
                'is_buyer' => $faker->boolean(70),
                'is_verified' => $faker->boolean(80),
                'date_of_birth' => $faker->dateTimeBetween('-40 years', '-18 years')->format('Y-m-d'),
                'years_of_experience' => $isPartner ? $faker->numberBetween(1, 15) : 0,
                'remember_token' => Str::random(10),
                'created_at' => now()->toDateTimeString(),
                'updated_at' => now()->toDateTimeString(),
            ];
            $regularUserCount++;
        }
        $existingEmails = User::whereIn('email', array_column($batchUsers, 'email'))
            ->pluck('email')
            ->all();
        $batchUsers = array_values(array_filter(
            $batchUsers,
            fn (array $user) => ! in_array($user['email'], $existingEmails, true),
        ));
        $skippedRegularUsers = $regularUserCount - count($batchUsers);

        if (! empty($batchUsers)) {
            User::insert($batchUsers);
        }

        $createdRegularUsers = count($batchUsers);
        $this->command->info("  - **{$createdRegularUsers}** randomized users created.");
        if ($skippedRegularUsers > 0) {
            $this->command->line("  - Skipped {$skippedRegularUsers} existing randomized user(s).");
        }
        $this->command->newLine();

        // 5. Attach Polymorphic Reviews to all created users
        $this->command->line('Generating polymorphic Reviews...');

        if ($initialReviewCount > 0) {
            $this->command->line('  - Skipping review generation — reviews already present.');
        } else {
            $reviewStatuses = ['approved', 'pending'];

            $allUsers = User::all();
            $userIds = $allUsers->pluck('id')->toArray();
            $batchReviews = [];

            foreach ($allUsers as $reviewedUser) {
                $availableReviewers = array_values(array_diff($userIds, [$reviewedUser->id]));
                $maxPossibleReviews = count($availableReviewers);

                if ($maxPossibleReviews < 1) {
                    continue;
                }

                $numReviews = $faker->numberBetween(1, min(5, $maxPossibleReviews));
                $randomKeys = (array) array_rand($availableReviewers, $numReviews);
                $reviewerIds = array_map(fn ($key) => $availableReviewers[$key], $randomKeys);

                foreach ($reviewerIds as $reviewerId) {
                    $batchReviews[] = [
                        'user_id' => $reviewerId,
                        'rating' => $faker->numberBetween(1, 5),
                        'comment' => $faker->paragraphs(1, true),
                        'status' => $faker->randomElement($reviewStatuses),
                        'reviewable_id' => $reviewedUser->id,
                        'reviewable_type' => User::class,
                        'created_at' => $faker->dateTimeBetween($reviewedUser->created_at, 'now')->format('Y-m-d H:i:s'),
                        'updated_at' => now()->toDateTimeString(),
                    ];
                }
            }

            if (! empty($batchReviews)) {
                Review::insert($batchReviews);
            }

            $this->command->info('  - **' . count($batchReviews) . '** polymorphic reviews created.');
        }
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

    /**
     * Create or refresh a core demo account without violating unique email constraints.
     */
    private function seedCoreUser(string $email, string $plainPassword, array $attributes): User
    {
        $existing = User::where('email', $email)->first();

        $attributes['password'] = Hash::make($plainPassword);
        $attributes['remember_token'] = Str::random(10);
        $attributes['updated_at'] = now();

        if (! $existing) {
            $attributes['created_at'] = now();
        } elseif (empty($existing->uuid)) {
            $attributes['uuid'] = (string) Str::uuid();
        }

        return User::updateOrCreate(['email' => $email], $attributes);
    }
}