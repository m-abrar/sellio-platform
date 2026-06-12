<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyBookingResource extends JsonResource
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
        $isPartner = $user && $this->relationLoaded('property') && $user->id === $this->property->user_id;
        $isAdmin = $user && $user->hasRole(['admin', 'super-admin']);
        $canViewPii = $isOwner || $isPartner || $isAdmin;

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'property_id' => $this->property_id,
            'full_name' => $this->when($canViewPii, $this->full_name),
            'phone' => $this->when($canViewPii, $this->phone),
            'email' => $this->when($canViewPii, $this->email),
            'message' => $this->when($canViewPii, $this->message),
            'check_in_date' => $this->check_in_date?->toDateString(),
            'check_out_date' => $this->check_out_date?->toDateString(),
            'guests' => $this->guests,
            'total_price' => $this->total_price,
            'status' => $this->status,
            'viewed_at' => $this->viewed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'property' => $this->whenLoaded('property', fn () => [
                'id' => $this->property->id,
                'title' => $this->property->title,
                'slug' => $this->property->slug,
                'primary_image_url' => $this->property->primary_image_url,
            ]),
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar_url' => $this->user->avatar_url,
            ]),
            'duration_nights' => $this->duration_nights,
            'base_rental_amount' => $this->base_rental_amount,
            'fees_and_taxes_amount' => $this->fees_and_taxes_amount,
            'addons_total_price' => $this->addons_total_price,
        ];
    }
}
