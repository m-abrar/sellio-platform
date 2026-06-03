<?php

namespace Tests\Concerns;

use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use Spatie\Permission\Models\Role;

trait InteractsWithPartnerApi
{
    protected function createPartner(?int $maxListings = 25): User
    {
        Role::firstOrCreate(['name' => 'partner']);

        $partner = User::factory()->partner()->create();
        $partner->assignRole('partner');

        if ($maxListings !== null) {
            $plan = Plan::create([
                'title' => 'Partner Test Plan',
                'slug' => 'partner-test-plan-' . $partner->id,
                'price' => 49.99,
                'billing_period' => 'monthly',
                'max_listings' => $maxListings,
                'is_active' => true,
            ]);

            Subscription::create([
                'user_id' => $partner->id,
                'plan_id' => $plan->id,
                'title' => 'default',
                'status' => Subscription::STATUS_ACTIVE,
                'starts_at' => now()->subDay(),
                'ends_at' => now()->addMonth(),
            ]);

            $partner->unsetRelation('subscription');
        }

        return $partner;
    }
}
