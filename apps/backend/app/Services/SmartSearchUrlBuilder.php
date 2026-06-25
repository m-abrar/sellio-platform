<?php

namespace App\Services;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Location;
use App\Models\Type;
use Illuminate\Support\Str;

class SmartSearchUrlBuilder
{
    /**
     * Allowed URL params per module (after normalisation).
     * These must match the exact keys in each module's FormRequest rules().
     */
    private const MODULE_ROUTES = [
        'properties'  => ['route' => 'properties.search',  'params' => ['q', 'location', 'category', 'property_type', 'min_price', 'max_price', 'bedrooms', 'bathrooms', 'guests', 'check_in', 'check_out']],
        'autos'       => ['route' => 'autos.search',       'params' => ['make', 'model', 'location', 'category', 'type', 'transmission', 'price_min', 'price_max', 'year_min', 'year_max']],
        'events'      => ['route' => 'events.search',      'params' => ['search', 'location', 'category', 'type', 'tag', 'date', 'sort']],
        'services'    => ['route' => 'services.search',    'params' => ['search', 'location', 'category_id', 'type', 'min_price', 'max_price', 'expertise']],
        'classifieds' => ['route' => 'classifieds.search', 'params' => ['search', 'location', 'category', 'type', 'tag', 'min_price', 'max_price', 'sort']],
        'jobs'        => ['route' => 'jobs.search',        'params' => ['search', 'location', 'category', 'type', 'tag', 'workplace_type', 'experience_level', 'sort']],
        'products'    => ['route' => 'products.search',    'params' => ['q', 'location', 'category', 'brand', 'min_price', 'max_price', 'sort_by']],
        'blogs'       => ['route' => 'blogs.search',       'params' => ['search', 'category', 'tag', 'sort']],
    ];

    public function build(string $module, array $filters): ?string
    {
        $module = strtolower(trim($module));

        if (! isset(self::MODULE_ROUTES[$module])) {
            return null;
        }

        $config  = self::MODULE_ROUTES[$module];
        $filters = $this->normalise($module, $filters);

        $allowed = array_flip($config['params']);
        $query   = array_filter(
            array_intersect_key($filters, $allowed),
            fn($v) => $v !== null && $v !== ''
        );

        try {
            return route($config['route'], $query);
        } catch (\Throwable) {
            return null;
        }
    }

    public function supportedModules(): array
    {
        return array_keys(self::MODULE_ROUTES);
    }

    // ── Normalisation ─────────────────────────────────────────────────────

    private function normalise(string $module, array $f): array
    {
        return match ($module) {
            'properties' => $this->normaliseProperties($f),
            'autos'      => $this->normaliseAutos($f),
            'events'     => $this->normaliseSlugs($f, ['location', 'category', 'type', 'tag']),
            'services'   => $this->normaliseServices($f),
            'classifieds'=> $this->normaliseSlugs($f, ['location', 'category', 'type', 'tag']),
            'jobs'       => $this->normaliseSlugs($f, ['location', 'category', 'type', 'tag']),
            'products'   => $this->normaliseProducts($f),
            'blogs'      => $this->normaliseSlugs($f, ['category', 'tag']),
            default      => $f,
        };
    }

    /** properties — location and category are integer IDs */
    private function normaliseProperties(array $f): array
    {
        if (isset($f['location'])) $f['location'] = $this->locationId($f['location'], 'is_property');
        if (isset($f['category'])) $f['category'] = $this->categoryId($f['category'], 'is_property');
        return $f;
    }

    /** autos — location and category are integer IDs; type is a string (selling|lease) */
    private function normaliseAutos(array $f): array
    {
        if (isset($f['location'])) $f['location'] = $this->locationId($f['location'], 'is_auto');
        if (isset($f['category'])) $f['category'] = $this->categoryId($f['category'], 'is_auto');
        return $f;
    }

    /** services — location is ID, category_id is ID, type is ID; remap 'category' → 'category_id' */
    private function normaliseServices(array $f): array
    {
        if (isset($f['category']) && ! isset($f['category_id'])) {
            $f['category_id'] = $f['category'];
            unset($f['category']);
        }
        if (isset($f['location']))    $f['location']    = $this->locationId($f['location'], 'is_service');
        if (isset($f['category_id'])) $f['category_id'] = $this->categoryId($f['category_id'], 'is_service');
        if (isset($f['type']))        $f['type']        = $this->typeId($f['type']);
        return $f;
    }

    /** products — location, category, brand are integer IDs */
    private function normaliseProducts(array $f): array
    {
        if (isset($f['location'])) $f['location'] = $this->locationId($f['location'], 'is_product');
        if (isset($f['category'])) $f['category'] = $this->categoryId($f['category'], 'is_product');
        if (isset($f['brand']))    $f['brand']    = $this->brandId($f['brand']);
        return $f;
    }

    /** For slug-based modules: slugify the specified fields so they pass exists:table,slug validation */
    private function normaliseSlugs(array $f, array $fields): array
    {
        foreach ($fields as $field) {
            if (isset($f[$field]) && is_string($f[$field])) {
                $f[$field] = Str::slug($f[$field]);
            }
        }
        return $f;
    }

    // ── DB lookups ────────────────────────────────────────────────────────

    private function locationId(mixed $value, ?string $moduleFlag = null): ?int
    {
        if (is_numeric($value)) return (int) $value;
        if (! is_string($value) || $value === '') return null;
        return Location::when($moduleFlag, fn($q) => $q->where($moduleFlag, true))
            ->where(fn($q) => $q->where('slug', Str::slug($value))->orWhere('title', 'LIKE', '%'.$value.'%'))
            ->value('id');
    }

    private function categoryId(mixed $value, ?string $moduleFlag = null): ?int
    {
        if (is_numeric($value)) return (int) $value;
        if (! is_string($value) || $value === '') return null;
        return Category::when($moduleFlag, fn($q) => $q->where($moduleFlag, true))
            ->where(fn($q) => $q->where('slug', Str::slug($value))->orWhere('title', 'LIKE', '%'.$value.'%'))
            ->value('id');
    }

    private function brandId(mixed $value): ?int
    {
        if (is_numeric($value)) return (int) $value;
        if (! is_string($value) || $value === '') return null;
        return Brand::where('slug', Str::slug($value))
            ->orWhere('title', 'LIKE', $value)
            ->value('id');
    }

    private function typeId(mixed $value): ?int
    {
        if (is_numeric($value)) return (int) $value;
        if (! is_string($value) || $value === '') return null;
        return Type::where('slug', Str::slug($value))
            ->orWhere('title', 'LIKE', $value)
            ->value('id');
    }
}
