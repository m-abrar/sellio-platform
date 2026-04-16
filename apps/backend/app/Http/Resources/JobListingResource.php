<?php

namespace App\Http\Resources;

use App\Models\JobListing;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobListingResource extends JsonResource
{
    /**
     * Transform the job listing into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'slug'        => $this->slug,
            'description' => $this->description,

            // Employment & Workplace
            'employment' => [
                'type'             => $this->employment_type, // e.g., Full-time, Part-time
                'workplace'        => $this->workplace_label, // From model accessor
                'workplace_id'     => $this->workplace_type,
                'experience_level' => $this->experience_level,
                'education'        => $this->required_education,
                'is_full_time'     => (bool) $this->is_full_time,
                'is_contract'      => (bool) $this->is_contract,
            ],

            // Compensation
            'compensation' => [
                'min'             => (float) $this->salary_min,
                'max'             => (float) $this->salary_max,
                'frequency'       => $this->salary_frequency,
                'range_compact'   => $this->salary_range_formatted, // e.g., $40k–$60k/yr
                'range_full'      => $this->salary_range_full_formatted, // e.g., $40,000 - $60,000/yr
            ],

            // Company & Branding (Spatie Media)
            'company' => [
                'name'      => $this->brand?->title ?? $this->employer?->company_name,
                'logo'      => $this->primary_image_url,
                'logo_card' => $this->getMedia(JobListing::PRIMARY_MEDIA)->first()?->getUrl('listing_card_logo'),
                'photos'    => $this->getMedia(JobListing::GALLERY_MEDIA)->map(fn($media) => [
                    'url'   => $media->getUrl(),
                    'thumb' => $media->getUrl('thumb'),
                ]),
            ],

            // Taxonomy & UI
            'taxonomy' => [
                'category'    => $this->category?->title,
                'badge_class' => $this->badge_class, // From model accessor
                'tags'        => $this->tags->pluck('title'),
            ],

            // Location
            'location' => [
                'display'   => "{$this->city}, {$this->country}",
                'address'   => $this->address,
                'city'      => $this->city,
                'state'     => $this->state,
                'country'   => $this->country,
                'latitude'  => (float) $this->latitude,
                'longitude' => (float) $this->longitude,
            ],

            // Applications & Status
            'status' => [
                'is_published'     => (bool) $this->is_published,
                'is_featured'      => (bool) $this->is_featured,
                'deadline'         => $this->application_deadline?->toIso8601String(),
                'is_expired'       => $this->application_deadline?->isPast() ?? false,
                'approved_at'      => $this->approved_at?->toIso8601String(),
                'application_count' => (int) ($this->applications_count ?? $this->applications()->count()),
                'new_applications'  => (int) ($this->applications_new_count ?? $this->applicationsNew()->count()),
            ],

            'employer' => [
                'id'   => $this->user_id,
                'name' => $this->employer?->name,
            ],

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
