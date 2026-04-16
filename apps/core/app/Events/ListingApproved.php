<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\Listing; 

class ListingApproved
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $owner; // The user who owns the listing
    public $listing; // The listing model (job, property, etc.)
    public $liveUrl; // The URL where the listing can be viewed

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\User $owner The user who owns the listing.
     * @param  \App\Models\Listing $listing The listing record.
     * @param  string $liveUrl The public URL of the approved listing.
     */
    public function __construct(User $owner, Listing $listing, string $liveUrl)
    {
        $this->owner = $owner;
        $this->listing = $listing;
        $this->liveUrl = $liveUrl;
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
