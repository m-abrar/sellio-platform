<?php

namespace App\Http\Resources;

use App\Models\Withdrawal;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $meta = $this->meta ?? [];
        $status = 'completed'; // default status for non-withdrawal transactions
        
        if ($this->type === 'withdraw') {
            if (isset($meta['withdrawal_id'])) {
                $withdrawal = Withdrawal::find($meta['withdrawal_id']);
                if ($withdrawal) {
                    $status = $withdrawal->status; // 'pending', 'approved', 'rejected'
                } else {
                    $status = $this->confirmed ? 'approved' : 'pending';
                }
            } else {
                $status = $this->confirmed ? 'approved' : 'pending';
            }
        }

        return [
            'id' => $this->id,
            'payable_type' => $this->payable_type,
            'payable_id' => $this->payable_id,
            'wallet_id' => $this->wallet_id,
            'type' => $this->type,
            'amount' => ($this->amount ?? 0) / 100, // Typically decimal divided by 100
            'confirmed' => $this->confirmed,
            'meta' => $this->meta,
            'status' => $status,
            'uuid' => $this->uuid,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
