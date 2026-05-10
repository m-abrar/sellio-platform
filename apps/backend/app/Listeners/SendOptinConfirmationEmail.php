<?php

namespace App\Listeners;

use App\Events\NewsletterOptinAttempted;
use App\Mail\DynamicEmail;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Class SendOptinConfirmationEmail
 * Orchestrates the automated dispatch of double-opt-in confirmation requests,
 * integrating dynamic template hydration and asynchronous mail queuing.
 */
class SendOptinConfirmationEmail implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     *
     * @param  \App\Events\NewsletterOptinAttempted  $event
     * @return void
     */
    public function handle(NewsletterOptinAttempted $event): void
    {
        $subscription = $event->subscription;

        // 1. Fetch the necessary template from the database
        $template = EmailTemplate::fetchByKey('newsletter_optin_confirmation');

        if (!$template || !$subscription->email || !$subscription->confirmation_token) {
            Log::warning("Email template 'newsletter_optin_confirmation' not found or missing subscription metadata.");
            return;
        }

        // 2. Generate the unique confirmation link
        $confirmationLink = url("/newsletter/confirm/{$subscription->confirmation_token}");

        $data = [
            'recipient_name'    => $subscription->name ?? 'Valued Customer', 
            'confirmation_link' => $confirmationLink,
        ];

        // 3. Queue the email for sending using the DynamicEmail mailable
        Mail::to($subscription->email)->queue(new DynamicEmail($template, $data));
    }
}
