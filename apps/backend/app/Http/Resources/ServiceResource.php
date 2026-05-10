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
                'category'       => $this->whenLoaded('category', fn() => $this->category->title),
                'type'           => $this->whenLoaded('type', fn() => $this->type->title),
            ],

            // Spatie Media Library
            'media' => [
                'main_photo' => $this->primary_image_url,
                'gallery'    => $this->whenLoaded('media', fn() => $this->getMedia(Service::GALLERY_MEDIA)->map(fn($media) => [
                    'id'        => $media->id,
                    'url'       => $media->getUrl(),
                    'thumbnail' => $media->getUrl('thumb'),
                    'name'      => $media->name,
                ])),
            ],

            // Location details
            'location' => [
                'address'   => $this->address,
                'city'      => $this->city,
                'state'     => $this->state,
                'country'   => $this->country,
                'latitude'  => (float) $this->latitude,
                'longitude' => (float) $this->longitude,
                'meta'      => $this->whenLoaded('location', fn() => $this->location->title),
            ],

            // Provider (User) Info
            'provider' => $this->whenLoaded('provider', fn() => [
                'id'     => $this->user_id,
                'name'   => $this->provider->name ?? __('Verified Professional'),
                'avatar' => $this->provider->avatar_url,
                'rating' => (float) ($this->reviews_avg_rating ?? 0),
            ]),

            // Features & Tags
            'features' => $this->whenLoaded('features', fn() => $this->features->map(fn($f) => [
                'id'    => $f->id,
                'title' => $f->title,
                'value' => $f->pivot?->value,
                'icon'  => $f->icon,
            ])),
            'tags' => $this->whenLoaded('tags', fn() => $this->tags->pluck('title')),

            // Meta & Status
            'status' => [
                'is_published' => (bool) $this->is_published,
                'is_featured'  => (bool) $this->is_featured,
                'approved_at'  => $this->approved_at?->toIso8601String(),
                'lead_counts'  => [
                    'quotes'       => (int) $this->whenCounted('quotes'),
                    'appointments' => (int) $this->whenCounted('appointments'),
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
