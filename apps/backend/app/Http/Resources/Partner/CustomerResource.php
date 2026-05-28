<?php

namespace App\Http\Resources\Partner;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource['id'],
            'key' => $this->resource['key'],
            'name' => $this->resource['name'],
            'email' => $this->resource['email'],
            'phone' => $this->resource['phone'],
            'total_orders' => $this->resource['total_orders'],
            'total_spent' => $this->resource['total_spent'],
            'status' => $this->resource['status'],
            'joined' => $this->resource['joined'],
            'avatar_url' => $this->resource['avatar_url'] ?? null,
            'last_interaction_at' => $this->resource['last_interaction_at'] ?? null,
            'interactions' => $this->when(
                isset($this->resource['interactions']),
                $this->resource['interactions'] ?? []
            ),
        ];
    }
}
