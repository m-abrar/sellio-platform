<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Property;
use App\Models\Event;
use App\Models\Auto;
use App\Models\Service;
use App\Models\Joblisting;
use App\Models\Classified;
use App\Models\User;
use Faker\Factory as Faker;

class ActivityLogSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $this->command->info('🚀 Starting High-Volume Activity Log Seeder...');

        $modelClasses = [
            'Property'   => Property::class,
            'Event'      => Event::class,
            'Auto'       => Auto::class,
            'Service'    => Service::class,
            'Joblisting' => Joblisting::class,
            'Classified' => Classified::class,
        ];

        $userIds = User::pluck('id')->toArray();
        if (empty($userIds)) {
            $this->command->error('❌ No users found. Please seed users first.');
            return;
        }

        $this->command->warn('🗑️ Truncating activity_log table...');
        DB::table('activity_log')->delete();

        $totalLogs = 0;

        foreach ($modelClasses as $modelName => $modelClass) {
            $this->command->line("\n--- Generating multiple views for {$modelName} ---");

            // Process in chunks to handle large datasets without memory issues
            $modelClass::chunk(100, function ($records) use ($faker, $userIds, $modelClass, &$totalLogs) {
                $logInserts = [];

                foreach ($records as $record) {
                    // Generate a random number of views (10 to 100) per specific item
                    $viewCount = $faker->numberBetween(10, 100);

                    for ($i = 0; $i < $viewCount; $i++) {
                        $randomDayOffset = $faker->numberBetween(-180, 180);
                        $timestamp = now()->addDays($randomDayOffset)
                                          ->addHours(rand(0, 23))
                                          ->addMinutes(rand(0, 59));

                        $logInserts[] = [
                            'log_name'     => 'listings',
                            'description'  => 'viewed_listing',
                            'subject_type' => $modelClass,
                            'subject_id'   => $record->id,
                            'causer_type'  => User::class,
                            'causer_id'    => $faker->randomElement($userIds),
                            'properties'   => json_encode(['ip' => $faker->ipv4]),
                            'created_at'   => $timestamp,
                            'updated_at'   => $timestamp,
                        ];
                    }
                }

                // Bulk insert this chunk
                DB::table('activity_log')->insert($logInserts);
                $totalLogs += count($logInserts);
                $this->command->info("   ✅ Logged batch of " . count($logInserts) . " views...");
            });
        }

        $this->command->info("\n🎉 Done! Total activity logs created: {$totalLogs}.");
    }
}