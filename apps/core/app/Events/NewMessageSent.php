<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Message;
use App\Models\User;

class NewMessageSent implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $message;
    public $recipient;

    // The recipient is still included, as this event is typically queued 
    // and listeners (like email or notification handlers) may need this info.
    public function __construct(Message $message, User $recipient) 
    {
        $this->message = $message;
        $this->recipient = $recipient;
    }

    /**
     * Get the channels the event should broadcast on.
     * Uses a PrivateChannel scoped to the Conversation ID.
     */
    public function broadcastOn(): array
    {
        // Channel name: 'private-chat.123'
        return [
            new Channel('chat.' . $this->message->conversation_id), 
        ];

    }

    public function broadcastAs(): string
    {
        // Consistent event name for all listeners
        return 'NewMessageSent'; 
    }

    public function broadcastWith(): array
    {
        // Payload keys match what the JavaScript expects
        return [
            'id' => $this->message->id,
            'conversation_id' => $this->message->conversation_id, 
            'sender_id' => $this->message->sender_id,
            'body' => $this->message->body, 
            'created_at' => $this->message->created_at, 
        ];
    }
}
