<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'price' => $this->price,
            'billing_period' => $this->billing_period,
            'max_listings' => $this->max_listings,
            'max_addons' => $this->max_addons,
            'priority_support' => $this->priority_support,
            'custom_branding' => $this->custom_branding,
            'analytics_access' => $this->analytics_access,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'is_popular' => $this->is_popular,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
