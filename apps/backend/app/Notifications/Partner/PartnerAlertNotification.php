<?php

namespace App\Notifications\Partner;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class PartnerAlertNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private string $type,
        private string $title,
        private string $message,
        private ?string $route = null,
        private ?string $sourceType = null,
        private int|string|null $sourceId = null,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => $this->type,
            'title' => $this->title,
            'message' => $this->message,
            'route' => $this->route,
            'source_type' => $this->sourceType,
            'source_id' => $this->sourceId,
        ];
    }
}
