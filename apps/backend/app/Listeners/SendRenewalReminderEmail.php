<?php

namespace App\Listeners;

use App\Events\PlanAboutToExpire;
use App\Mail\DynamicEmail;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Class SendRenewalReminderEmail
 * Orchestrates the automated dispatch of subscription renewal reminders,
 * integrating dynamic template hydration and asynchronous mail queuing.
 */
class SendRenewalReminderEmail implements ShouldQueue
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
    public function handle(PlanAboutToExpire $event): void
    {
        $user = $event->user;
        $subscription = $event->subscription;

        // Ensure we have all necessary data, including the critical ends_at date.
        if (!$user || !$subscription || !$subscription->ends_at) {
             Log::error("PlanAboutToExpire event missing user or valid subscription data.");
             return;
        }

        // 1. Fetch the 'plan_about_to_expire' template from the database
        $template = EmailTemplate::fetchByKey('plan_about_to_expire');

        if ($template) {
            // 2. Define the dynamic data for the template
            $data = [
                'user_name' => $user->name,
                // Note: Assumes a 'plan' relationship is defined on the Subscription model
                'plan_name' => $subscription->plan->title, 
                // Format the ends_at date for display in the email body
                'expiry_date' => $subscription->ends_at->toFormattedDateString(),
                'renewal_url' => route('dashboard.partner.subscriptions.index'),
            ];

            // 3. Send the email using the DynamicEmail Mailable via the queue
            Mail::to($user->email)->queue(new DynamicEmail($template, $data));

        } else {
            Log::warning("Email template 'plan_about_to_expire' not found. Renewal reminder not sent to user ID: " . $user->id);
        }
    }
}
