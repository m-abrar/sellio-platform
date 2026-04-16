<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceAppointmentResource extends JsonResource
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
            'service_id' => $this->service_id,
            'service_package_id' => $this->service_package_id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'topic' => $this->topic,
            'scheduled_at' => $this->scheduled_at,
            'status' => $this->status,
            'notes' => $this->notes,
            'price' => $this->price,
            'viewed_at' => $this->viewed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'service' => $this->whenLoaded("service"),
        ];
    }
}
