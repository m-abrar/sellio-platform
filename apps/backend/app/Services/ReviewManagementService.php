<?php

namespace App\Services;

use App\Models\Auto;
use App\Models\Classified;
use App\Models\Event;
use App\Models\JobListing;
use App\Models\Property;
use App\Models\Review;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/**
 * Class ReviewManagementService
 *
 * Handles polymorphic review mapping and storage logic aligned with migration schema.
 */
class ReviewManagementService
{
    /**
     * Map slugs to fully qualified model names.
     *
     * @var array
     */
    protected $reviewableMap = [
        'properties'  => Property::class,
        'autos'       => Auto::class,
        'events'      => Event::class,
        'jobs'        => JobListing::class,
        'services'    => Service::class,
        'classifieds' => Classified::class,
        'users'       => User::class,
    ];

    /**
     * Resolve the model instance based on type and ID.
     *
     * @param string $type
     * @param int|string $id
     * @return Model
     */
    public function resolveReviewable(string $type, $id): Model
    {
        $modelClass = $this->reviewableMap[$type] ?? null;

        if (!$modelClass) {
            abort(404, __('Invalid reviewable type.'));
        }

        return $modelClass::findOrFail($id);
    }

    /**
     * Create a review for a specific model, checking for duplicates.
     *
     * @param Model $reviewable
     * @param array $data
     * @return mixed
     */
    public function createReview(Model $reviewable, array $data)
    {
        $review = $reviewable->reviews()->make([
            'rating'  => $data['rating'],
            'comment' => $data['comment'] ?? null,
        ]);

        $review->user_id = Auth::id();
        $review->status = Review::STATUS_PENDING;
        $review->save();

        return $review;
    }

    /**
     * Check if the user has already reviewed this specific item.
     *
     * @param Model $reviewable
     * @return bool
     */
    public function hasAlreadyReviewed(Model $reviewable): bool
    {
        return $reviewable->reviews()
            ->where('user_id', Auth::id())
            ->exists();
    }
}
