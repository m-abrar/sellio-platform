<?php

namespace App\Services;

use App\Models\Classified;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\User;
use Illuminate\Support\Collection;

/**
 * Class ClassifiedManagementService
 *
 * Handles advanced filtering and complex pagination for classified ads.
 */
class ClassifiedManagementService
{
    /**
     * Filter and paginate classifieds, ensuring featured items appear first.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPaginatedClassifieds(array $filters, ?User $user = null, int $perPage = 12): LengthAwarePaginator
    {
        $currentPage = (int) ($filters['page'] ?? 1);
        $isFirstPage = $currentPage === 1;

        // 1. Fetch Featured Items
        $featured = Classified::where('is_featured', true)
            ->visibleTo($user)
            ->latest()
            ->get();

        $featuredCount = $featured->count();

        // 2. Build Normal Query
        $normalQuery = Classified::visibleTo($user)
            ->whereNotIn('id', $featured->pluck('id'))
            ->latest()
            ->when($filters['search'] ?? null, function ($q, $v) {
                $q->where(fn($sub) => $sub->where('title', 'like', "%$v%")
                    ->orWhere('description', 'like', "%$v%"));
            })
            ->when($filters['category_id'] ?? null, fn($q, $v) => $q->where('category_id', $v))
            ->when($filters['min_price'] ?? null, fn($q, $v) => $q->where(fn($sq) => $sq->where('sale_price', '>=', $v)->orWhere(fn($ssq) => $ssq->whereNull('sale_price')->where('base_price', '>=', $v))))
            ->when($filters['max_price'] ?? null, fn($q, $v) => $q->where(fn($sq) => $sq->where('sale_price', '<=', $v)->orWhere(fn($ssq) => $ssq->whereNull('sale_price')->where('base_price', '<=', $v))))
            ->when($filters['location'] ?? null, fn($q, $v) => $q->where('location_id', $v))
            ->when($filters['type'] ?? null,     fn($q, $v) => $q->where('type_id', $v))
            ->when($filters['tags'] ?? null, function ($q, $v) {
                $q->whereHas('tags', fn($sub) => $sub->whereIn('tags.id', (array) $v));
            })
            ->with(['category', 'location', 'type', 'tags', 'user']);

        $totalNormalCount = $normalQuery->count();
        $total = $totalNormalCount + $featuredCount;

        // 3. Handle Manual Pagination Math
        if ($isFirstPage) {
            $normalLimit = max($perPage - $featuredCount, 0);
            $normalOffset = 0;
        } else {
            $itemsSkippedBeforeThisPage = ($currentPage - 1) * $perPage;
            $normalOffset = max($itemsSkippedBeforeThisPage - $featuredCount, 0);
            $normalLimit = $perPage;
        }

        $normalItems = $normalQuery->offset($normalOffset)->limit($normalLimit)->get();

        // 4. Merge results
        $merged = $isFirstPage ? $featured->concat($normalItems) : $normalItems;

        return new LengthAwarePaginator(
            $merged,
            $total,
            $perPage,
            $currentPage,
            [
                'path'  => request()->url(),
                'query' => request()->query(),
            ]
        );
    }

    /**
     * Get related items from the same user.
     *
     * @param Classified $classified
     * @param int $limit
     * @return Collection
     */
    public function getRelatedItems(Classified $classified, int $limit = 4): Collection
    {
        return Classified::where('user_id', $classified->user_id)
            ->where('id', '!=', $classified->id)
            ->active()
            ->latest()
            ->limit($limit)
            ->get();
    }
}
