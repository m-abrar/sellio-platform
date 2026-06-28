<?php

namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MobileMessagingApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_buyer_can_page_send_and_mark_conversation_messages_read(): void
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $conversation = Conversation::create(['user_id' => $buyer->id, 'partner_id' => $seller->id]);

        foreach (range(1, 35) as $index) {
            $message = new Message(['conversation_id' => $conversation->id, 'body' => "Message {$index}"]);
            $message->sender_id = $index % 2 ? $seller->id : $buyer->id;
            $message->save();
        }

        $this->actingAs($buyer, 'sanctum')
            ->getJson("/api/dashboard/user/messages/{$conversation->id}?per_page=10&page=1")
            ->assertOk()
            ->assertJsonCount(10, 'data.messages')
            ->assertJsonPath('data.message_meta.total', 35)
            ->assertJsonPath('data.conversations.0.unread_count', 18);

        $this->actingAs($buyer, 'sanctum')
            ->postJson("/api/dashboard/user/messages/{$conversation->id}", ['body' => 'Mobile reply'])
            ->assertCreated()
            ->assertJsonPath('data.message.body', 'Mobile reply');

        $this->actingAs($buyer, 'sanctum')
            ->patchJson("/api/dashboard/user/messages/{$conversation->id}/read")
            ->assertOk()
            ->assertJsonPath('data.marked', 18);
    }

    public function test_buyer_can_start_a_listing_conversation_with_context(): void
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $property = Property::factory()->create(['user_id' => $seller->id]);

        $response = $this->actingAs($buyer, 'sanctum')
            ->postJson('/api/dashboard/user/messages/start', [
                'vertical' => 'properties',
                'listing_id' => $property->id,
            ])
            ->assertOk();

        $this->assertDatabaseHas('conversations', [
            'id' => $response->json('data.conversation_id'),
            'user_id' => $buyer->id,
            'partner_id' => $seller->id,
            'inquiriable_type' => Property::class,
            'inquiriable_id' => $property->id,
        ]);
    }
}
