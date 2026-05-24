<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'location_key' => $this->resource['location_key'],
            'title'        => $this->resource['title'],
            'source'       => $this->resource['source'] ?? 'theme',
            'items'        => MenuItemResource::collection(collect($this->resource['items'] ?? [])),
        ];
    }
}
