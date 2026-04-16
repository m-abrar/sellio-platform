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

class ReviewController extends Controller
{
    /**
     * Display a listing of the user's submitted reviews with stats.
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
     * Show the form for editing the specified review.
     */
    public function edit(Review $review) {
        if ($review->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $review->load(['reviewable']);

        return $this->successResponse(new ReviewResource($review));
    }

    /**
     * Update the specified review in storage.
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
     * Remove the specified review from storage.
     */
    public function destroy(Review $review) {
        if ($review->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $review->delete();

        return $this->successResponse(null, 'Successfully removed from your reviews.');
    }
}
