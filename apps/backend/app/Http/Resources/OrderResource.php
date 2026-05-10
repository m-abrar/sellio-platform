<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'order_number'    => $this->order_number,
            'status'          => $this->status,
            'payment_status'  => $this->payment_status,
            'payment_method'  => $this->payment_method,

            'pricing' => [
                'subtotal'        => (float) $this->subtotal,
                'shipping_cost'   => (float) $this->shipping_cost,
                'tax_amount'      => (float) $this->tax_amount,
                'discount_amount' => (float) $this->discount_amount,
                'total_amount'    => (float) $this->total_amount,
                'currency_symbol' => setting('currency_symbol', '$'),
            ],

            'shipping' => $this->when(
                auth()->id() === $this->user_id || (auth()->check() && auth()->user()->hasRole('admin')),
                fn() => [
                    'name'    => $this->shipping_name,
                    'address' => $this->shipping_address,
                    'city'    => $this->shipping_city,
                    'state'   => $this->shipping_state,
                    'zip'     => $this->shipping_zip,
                    'country' => $this->shipping_country,
                ],
                fn() => [
                    'city'    => $this->shipping_city,
                    'country' => $this->shipping_country,
                    'note'    => 'Full address restricted.'
                ]
            ),

            'tracking_number' => $this->when(
                auth()->id() === $this->user_id || (auth()->check() && auth()->user()->hasRole('admin')),
                $this->tracking_number
            ),
            'notes'           => $this->notes,

            'items' => OrderItemResource::collection($this->whenLoaded('items')),

            'user' => $this->whenLoaded('user', fn() => [
                'id'   => $this->user->id,
                'name' => $this->user->name,
            ]),

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
