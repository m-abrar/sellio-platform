<?php

namespace App\Services;

use App\Models\Classified;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\User;
use Illuminate\Support\Collection;
use App\Models\Category;
use App\Models\Location;
use App\Models\Type;
use App\Models\Tag;

/**
 * Class ClassifiedManagementService
 *
 * Handles advanced filtering and complex pagination for classified ads.
 */
class ClassifiedManagementService
{
    /**
     * Get filter taxonomies for the classified search sidebar.
     *
     * @return array
     */
    public function getFilterTaxonomies(): array
    {
        return [
            'categories' => Category::where('is_classified', true)->get(),
            'locations'  => Location::where('is_classified', true)->get(),
            'types'      => Type::where('is_classified', true)->get(),
            'tags'       => Tag::where('is_classified', true)->get(),
        ];
    }

    /**
     * Filter and paginate classifieds, ensuring featured items appear first.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPaginatedClassifieds(array $filters, ?User $user = null, int $perPage = 12): LengthAwarePaginator
    {
        return Classified::visibleTo($user)
            ->orderByDesc('is_featured')
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
            ->with(['category', 'location', 'type', 'tags', 'user'])
            ->paginate($perPage)
            ->withQueryString();
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
