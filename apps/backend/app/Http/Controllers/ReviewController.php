<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Services\ReviewManagementService;
use App\Events\ReviewReceived;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Log;

/**
 * Class ReviewController
 *
 * Manages reviews using polymorphic relationships aligned with the database schema.
 */
class ReviewController extends Controller
{
    /**
     * @var ReviewManagementService
     */
    protected $reviewService;

    /**
     * ReviewController constructor.
     *
     * @param ReviewManagementService $reviewService
     */
    public function __construct(ReviewManagementService $reviewService)
    {
        $this->reviewService = $reviewService;
    }

    /**
     * Store a newly created review.
     *
     * @param StoreReviewRequest $request
     * @param string $type
     * @param int|string $id
     * @return RedirectResponse
     */
    public function store(StoreReviewRequest $request, string $type, $id): RedirectResponse
    {
        $reviewable = $this->reviewService->resolveReviewable($type, $id);

        // Check for duplicate to avoid SQL Unique Constraint error
        if ($this->reviewService->hasAlreadyReviewed($reviewable)) {
            return back()->with('error', __('You have already reviewed this item.'));
        }

        try {
            $review = $this->reviewService->createReview($reviewable, $request->validated());
            $reviewable->loadMissing('user');

            if ($reviewable->user) {
                ReviewReceived::dispatch($reviewable->user, $reviewable, $review);
            }

            return back()->with('success', __('Review submitted successfully.'));
        } catch (\Exception $e) {
            Log::error("Review Submission Error: " . $e->getMessage());
            return back()->with('error', __('Failed to submit review. Please try again.'));
        }
    }

    /**
     * Display reviews for a specific reviewable item.
     *
     * @param string $type
     * @param int|string $id
     * @return View
     */
    public function index(string $type, $id): View
    {
        $reviewable = $this->reviewService->resolveReviewable($type, $id);
        
        $reviews = $reviewable->reviews()
            ->with('user')
            ->approved() // Uses the scope defined in the Review model
            ->latest()
            ->paginate(10);

        return view('frontend.reviews.index', compact('reviewable', 'reviews'));
    }
}
