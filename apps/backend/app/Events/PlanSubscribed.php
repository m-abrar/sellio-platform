<?php

namespace App\Events;

use App\Models\Plan; // <<< NEW IMPORT
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class PlanSubscribed
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $user;
    public $plan;
    
    /**
     * Create a new event instance.
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
            // Example
        ];
    }
}
