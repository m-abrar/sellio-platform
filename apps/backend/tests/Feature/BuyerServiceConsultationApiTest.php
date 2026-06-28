<?php

namespace Tests\Feature;

use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BuyerServiceConsultationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_buyer_can_request_a_service_consultation(): void
    {
        $buyer = User::factory()->create();
        $service = Service::factory()->create();

        $this->actingAs($buyer, 'sanctum')
            ->postJson("/api/v1/services/{$service->id}/consultations", [
                'full_name' => $buyer->name,
                'email' => $buyer->email,
                'phone' => '555-0100',
                'preferred_date' => now()->addWeek()->toDateString(),
                'requirements' => 'Discuss the project scope and timing.',
                'topic' => 'Mobile service consultation',
            ])
            ->assertCreated()
            ->assertJsonPath('data.service_id', $service->id)
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('service_appointments', [
            'service_id' => $service->id,
            'email' => $buyer->email,
            'topic' => 'Mobile service consultation',
        ]);
    }
}
