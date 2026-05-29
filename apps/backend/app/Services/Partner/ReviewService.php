<?php

namespace App\Services\Partner;

use App\Models\Review;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Class ReviewService
 * Manages the partner's interaction with the centralized polymorphic review engine.
 */
class ReviewService
{
    /**
     * Retrieve all reviews belonging to any listing owned by the partner.
     *
     * @param User $partner
     * @return LengthAwarePaginator
     */
    public function getReviewsForPartner(User $partner): LengthAwarePaginator
    {
        // Fetches reviews where the reviewable model (Property, Auto, etc.) belongs to the partner.
        return Review::whereHasMorph('reviewable', '*', function ($query) use ($partner) {
            $query->where('user_id', $partner->id);
        })
        ->with(['user', 'reviewable', 'reviewable.media'])
        ->latest()
        ->paginate(10);
    }

    /**
     * Mark a review as viewed/read by the partner.
     *
     * @param Review $review
     * @return void
     */
    public function markAsViewed(Review $review): void
    {
        if (!$review->viewed_at) {
            $review->update(['viewed_at' => now()]);
        }
    }
}
