<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Http\Resources\ReviewResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Dashboard\User\UpdateReviewRequest;
use Illuminate\View\View;

/**
 * Class ReviewController
 * Orchestrates the user-facing discovery and management of submitted reviews, 
 * providing centralized access to feedback history and polymorphic entity metadata.
 */
class ReviewController extends Controller
{
    /**
     * Retrieve a paginated collection of reviews submitted by the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index() {
        $user = Auth::user();

        $reviews = Review::where('user_id', $user->id)
            ->with(['reviewable'])
            ->latest()
            ->paginate(10);

        $stats = [
            'reviews_given' => $reviews->total(),
            'avg_rating'    => number_format($user->reviews()->avg('rating') ?? 0, 1),
        ];

        return $this->successResponse(
            ReviewResource::collection($reviews),
            null,
            200,
            ['stats' => $stats]
        );
    }

    /**
     * Retrieve a specific review for modification.
     *
     * @param  \App\Models\Review  $review
     * @return \Illuminate\Http\JsonResponse
     */
    public function edit(Review $review) {
        if ($review->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $review->load(['reviewable']);

        return $this->successResponse(new ReviewResource($review));
    }

    /**
     * Persist modifications to an existing review entity.
     *
     * @param  \App\Http\Requests\Dashboard\User\UpdateReviewRequest  $request
     * @param  \App\Models\Review  $review
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateReviewRequest $request, Review $review) {
        if ($review->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validated();

        $review->update($validated);

        return $this->successResponse(null, 'Your review has been successfully updated.');
    }

    /**
     * Terminate the specified review entity.
     *
     * @param  \App\Models\Review  $review
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Review $review) {
        if ($review->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $review->delete();

        return $this->successResponse(null, 'Successfully removed from your reviews.');
    }

    /**
     * Store a newly created review in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request) {
        $validated = $request->validate([
            'rating'          => 'required|integer|between:1,5',
            'comment'         => 'required|string',
            'reviewable_id'   => 'required|integer',
            'reviewable_type' => 'required|string',
        ]);

        // Standardize reviewable type names if they are short names
        $typeMap = [
            'properties'   => \App\Models\Property::class,
            'property'     => \App\Models\Property::class,
            'autos'        => \App\Models\Auto::class,
            'auto'         => \App\Models\Auto::class,
            'events'       => \App\Models\Event::class,
            'event'        => \App\Models\Event::class,
            'services'     => \App\Models\Service::class,
            'service'      => \App\Models\Service::class,
            'jobs'         => \App\Models\JobListing::class,
            'job'          => \App\Models\JobListing::class,
            'products'     => \App\Models\Product::class,
            'product'      => \App\Models\Product::class,
            'classifieds'  => \App\Models\Classified::class,
            'classified'   => \App\Models\Classified::class,
        ];

        $lowerType = strtolower($validated['reviewable_type']);
        if (isset($typeMap[$lowerType])) {
            $validated['reviewable_type'] = $typeMap[$lowerType];
        }

        $review = new Review($validated);
        $review->user_id = Auth::id();
        $review->status = Review::STATUS_APPROVED; // Default to approved
        $review->save();

        return $this->successResponse(new ReviewResource($review), __('Review successfully submitted.'), 201);
    }
}
