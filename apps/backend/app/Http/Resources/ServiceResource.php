<?php

namespace App\Http\Resources;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    /**
     * Transform the service into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'title'             => $this->title,
            'slug'              => $this->slug,
            'description'       => $this->description,
            'short_description' => $this->short_description,

            // Pricing & Billing
            'pricing' => [
                'base_price'      => (float) $this->base_price,
                'sale_price'      => (float) $this->sale_price, // Min/Deposit Fee
                'formatted'       => $this->price_formatted,
                'formatted_short' => $this->price_formatted_k,
                'billing_type'    => [
                    'is_subscription'  => (bool) $this->is_subscription,
                    'is_project_based' => (bool) $this->is_project_based,
                ],
                'min_contract'    => $this->min_contract_months ? "{$this->min_contract_months} Months" : null,
            ],

            // Operations & Availability
            'operations' => [
                'is_open'        => (bool) $this->is_open, // Dynamic accessor logic
                'hours_label'    => $this->operating_hours,
                'days_label'     => $this->operating_days_label,
                'radius'         => $this->service_radius ? $this->service_radius . ' km' : null,
                'client_slots'   => [
                    'max'        => $this->max_client_slots,
                    'available'  => (bool) ($this->max_client_slots > 0), // Logic could be expanded
                ],
            ],

            // Professional Specifics
            'professional' => [
                'expertise_id'   => $this->expertise_level,
                'schedule_id'    => $this->availability_schedule,
                'certifications' => $this->licenses_certs,
                'category'       => $this->category?->title,
                'type'           => $this->type?->title,
            ],

            // Spatie Media Library
            'media' => [
                'main_photo' => $this->primary_image_url,
                'gallery'    => $this->getMedia(Service::GALLERY_MEDIA)->map(fn($media) => [
                    'id'        => $media->id,
                    'url'       => $media->getUrl(),
                    'thumbnail' => $media->getUrl('thumb'),
                    'name'      => $media->name,
                ]),
            ],

            // Location details
            'location' => [
                'address'   => $this->address,
                'city'      => $this->city,
                'state'     => $this->state,
                'country'   => $this->country,
                'latitude'  => (float) $this->latitude,
                'longitude' => (float) $this->longitude,
                'meta'      => $this->location?->title,
            ],

            // Provider (User) Info
            'provider' => [
                'id'     => $this->user_id,
                'name'   => $this->provider?->name ?? __('Verified Professional'),
                'avatar' => $this->provider?->avatar_url,
                'rating' => (float) $this->rating_average,
            ],

            // Features & Tags
            'features' => $this->features->map(fn($f) => [
                'id'    => $f->id,
                'title' => $f->title,
                'value' => $f->pivot?->value,
                'icon'  => $f->icon,
            ]),
            'tags' => $this->tags->pluck('title'),

            // Meta & Status
            'status' => [
                'is_published' => (bool) $this->is_published,
                'is_featured'  => (bool) $this->is_featured,
                'approved_at'  => $this->approved_at?->toIso8601String(),
                'lead_counts'  => [
                    'quotes'       => (int) ($this->quotes_count ?? $this->quotes()->count()),
                    'appointments' => (int) ($this->appointments_count ?? $this->appointments()->count()),
                ],
            ],

            'seo' => [
                'meta_title'       => $this->meta_title,
                'meta_description' => $this->meta_description,
            ],

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
