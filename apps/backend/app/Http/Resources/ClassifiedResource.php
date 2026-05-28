<?php

namespace App\Http\Resources;

use App\Models\Classified;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassifiedResource extends JsonResource
{
    /**
     * Transform the classified ad into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'title'             => $this->title,
            'slug'              => $this->slug,
            'description'       => $this->description,
            'short_description' => $this->short_description,
            'category_id'       => $this->category_id,
            'brand_id'          => $this->brand_id,
            'type_id'           => $this->type_id,
            'location_id'       => $this->location_id,
            'is_published'      => (bool) $this->is_published,
            'is_featured'       => (bool) $this->is_featured,
            'is_for_sale'       => (bool) $this->is_for_sale,
            'is_for_rent'       => (bool) $this->is_for_rent,

            // Pricing & Offers
            'pricing' => [
                'base_price'      => $this->base_price !== null ? (float) $this->base_price : null,
                'sale_price'      => $this->sale_price !== null ? (float) $this->sale_price : null,
                'is_on_sale'      => (bool) $this->is_sale,
                'discount'        => $this->discount_percentage > 0 ? "{$this->discount_percentage}%" : null,
                'formatted'       => $this->price_formatted,
                'formatted_short' => $this->price_formatted_k,
                'transaction_type' => [
                    'for_sale' => (bool) $this->is_for_sale,
                    'for_rent' => (bool) $this->is_for_rent,
                ],
            ],

            // Item Details
            'item_specs' => [
                'condition_rating' => $this->item_condition !== null ? (int) $this->item_condition : null,
                'condition_label'  => $this->condition_label, // From model match logic
                'badge_class'      => $this->condition_badge_class, // bg-success, etc.
                'age_years'        => $this->item_year_age !== null ? (int) $this->item_year_age : null,
                'quantity'         => $this->item_quantity !== null ? (int) $this->item_quantity : null,
                'dimensions'       => $this->item_dimensions,
                'warranty_months'  => $this->warranty_months !== null ? (int) $this->warranty_months : null,
                'min_ad_duration'  => $this->min_ad_duration !== null ? (int) $this->min_ad_duration : null,
            ],

            // Media (Spatie Media Library)
            'media' => [
                'main_photo'    => $this->primary_image_url,
                'main_photo_id' => $this->relationLoaded('media') ? $this->getFirstMedia(Classified::PRIMARY_MEDIA)?->id : null,
                'thumbnail'     => $this->whenLoaded('media', fn() => $this->getMedia(Classified::PRIMARY_MEDIA)->first()?->getUrl('classified_thumb')),
                'gallery'    => $this->whenLoaded('media', fn() => $this->getMedia(Classified::GALLERY_MEDIA)->map(fn($media) => [
                    'id'    => $media->id,
                    'url'   => $media->getUrl(),
                    'thumb' => $media->getUrl('thumb'),
                ])),
                // Efficiently merged collection from your custom attribute
                'all_photos_count' => $this->whenLoaded('media', fn() => $this->all_photos->count()),
            ],

            // Taxonomy & Location
            'taxonomy' => [
                'category' => $this->whenLoaded('category', fn() => [
                    'id' => $this->category?->id,
                    'title' => $this->category?->title,
                ]),
                'type' => $this->whenLoaded('type', fn() => [
                    'id' => $this->type?->id,
                    'title' => $this->type?->title,
                ]),
                'brand' => $this->whenLoaded('brand', fn() => [
                    'id' => $this->brand?->id,
                    'title' => $this->brand?->title,
                ]),
                'tags'     => $this->whenLoaded('tags', fn() => $this->tags->pluck('title')),
            ],

            'location' => [
                'city'      => $this->city,
                'state'     => $this->state,
                'country'   => $this->country,
                'address'   => $this->address,
                'zip_code'  => $this->zip_code,
                'latitude'  => (float) $this->latitude,
                'longitude' => (float) $this->longitude,
            ],

            // Status & Engagement
            'status' => [
                'is_published'   => (bool) $this->is_published,
                'is_featured'    => (bool) $this->is_featured,
                'is_new_listing' => (bool) $this->is_new,
                'is_shipping'    => (bool) $this->is_shipping,
                'approved_at'    => $this->approved_at?->toIso8601String(),
                'inquiry_count'  => $this->inquiries_count !== null ? (int) $this->inquiries_count : null,
            ],

            'seller' => $this->whenLoaded('user', fn() => [
                'id'     => $this->user_id,
                'name'   => $this->user->name,
                'avatar' => $this->user->avatar_url,
            ]),

            'seo' => [
                'meta_title'       => $this->meta_title,
                'meta_description' => $this->meta_description,
            ],

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
