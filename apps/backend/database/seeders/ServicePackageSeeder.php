<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;
use App\Models\ServicePackage;
use Faker\Factory as Faker;
use Illuminate\Support\Str;

class ServicePackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $faker = Faker::create();
        $this->command->info('Seeding Service Packages (Tiers)...');

        // Performance: Use chunkById to prevent memory exhaustion on large datasets
        Service::orderBy('id')->chunkById(50, function ($services) use ($faker) {
            foreach ($services as $service) {
            // Define package templates
            $tiers = [
                [
                    'title' => 'Starter Package',
                    'price_multiplier' => 1.0, // Base price
                    'billing' => 'one-time',
                    'features' => ['Core Consultation', 'Email Support', 'Basic Documentation'],
                    'sort' => 1,
                    'popular' => false
                ],
                [
                    'title' => 'Professional Tier',
                    'price_multiplier' => 2.5,
                    'billing' => 'monthly',
                    'features' => ['Core Consultation', 'Priority Email Support', 'Full Documentation', '2 Revision Rounds', 'Video Call Setup'],
                    'sort' => 2,
                    'popular' => true // Usually the middle tier is most popular
                ],
                [
                    'title' => 'Enterprise/Ultimate',
                    'price_multiplier' => 5.0,
                    'billing' => 'monthly',
                    'features' => ['Everything in Professional', '24/7 Phone Support', 'Unlimited Revisions', 'On-site Visit', 'Dedicated Manager'],
                    'sort' => 3,
                    'popular' => false
                ]
            ];

            foreach ($tiers as $tier) {
                // Calculate price based on the service's base_price
                $calculatedPrice = $service->base_price * $tier['price_multiplier'];

                ServicePackage::create([
                    'service_id'     => $service->id,
                    'title'           => $tier['title'],
                    'slug'           => Str::slug($tier['title'] . '-' . $service->id),
                    'description'    => $faker->sentence(15),
                    'price'          => $calculatedPrice,
                    'billing_period' => $tier['billing'],
                    'features'       => $tier['features'], // Casts to JSON automatically in model
                    'sort_order'     => $tier['sort'],
                    'is_active'      => true,
                    'is_popular'     => $tier['popular'],
                    'created_at'     => now(),
                    'updated_at'     => now(),
                ]);
            }
            }
        });

        $this->command->info('✅ Service Packages seeded successfully.');
    }
}