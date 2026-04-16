<?php

namespace App\Listeners;

use App\Events\ReviewRequested;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendReviewRequestEmail implements ShouldQueue
{
    /**
     * Handle the event.
     */
    public function handle(ReviewRequested $event): void
    {
        // 1. Fetch the necessary template from the database
        $template = EmailTemplate::where('key', 'request_a_review')->first();

        if (!$template || !$event->recipient->email) {
            return;
        }

        // 2. Determine the Item Name (use 'name' or 'title' depending on your models)
        $itemName = $event->reviewable->title ?? $event->reviewable->title ?? 'your recent experience';
        
        // 3. Generate the Review Link (Crucial for Review Requests)
        // In a real app, this link might include a signed URL or token 
        // to verify the user's eligibility and pre-fill their review form.
        // For this example, we use a standard route.
        $reviewLink = url("/review/create/{$event->reviewable->id}?type=" . class_basename($event->reviewable));

        $data = [
            'recipient_name' => $event->recipient->title,
            'item_name' => $itemName,
            'review_link' => $reviewLink,
        ];

        // 4. Queue the email for sending
        Mail::send('emails.base', ['template' => $template, 'data' => $data], function ($message) use ($event, $template) {
            $message->to($event->recipient->email)
                    ->subject($template->subject);
        });
    }
}
