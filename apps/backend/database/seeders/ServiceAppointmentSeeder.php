<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ServiceAppointment;
use App\Models\User;
use App\Models\Service;
use App\Models\ServicePackage;
use Illuminate\Support\Carbon;

/**
 * Class ServiceAppointmentSeeder
 *
 * Seeds the database with sample ServiceAppointment records including contact details,
 * topics, and the newly added Service Packages.
 */
class ServiceAppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        // 1. Fetch available data
        $users = User::all();
        $services = Service::with('packages')->get();

        if ($users->isEmpty() || $services->isEmpty()) {
            $this->command->line("⚠️ Skipping ServiceAppointmentSeeder: Requires Users and Services with Packages.\n");
            return;
        }

        // Clear existing data (Be careful with truncate if you have active foreign keys)
        ServiceAppointment::query()->delete();

        $this->command->info('Seeding Service Appointment records with Packages and Contact info...');

        $numberOfAppointments = 30;
        $daysRange = 180;
        $statuses = ['confirmed', 'pending', 'completed', 'cancelled'];
        
        $topics = [
            'Consultation' => 'Initial consultation for a new project.',
            'Maintenance'  => 'Routine maintenance check-up.',
            'Repair'       => 'Full system diagnostics and repair.',
            'Cleaning'     => 'Deep cleaning service.',
            'Follow-up'    => 'Follow-up appointment regarding previous visit.',
            'Wellness'     => 'Wellness session based on selected tier.',
        ];

        for ($i = 0; $i < $numberOfAppointments; $i++) {
            $user = $users->random();
            $service = $services->random();
            
            // 2. Select a package from the service if available
            $package = $service->packages->isNotEmpty() ? $service->packages->random() : null;
            
            $daysOffset = rand(-$daysRange, $daysRange);
            $randomDate = Carbon::now()->addDays($daysOffset);
            $randomDate->setTime(rand(9, 17), rand(0, 59), 0);
            
            $randomTopic = array_rand($topics);
            $randomNote  = $topics[$randomTopic];
            
            // 3. Set price based on package, otherwise fallback to service base_price
            $finalPrice = $package ? $package->price : ($service->sale_price ?? $service->base_price);

            $isGuest = rand(0, 10) > 8; // 20% chance of guest lead

            ServiceAppointment::create([
                'user_id'            => $isGuest ? null : $user->id,
                'service_id'         => $service->id,
                'service_package_id' => $package ? $package->id : null, // Set the package
                'name'               => $isGuest ? 'Guest User ' . rand(100, 999) : $user->name,
                'email'              => $isGuest ? 'guest' . rand(100, 999) . '@example.com' : $user->email,
                'phone'              => $isGuest ? '+1 (555) ' . rand(100, 999) . '-' . rand(1000, 9999) : $user->phone,
                'topic'              => $package ? $package->title : $randomTopic, 
                'scheduled_at'       => $randomDate,
                'status'             => $statuses[array_rand($statuses)],
                'notes'              => $randomNote,
                'admin_note'         => 'Seeded demographic record for marketplace simulation.',
                'price'              => $finalPrice,
            ]);
        }
        
        $this->command->info("✅ Successfully created {$numberOfAppointments} service appointments linked to packages.");
    }
}