<?php

namespace App\Events;

use App\Models\Subscription;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class PlanAboutToExpire
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $user;
    public $subscription; // The Subscription model containing the 'ends_at' date

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\User $user
     * @param  \App\Models\Subscription $subscription The subscription that is about to expire.
     */
    public function __construct(User $user, Subscription $subscription)
    {
        $this->user = $user;
        $this->subscription = $subscription;
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
