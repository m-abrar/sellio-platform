<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'username'   => $this->username,
            'avatar_url' => $this->avatar_url,
            // Sensitive fields included only for owner or admin
            'email'      => $this->when($request->user()?->id === $this->id || $request->user()?->hasRole(['admin', 'super-admin']), $this->email),
            'phone'      => $this->when($request->user()?->id === $this->id || $request->user()?->hasRole(['admin', 'super-admin']), $this->phone),
            'is_buyer'   => $this->is_buyer,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
