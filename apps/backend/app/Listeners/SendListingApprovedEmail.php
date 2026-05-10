<?php

namespace App\Listeners;

use App\Events\ListingApproved;
use App\Mail\DynamicEmail;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Class SendListingApprovedEmail
 * Orchestrates the automated dispatch of listing approval notifications,
 * integrating dynamic template hydration and asynchronous mail queuing.
 */
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
        $listing = $event->listing;
        $owner = $listing->user;

        // Critical Check: Ensure required models are present
        if (!$owner || !$listing) {
             Log::error("ListingApproved event received with missing Owner or Listing model on listing ID: " . ($listing->id ?? 'unknown'));
             return;
        }

        // 1. Fetch the 'listing_approved' template from the database
        $template = EmailTemplate::where('key', 'listing_approved')->first();

        if ($template) {
            // 2. Define the dynamic data for the template
            $data = [
                'owner_name' => $owner->name,
                'listing_title' => $listing->title, 
                'live_url' => route('listings.show', $listing->id),
            ];

            // 3. Send the email using the DynamicEmail Mailable via the queue
            Mail::to($owner->email)->queue(new DynamicEmail($template, $data));

        } else {
            Log::warning("Email template 'listing_approved' not found. Approval notification not sent to owner ID: " . $owner->id);
        }
    }
}
