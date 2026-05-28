<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AutoInquiryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $isOwner = $user && $user->id === $this->user_id;
        $isPartner = $user && $this->relationLoaded('auto') && $this->auto && $user->id === $this->auto->user_id;
        $isAdmin = $user && $user->hasRole(['admin', 'super-admin']);
        $canViewPii = $isOwner || $isPartner || $isAdmin;

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'auto_id' => $this->auto_id,
            'full_name' => $this->when($canViewPii, $this->full_name),
            'email' => $this->when($canViewPii, $this->email),
            'phone' => $this->when($canViewPii, $this->phone),
            'preferred_date' => $this->preferred_date,
            'preferred_time' => $this->preferred_time,
            'message' => $this->when($canViewPii, $this->message),
            'status' => $this->status,
            'viewed_at' => $this->viewed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'auto' => $this->auto ? [
                'id' => $this->auto->id,
                'title' => $this->auto->title,
                'slug' => $this->auto->slug,
                'primary_image_url' => $this->auto->primary_image_url,
            ] : null,
            'user' => $this->user ? [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar_url' => $this->user->avatar_url,
            ] : null,
        ];
    }
}
