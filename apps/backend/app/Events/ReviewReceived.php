<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\Review;
use Illuminate\Database\Eloquent\Model;

class ReviewReceived implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public User $owner,
        public Model $reviewable,
        public Review $review
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('App.Models.User.' . $this->owner->id)];
    }

    public function broadcastAs(): string
    {
        return 'ReviewReceived';
    }

    public function broadcastWith(): array
    {
        return [
            'review_id'   => $this->review->id,
            'rating'      => $this->review->rating,
            'listing'     => $this->reviewable->title ?? null,
        ];
    }
}
