<?php

namespace App\Listeners;

use App\Events\EventTicketPurchased;
use App\Mail\DynamicEmail;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Class SendEventTicketEmail
 * Orchestrates the automated dispatch of event ticket purchases,
 * integrating dynamic template hydration and asynchronous mail queuing.
 */
class SendEventTicketEmail implements ShouldQueue
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
    public function handle(EventTicketPurchased $event): void
    {
        $user = $event->user;
        $booking = $event->booking->loadMissing(['event', 'ticketType', 'occurrence']);
        $bookingEvent = $booking->event;

        if (!$user || !$booking || !$bookingEvent) {
             Log::error("EventTicketPurchased event received with missing User, EventBooking, or Event model.");
             return;
        }

        // 1. Fetch the 'event_ticket_purchased' template from the database
        $template = EmailTemplate::fetchByKey('event_ticket_purchased');

        if ($template) {
            // 2. Define the dynamic data for the template
            $data = [
                'user_name' => $user->name,
                'event_title' => $bookingEvent->title,
                'ticket_type' => $booking->ticketType?->title ?? 'Event Ticket',
                'event_date' => $booking->occurrence?->start_date_time?->toFormattedDateString() ?? 'TBA',
                'event_time' => $booking->occurrence?->start_date_time?->format('h:i A') ?? 'TBA',
                'ticket_download_url' => route('events.tickets.booking.confirmation', [$bookingEvent->slug, $booking->id]),
            ];

            // 3. Send the email using the DynamicEmail Mailable via the queue
            $mailable = new DynamicEmail($template, $data);
            
            // --- Attachment Logic ---
            
            // In a real application, you would generate or fetch the ticket file (e.g., PDF or PNG)
            // and attach it here. We use a placeholder path for demonstration.
            
            /*
            $ticketPath = 'tickets/ticket-' . $ticket->id . '.pdf'; 
            
            if (Storage::disk('s3')->exists($ticketPath)) {
                // Attach the ticket file from storage
                $mailable->attachFromStorageDisk('s3', $ticketPath, 'Your_Ticket.pdf', [
                    'mime' => 'application/pdf',
                ]);
            } else {
                 Log::warning("Ticket file not found for ticket ID: " . $ticket->id);
            }
            */
            
            // For now, we queue the basic email without the file attachment logic uncommented:
            Mail::to($user->email)->queue($mailable);

        } else {
            Log::warning("Email template 'event_ticket_purchased' not found. Ticket confirmation not sent to user ID: " . $user->id);
        }
    }
}
