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
        // Define common vertical relations to count for the dashboard/sidebar
        $verticals = ['properties', 'autos', 'events', 'jobs', 'services', 'classifieds', 'products'];
        $locationVerticals = ['properties', 'autos', 'events', 'jobs', 'services', 'classifieds'];
        $tagVerticals = ['properties', 'autos', 'events', 'jobs', 'services', 'classifieds'];

        return [
            'categories' => Category::where('is_classified', true)->withCount($verticals)->get(),
            'locations'  => Location::where('is_classified', true)->withCount($locationVerticals)->get(),
            'types'      => Type::where('is_classified', true)->withCount($verticals)->get(),
            'tags'       => Tag::where('is_classified', true)->withCount($tagVerticals)->get(),
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
        $filters = $this->normalizeClassifiedFilters($filters);
        $perPage = (int) ($filters['per_page'] ?? $perPage);

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
            ->with(['category', 'location', 'type', 'tags', 'user', 'media'])
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
            ->with(['media', 'category', 'location'])
            ->limit($limit)
            ->get();
    }

    protected function normalizeClassifiedFilters(array $filters): array
    {
        if (!empty($filters['category']) && empty($filters['category_id'])) {
            $category = Category::where('slug', $filters['category'])->first();
            if ($category) {
                $filters['category_id'] = $category->id;
            }
            unset($filters['category']);
        }

        if (!empty($filters['location']) && !is_numeric($filters['location'])) {
            $filters['location'] = Location::where('slug', $filters['location'])->value('id');
        }

        if (!empty($filters['price_range']) && empty($filters['min_price']) && empty($filters['max_price'])) {
            $parts = explode('-', (string) $filters['price_range'], 2);
            if (count($parts) === 2) {
                $filters['min_price'] = $parts[0];
                $filters['max_price'] = $parts[1];
            }
            unset($filters['price_range']);
        }

        if (!empty($filters['q']) && empty($filters['search'])) {
            $filters['search'] = $filters['q'];
            unset($filters['q']);
        }

        return $filters;
    }
}
