<?php

namespace Tests\Feature;

use App\Models\Auto;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Location;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Type;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PartnerLimitsTest extends TestCase
{
    use RefreshDatabase;

    private User $partner;
    private Plan $starterPlan;
    private Plan $unlimitedPlan;
    private Category $category;
    private Brand $brand;
    private Type $type;
    private Location $location;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');

        // Create the partner role and assign it
        Role::create(['name' => 'partner']);
        $this->partner = User::factory()->partner()->create();
        $this->partner->assignRole('partner');

        // Create metadata for listings
        $this->category = Category::factory()->create(['is_auto' => true]);
        $this->brand = Brand::factory()->create(['is_auto' => true]);
        $this->type = Type::factory()->create(['is_auto' => true]);
        $this->location = Location::factory()->create(['is_auto' => true]);

        // Create plan tiers
        $this->starterPlan = Plan::create([
            'title' => 'Starter Plan',
            'price' => 29.99,
            'billing_period' => 'monthly',
            'max_listings' => 3,
            'is_active' => true,
        ]);

        $this->unlimitedPlan = Plan::create([
            'title' => 'Pro Plan',
            'price' => 79.99,
            'billing_period' => 'monthly',
            'max_listings' => 999,
            'is_active' => true,
        ]);
    }

    /**
     * Test that a partner with no active subscription is blocked from creating listings.
     */
    public function test_partner_with_no_subscription_is_blocked(): void
    {
        // Assert that the partner has no subscription initially
        $this->assertNull($this->partner->getPlan());

        $response = $this->actingAs($this->partner, 'sanctum')
            ->post('/api/dashboard/partner/autos', [
                'title' => '2024 Tesla Model S Plaid',
                'description' => 'Excellent condition.',
                'category_id' => $this->category->id,
                'brand_id' => $this->brand->id,
                'type_id' => $this->type->id,
                'location_id' => $this->location->id,
                'base_price' => '89000',
                'year' => '2024',
                'make' => 'Tesla',
                'model' => 'Model S',
                'engine_type' => 'Electric',
                'transmission' => 'Automatic',
                'drivetrain' => 'AWD',
                'mileage_value' => '4200',
                'mileage_units' => 'mi',
                'stock_quantity' => '1',
                'city' => 'Austin',
                'country' => 'USA',
                'is_published' => '1',
            ], ['Accept' => 'application/json']);

        $response->assertStatus(403);
        $this->assertStringContainsString('You have reached your listing limit', $response->json('message'));
    }

    /**
     * Test that a partner within their subscription limits can create listings.
     */
    public function test_partner_within_limits_can_create_listing(): void
    {
        // Subscribe the partner to the Starter Plan (max 3 listings)
        Subscription::create([
            'user_id' => $this->partner->id,
            'plan_id' => $this->starterPlan->id,
            'title' => 'default',
            'status' => 'active',
            'starts_at' => now(),
        ]);

        $this->partner->unsetRelation('subscription'); // Clear relationship cache

        $this->assertEquals(3, $this->partner->getPlan()->max_listings);
        $this->assertFalse($this->partner->hasReachedListingLimit());

        $response = $this->actingAs($this->partner, 'sanctum')
            ->post('/api/dashboard/partner/autos', [
                'title' => '2024 Tesla Model S Plaid',
                'description' => 'Excellent condition.',
                'category_id' => $this->category->id,
                'brand_id' => $this->brand->id,
                'type_id' => $this->type->id,
                'location_id' => $this->location->id,
                'base_price' => '89000',
                'year' => '2024',
                'make' => 'Tesla',
                'model' => 'Model S',
                'engine_type' => 'Electric',
                'transmission' => 'Automatic',
                'drivetrain' => 'AWD',
                'mileage_value' => '4200',
                'mileage_units' => 'mi',
                'stock_quantity' => '1',
                'city' => 'Austin',
                'country' => 'USA',
                'is_published' => '1',
            ], ['Accept' => 'application/json']);

        $response->assertStatus(201);
        $this->assertDatabaseHas('autos', [
            'title' => '2024 Tesla Model S Plaid',
            'user_id' => $this->partner->id,
        ]);
    }

    /**
     * Test that a partner who exceeds their subscription limits is blocked.
     */
    public function test_partner_exceeding_limits_is_blocked(): void
    {
        // Subscribe the partner to the Starter Plan (max 3 listings)
        Subscription::create([
            'user_id' => $this->partner->id,
            'plan_id' => $this->starterPlan->id,
            'title' => 'default',
            'status' => 'active',
            'starts_at' => now(),
        ]);

        $this->partner->unsetRelation('subscription'); // Clear relationship cache

        // Create 3 pre-existing listings to hit the maximum limit of 3
        Auto::factory()->count(3)->create([
            'user_id' => $this->partner->id,
        ]);

        $this->assertTrue($this->partner->hasReachedListingLimit());

        $response = $this->actingAs($this->partner, 'sanctum')
            ->post('/api/dashboard/partner/autos', [
                'title' => '2024 Tesla Model S Plaid Exceeded',
                'description' => 'Excellent condition.',
                'category_id' => $this->category->id,
                'brand_id' => $this->brand->id,
                'type_id' => $this->type->id,
                'location_id' => $this->location->id,
                'base_price' => '89000',
                'year' => '2024',
                'make' => 'Tesla',
                'model' => 'Model S',
                'engine_type' => 'Electric',
                'transmission' => 'Automatic',
                'drivetrain' => 'AWD',
                'mileage_value' => '4200',
                'mileage_units' => 'mi',
                'stock_quantity' => '1',
                'city' => 'Austin',
                'country' => 'USA',
                'is_published' => '1',
            ], ['Accept' => 'application/json']);

        $response->assertStatus(403);
        $this->assertStringContainsString('You have reached your listing limit', $response->json('message'));
        $this->assertDatabaseMissing('autos', [
            'title' => '2024 Tesla Model S Plaid Exceeded',
        ]);
    }

    /**
     * Test that a partner with an unlimited plan (e.g. max_listings = 999) can create unlimited listings.
     */
    public function test_partner_with_unlimited_plan_is_not_blocked(): void
    {
        // Subscribe the partner to the Pro Plan (max 999 listings)
        Subscription::create([
            'user_id' => $this->partner->id,
            'plan_id' => $this->unlimitedPlan->id,
            'title' => 'default',
            'status' => 'active',
            'starts_at' => now(),
        ]);

        $this->partner->unsetRelation('subscription'); // Clear relationship cache

        // Create 5 pre-existing listings
        Auto::factory()->count(5)->create([
            'user_id' => $this->partner->id,
        ]);

        $this->assertFalse($this->partner->hasReachedListingLimit());

        $response = $this->actingAs($this->partner, 'sanctum')
            ->post('/api/dashboard/partner/autos', [
                'title' => '2024 Tesla Model S Plaid Unlimited',
                'description' => 'Excellent condition.',
                'category_id' => $this->category->id,
                'brand_id' => $this->brand->id,
                'type_id' => $this->type->id,
                'location_id' => $this->location->id,
                'base_price' => '89000',
                'year' => '2024',
                'make' => 'Tesla',
                'model' => 'Model S',
                'engine_type' => 'Electric',
                'transmission' => 'Automatic',
                'drivetrain' => 'AWD',
                'mileage_value' => '4200',
                'mileage_units' => 'mi',
                'stock_quantity' => '1',
                'city' => 'Austin',
                'country' => 'USA',
                'is_published' => '1',
            ], ['Accept' => 'application/json']);

        $response->assertStatus(201);
        $this->assertDatabaseHas('autos', [
            'title' => '2024 Tesla Model S Plaid Unlimited',
            'user_id' => $this->partner->id,
        ]);
    }
}
