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
        return [
            'id'                => $this->id,
            'title'             => $this->title,
            'slug'              => $this->slug,
            'description'       => $this->description,
            'short_description' => $this->short_description,

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
                'vin'            => $this->vin_number,
                'condition'      => $this->condition_rating . '/10',
                'mileage'        => $this->mileage_formatted, // Uses session-aware conversion
                'raw_mileage'    => (int) $this->mileage_value,
                'mileage_units'  => $this->mileage_units,
                'engine'         => $this->engine_type,
                'transmission'   => $this->transmission,
                'fuel_economy'   => $this->fuel_economy,
                'drivetrain'     => $this->drivetrain,
                'exterior_color' => $this->exterior_color,
                'warranty'       => $this->warranty_months ? "{$this->warranty_months} Months" : null,
            ],

            // Media (Spatie Media Library)
            'media' => [
                'main_photo' => $this->primary_image_url,
                'preview'    => $this->getMedia(Auto::PRIMARY_MEDIA)->first()?->getUrl('auto_listing_preview'),
                'gallery'    => $this->getMedia(Auto::GALLERY_MEDIA)->map(fn($media) => [
                    'id'        => $media->id,
                    'url'       => $media->getUrl(),
                    'thumbnail' => $media->getUrl('thumb'),
                    'name'      => $media->name,
                ]),
            ],

            // Relationships & Taxonomy
            'taxonomy' => [
                'category' => [
                    'id'    => $this->category?->id,
                    'title' => $this->category?->title,
                ],
                'brand' => [
                    'id'    => $this->brand?->id,
                    'title' => $this->brand?->title,
                ],
                'features' => $this->features->map(fn($f) => [
                    'title' => $f->title,
                    'icon'  => $f->icon,
                ]),
                'tags' => $this->tags->pluck('title'),
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
                'is_published'  => (bool) $this->is_published,
                'is_featured'   => (bool) $this->is_featured,
                'is_new_arrival' => (bool) $this->is_new,
                'approved_at'   => $this->approved_at?->toIso8601String(),
                'inquiry_count' => (int) ($this->inquiries_count ?? $this->inquiries()->count()),
            ],

            'seo' => [
                'meta_title'       => $this->meta_title,
                'meta_description' => $this->meta_description,
            ],

            'owner' => [
                'id'     => $this->user_id,
                'name'   => $this->user?->name,
                'avatar' => $this->user?->avatar_url,
            ],

            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
