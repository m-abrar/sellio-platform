<?php

namespace App\Listeners;

use App\Events\PaymentFailed;
use App\Mail\DynamicEmail;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Class SendPaymentFailedEmail
 * Orchestrates the automated dispatch of payment failure notifications,
 * integrating dynamic template hydration and asynchronous mail queuing.
 */
class SendPaymentFailedEmail implements ShouldQueue
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
    public function handle(PaymentFailed $event): void
    {
        $user = $event->user;
        $plan = $event->plan;

        // Critical Check: Ensure required models are present
        if (!$user || !$plan) {
             Log::error("PaymentFailed event received with missing User or Plan model.");
             return;
        }

        // 1. Fetch the 'payment_failed' template from the database
        $template = EmailTemplate::where('key', 'payment_failed')->first();

        if ($template) {
            // 2. Define the dynamic data for the template
            $data = [
                'user_name' => $user->name,
                'plan_name' => $plan->title, 
                // Link directly to where the user can update their card details
                'billing_url' => route('dashboard.partner.subscriptions.index'), 
            ];

            // 3. Send the email using the DynamicEmail Mailable via the queue
            Mail::to($user->email)->queue(new DynamicEmail($template, $data));

        } else {
            Log::warning("Email template 'payment_failed' not found. Payment failed notification not sent to user ID: " . $user->id);
        }
    }
}
