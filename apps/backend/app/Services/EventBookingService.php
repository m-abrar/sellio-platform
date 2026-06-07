<?php

namespace App\Services;

use App\Events\EventTicketPurchased;
use App\Models\Event;
use App\Models\EventBooking;
use App\Models\EventOccurrence;
use App\Models\EventOccurrenceTicket;
use App\Models\EventTicketType;
use App\Models\Payment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
    public function finalizePayment(EventBooking $booking, string $method, ?string $transactionId, float $amount): bool
    {
        $booking->status         = 'confirmed';
        $booking->payment_status = 'paid';
        $booking->transaction_id = $transactionId;
        
        $saved = $booking->save();
        if ($saved) {
            event(new EventTicketPurchased($booking->user, $booking));
        }
        return $saved;
    }

    public function recordBookingPayment(
        EventBooking $booking,
        string $gateway,
        float $amount,
        string $status,
        ?string $reference = null,
        ?string $message = null
    ): Payment {
        return DB::transaction(function () use ($booking, $gateway, $amount, $status, $reference, $message) {
            $payment = Payment::query()
                ->where('payable_type', EventBooking::class)
                ->where('payable_id', $booking->id)
                ->when($reference, fn ($query) => $query->where('transaction_id', $reference))
                ->first();

            if (!$payment) {
                $payment = new Payment([
                    'payable_type' => EventBooking::class,
                    'payable_id' => $booking->id,
                ]);
            }

            $payment->user_id = $booking->user_id;
            $payment->amount = $amount;
            $payment->currency = 'USD';
            $payment->transaction_id = $reference;
            $payment->payment_method = $gateway;
            $payment->status = $status;
            $payment->paid_at = $status === Payment::STATUS_COMPLETED ? now() : null;
            $payment->admin_note = $message;
            $payment->save();

            return $payment;
        });
    }
}
