<?php

namespace App\Events;

use App\Models\Plan; 
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class PaymentFailed
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $user;
    public $plan; // The Plan model for which the payment failed

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\User $user
     * @param  \App\Models\Plan $plan The plan model associated with the failed payment.
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
