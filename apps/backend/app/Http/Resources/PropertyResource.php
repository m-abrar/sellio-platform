<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Property;

class PropertyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'slug'        => $this->slug,
            'description' => $this->description,
            'short_description' => $this->short_description,
            
            'category_id' => $this->category_id, 
            'type_id' => $this->type_id,     
            'brand_id' => $this->brand_id,    
            'location_id' => $this->location_id, 

            // Pricing Logic (Using Model Accessors)
            'pricing' => [
                'base_price'        => $this->base_price,
                'sale_price'        => $this->sale_price,
                'price_per_night'   => $this->price_per_night,
                'active_price'      => $this->price, // From Model logic
                'price_formatted'   => $this->price_formatted,
                'price_formatted_k' => $this->price_formatted_k,
                'hoa'               => $this->hoa,
                'hoa_formatted'     => $this->hoa_formatted,
                'currency_symbol'   => setting('currency_symbol', '$'),
            ],

            // Property Specific Specs (Aligned with Migration)
            'specs' => [
                'bedrooms'        => $this->number_of_bedrooms,
                'bathrooms'       => $this->number_of_bathrooms,
                'max_guests'      => $this->maximum_guests,
                'total_units'     => $this->total_units,
                'area_sq_ft'      => $this->area_sq_ft,
                'area_sq_m'       => $this->area_sq_m,
                'area_formatted'  => $this->area_formatted,
                'year_built'      => $this->year_built,
                'parking_spots'   => $this->number_of_parking_spots,
                'property_type'   => $this->whenLoaded('type', fn() => $this->type->title), 
                'category'        => $this->whenLoaded('category', fn() => $this->category->title),
            ],

            // Spatie Media (N+1 Hardened)
            'thumbnail_image' => $this->relationLoaded('media') ? $this->thumbnail_url : $this->getFallbackImage('thumb'), 
            'featured_image'  => $this->relationLoaded('media') ? $this->primary_image_url : $this->getFallbackImage('card'), 
            'gallery'         => $this->whenLoaded('media', fn() => $this->getMedia(Property::GALLERY_MEDIA)->map(fn($media) => [
                'id'        => $media->id,
                'url'       => $media->getUrl(),
                'hero'      => $media->getUrl('listing_hero'),
                'thumbnail' => $media->getUrl('thumb'),
                'order'     => $media->order_column
            ])),
            
            // Rich Media
            'video'        => $this->video,
            'virtual_tour' => $this->virtual_tour,

            // Location Meta
            'location' => [
                'title'     => $this->whenLoaded('location', fn() => $this->location->title),
                'address'   => $this->address,
                'city'      => $this->city,
                'state'     => $this->state,
                'country'   => $this->country,
                'zip_code'  => $this->zip_code,
                'latitude'  => (float) $this->latitude,
                'longitude' => (float) $this->longitude,
            ],

            // Relationships
            'amenities' => AmenityResource::collection($this->whenLoaded('amenities')),
            'owner'     => new UserResource($this->whenLoaded('user')),

            // Status & Meta
            'status' => [
                'label'        => $this->status_label,
                'color_class'  => $this->status_color,
                'is_published' => (bool) $this->is_published,
                'is_featured'  => (bool) $this->is_featured,
                'is_rental'    => (bool) $this->is_rental,
                'is_sale'      => (bool) $this->is_sale,
                'is_new'       => (bool) $this->is_new,
            ],
            
            'rules'        => $this->rules,
            'policies'     => $this->policies,
            'rating'       => (float) $this->rating_average,
            'created_at'   => $this->created_at?->toIso8601String(),
            'updated_at'   => $this->updated_at?->toIso8601String(),
        ];
    }
}
