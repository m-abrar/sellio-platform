<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'quantity'   => (int) $this->quantity,
            'unit_price' => (float) $this->unit_price,
            'total_price' => (float) $this->total_price,

            'product' => [
                'id'    => $this->product?->id,
                'title' => $this->product?->title,
                'slug'  => $this->product?->slug,
                'price' => (float) ($this->product?->price ?? 0),
                'image' => $this->product?->primary_image_url ?? null,
            ],

            'attribute_ids' => $this->attribute_ids ?? [],
            'addon_ids'     => $this->addon_ids ?? [],
        ];
    }
}
