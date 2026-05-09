<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'items'      => CartItemResource::collection($this->whenLoaded('items')),
            'total'      => (float) $this->total,
            'item_count' => (int) ($this->items_count ?? ($this->relationLoaded('items') ? $this->items->sum('quantity') : 0)),
            'currency_symbol' => setting('currency_symbol', '$'),
        ];
    }
}
