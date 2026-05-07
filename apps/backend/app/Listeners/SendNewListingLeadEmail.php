<?php

namespace App\Listeners;

use App\Events\NewListingLead;
use App\Mail\DynamicEmail;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Class SendNewListingLeadEmail
 * Orchestrates the automated dispatch of lead notifications to listing owners,
 * integrating dynamic template hydration and asynchronous mail queuing.
 */
class SendNewListingLeadEmail implements ShouldQueue
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
    public function handle(NewListingLead $event): void
    {
        $owner = $event->owner;
        $listing = $event->listing;

        if (!$owner || !$listing) {
             Log::error("NewListingLead event received with missing Owner or Listing model.");
             return;
        }

        // 1. Fetch the 'new_listing_lead' template from the database
        $template = EmailTemplate::where('key', 'new_listing_lead')->first();

        if ($template) {
            // 2. Define the dynamic data for the template
            $data = [
                'owner_name' => $owner->name,
                'listing_title' => $listing->title,
                'lead_name' => $event->leadName,
                'lead_email' => $event->leadEmail,
                'lead_message' => $event->leadMessage,
            ];

            // 3. Send the email using the DynamicEmail Mailable via the queue
            Mail::to($owner->email)->queue(new DynamicEmail($template, $data));

        } else {
            Log::warning("Email template 'new_listing_lead' not found. Lead notification not sent to owner ID: " . $owner->id);
        }
    }
}
