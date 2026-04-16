<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\Listing; 

class ListingRejected
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $owner; // The user who owns the listing
    public $listing; // The listing model (job, property, etc.)
    public $rejectionReason; // The reason provided by the moderator

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\User $owner The user who owns the listing.
     * @param  \App\Models\Listing $listing The listing record.
     * @param  string $rejectionReason The reason the listing was rejected.
     */
    public function __construct(User $owner, Listing $listing, string $rejectionReason)
    {
        $this->owner = $owner;
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
