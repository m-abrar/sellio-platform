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
        $user = $request->user();
        $isOwner = $user && $user->id === $this->user_id;
        $isPartner = $user && $this->relationLoaded('classifiedAd') && $this->classifiedAd && $user->id === $this->classifiedAd->user_id;
        $isAdmin = $user && $user->hasRole(['admin', 'super-admin']);
        $canViewPii = $isOwner || $isPartner || $isAdmin;

        $classifiedData = $this->classifiedAd ? [
            'id' => $this->classifiedAd->id,
            'title' => $this->classifiedAd->title,
            'slug' => $this->classifiedAd->slug,
            'base_price' => $this->classifiedAd->base_price,
            'sale_price' => $this->classifiedAd->sale_price,
            'price_formatted' => $this->classifiedAd->price_formatted,
            'item_condition' => $this->classifiedAd->item_condition,
            'condition_label' => $this->classifiedAd->condition_label,
            'condition_badge_class' => $this->classifiedAd->condition_badge_class,
            'item_year_age' => $this->classifiedAd->item_year_age,
            'item_quantity' => $this->classifiedAd->item_quantity,
            'primary_image_url' => $this->classifiedAd->primary_image_url,
            'brand' => $this->classifiedAd->brand ? [
                'id' => $this->classifiedAd->brand->id,
                'name' => $this->classifiedAd->brand->name,
            ] : null,
        ] : null;

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'classified_id' => $this->classified_id,
            'full_name' => $this->name ?? ($this->user ? $this->user->name : null),
            'email' => $this->email ?? ($this->user ? $this->user->email : null),
            'phone' => $this->phone ?? ($this->user ? $this->user->phone : null),
            'message' => $this->message,
            'status' => $this->status,
            'viewed_at' => $this->viewed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Backward-compatible relation mappings
            'classified' => $classifiedData,
            'classifiedAd' => $classifiedData,
            'classifiedad' => $classifiedData,
            'classified_ad' => $classifiedData,
            
            'user' => $this->user ? [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar_url' => $this->user->avatar_url,
            ] : null,
        ];
    }
}
