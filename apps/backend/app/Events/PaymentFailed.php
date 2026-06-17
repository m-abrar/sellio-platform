<?php

namespace App\Events;

use App\Models\Plan;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PaymentFailed implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public User $user,
        public Plan $plan,
        public ?Payment $payment = null,
        public ?string $errorMessage = null,
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('App.Models.User.' . $this->user->id)];
    }

    public function broadcastAs(): string
    {
        return 'PaymentFailed';
    }

    public function broadcastWith(): array
    {
        return [
            'plan'          => $this->plan->name ?? null,
            'error_message' => $this->errorMessage,
        ];
    }
}
