<?php

namespace App\Listeners;

use App\Models\User;
use App\Services\ExpoPushService;
use Illuminate\Notifications\Events\NotificationSent;

class SendExpoPushNotification
{
    public function __construct(private readonly ExpoPushService $pushService) {}

    public function handle(NotificationSent $event): void
    {
        if ($event->channel !== 'database' || !$event->notifiable instanceof User) return;

        $payload = method_exists($event->notification, 'toArray')
            ? $event->notification->toArray($event->notifiable)
            : [];

        $this->pushService->send($event->notifiable, is_array($payload) ? $payload : []);
    }
}
