<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceQuoteResource extends JsonResource
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
        $isPartner = $user && $this->relationLoaded('service') && $this->service && $user->id === $this->service->user_id;
        $isAdmin = $user && $user->hasRole(['admin', 'super-admin']);
        $canViewPii = $isOwner || $isPartner || $isAdmin;

        return [
            'id' => $this->id,
            'service_id' => $this->service_id,
            'user_id' => $this->user_id,
            'service_package_id' => $this->service_package_id,
            'scope_size' => $this->scope_size,
            'requested_date' => $this->requested_date,
            'details' => $this->details,
            'status' => $this->status,
            'quoted_price' => $this->quoted_price,
            'viewed_at' => $this->viewed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'service' => $this->service ? [
                'id' => $this->service->id,
                'title' => $this->service->title,
                'slug' => $this->service->slug,
                'primary_image_url' => $this->service->primary_image_url,
            ] : null,
            'user' => $this->user ? [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar_url' => $this->user->avatar_url,
            ] : null,
            // Fallback user contact details for consistent detail view UI
            'full_name' => $this->when($canViewPii, $this->user ? $this->user->name : 'Client'),
            'email' => $this->when($canViewPii, $this->user ? $this->user->email : null),
            'phone' => $this->when($canViewPii, $this->user ? $this->user->phone : null),
        ];
    }
}
