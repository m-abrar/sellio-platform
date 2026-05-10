<?php

namespace App\Listeners;

use App\Events\ListingRejected;
use App\Mail\DynamicEmail;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Class SendListingRejectedEmail
 * Orchestrates the automated dispatch of listing rejection notifications,
 * integrating dynamic template hydration and asynchronous mail queuing.
 */
class SendListingRejectedEmail implements ShouldQueue
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
    public function handle(ListingRejected $event): void
    {
        $listing = $event->listing;
        $owner = $listing->user;

        // Critical Check: Ensure required models are present
        if (!$owner || !$listing) {
             Log::error("ListingRejected event received with missing Owner or Listing model on listing ID: " . ($listing->id ?? 'unknown'));
             return;
        }

        // 1. Fetch the 'listing_rejected' template from the database
        $template = EmailTemplate::fetchByKey('listing_rejected');

        if ($template) {
            // 2. Define the dynamic data for the template
            $data = [
                'user_name' => $owner->name,
                'listing_title' => $listing->title, 
                'rejection_reason' => $event->rejectionReason,
            ];

            // 3. Send the email using the DynamicEmail Mailable via the queue
            Mail::to($owner->email)->queue(new DynamicEmail($template, $data));

        } else {
            Log::warning("Email template 'listing_rejected' not found. Rejection notification not sent to owner ID: " . $owner->id);
        }
    }
}
