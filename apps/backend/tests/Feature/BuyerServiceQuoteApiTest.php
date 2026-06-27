<?php

namespace Tests\Feature;

use App\Events\Partner\PartnerLeadCreated;
use App\Models\Service;
use App\Models\ServicePackage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class BuyerServiceQuoteApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_buyer_can_request_a_service_quote(): void
    {
        Event::fake([PartnerLeadCreated::class]);

        $buyer = User::factory()->create();
        $service = Service::factory()->create();
        $package = ServicePackage::query()->create([
            'service_id' => $service->id,
            'title' => 'Starter package',
            'slug' => 'starter-package',
            'price' => 250,
            'billing_period' => 'one-time',
            'is_active' => true,
        ]);

        $this->getJson("/api/v1/services/{$service->slug}")
            ->assertOk()
            ->assertJsonPath('data.packages.0.id', $package->id)
            ->assertJsonPath('data.packages.0.title', 'Starter package');

        $this->actingAs($buyer, 'sanctum')
            ->postJson("/api/v1/services/{$service->id}/quotes", [
                'service_package_id' => $package->id,
                'target_date' => now()->addWeek()->toDateString(),
                'scope_size' => 3,
                'notes' => 'Please include delivery in the estimate.',
            ])
            ->assertCreated()
            ->assertJsonPath('data.user_id', $buyer->id)
            ->assertJsonPath('data.service_id', $service->id)
            ->assertJsonPath('data.service_package_id', $package->id)
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('service_quotes', [
            'user_id' => $buyer->id,
            'service_id' => $service->id,
            'service_package_id' => $package->id,
            'scope_size' => '3',
            'status' => 'pending',
        ]);
    }
}
