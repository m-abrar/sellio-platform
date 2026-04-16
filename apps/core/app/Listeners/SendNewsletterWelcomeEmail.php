<?php

namespace App\Listeners;

use App\Events\NewsletterSubscriptionConfirmed;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendNewsletterWelcomeEmail implements ShouldQueue
{
    /**
     * Handle the event.
     */
    public function handle(NewsletterSubscriptionConfirmed $event): void
    {
        $subscription = $event->subscription;

        // 1. Fetch the necessary template from the database
        $template = EmailTemplate::where('key', 'newsletter_welcome')->first();

        if (!$template || !$subscription->email) {
            // Handle error: template missing or no email address
            return;
        }

        // 2. Prepare dynamic data for the email
        $data = [
            'recipient_name' => $subscription->name ?? 'Valued Customer',
            // Add any other dynamic content specific to your welcome email
            'unsubscribe_link' => url('/newsletter/unsubscribe/' . $subscription->email), // Always good to include
        ];

        // 3. Queue the email for sending
        Mail::send('emails.base', ['template' => $template, 'data' => $data], function ($message) use ($subscription, $template) {
            $message->to($subscription->email)
                    ->subject($template->subject);
        });
    }
}
