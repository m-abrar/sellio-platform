<?php

namespace Tests\Feature;

use App\Models\Subscription;
use App\Models\User;
use Database\Seeders\PlanSeeder;
use Database\Seeders\SubscriptionSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeededPartnerSubscriptionTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeded_demo_partner_has_active_usable_subscription(): void
    {
        $this->seed([
            UserSeeder::class,
            PlanSeeder::class,
            SubscriptionSeeder::class,
        ]);

        $partner = User::where('email', 'partner@example.com')->first();

        $this->assertNotNull($partner);

        $this->assertSame(1, $partner->subscriptions()->where('title', 'default')->count());

        $subscription = $partner->subscription()->with('plan')->first();

        $this->assertNotNull($subscription);
        $this->assertSame(Subscription::STATUS_ACTIVE, $subscription->status);
        $this->assertNull($subscription->ends_at);
        $this->assertNotNull($subscription->plan);
        $this->assertGreaterThan(0, (int) $subscription->plan->max_listings);
        $this->assertFalse($partner->fresh()->hasReachedListingLimit());
    }
}
