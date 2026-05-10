<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Listing;

class ListingRejected
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $listing;
    public $rejectionReason;

    /**
     * Create a new event instance.
     */
    public function __construct(Listing $listing, string $rejectionReason)
    {
        $this->listing = $listing;
        $this->rejectionReason = $rejectionReason;
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
