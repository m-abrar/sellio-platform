<?php

namespace App\Listeners;

use App\Events\NewsletterSubscriptionConfirmed;
use App\Mail\DynamicEmail;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Class SendNewsletterWelcomeEmail
 * Orchestrates the automated dispatch of newsletter welcome messages,
 * integrating dynamic template hydration and asynchronous mail queuing.
 */
class SendNewsletterWelcomeEmail implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     *
     * @param  \App\Events\NewsletterSubscriptionConfirmed  $event
     * @return void
     */
    public function handle(NewsletterSubscriptionConfirmed $event): void
    {
        $subscription = $event->subscription;

        // 1. Fetch the necessary template from the database
        $template = EmailTemplate::where('key', 'newsletter_welcome')->first();

        if (!$template || !$subscription->email) {
            Log::warning("Email template 'newsletter_welcome' not found or missing recipient email.");
            return;
        }

        // 2. Prepare dynamic data for the email
        $data = [
            'recipient_name'   => $subscription->name ?? 'Valued Subscriber',
            'unsubscribe_link' => url('/newsletter/unsubscribe/' . $subscription->email),
        ];

        // 3. Queue the email for sending using the DynamicEmail mailable
        Mail::to($subscription->email)->queue(new DynamicEmail($template, $data));
    }
}
