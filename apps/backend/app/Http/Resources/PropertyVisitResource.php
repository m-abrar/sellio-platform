<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyVisitResource extends JsonResource
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
            'user_id' => $this->user_id,
            'property_id' => $this->property_id,
            'full_name' => $this->full_name,
            'phone' => $this->phone,
            'email' => $this->email,
            'scheduled_at' => $this->scheduled_at,
            'notes' => $this->notes,
            'status' => $this->status,
            'viewed_at' => $this->viewed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'property' => $this->whenLoaded("property"),
        ];
    }
}
