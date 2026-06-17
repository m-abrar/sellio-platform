<?php

namespace App\Events;

use App\Models\Plan;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class PlanExpired implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public User $user, public Plan $plan) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('App.Models.User.' . $this->user->id)];
    }

    public function broadcastAs(): string
    {
        return 'PlanExpired';
    }

    public function broadcastWith(): array
    {
        return [
            'plan' => $this->plan->name ?? null,
        ];
    }
}
