<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array for UI display.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = $this->data;
        $customType = $data['type'] ?? 'default';
        
        $tag = __('New');
        $iconClass = 'fa-bell text-primary';
        $tagClass = 'bg-primary';
        $message = $data['message'] ?? __('System Notification');

        // Semantic Category Mapping
        switch ($customType) {
            case 'alert':
                $tag = __('Urgent');
                $iconClass = 'fa-exclamation-circle text-danger';
                $tagClass = 'bg-danger';
                break;
            case 'flag':
                $tag = __('Flagged'); 
                $iconClass = 'fa-flag text-warning';
                $tagClass = 'bg-warning';
                break;
            case 'review':
                $tag = __('Review');
                $iconClass = 'fa-user-check text-success'; 
                $tagClass = 'bg-success';
                break;
            case 'report':
                $tag = __('Report');
                $iconClass = 'fa-user-slash text-warning';
                $tagClass = 'bg-warning';
                break;
            case 'new':
                $tag = __('Support');
                $iconClass = 'fa-headset text-info';
                $tagClass = 'bg-info';
                break;
        }

        return [
            'id'               => $this->id,
            'message'          => $message, 
            'url'              => $data['url'] ?? '#',
            'created_at_human' => $this->created_at->diffForHumans(),
            'read_at'          => $this->read_at,
            'is_read'          => (bool) $this->read_at,
            'tag'              => $tag,
            'icon_class'       => 'fa ' . $iconClass,
            'tag_class'        => $tagClass,
        ];
    }
}
