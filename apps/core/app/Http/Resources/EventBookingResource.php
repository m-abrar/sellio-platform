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
            'event' => $this->whenLoaded("event"),
            'occurrence' => $this->whenLoaded("occurrence"),
            'ticket_type' => $this->whenLoaded("ticketType"),
        ];
    }
}
