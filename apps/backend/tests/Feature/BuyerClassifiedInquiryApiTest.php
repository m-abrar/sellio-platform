<?php

namespace Tests\Feature;

use App\Events\Partner\PartnerLeadCreated;
use App\Models\Classified;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class BuyerClassifiedInquiryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_buyer_classified_inquiry_is_linked_to_their_account(): void
    {
        Event::fake([PartnerLeadCreated::class]);

        $buyer = User::factory()->create();
        $classified = Classified::factory()->create();

        $this->actingAs($buyer, 'sanctum')
            ->postJson("/api/v1/classifieds/{$classified->slug}/inquiries", [
                'full_name' => $buyer->name,
                'email' => $buyer->email,
                'phone' => $buyer->phone,
                'message' => 'Is this item still available?',
                'offer_price' => '$150',
            ])
            ->assertCreated()
            ->assertJsonPath('data.user_id', $buyer->id)
            ->assertJsonPath('data.classified_id', $classified->id)
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('classified_inquiries', [
            'user_id' => $buyer->id,
            'classified_id' => $classified->id,
            'email' => $buyer->email,
            'status' => 'pending',
        ]);
    }
}
