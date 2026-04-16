<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\Review;
use Illuminate\Database\Eloquent\Model; // For the reviewable item

/**
 * Dispatched when a new review is submitted for a listing.
 *
 * @property User $owner The user who owns the item being reviewed (e.g., property owner, job poster).
 * @property Model $reviewable The polymorphic item being reviewed (e.g., Listing, Property).
 * @property Review $review The newly created Review model instance.
 */
class ReviewReceived
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @param User $owner The owner of the item that received the review.
     * @param Model $reviewable The item (e.g., Listing model) that was reviewed.
     * @param Review $review The new review instance.
     */
    public function __construct(
        public User $owner,
        public Model $reviewable,
        public Review $review
    ) {}
}
