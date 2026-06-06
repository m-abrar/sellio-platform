<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\EventBooking;
use App\Models\User;

class EventTicketPurchased
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $user;
    public $booking;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\User $user The user who purchased the ticket.
     * @param  \App\Models\EventBooking $booking The purchased event booking.
     */
    public function __construct(User $user, EventBooking $booking)
    {
        $this->user = $user;
        $this->booking = $booking;
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
