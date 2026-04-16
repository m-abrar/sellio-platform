<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\Booking; // Assumed model for transactional data

class PropertyBookingConfirmed
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $guest;
    public $booking;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\User $guest The user who made the booking.
     * @param  \App\Models\Booking $booking The confirmed booking record.
     */
    public function __construct(User $guest, Booking $booking)
    {
        $this->guest = $guest;
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
