<?php

namespace App\Listeners;

use App\Events\ListingRejected;
use App\Mail\DynamicEmail;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

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
        $owner = $event->owner;
        $listing = $event->listing;

        // Critical Check: Ensure required models are present
        if (!$owner || !$listing) {
             Log::error("ListingRejected event received with missing Owner or Listing model.");
             return;
        }

        // 1. Fetch the 'listing_rejected' template from the database
        $template = EmailTemplate::where('key', 'listing_rejected')->first();

        if ($template) {
            // 2. Define the dynamic data for the template
            $data = [
                'user_name' => $owner->name,
                'listing_title' => $listing->title, // Assuming 'title' holds the listing name/title
                'rejection_reason' => $event->rejectionReason,
            ];

            // 3. Send the email using the DynamicEmail Mailable via the queue
            Mail::to($owner->email)->queue(new DynamicEmail($template, $data));

        } else {
            Log::warning("Email template 'listing_rejected' not found. Rejection notification not sent to owner ID: " . $owner->id);
        }
    }
}
