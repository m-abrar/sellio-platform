<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Http\Resources\ReviewResource;
use App\Services\Partner\ReviewService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

/**
 * Class ReviewController
 * Manages customer feedback for a partner's multi-category listings.
 */
class ReviewController extends Controller
{
    /**
     * @var ReviewService
     */
    protected $reviewService;

    /**
     * ReviewController constructor.
     *
     * @param ReviewService $reviewService
     */
    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
    }

    /**
     * Display a listing of reviews for the partner's items.
     *
     * @return View
     */
    public function index() {
        $reviews = $this->reviewService->getReviewsForPartner(Auth::user());

        return $this->successResponse(ReviewResource::collection($reviews));
    }

    /**
     * Store a partner reply on the specified review.
     */
    public function reply(Request $request, Review $review)
    {
        $this->authorizeOwner($review);

        $validated = $request->validate([
            'reply' => ['required', 'string', 'max:2000'],
        ]);

        $review->update([
            'partner_reply' => $validated['reply'],
            'partner_replied_at' => now(),
            'partner_id' => Auth::id(),
            'viewed_at' => $review->viewed_at ?? now(),
        ]);

        return $this->successResponse(
            new ReviewResource($review->fresh(['user', 'reviewable'])),
            __('Reply posted successfully.')
        );
    }

    /**
     * Display the specified review and mark it as viewed.
     *
     * @param Review $review
     * @return View
     */
    public function show(Review $review) {
        $this->authorizeOwner($review);

        // Mark as viewed when the partner opens the review
        $this->reviewService->markAsViewed($review);

        return $this->successResponse(new ReviewResource($review->load(['user', 'reviewable'])));
    }

    /**
     * Ensure the partner is the owner of the listing being reviewed.
     *
     * @param Review $review
     * @return void
     */
    protected function authorizeOwner(Review $review): void
    {
        /** * Logic: $review->reviewable is the listing (Property, Auto, etc.).
         * We check if that listing's user_id matches the authenticated partner.
         */
        if ($review->reviewable->user_id !== Auth::id()) {
            abort(403, __('Unauthorized access to this review.'));
        }
    }
}
