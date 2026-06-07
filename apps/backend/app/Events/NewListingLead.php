<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class NewListingLead
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $owner;
    public $listing;
    public $leadName;
    public $leadEmail;
    public $leadMessage;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\User $owner The user who owns the listing.
     * @param  \Illuminate\Database\Eloquent\Model $listing The listing record.
     * @param  string $leadName The name of the person submitting the lead.
     * @param  string $leadEmail The email of the person submitting the lead.
     * @param  string $leadMessage The message from the lead.
     */
    public function __construct(User $owner, Model $listing, string $leadName, string $leadEmail, string $leadMessage)
    {
        $this->owner = $owner;
        $this->listing = $listing;
        $this->leadName = $leadName;
        $this->leadEmail = $leadEmail;
        $this->leadMessage = $leadMessage;
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
