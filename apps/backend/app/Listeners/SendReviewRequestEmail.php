<?php

namespace App\Listeners;

use App\Events\ReviewRequested;
use App\Mail\DynamicEmail;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Class SendReviewRequestEmail
 * Orchestrates the automated dispatch of post-interaction review requests,
 * integrating dynamic template hydration and asynchronous mail queuing.
 */
class SendReviewRequestEmail implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     *
     * @param  \App\Events\ReviewRequested  $event
     * @return void
     */
    public function handle(ReviewRequested $event): void
    {
        // 1. Fetch the necessary template from the database
        $template = EmailTemplate::where('key', 'request_a_review')->first();

        if (!$template || !$event->recipient->email) {
            Log::warning("Email template 'request_a_review' not found or missing recipient email.");
            return;
        }

        // 2. Determine the Item Name
        $itemName = $event->reviewable->title ?? 'your recent experience';
        
        // 3. Generate the Review Link
        $reviewLink = url("/review/create/{$event->reviewable->id}?type=" . class_basename($event->reviewable));

        $data = [
            'recipient_name' => $event->recipient->name ?? 'Valued Customer',
            'item_name'      => $itemName,
            'review_link'    => $reviewLink,
        ];

        // 4. Queue the email for sending using the DynamicEmail mailable
        Mail::to($event->recipient->email)->queue(new DynamicEmail($template, $data));
    }
}
