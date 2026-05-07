<?php

namespace App\Listeners;

use App\Events\EventTicketPurchased;
use App\Mail\DynamicEmail;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage; // Needed for file attachment

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
        $ticket = $event->ticket;

        // Critical Check: Ensure all relationships required for the email exist
        // Note: Assumes a 'event' relationship is defined on the Ticket model
        if (!$user || !$ticket || !$ticket->event) {
             Log::error("EventTicketPurchased event received with missing User, Ticket, or Event model.");
             return;
        }

        // 1. Fetch the 'event_ticket_purchased' template from the database
        $template = EmailTemplate::where('key', 'event_ticket_purchased')->first();

        if ($template) {
            // 2. Define the dynamic data for the template
            $data = [
                'user_name' => $user->name,
                'event_title' => $ticket->event->title,
                'ticket_type' => $ticket->type_name, // e.g., 'VIP', 'General Admission'
                'event_date' => $ticket->event->start_time->toFormattedDateString(),
                'event_time' => $ticket->event->start_time->format('h:i A'),
                'ticket_download_url' => route('tickets.download', $ticket->id), // Link for web download
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
