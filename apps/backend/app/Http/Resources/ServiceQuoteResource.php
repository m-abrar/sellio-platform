<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceQuoteResource extends JsonResource
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
            'service_id' => $this->service_id,
            'user_id' => $this->user_id,
            'service_package_id' => $this->service_package_id,
            'scope_size' => $this->scope_size,
            'requested_date' => $this->requested_date,
            'details' => $this->details,
            'status' => $this->status,
            'quoted_price' => $this->quoted_price,
            'viewed_at' => $this->viewed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'service' => $this->whenLoaded("service"),
        ];
    }
}
