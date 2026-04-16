<?php

namespace App\Listeners;

use App\Events\ReviewReceived;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendReviewReceivedEmail implements ShouldQueue
{
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
    public function handle(ReviewReceived $event): void
    {
        $template = EmailTemplate::where('key', 'review_received')->first();

        if (!$template || !$event->owner->email) {
            return;
        }
        
        // Helper function to convert the rating number into star characters (for display in email)
        $ratingStars = str_repeat('★', $event->review->rating) . str_repeat('☆', 5 - $event->review->rating);

        $data = [
            'owner_name' => $event->owner->name,
            'item_name' => $event->reviewable->title ?? $event->reviewable->title ?? 'Your Listing',
            'rating_value' => $event->review->rating,
            'rating_stars' => $ratingStars,
            'review_comment' => $event->review->comment,
            // You would replace this with your actual route to the specific review/listing page
            'review_link' => url('/listings/' . $event->reviewable->id . '#review-' . $event->review->id), 
        ];

        Mail::send('emails.base', ['template' => $template, 'data' => $data], function ($message) use ($event, $template) {
            $message->to($event->owner->email)
                    ->subject($template->subject);
        });
    }
}
