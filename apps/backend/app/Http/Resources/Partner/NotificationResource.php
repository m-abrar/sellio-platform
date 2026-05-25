<?php

namespace App\Http\Resources\Partner;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = $this->data ?? [];

        return [
            'id' => $this->id,
            'type' => $data['type'] ?? 'system',
            'title' => $data['title'] ?? __('Notification'),
            'message' => $data['message'] ?? '',
            'date' => $this->created_at?->diffForHumans() ?? '',
            'read' => (bool) $this->read_at,
            'route' => $data['route'] ?? null,
            'created_at' => $this->created_at,
            'read_at' => $this->read_at,
        ];
    }
}
