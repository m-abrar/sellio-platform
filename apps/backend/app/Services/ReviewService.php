<?php

namespace App\Services;

use App\Models\User;
use App\Models\Review;
use App\Models\Auto;
use App\Models\Property;
use Illuminate\Support\Facades\Cache;

/**
 * Class ReviewService
 * Manages business logic for reviews and ratings.
 */
class ReviewService
{
    /**
     * Calculate the average rating for a user's listings of a specific type.
     */
    public function getUserRatingByType(User $user, string $type): string
    {
        $mapping = [
            'auto'     => ['class' => Auto::class,     'relation' => 'autos'],
            'property' => ['class' => Property::class, 'relation' => 'properties'],
        ];

        if (!isset($mapping[$type])) {
            return number_format(0, 1);
        }

        $cacheKey = "user_rating_{$user->id}_{$type}";

        return Cache::remember($cacheKey, now()->addHours(1), function () use ($user, $mapping) {
            $modelClass = $mapping[$type]['class'];
            $relationName = $mapping[$type]['relation'];
            
            $listingIds = $user->$relationName()->pluck('id');
            
            if ($listingIds->isEmpty()) {
                return number_format(0, 1);
            }

            $averageRating = Review::query()
                ->whereIn('reviewable_id', $listingIds)
                ->where('reviewable_type', $modelClass)
                ->where('status', 'approved')
                ->avg('rating');

            return number_format($averageRating ?? 0, 1);
        });
    }
}
