<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassifiedInquiryResource extends JsonResource
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
            'classified_id' => $this->classified_id,
            'message' => $this->message,
            'status' => $this->status,
            'viewed_at' => $this->viewed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'classifiedad' => $this->whenLoaded("classifiedAd"),
            'classifiedAd' => $this->whenLoaded("classifiedAd"),
            'classified_ad' => $this->whenLoaded("classifiedAd"),
        ];
    }
}
