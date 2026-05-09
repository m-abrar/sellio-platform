<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ContentFlagged extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private string $type, private string $message)
    {
        //
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => $this->type,
            'message' => $this->message,
            'url' => '/admin/notifications/' . strtolower($this->type),
        ];
    }
}
