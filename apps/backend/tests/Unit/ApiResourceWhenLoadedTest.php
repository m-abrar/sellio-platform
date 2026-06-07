<?php

namespace Tests\Unit;

use App\Http\Resources\PropertyResource;
use App\Http\Resources\TicketMessageResource;
use App\Models\Property;
use App\Models\Ticket;
use App\Models\TicketMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ApiResourceWhenLoadedTest extends TestCase
{
    use RefreshDatabase;

    public function test_property_resource_omits_unloaded_relationships(): void
    {
        $property = Property::factory()->create();

        $payload = (new PropertyResource($property))->resolve(Request::create('/'));

        $this->assertArrayNotHasKey('tags', $payload);
        $this->assertArrayNotHasKey('features', $payload);
        $this->assertArrayNotHasKey('brand', $payload);
    }

    public function test_property_resource_includes_tags_when_eager_loaded(): void
    {
        $property = Property::factory()->create();
        $property->load('tags');

        $payload = (new PropertyResource($property))->resolve(Request::create('/'));

        $this->assertArrayHasKey('tags', $payload);
    }

    public function test_ticket_message_resource_does_not_lazy_load_user_or_ticket(): void
    {
        $owner = User::factory()->create();
        $author = User::factory()->create();

        $ticket = Ticket::create([
            'user_id' => $owner->id,
            'title' => 'Help',
            'description' => 'Need support',
            'priority' => 'low',
            'status' => 'open',
        ]);

        $message = new TicketMessage([
            'ticket_id' => $ticket->id,
            'body' => 'Hello',
        ]);
        $message->user_id = $author->id;
        $message->save();
        $message->unsetRelation('ticket');
        $message->unsetRelation('user');

        DB::flushQueryLog();
        DB::enableQueryLog();

        $payload = (new TicketMessageResource($message))->resolve(Request::create('/'));

        $this->assertSame([], DB::getQueryLog());
        $this->assertSame('Unknown', $payload['user_name']);
        $this->assertFalse($payload['is_staff']);
    }

    public function test_ticket_message_resource_uses_loaded_relationships(): void
    {
        $owner = User::factory()->create(['name' => 'Owner User']);
        $author = User::factory()->create(['name' => 'Staff User']);

        $ticket = Ticket::create([
            'user_id' => $owner->id,
            'title' => 'Help',
            'description' => 'Need support',
            'priority' => 'low',
            'status' => 'open',
        ]);

        $message = new TicketMessage([
            'ticket_id' => $ticket->id,
            'body' => 'Hello',
        ]);
        $message->user_id = $author->id;
        $message->save();

        $message->load(['user', 'ticket']);

        $payload = (new TicketMessageResource($message))->resolve(Request::create('/'));

        $this->assertSame('Staff User', $payload['user_name']);
        $this->assertTrue($payload['is_staff']);
    }
}
