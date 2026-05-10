<?php

namespace App\Listeners;

use App\Events\BookingCancelled;
use App\Mail\DynamicEmail;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Class SendBookingCancelledEmail
 * Orchestrates the automated dispatch of cancellation confirmations, 
 * integrating dynamic template hydration and asynchronous mail queuing.
 */
class SendBookingCancelledEmail implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(BookingCancelled $event): void
    {
        $booking = $event->booking;
        $user = $booking->user;
        
        // Resolve item title and refund amount based on booking type
        $itemTitle = $booking->property->title ?? $booking->event->title ?? __('Marketplace Item');
        $refundAmount = $booking->total_price ?? 0;

        if (!$user) {
             Log::error("BookingCancelled event received with missing User model on booking ID: " . ($booking->id ?? 'unknown'));
             return;
        }

        // 1. Fetch the 'booking_cancelled' template from the database
        $template = EmailTemplate::where('key', 'booking_cancelled')->first();

        if ($template) {
            // 2. Format the refund amount for display (e.g., 150.00 USD)
            $formattedRefund = number_format($refundAmount, 2) . ' USD';

            // 3. Define the dynamic data for the template
            $data = [
                'user_name' => $user->name,
                'item_title' => $itemTitle,
                'refund_amount' => $formattedRefund,
            ];

            // 4. Send the email using the DynamicEmail Mailable via the queue
            Mail::to($user->email)->queue(new DynamicEmail($template, $data));

        } else {
            Log::warning("Email template 'booking_cancelled' not found. Cancellation confirmation not sent to user ID: " . $user->id);
        }
    }
}
