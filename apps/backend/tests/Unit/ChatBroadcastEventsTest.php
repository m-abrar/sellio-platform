<?php

namespace Tests\Unit;

use App\Events\MessageRead;
use App\Events\NewMessageSent;
use App\Models\Message;
use App\Models\User;
use Tests\TestCase;

class ChatBroadcastEventsTest extends TestCase
{
    public function test_chat_events_support_broadcasting_to_others(): void
    {
        $message = new Message([
            'conversation_id' => 123,
            'sender_id' => 456,
            'body' => 'Hello',
        ]);

        $events = [
            new NewMessageSent($message, new User()),
            new MessageRead($message),
        ];

        foreach ($events as $event) {
            $this->assertTrue(method_exists($event, 'dontBroadcastToCurrentUser'));

            $event->dontBroadcastToCurrentUser();

            $this->assertNull($event->socket);
        }
    }
}
