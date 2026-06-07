<?php

namespace App\Services;

use App\Models\Auto;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Location;
use App\Models\Tag;
use App\Models\Type;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Class AutoService
 * * Encapsulates business logic for filtering and retrieving automobile data.
 */
class AutoService
{
    /**
     * Retrieves all data required for the search/index page.
     * * @param array $filters
     * @return array
     */
    public function getSearchPageData(array $filters, ?User $user = null): array
    {
        // Define common vertical relations to count for the dashboard/sidebar
        $verticals = ['properties', 'autos', 'events', 'jobs', 'services', 'classifieds', 'products'];
        $locationVerticals = ['properties', 'autos', 'events', 'jobs', 'services', 'classifieds'];
        $tagVerticals = ['properties', 'autos', 'events', 'jobs', 'services', 'classifieds'];

        return [
            'autos' => $this->getFilteredAutos($filters, $user),
            'categories' => Category::where('is_auto', true)->withCount($verticals)->get(),
            'locations' => Location::where('is_auto', true)->withCount($locationVerticals)->get(),
            'types' => Type::where('is_auto', true)->withCount($verticals)->get(),
            'tags' => Tag::where('is_auto', true)->withCount($tagVerticals)->get(),
            'brands' => Brand::where('is_auto', true)->get(),
            'transactionType' => $this->getTransactionTypes(),
            'transmissionOptions' => [__('Automatic'), __('Manual')],
        ];
    }

    /**
     * Apply filters to the Auto model.
     * * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getFilteredAutos(array $filters, ?User $user = null): LengthAwarePaginator
    {
        $query = Auto::query()
            ->orderByDesc('is_featured')
            ->latest()
            ->visibleTo($user);

        $query->when($filters['category_id'] ?? null, fn($q, $val) => $q->where('category_id', $val));
        $query->when($filters['make'] ?? null, fn($q, $val) => $q->where('make', $val));
        $query->when($filters['model'] ?? null, fn($q, $val) => $q->where('model', 'like', "%{$val}%"));
        $query->when($filters['location'] ?? null, fn($q, $val) => $q->where('location_id', $val));
        $query->when($filters['min_price'] ?? null, fn($q, $val) => $q->where('base_price', '>=', $val));
        $query->when($filters['max_price'] ?? null, fn($q, $val) => $q->where('base_price', '<=', $val));
        $query->when($filters['search'] ?? null, fn($q, $val) => $q->where(fn($sq) => $sq->where('make', 'like', "%{$val}%")->orWhere('model', 'like', "%{$val}%")));
        $query->when($filters['year_min'] ?? null, fn($q, $val) => $q->where('year', '>=', $val));
        $query->when($filters['year_max'] ?? null, fn($q, $val) => $q->where('year', '<=', $val));
        $query->when($filters['transmission'] ?? null, fn($q, $val) => $q->where('transmission', $val));

        $query->when($filters['type'] ?? null, function ($q, $type) {
            if ($type === 'selling') {
                $q->where('is_selling', true);
            } elseif ($type === 'lease') {
                $q->where('is_lease', true);
            }
        });

        $query->when($filters['tags'] ?? null, function ($q, $tags) {
            foreach ((array)$tags as $tagId) {
                $q->whereHas('tags', fn($sub) => $sub->where('tag_id', $tagId));
            }
        });

            ->with(['category', 'location', 'user', 'media', 'brand', 'type', 'features', 'tags'])->paginate(12);
    }

    /**
     * Get related autos based on category and make.
     * * @param Auto $auto
     * @param int $limit
     * @return Collection
     */
    public function getRelatedAutos(Auto $auto, int $limit = 4): Collection
    {
        $excludedIds = [$auto->id];

        // 1. Same Category & Make
        $related = Auto::active()
            ->where('category_id', $auto->category_id)
            ->where('make', $auto->make)
            ->whereNotIn('id', $excludedIds)
            ->with(['category', 'location', 'media'])
            ->latest()
            ->take($limit)
            ->get();

        $excludedIds = array_merge($excludedIds, $related->pluck('id')->toArray());
        $needed = $limit - $related->count();

        // 2. Fill with same Category (Random)
        if ($needed > 0) {
            $extra = Auto::active()
                ->where('category_id', $auto->category_id)
                ->whereNotIn('id', $excludedIds)
                ->with(['category', 'location', 'media'])
                ->inRandomOrder()
                ->take($needed)
                ->get();

            $related = $related->merge($extra);
        }

        return $related;
    }

    /**
     * Returns static transaction types.
     * * @return Collection
     */
    private function getTransactionTypes(): Collection
    {
        return collect([
            (object)['id' => 'selling', 'title' => __('For Sale')],
            (object)['id' => 'lease', 'title' => __('For Lease')],
        ]);
    }
}
