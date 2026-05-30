<?php

namespace App\Services;

use App\Models\Event;
use App\Models\EventBooking;
use App\Models\EventOccurrence;
use App\Models\EventOccurrenceTicket;
use App\Models\EventTicketType;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

/**
 * Class EventBookingService
 *
 * Handles the core business logic for ticket availability and payment processing.
 */
class EventBookingService
{
    /**
     * Calculate available tickets for a specific occurrence and ticket type.
     *
     * @param int $occurrenceId
     * @param int $ticketTypeId
     * @param EventOccurrenceTicket $occurrenceTicket
     * @return int
     */
    public function getAvailableQuantity(int $occurrenceId, int $ticketTypeId, EventOccurrenceTicket $occurrenceTicket): int
    {
        $sold = EventBooking::where('event_occurrence_id', $occurrenceId)
            ->where('event_ticket_type_id', $ticketTypeId)
            ->where('status', 'confirmed')
            ->sum('quantity');

        return max(0, $occurrenceTicket->available_quantity - $sold);
    }

    /**
     * Finalize the payment and update booking status.
     *
     * @param EventBooking $booking
     * @param string $method
     * @param string $transactionId
     * @param float $amount
     * @return bool
     */
    public function finalizePayment(EventBooking $booking, string $method, string $transactionId, float $amount): bool
    {
        $booking->status         = 'confirmed';
        $booking->transaction_id = $transactionId;
        $booking->payment_method = $method;
        $booking->paid_amount    = $amount;
        $booking->paid_at        = Carbon::now();
        
        $saved = $booking->save();
        if ($saved) {
            event(new \App\Events\EventTicketPurchased($booking->user, $booking));
        }
        return $saved;
    }
}
