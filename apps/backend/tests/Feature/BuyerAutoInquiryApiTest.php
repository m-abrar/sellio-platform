<?php

namespace Tests\Feature;

use App\Events\Partner\PartnerLeadCreated;
use App\Models\Auto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class BuyerAutoInquiryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_buyer_vehicle_inquiry_is_linked_to_their_account(): void
    {
        Event::fake([PartnerLeadCreated::class]);

        $buyer = User::factory()->create();
        $auto = Auto::factory()->create();

        $this->actingAs($buyer, 'sanctum')
            ->postJson("/api/v1/vehicles/{$auto->id}/inquiries", [
                'full_name' => $buyer->name,
                'email' => $buyer->email,
                'phone' => $buyer->phone,
                'message' => 'I would like to arrange a test drive.',
                'preferred_time' => 'Anytime',
            ])
            ->assertCreated()
            ->assertJsonPath('data.user_id', $buyer->id)
            ->assertJsonPath('data.auto_id', $auto->id)
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('auto_inquiries', [
            'user_id' => $buyer->id,
            'auto_id' => $auto->id,
            'email' => $buyer->email,
            'status' => 'pending',
        ]);
    }
}
