<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'product_name' => $this->product_name,
            'quantity'     => (int) $this->quantity,
            'unit_price'   => (float) $this->unit_price,
            'total_price'  => (float) $this->total_price,

            'product' => $this->whenLoaded('product', fn() => [
                'id'    => $this->product->id,
                'title' => $this->product->title,
                'slug'  => $this->product->slug,
                'image' => $this->product->primary_image_url ?? null,
            ]),

            'selected_attributes' => $this->selected_attributes,
            'selected_addons'     => $this->selected_addons,
        ];
    }
}
