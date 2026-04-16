<?php

namespace App\Events;

use App\Models\Plan;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class PlanExpired
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $user;
    public $plan; // The Subscription model that was cancelled

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\User $user
     * @param  \App\Models\Subscription $subscription The subscription record with the updated 'ends_at' date.
     */
    public function __construct(User $user, Plan $plan)
    {
        $this->user = $user;
        $this->plan = $plan;
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
