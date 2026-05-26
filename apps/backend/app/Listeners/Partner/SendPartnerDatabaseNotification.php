<?php

namespace App\Listeners\Partner;

use App\Events\JobApplicationReceived;
use App\Events\NewMessageSent;
use App\Events\Partner\PartnerLeadCreated;
use App\Events\ReviewReceived;
use App\Models\Message;
use App\Services\Partner\NotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendPartnerDatabaseNotification implements ShouldQueue
{
    public function __construct(private NotificationService $notificationService)
    {
    }

    public function handle(PartnerLeadCreated|ReviewReceived|JobApplicationReceived|NewMessageSent $event): void
    {
        if ($event instanceof PartnerLeadCreated) {
            $this->notificationService->notifyForRecord($event->record);

            return;
        }

        if ($event instanceof ReviewReceived) {
            $event->review->loadMissing(['reviewable', 'user']);
            $this->notificationService->notifyForRecord($event->review);

            return;
        }

        if ($event instanceof JobApplicationReceived) {
            $event->application->loadMissing(['job', 'user']);
            $this->notificationService->notifyForRecord($event->application);

            return;
        }

        if ($event instanceof NewMessageSent) {
            $recipient = $event->recipient;

            if (!$recipient->hasRole('partner')) {
                return;
            }

            $message = $event->message instanceof Message
                ? $event->message
                : Message::query()->find($event->message->id);

            if (!$message) {
                return;
            }

            $this->notificationService->notifyForMessage($message, $recipient);
        }
    }
}
