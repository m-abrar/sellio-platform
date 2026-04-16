<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use Illuminate\Database\Eloquent\Model; // For the reviewable item

/**
 * Dispatched when a customer should be prompted to leave a review.
 *
 * @property User $recipient The user (customer) who should write the review.
 * @property Model $reviewable The polymorphic item the user interacted with (e.g., Listing).
 */
class ReviewRequested
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @param User $recipient The customer who is being asked to leave a review.
     * @param Model $reviewable The item (e.g., Listing model) to be reviewed.
     */
    public function __construct(
        public User $recipient,
        public Model $reviewable
    ) {}
}
