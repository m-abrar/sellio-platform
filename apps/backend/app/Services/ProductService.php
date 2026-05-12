<?php

namespace App\Services;

use App\Models\{Product, ProductAttribute, ProductAddon, Location, Feature, Category, Type, Brand, Tag, User};
use Illuminate\Support\Facades\{DB, Cache};
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

/**
 * Class ProductService
 * Optimized for high-performance E-commerce marketplace standards.
 */
class ProductService
{
    /**
     * Get all data required for the product search/listing view.
     * Optimized with caching and eager loading.
     */
    public function getSearchPageData(array $filters, ?User $user): array
    {
        // Cache taxonomy data to reduce database load on high-traffic search pages
        $ttl = 3600; // 1 hour
        $rawMaxPrice = Product::max(DB::raw('COALESCE(sale_price, base_price)'));

        $query = Product::query()->visibleTo($user)->with(['media', 'brand', 'category']);
        $products = $this->applyFilters($query, $filters)->paginate(120)->withQueryString();

        return [
            'products'        => $products,
            'locations'       => Cache::remember('shop_locations', $ttl, fn() => Location::where('is_product', true)->active()->get()),
            'features'        => Cache::remember('shop_features', $ttl, fn() => Feature::where('is_product', true)->active()->get()),
            'categories'      => Cache::remember('shop_categories', $ttl, fn() => Category::where('is_product', true)->active()->get()),
            'types'           => Cache::remember('shop_types', $ttl, fn() => Type::where('is_product', true)->active()->get()),
            'brands'          => Cache::remember('shop_brands', $ttl, fn() => Brand::where('is_product', true)->active()->get()),
            'tags'            => Cache::remember('shop_tags', $ttl, fn() => Tag::where('is_product', true)->active()->get()),
            'maxAllowedPrice' => $this->roundUpPrice($rawMaxPrice) ?? 5000,
            'filters'         => $filters,
            'count'           => $products->total(),
        ];
    }

    /**
     * Core filtering logic for products.
     */
    private function applyFilters($query, array $f)
    {
        // 1. Keyword Search (Indexed columns)
        $query->when($f['search'] ?? null, function ($q, $v) {
            $q->where(fn($sq) => $sq->where('title', 'like', "%$v%")
                ->orWhere('sku', 'like', "%$v%"));
        });

        // 2. Taxonomy Filters
        $query->when($f['category_id'] ?? null, fn($q, $v) => $q->where('category_id', $v));
        $query->when($f['brand'] ?? null, fn($q, $v) => $q->where('brand_id', $v));

        // 3. Dynamic Price Filtering
        $query->when($f['min_price'] ?? null, function ($q, $v) {
            $q->where(DB::raw('COALESCE(sale_price, base_price)'), '>=', (float)$v);
        });

        $query->when($f['max_price'] ?? null, function ($q, $v) {
            $q->where(DB::raw('COALESCE(sale_price, base_price)'), '<=', (float)$v);
        });

        // 4. Sorting logic
        $sort = $f['sort_by'] ?? 'latest';
        match ($sort) {
            'price_low'  => $query->orderBy(DB::raw('COALESCE(sale_price, base_price)'), 'asc'),
            'price_high' => $query->orderBy(DB::raw('COALESCE(sale_price, base_price)'), 'desc'),
            'rating'     => $query->orderByRating(),
            default      => $query->orderByDesc('is_featured')->latest(),
        };

        return $query;
    }

    /**
     * Get full detail data for a single product page.
     */
    public function getProductDetailsData(Product $product): array
    {
        return [
            'product'          => $product->load(['brand', 'category', 'tags']),
            'related_products' => $this->getRelatedProducts($product),
            'attributes'       => $product->attributes()
                                    ->where('is_visible', true)
                                    ->get()
                                    ->groupBy('name'),
            'addons'           => $product->addons()->where('is_published', true)->get(),
        ];
    }

    /**
     * AJAX Helper: Calculate price based on user selection.
     */
    public function calculateSelectionPrice(Product $product, array $attrIds, array $addonIds, int $qty = 1): array
    {
        $breakdown = $this->calculateProductBreakdown($product, $attrIds, $addonIds, $qty);
        $currency = setting('currency_symbol', '$');

        return [
            'unit_price'            => $breakdown['unit_price'],
            'total_price'           => $breakdown['total_amount'],
            'unit_price_formatted'  => $currency . number_format($breakdown['unit_price'], 2),
            'total_price_formatted' => $currency . number_format($breakdown['total_amount'], 2),
            'breakdown'             => $breakdown['lines']
        ];
    }

    /**
     * Detailed breakdown of costs with Translation and Configurable Taxes.
     */
    public function calculateProductBreakdown(Product $product, array $attrIds, array $addonIds, int $qty): array
    {
        $lines = collect();
        $basePrice = $product->on_sale ? $product->sale_price : $product->base_price;

        // 1. Base Product Line
        $lines->push([
            'title'  => $product->title . ' ' . __('(Base)'),
            'amount' => (float) $basePrice,
            'type'   => 'base'
        ]);

        // 2. Attributes Surcharges
        $attributes = ProductAttribute::whereIn('id', $attrIds)->get();
        foreach ($attributes as $attr) {
            if ($attr->additional_price > 0) {
                $lines->push([
                    'title'  => __('Option: :name (:value)', ['name' => $attr->name, 'value' => $attr->value]),
                    'amount' => (float) $attr->additional_price,
                    'type'   => 'attribute'
                ]);
            }
        }

        // 3. Addons
        $addons = ProductAddon::whereIn('id', $addonIds)->get();
        foreach ($addons as $addon) {
            $addonAmount = ($addon->pricing_type === 'per_unit') ? $addon->price : ($addon->price / $qty);
            $lines->push([
                'title'  => __('Addon: :title', ['title' => $addon->title]),
                'amount' => (float) $addonAmount,
                'type'   => 'addon'
            ]);
        }

        $unitPrice = (float) $lines->sum('amount');
        $subtotal  = $unitPrice * $qty;

        // 4. Tax Calculation from Config
        $taxRate = (float) config('shop.tax_rate', 0); 
        $taxAmount = $subtotal * $taxRate;

        return [
            'unit_price'   => round($unitPrice, 2),
            'qty'          => $qty,
            'subtotal'     => round($subtotal, 2),
            'tax_amount'   => round($taxAmount, 2),
            'total_amount' => round($subtotal + $taxAmount, 2),
            'lines'        => $lines->toArray()
        ];
    }

    /**
     * Get related products with optimized fallback.
     */
    protected function getRelatedProducts(Product $product): Collection
    {
        $related = Product::active()
            ->where('id', '!=', $product->id)
            ->where(function($q) use ($product) {
                $q->where('category_id', $product->category_id)
                  ->orWhere('brand_id', $product->brand_id);
            })
            ->with(['media', 'brand', 'category', 'user'])
            ->limit(4)->get();

        if ($related->count() < 4) {
            $extra = Product::active()
                ->where('id', '!=', $product->id)
                ->whereNotIn('id', $related->pluck('id'))
                ->with(['media', 'brand', 'category', 'user'])
                ->inRandomOrder()->limit(4 - $related->count())->get();
            $related = $related->merge($extra);
        }

        return $related;
    }

    /**
     * Logic for search price rounding.
     */
    protected function roundUpPrice(?float $price): ?int
    {
        if (!$price || $price <= 0) return null;
        $base = pow(10, floor(log10($price)));
        $rounded = ceil($price / $base) * $base;
        return (int) ($rounded < 100 ? ceil($price / 10) * 10 : $rounded);
    }

    /**
     * Log the view for analytics using Spatie ActivityLog.
     */
    public function logListingView(Product $product): void
    {
        activity('product_views')
            ->performedOn($product)
            ->causedBy(auth()->user())
            ->withProperties(['ip' => request()->ip(), 'agent' => request()->userAgent()])
            ->log('viewed_product');
    }
}
