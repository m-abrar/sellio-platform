<?php

namespace App\Events;

use App\Models\Plan; 
use App\Models\Subscription;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class PlanDowngraded
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $user;
    public $newPlan; // The plan the user is downgrading TO
    public $subscription; // The current Subscription record (which holds the ends_at date)

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\User $user
     * @param  \App\Models\Plan $newPlan The plan model the user will switch to.
     * @param  \App\Models\Subscription $subscription The subscription record being scheduled for downgrade.
     */
    public function __construct(User $user, Plan $newPlan, Subscription $subscription)
    {
        $this->user = $user;
        $this->newPlan = $newPlan;
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
