<?php

namespace App\Listeners;

use App\Events\NewsletterOptinAttempted;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendOptinConfirmationEmail implements ShouldQueue
{
    /**
     * Handle the event.
     */
    public function handle(NewsletterOptinAttempted $event): void
    {
        $subscription = $event->subscription;

        // 1. Fetch the necessary template from the database
        $template = EmailTemplate::where('key', 'newsletter_optin_confirmation')->first();

        if (!$template || !$subscription->email || !$subscription->confirmation_token) {
            // Handle error: template missing, no email, or token missing (which shouldn't happen)
            return;
        }

        // 2. Generate the unique confirmation link using the token
        // This token is later used in a route to confirm the subscription status.
        $confirmationLink = url("/newsletter/confirm/{$subscription->confirmation_token}");

        $data = [
            // We may not have the recipient name yet, so we use a fallback
            'recipient_name' => $subscription->name ?? 'Valued Customer', 
            'confirmation_link' => $confirmationLink,
        ];

        // 3. Queue the email for sending
        Mail::send('emails.base', ['template' => $template, 'data' => $data], function ($message) use ($subscription, $template) {
            $message->to($subscription->email)
                    ->subject($template->subject);
        });
    }
}
