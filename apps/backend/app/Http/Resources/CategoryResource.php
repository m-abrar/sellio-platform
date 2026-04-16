<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'title'          => $this->title,
            'slug'           => $this->slug,
            'description'    => $this->description,
            'icon'       => $this->icon,
            'thumbnail_url'       => $this->thumbnail_url, // Spatie Media
            'cover_url'      => $this->primary_image_url, // Spatie Media
            'parent_id'      => $this->parent_id,
            'listings_count' => $this->listings_count,
            'flags' => [
                'is_property'   => $this->is_property,
                'is_auto'       => $this->is_auto,
                'is_job'        => $this->is_job,
                'is_service'    => $this->is_service,
                'is_event'      => $this->is_event,
                'is_classified' => $this->is_classified,
            ],
            // Recursively load children if they are loaded in the relationship
            'children' => CategoryResource::collection($this->whenLoaded('childrenRecursive')),
            'sub_categories' => CategoryResource::collection($this->whenLoaded('children')),
        ];
    }
}
