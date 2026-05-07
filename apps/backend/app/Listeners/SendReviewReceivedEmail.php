<?php

namespace App\Listeners;

use App\Events\ReviewReceived;
use App\Mail\DynamicEmail;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Class SendReviewReceivedEmail
 * Orchestrates the automated dispatch of review notifications to entity owners,
 * integrating dynamic template hydration and asynchronous mail queuing.
 */
class SendReviewReceivedEmail implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     *
     * @param  \App\Events\ReviewReceived  $event
     * @return void
     */
    public function handle(ReviewReceived $event): void
    {
        $template = EmailTemplate::where('key', 'review_received')->first();

        if (!$template || !$event->owner->email) {
            Log::warning("Email template 'review_received' not found or missing owner email.");
            return;
        }
        
        // Convert the rating number into star characters for visual display
        $ratingStars = str_repeat('★', (int) $event->review->rating) . str_repeat('☆', 5 - (int) $event->review->rating);

        $data = [
            'owner_name'     => $event->owner->name,
            'item_name'      => $event->reviewable->title ?? 'Your Listing',
            'rating_value'   => $event->review->rating,
            'rating_stars'   => $ratingStars,
            'review_comment' => $event->review->comment,
            'review_link'    => url('/listings/' . $event->reviewable->id . '#review-' . $event->review->id), 
        ];

        // Queue the email for sending using the DynamicEmail mailable
        Mail::to($event->owner->email)->queue(new DynamicEmail($template, $data));
    }
}
