<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Property;
use App\Models\Auto;
use App\Models\Event;
use App\Models\JobListing;
use App\Models\Service;
use App\Models\Classified;
use App\Models\User;
use App\Models\Category;
use App\Models\Location;
use App\Models\Type;
use App\Models\Brand;

class PendingListingsSeeder extends Seeder
{
    private function sampleListingTitle(string $prefix): string
    {
        return $prefix . ': ' . ucwords(fake()->words(3, true));
    }

    /**
     * Run the database seeds to create pending listings across all marketplace verticals.
     * This ensures the "Pending Approval" registry has data for demonstration/testing.
     */
    public function run()
    {
        $this->command->info('🚀 Generating Pending Marketplace Assets...');

        $partner = User::where('is_partner', true)->first();
        if (!$partner) {
            $partner = User::factory()->create([
                'name' => 'Demo Partner',
                'email' => 'partner@demo.com',
                'is_partner' => true
            ]);
        }

        $locationId = Location::where('level', 2)->first()?->id ?? Location::first()?->id;
        if (!$locationId) {
            $locationId = Location::factory()->create(['level' => 2])->id;
        }

        // 1. Properties
        if (class_exists(Property::class)) {
            // 2 Pending Properties
            Property::factory()->count(2)->create([
                'user_id' => $partner->id,
                'location_id' => $locationId,
                'category_id' => Category::where('is_property', true)->first()?->id ?? Category::factory()->create(['is_property' => true])->id,
                'type_id' => Type::where('is_property', true)->first()?->id ?? Type::factory()->create(['is_property' => true])->id,
                'is_published' => true,
                'approved_at' => null,
                'status' => 'pending',
                'title' => $this->sampleListingTitle('PENDING'),
            ]);
            
            // 2 Draft Properties
            Property::factory()->count(2)->create([
                'user_id' => $partner->id,
                'location_id' => $locationId,
                'category_id' => Category::where('is_property', true)->first()?->id ?? Category::factory()->create(['is_property' => true])->id,
                'type_id' => Type::where('is_property', true)->first()?->id ?? Type::factory()->create(['is_property' => true])->id,
                'is_published' => false,
                'approved_at' => null,
                'status' => 'draft',
                'title' => $this->sampleListingTitle('DRAFT'),
            ]);

            Property::factory()->create([
                'user_id' => $partner->id,
                'location_id' => $locationId,
                'category_id' => Category::where('is_property', true)->first()?->id ?? Category::factory()->create(['is_property' => true])->id,
                'type_id' => Type::where('is_property', true)->first()?->id ?? Type::factory()->create(['is_property' => true])->id,
                'is_published' => true,
                'approved_at' => now()->subMonths(2),
                'expires_at' => now()->subDays(7),
                'status' => 'expired',
                'title' => $this->sampleListingTitle('EXPIRED'),
            ]);
            $this->command->line('   - Created 2 Pending, 2 Draft & 1 Expired Properties');
        }

        // 2. Autos
        if (class_exists(Auto::class)) {
            Auto::factory()->count(2)->create([
                'user_id' => $partner->id,
                'location_id' => $locationId,
                'category_id' => Category::where('is_auto', true)->first()?->id ?? Category::factory()->create(['is_auto' => true])->id,
                'type_id' => Type::where('is_auto', true)->first()?->id ?? Type::factory()->create(['is_auto' => true])->id,
                'brand_id' => Brand::where('is_auto', true)->first()?->id ?? Brand::factory()->create(['is_auto' => true])->id,
                'is_published' => true,
                'approved_at' => null,
                'status' => 'pending',
                'title' => $this->sampleListingTitle('PENDING'),
            ]);
            Auto::factory()->create([
                'user_id' => $partner->id,
                'location_id' => $locationId,
                'category_id' => Category::where('is_auto', true)->first()?->id ?? Category::factory()->create(['is_auto' => true])->id,
                'type_id' => Type::where('is_auto', true)->first()?->id ?? Type::factory()->create(['is_auto' => true])->id,
                'brand_id' => Brand::where('is_auto', true)->first()?->id ?? Brand::factory()->create(['is_auto' => true])->id,
                'is_published' => true,
                'approved_at' => now()->subMonths(2),
                'expires_at' => now()->subDays(5),
                'status' => 'expired',
                'title' => $this->sampleListingTitle('EXPIRED'),
            ]);
            $this->command->line('   - Created 2 Pending & 1 Expired Autos');
        }

        // 3. Events
        if (class_exists(Event::class)) {
            // 2 Pending Events
            Event::factory()->count(2)->create([
                'user_id' => $partner->id,
                'location_id' => $locationId,
                'category_id' => Category::where('is_event', true)->first()?->id ?? Category::factory()->create(['is_event' => true])->id,
                'type_id' => Type::where('is_event', true)->first()?->id ?? Type::factory()->create(['is_event' => true])->id,
                'is_published' => true,
                'approved_at' => null,
                'title' => $this->sampleListingTitle('PENDING'),
            ]);

            // 2 Draft Events
            Event::factory()->count(2)->create([
                'user_id' => $partner->id,
                'location_id' => $locationId,
                'category_id' => Category::where('is_event', true)->first()?->id ?? Category::factory()->create(['is_event' => true])->id,
                'type_id' => Type::where('is_event', true)->first()?->id ?? Type::factory()->create(['is_event' => true])->id,
                'is_published' => false,
                'approved_at' => null,
                'title' => $this->sampleListingTitle('DRAFT'),
            ]);
            Event::factory()->create([
                'user_id' => $partner->id,
                'location_id' => $locationId,
                'category_id' => Category::where('is_event', true)->first()?->id ?? Category::factory()->create(['is_event' => true])->id,
                'type_id' => Type::where('is_event', true)->first()?->id ?? Type::factory()->create(['is_event' => true])->id,
                'is_published' => true,
                'approved_at' => now()->subMonths(2),
                'expires_at' => now()->subDays(3),
                'title' => $this->sampleListingTitle('EXPIRED'),
            ]);
            $this->command->line('   - Created 2 Pending, 2 Draft & 1 Expired Events');
        }

        // 4. Job Listings
        if (class_exists(JobListing::class)) {
            JobListing::factory()->count(2)->create([
                'user_id' => $partner->id,
                'location_id' => $locationId,
                'category_id' => Category::where('is_job', true)->first()?->id ?? Category::factory()->create(['is_job' => true])->id,
                'type_id' => Type::where('is_job', true)->first()?->id ?? Type::factory()->create(['is_job' => true])->id,
                'is_published' => true,
                'approved_at' => null,
                'status' => 'pending',
                'title' => $this->sampleListingTitle('PENDING'),
            ]);
            JobListing::factory()->create([
                'user_id' => $partner->id,
                'location_id' => $locationId,
                'category_id' => Category::where('is_job', true)->first()?->id ?? Category::factory()->create(['is_job' => true])->id,
                'type_id' => Type::where('is_job', true)->first()?->id ?? Type::factory()->create(['is_job' => true])->id,
                'is_published' => true,
                'approved_at' => now()->subMonths(2),
                'expires_at' => now()->subDays(4),
                'status' => 'expired',
                'title' => $this->sampleListingTitle('EXPIRED'),
            ]);
            $this->command->line('   - Created 2 Pending & 1 Expired Job Listings');
        }

        // 5. Services
        if (class_exists(Service::class)) {
            Service::factory()->count(2)->create([
                'user_id' => $partner->id,
                'location_id' => $locationId,
                'category_id' => Category::where('is_service', true)->first()?->id ?? Category::factory()->create(['is_service' => true])->id,
                'type_id' => Type::where('is_service', true)->first()?->id ?? Type::factory()->create(['is_service' => true])->id,
                'is_published' => true,
                'approved_at' => null,
                'status' => 'pending',
                'title' => $this->sampleListingTitle('PENDING'),
            ]);
            Service::factory()->create([
                'user_id' => $partner->id,
                'location_id' => $locationId,
                'category_id' => Category::where('is_service', true)->first()?->id ?? Category::factory()->create(['is_service' => true])->id,
                'type_id' => Type::where('is_service', true)->first()?->id ?? Type::factory()->create(['is_service' => true])->id,
                'is_published' => true,
                'approved_at' => now()->subMonths(2),
                'expires_at' => now()->subDays(6),
                'status' => 'expired',
                'title' => $this->sampleListingTitle('EXPIRED'),
            ]);
            $this->command->line('   - Created 2 Pending & 1 Expired Services');
        }

        // 6. Classifieds
        if (class_exists(Classified::class)) {
            Classified::factory()->count(2)->create([
                'user_id' => $partner->id,
                'location_id' => $locationId,
                'category_id' => Category::where('is_classified', true)->first()?->id ?? Category::factory()->create(['is_classified' => true])->id,
                'type_id' => Type::where('is_classified', true)->first()?->id ?? Type::factory()->create(['is_classified' => true])->id,
                'brand_id' => Brand::where('is_classified', true)->first()?->id ?? Brand::factory()->create(['is_classified' => true])->id,
                'is_published' => true,
                'approved_at' => null,
                'title' => $this->sampleListingTitle('PENDING'),
            ]);
            Classified::factory()->create([
                'user_id' => $partner->id,
                'location_id' => $locationId,
                'category_id' => Category::where('is_classified', true)->first()?->id ?? Category::factory()->create(['is_classified' => true])->id,
                'type_id' => Type::where('is_classified', true)->first()?->id ?? Type::factory()->create(['is_classified' => true])->id,
                'brand_id' => Brand::where('is_classified', true)->first()?->id ?? Brand::factory()->create(['is_classified' => true])->id,
                'is_published' => true,
                'approved_at' => now()->subMonths(2),
                'expires_at' => now()->subDays(8),
                'title' => $this->sampleListingTitle('EXPIRED'),
            ]);
            $this->command->line('   - Created 2 Pending & 1 Expired Classifieds');
        }

        $this->command->info('✅ Pending listings generation complete!');
    }
}
