<?php

namespace App\Http\Resources;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'slug'        => $this->slug,
            'description' => $this->description,

            // Schedule & Duration
            'schedule' => [
                'start_at'       => $this->start_date_time?->toIso8601String(),
                'end_at'         => $this->end_date_time?->toIso8601String(),
                'duration_hours' => $this->duration_hours,
                'is_virtual'     => (bool) $this->is_virtual,
            ],

            // Pricing & Ticketing
            'ticketing' => [
                'is_paid'           => (bool) $this->is_paid,
                'is_free'           => (bool) $this->is_free, // From custom accessor
                'on_sale'           => (bool) $this->on_sale, // From custom accessor
                'base_price'        => (float) $this->base_price,
                'sale_price'        => (float) $this->sale_price,
                'price_formatted'   => $this->price_formatted,
                'price_formatted_k' => $this->price_formatted_k,
                'max_attendees'     => (int) $this->max_attendees,
                'tickets_left'      => $this->tickets_left, // Placeholder from Model
            ],

            // Taxonomy & Specs
            'specs' => [
                'category'    => $this->category?->title,
                'type'        => $this->type?->title,
                'brand'       => $this->brand?->title,
                'event_genre' => $this->event_genre,
                'venue_size'  => $this->venue_size,
                'tags'        => $this->tags->pluck('title'),
            ],

            // Spatie Media Implementation
            'media' => [
                'poster'  => $this->primary_image_url, 
                'preview' => $this->getMedia(Event::PRIMARY_MEDIA)->first()?->getUrl('event_poster_preview'),
                'gallery' => $this->getMedia(Event::GALLERY_MEDIA)->map(fn($media) => [
                    'id'        => $media->id,
                    'url'       => $media->getUrl(),
                    'thumbnail' => $media->getUrl('thumb'), // Assuming standard thumb conversion
                    'order'     => $media->order_column
                ]),
            ],

            // Location Meta
            'location' => [
                'address'   => $this->address,
                'city'      => $this->city,
                'state'     => $this->state,
                'country'   => $this->country,
                'latitude'  => (float) $this->latitude,
                'longitude' => (float) $this->longitude,
                'map_title' => $this->location?->title,
            ],

            // Organizer Details
            'organizer' => [
                'id'     => $this->user_id,
                'name'   => $this->organizer?->name,
                'avatar' => $this->organizer?->avatar_url ?? null,
            ],

            // Meta & Status
            'status' => [
                'is_published' => (bool) $this->is_published,
                'is_featured'  => (bool) $this->is_featured,
                'approved_at'  => $this->approved_at?->toIso8601String(),
                'rating'       => $this->reviews()->avg('rating') ?? 0,
            ],

            'seo' => [
                'title'       => $this->meta_title,
                'description' => $this->meta_description,
            ],

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
