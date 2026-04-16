<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class BookingCancelled
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $user;
    public $itemTitle;
    public $refundAmount;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\User $user The user who made the booking.
     * @param  string $itemTitle The title of the cancelled item (e.g., Property title, Event name).
     * @param  float $refundAmount The final amount being refunded to the user.
     */
    public function __construct(User $user, string $itemTitle, float $refundAmount)
    {
        $this->user = $user;
        $this->itemTitle = $itemTitle;
        $this->refundAmount = $refundAmount;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            //
        ];
    }
}
