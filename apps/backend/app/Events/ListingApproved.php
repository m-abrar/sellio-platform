<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Database\Eloquent\Model; 

class ListingApproved
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $listing;

    /**
     * Create a new event instance.
     */
    public function __construct(Model $listing)
    {
        $this->listing = $listing;
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
