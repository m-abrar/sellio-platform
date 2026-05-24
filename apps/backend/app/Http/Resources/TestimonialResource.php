<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestimonialResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'author_name' => $this->author_name,
            'author_title' => $this->author_title,
            'company' => $this->company,
            'quote' => $this->quote,
            'rating' => $this->rating,
            'status' => $this->status,
            'sort_order' => $this->sort_order,
            'avatar_url' => $this->avatar_url,
            'theme_priority' => $this->theme_priority ?? $this->resource->pivot?->priority,
            'is_featured' => (bool) ($this->theme_is_featured ?? $this->resource->pivot?->is_featured ?? false),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
