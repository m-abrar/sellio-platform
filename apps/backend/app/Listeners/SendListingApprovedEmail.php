<?php

namespace App\Listeners;

use App\Events\ListingApproved;
use App\Mail\DynamicEmail;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendListingApprovedEmail implements ShouldQueue
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
    public function handle(ListingApproved $event): void
    {
        $owner = $event->owner;
        $listing = $event->listing;

        // Critical Check: Ensure required models are present
        if (!$owner || !$listing) {
             Log::error("ListingApproved event received with missing Owner or Listing model.");
             return;
        }

        // 1. Fetch the 'listing_approved' template from the database
        $template = EmailTemplate::where('key', 'listing_approved')->first();

        if ($template) {
            // 2. Define the dynamic data for the template
            $data = [
                'owner_name' => $owner->name,
                'listing_title' => $listing->title, // Assuming 'title' holds the listing name/title
                'live_url' => $event->liveUrl,
            ];

            // 3. Send the email using the DynamicEmail Mailable via the queue
            Mail::to($owner->email)->queue(new DynamicEmail($template, $data));

        } else {
            Log::warning("Email template 'listing_approved' not found. Approval notification not sent to owner ID: " . $owner->id);
        }
    }
}
