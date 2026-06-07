<?php

namespace App\Listeners;

use App\Events\EventTicketPurchased;
use App\Events\PropertyBookingConfirmed;
use App\Events\ReviewRequested;
use Illuminate\Contracts\Queue\ShouldQueue;

class RequestPostPurchaseReview implements ShouldQueue
{
    public function handle(PropertyBookingConfirmed|EventTicketPurchased $event): void
    {
        if ($event instanceof PropertyBookingConfirmed) {
            $guest = $event->guest;
            $booking = $event->booking?->loadMissing('property');

            if ($guest && $booking?->property) {
                ReviewRequested::dispatch($guest, $booking->property);
            }

            return;
        }

        $user = $event->user;
        $booking = $event->booking?->loadMissing('event');

        if ($user && $booking?->event) {
            ReviewRequested::dispatch($user, $booking->event);
        }
    }
}
