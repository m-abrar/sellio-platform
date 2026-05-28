<?php

namespace App\Http\Resources;

use App\Models\Auto;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AutoResource extends JsonResource
{
    /**
     * Transform the auto listing into an array.
     */
    public function toArray(Request $request): array
    {
        $canViewSensitiveVin = auth()->id() === $this->user_id
            || (auth()->check() && auth()->user()->hasRole('admin'));

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
            'stock_quantity'    => $this->stock_quantity !== null ? (int) $this->stock_quantity : null,
            'is_published'      => (bool) $this->is_published,
            'is_featured'       => (bool) $this->is_featured,
            'is_lease'          => (bool) $this->is_lease,
            'is_selling'        => (bool) $this->is_selling,

            // Pricing details
            'pricing' => [
                'base_price'        => (float) $this->base_price,
                'sale_price'        => (float) $this->sale_price,
                'formatted'         => $this->price_formatted,
                'formatted_short'   => $this->price_formatted_k,
                'is_lease'          => (bool) $this->is_lease,
                'is_selling'        => (bool) $this->is_selling,
            ],

            // Vehicle Specifications
            'specs' => [
                'year'           => (int) $this->year,
                'make'           => $this->make,
                'model'          => $this->model,
                'vin'            => $this->when(
                    $canViewSensitiveVin,
                    $this->vin_number,
                    $this->vin_number ? substr($this->vin_number, 0, 4) . '***********' : null
                ),
                'raw_vin'        => $this->when($canViewSensitiveVin, $this->vin_number),
                'condition'      => $this->condition_rating !== null ? (int) $this->condition_rating : null,
                'mileage'        => $this->mileage_formatted, // Uses session-aware conversion
                'raw_mileage'    => (int) $this->mileage_value,
                'mileage_units'  => $this->mileage_units,
                'engine'         => $this->engine_type,
                'transmission'   => $this->transmission,
                'fuel_economy'   => $this->fuel_economy,
                'drivetrain'     => $this->drivetrain,
                'exterior_color' => $this->exterior_color,
                'warranty_months'=> $this->warranty_months !== null ? (int) $this->warranty_months : null,
                'stock_quantity' => $this->stock_quantity !== null ? (int) $this->stock_quantity : null,
                'is_certified'   => (bool) $this->is_certified,
            ],

            // Media (Spatie Media Library)
            'media' => [
                'main_photo'    => $this->primary_image_url,
                'main_photo_id' => $this->relationLoaded('media') ? $this->getFirstMedia(Auto::PRIMARY_MEDIA)?->id : null,
                'preview'       => $this->whenLoaded('media', fn() => $this->getMedia(Auto::PRIMARY_MEDIA)->first()?->getUrl('auto_listing_preview')),
                'gallery'    => $this->whenLoaded('media', fn() => $this->getMedia(Auto::GALLERY_MEDIA)->map(fn($media) => [
                    'id'        => $media->id,
                    'url'       => $media->getUrl(),
                    'thumbnail' => $media->getUrl('thumb'),
                    'name'      => $media->name,
                ])),
            ],

            // Relationships & Taxonomy
            'taxonomy' => [
                'category' => $this->whenLoaded('category', fn() => [
                    'id'    => $this->category?->id,
                    'title' => $this->category?->title,
                ]),
                'brand' => $this->whenLoaded('brand', fn() => [
                    'id'    => $this->brand?->id,
                    'title' => $this->brand?->title,
                ]),
                'type' => $this->whenLoaded('type', fn() => [
                    'id'    => $this->type?->id,
                    'title' => $this->type?->title,
                ]),
                'features' => $this->whenLoaded('features', fn() => $this->features->map(fn($f) => [
                    'title' => $f->title,
                    'icon'  => $f->icon,
                ])),
                'tags' => $this->whenLoaded('tags', fn() => $this->tags->pluck('title')),
            ],

            // Location
            'location' => [
                'address'   => $this->address,
                'city'      => $this->city,
                'state'     => $this->state,
                'country'   => $this->country,
                'zip_code'  => $this->zip_code,
                'latitude'  => (float) $this->latitude,
                'longitude' => (float) $this->longitude,
            ],

            // Meta & Status
            'status' => [
                'is_published'   => (bool) $this->is_published,
                'is_featured'    => (bool) $this->is_featured,
                'is_new_arrival' => (bool) $this->is_new,
                'approved_at'    => $this->approved_at?->toIso8601String(),
                'inquiry_count'  => $this->inquiries_count !== null ? (int) $this->inquiries_count : null,
            ],

            'seo' => [
                'meta_title'       => $this->meta_title,
                'meta_description' => $this->meta_description,
            ],

            'owner' => $this->whenLoaded('user', fn() => [
                'id'     => $this->user_id,
                'name'   => $this->user->name,
                'avatar' => $this->user->avatar_url,
            ]),

            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
