<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LocationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'title'            => $this->title,
            'slug'             => $this->slug,
            'description'      => $this->description,
            
            // Geographical & Address Data
            'latitude'         => $this->latitude,
            'longitude'        => $this->longitude,
            'state'            => $this->state,
            'zip_code'         => $this->zip_code,
            'country'          => $this->country,

            // SEO
            'meta_title'       => $this->meta_title,
            'meta_description' => $this->meta_description,
            
            // Spatie Media Integration
            'thumbnail_url'    => $this->thumbnail_url, 
            'cover_url'        => $this->primary_image_url, 
            
            'flags' => [
                'is_featured'   => $this->is_featured,
                'is_published'  => $this->is_published,
                'is_property'   => $this->is_property,
                'is_event'      => $this->is_event,
                'is_job'        => $this->is_job,
                'is_auto'       => $this->is_auto,
                'is_service'    => $this->is_service,
                'is_classified' => $this->is_classified,
                'is_product'    => $this->is_product,
                'is_blog'       => $this->is_blog,
            ],
        ];
    }
}
