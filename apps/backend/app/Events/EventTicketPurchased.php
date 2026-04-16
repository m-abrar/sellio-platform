<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\Ticket; // Assumed model for a purchased ticket

class EventTicketPurchased
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $user;
    public $ticket;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\User $user The user who purchased the ticket.
     * @param  \App\Models\Ticket $ticket The purchased ticket record.
     */
    public function __construct(User $user, Ticket $ticket)
    {
        $this->user = $user;
        $this->ticket = $ticket;
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
