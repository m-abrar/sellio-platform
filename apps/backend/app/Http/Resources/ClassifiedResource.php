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

            // Pricing & Offers
            'pricing' => [
                'base_price'      => (float) $this->base_price,
                'sale_price'      => (float) $this->sale_price,
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
                'condition_rating' => (int) $this->item_condition,
                'condition_label'  => $this->condition_label, // From model match logic
                'badge_class'      => $this->condition_badge_class, // bg-success, etc.
                'age_years'        => $this->item_year_age,
                'quantity'         => (int) $this->item_quantity,
                'dimensions'       => $this->item_dimensions,
                'warranty'         => $this->warranty_months ? "{$this->warranty_months} Months" : null,
            ],

            // Media (Spatie Media Library)
            'media' => [
                'main_photo' => $this->primary_image_url,
                'thumbnail'  => $this->whenLoaded('media', fn() => $this->getMedia(Classified::PRIMARY_MEDIA)->first()?->getUrl('classified_thumb')),
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
                'category' => $this->whenLoaded('category', fn() => $this->category->title),
                'type'     => $this->whenLoaded('type', fn() => $this->type->title),
                'brand'    => $this->whenLoaded('brand', fn() => $this->brand->title),
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
                'inquiry_count'  => (int) $this->whenCounted('inquiries'),
            ],

            'seller' => $this->whenLoaded('user', fn() => [
                'id'     => $this->user_id,
                'name'   => $this->user->name,
                'avatar' => $this->user->avatar_url,
            ]),

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
