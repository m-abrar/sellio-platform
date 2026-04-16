<?php

namespace App\Events;

use App\Models\Plan; 
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class PlanUpgraded
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $user;
    public $oldPlan; // The Plan model the user is leaving
    public $newPlan; // The Plan model the user is moving to

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\User $user
     * @param  \App\Models\Plan $oldPlan The plan the user was previously subscribed to.
     * @param  \App\Models\Plan $newPlan The plan the user is now subscribed to.
     */
    public function __construct(User $user, Plan $oldPlan, Plan $newPlan)
    {
        $this->user = $user;
        $this->oldPlan = $oldPlan;
        $this->newPlan = $newPlan;
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
