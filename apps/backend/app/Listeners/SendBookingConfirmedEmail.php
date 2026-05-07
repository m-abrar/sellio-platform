<?php

namespace App\Listeners;

use App\Events\PropertyBookingConfirmed;
use App\Mail\DynamicEmail;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Class SendBookingConfirmedEmail
 * Orchestrates the automated dispatch of property booking confirmations,
 * integrating dynamic template hydration and asynchronous mail queuing.
 */
class SendBookingConfirmedEmail implements ShouldQueue
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
    public function handle(PropertyBookingConfirmed $event): void
    {
        $guest = $event->guest;
        $booking = $event->booking;

        // Critical Check: Ensure all relationships required for the email exist
        // Note: Assumes a 'property' relationship is defined on the Booking model
        if (!$guest || !$booking || !$booking->property) {
             Log::error("PropertyBookingConfirmed event received with missing Guest, Booking, or Property model.");
             return;
        }

        // 1. Fetch the 'property_booking_confirmed' template from the database
        $template = EmailTemplate::where('key', 'property_booking_confirmed')->first();

        if ($template) {
            // 2. Define the dynamic data for the template
            $data = [
                'guest_name' => $guest->name,
                'property_title' => $booking->property->title,
                // Assuming check_in_date and check_out_date are Carbon instances
                'check_in_date' => $booking->check_in_date->toFormattedDateString(),
                'check_out_date' => $booking->check_out_date->toFormattedDateString(),
                // Format price for currency display (assuming 2 decimals and USD, adjust as needed)
                'total_price' => number_format($booking->total_price, 2) . ' USD',
                // Assuming a route exists to view the specific booking details
                'booking_link' => route('dashboard.bookings.show', $booking->id), 
            ];

            // 3. Send the email using the DynamicEmail Mailable via the queue
            Mail::to($guest->email)->queue(new DynamicEmail($template, $data));

        } else {
            Log::warning("Email template 'property_booking_confirmed' not found. Confirmation email not sent to guest ID: " . $guest->id);
        }
    }
}
