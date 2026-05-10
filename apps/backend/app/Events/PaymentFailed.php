<?php

namespace App\Events;

use App\Models\Plan;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PaymentFailed
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $user;
    public $plan;
    public $payment;
    public $errorMessage;

    /**
     * Create a new event instance.
     */
    public function __construct(User $user, Plan $plan, ?Payment $payment = null, ?string $errorMessage = null)
    {
        $this->user = $user;
        $this->plan = $plan;
        $this->payment = $payment;
        $this->errorMessage = $errorMessage;
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
