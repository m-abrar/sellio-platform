<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FavoriteResource extends JsonResource
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
            'favoritable_type' => $this->favoritable_type,
            'favoritable_id' => $this->favoritable_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'favoritable' => $this->whenLoaded("favoritable"),
        ];
    }
}
