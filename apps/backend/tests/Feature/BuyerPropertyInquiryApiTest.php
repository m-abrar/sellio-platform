<?php

namespace Tests\Feature;

use App\Events\Partner\PartnerLeadCreated;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class BuyerPropertyInquiryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_bearer_authenticated_buyer_can_send_a_sale_property_inquiry(): void
    {
        Event::fake([PartnerLeadCreated::class]);

        $buyer = User::factory()->create();
        $property = Property::factory()->create([
            'is_sale' => true,
            'is_rental' => false,
        ]);
        $token = $buyer->createToken('mobile-property-inquiry-test')->plainTextToken;

        $this->withToken($token)
            ->postJson("/api/v1/properties/{$property->id}/inquiries", [
                'full_name' => $buyer->name,
                'email' => $buyer->email,
                'phone' => $buyer->phone,
                'message' => 'I would like to arrange a viewing.',
            ])
            ->assertCreated()
            ->assertJsonPath('data.user_id', $buyer->id)
            ->assertJsonPath('data.property_id', $property->id)
            ->assertJsonPath('data.status', 'scheduled');

        $this->assertDatabaseHas('property_visits', [
            'user_id' => $buyer->id,
            'property_id' => $property->id,
            'email' => $buyer->email,
            'status' => 'scheduled',
        ]);
    }
}
