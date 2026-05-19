<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'title'             => $this->title,
            'slug'              => $this->slug,
            'sku'               => $this->sku,
            'description'       => $this->description,
            'short_description' => $this->short_description, // Custom accessor logic

            // Pricing & Financials
            'pricing' => [
                'base_price'      => (float) $this->base_price,
                'sale_price'      => (float) $this->sale_price,
                'current_price'   => (float) $this->price, // From custom accessor
                'formatted'       => $this->price_formatted,
                'on_sale'         => (bool) $this->on_sale,
                'currency_symbol' => setting('currency_symbol', '$'),
            ],

            // Inventory Management
            'inventory' => [
                'in_stock'             => (bool) $this->in_stock,
                'stock_quantity'       => $this->when(
                    auth()->id() === $this->user_id || (auth()->check() && auth()->user()->hasRole('admin')),
                    (int) $this->stock_quantity,
                    $this->stock_quantity > 0 ? 'In Stock' : 'Out of Stock'
                ),
                'manage_stock'         => (bool) $this->manage_stock,
                'low_stock_threshold'  => $this->when(
                    auth()->id() === $this->user_id || (auth()->check() && auth()->user()->hasRole('admin')),
                    (int) $this->low_stock_threshold
                ),
                'is_digital'           => (bool) $this->is_digital,
            ],

            // Physical Attributes & Specs
            'specs' => [
                'weight'               => $this->weight ? $this->weight . ' kg' : null,
                'dimensions'           => $this->dimensions_formatted, // From custom accessor
                'type'                 => $this->whenLoaded('type', fn() => $this->type->title),
                'features'             => $this->whenLoaded('features', fn() => $this->features->map(fn($f) => [
                    'id'    => $f->id,
                    'title' => $f->title,
                    'icon'  => $f->icon,
                ])),
            ],

            // Spatie Media Implementation
            'media' => [
                'featured_image' => $this->primary_image_url, 
                'gallery'        => $this->whenLoaded('media', fn() => $this->getMedia(Product::GALLERY_MEDIA)->map(fn($media) => [
                    'id'        => $media->id,
                    'url'       => $media->getUrl(),
                    'thumbnail' => $media->getUrl('product_thumbnail'),
                    'name'      => $media->name,
                    'order'     => $media->order_column
                ])),
                'video_url' => $this->video,
            ],

            // Relationships & Taxonomy
            'taxonomy' => [
                'category' => $this->whenLoaded('category', fn() => [
                    'id'    => $this->category->id,
                    'title' => $this->category->title,
                    'slug'  => $this->category->slug,
                ]),
                'brand' => $this->whenLoaded('brand', fn() => [
                    'id'    => $this->brand->id,
                    'title' => $this->brand->title,
                    'logo'  => $this->brand->logo_url ?? null,
                ]),
                'tags' => $this->whenLoaded('tags', fn() => $this->tags->pluck('title')),
            ],

            // Vendor Info
            'vendor' => $this->whenLoaded('user', fn() => [
                'id'     => $this->user_id,
                'name'   => $this->user->name ?? __('Official Store'),
                'avatar' => $this->user->avatar_url ?? null,
            ]),

            // SEO & Status
            'status' => [
                'is_published' => (bool) $this->is_published,
                'is_featured'  => (bool) $this->is_featured,
                'is_new'       => (bool) $this->is_new,
                'rating'       => (float) ($this->reviews_avg_rating ?? 0),
                'review_count' => $this->whenCounted('reviews'),
                'approved_at'  => $this->approved_at?->toIso8601String(),
            ],

            'meta' => [
                'title'       => $this->meta_title,
                'description' => $this->meta_description,
            ],

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
