<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventBookingResource extends JsonResource
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
        $isPartner = $user && $this->relationLoaded('event') && $this->event && $user->id === $this->event->user_id;
        $isAdmin = $user && $user->hasRole(['admin', 'super-admin']);
        $canViewPii = $isOwner || $isPartner || $isAdmin;

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'event_id' => $this->event_id,
            'event_occurrence_id' => $this->event_occurrence_id,
            'event_ticket_type_id' => $this->event_ticket_type_id,
            'occurrence_ticket_id' => $this->occurrence_ticket_id,
            'quantity' => $this->quantity,
            'total_price' => $this->total_price,
            'status' => $this->status,
            'viewed_at' => $this->viewed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'event' => $this->whenLoaded('event', fn () => [
                'id' => $this->event->id,
                'title' => $this->event->title,
                'slug' => $this->event->slug,
                'primary_image_url' => $this->event->primary_image_url,
            ]),
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar_url' => $this->user->avatar_url,
            ]),
            'occurrence' => $this->whenLoaded('occurrence', fn () => $this->occurrence ? [
                'id' => $this->occurrence->id,
                'start_date_time' => $this->occurrence->start_date_time,
                'end_date_time' => $this->occurrence->end_date_time,
            ] : null),
            'ticket_type' => $this->whenLoaded('ticketType', fn () => $this->ticketType ? [
                'id' => $this->ticketType->id,
                'name' => $this->ticketType->title,
                'price' => $this->ticketType->base_price,
            ] : null),
            'full_name' => $this->when(
                $canViewPii,
                $this->relationLoaded('user') ? ($this->user?->name ?? 'Attendee') : 'Attendee'
            ),
            'email' => $this->when($canViewPii, $this->relationLoaded('user') ? $this->user?->email : null),
            'phone' => $this->when($canViewPii, $this->relationLoaded('user') ? $this->user?->phone : null),
        ];
    }
}
