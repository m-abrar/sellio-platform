<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
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
            'reviewable_id' => $this->reviewable_id,
            'reviewable_type' => $this->reviewable_type,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'partner_reply' => $this->partner_reply,
            'partner_replied_at' => $this->partner_replied_at,
            'partner_id' => $this->partner_id,
            'status' => $this->status,
            'viewed_at' => $this->viewed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user' => $this->whenLoaded("user"),
            'reviewable' => $this->whenLoaded("reviewable"),
        ];
    }
}
