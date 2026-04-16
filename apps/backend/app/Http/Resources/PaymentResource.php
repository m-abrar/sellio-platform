<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
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
            'amount' => $this->amount,
            'currency' => $this->currency,
            'transaction_id' => $this->transaction_id,
            'payment_method' => $this->payment_method,
            'status' => $this->status,
            'paid_at' => $this->paid_at,
            'payable_type' => $this->payable_type,
            'payable_id' => $this->payable_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
