<?php

namespace App\Listeners;

use App\Events\PlanSubscribed; // Assuming this is your event
use App\Mail\DynamicEmail;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Class SendPlanSubscribedEmail
 * Orchestrates the automated dispatch of subscription activation confirmations,
 * integrating dynamic template hydration and asynchronous mail queuing.
 */
class SendPlanSubscribedEmail implements ShouldQueue
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
    public function handle(PlanSubscribed $event): void
    {
        // Assuming your event has a $user object and a $plan object
        $user = $event->user;
        $plan = $event->plan;

        // 1. Fetch the 'plan_subscribed' template from the database
        $template = EmailTemplate::fetchByKey('plan_subscribed');

        if ($template) {
            // 2. Define the dynamic data for the template
            $data = [
                'user_name' => $user->name,
                'plan_name' => $plan->title, 
                'billing_url' => route('api.dashboard.partner.subscriptions.index'), 
            ];

            // 3. Send the email using the DynamicEmail Mailable via the queue
            Mail::to($user->email)->queue(new DynamicEmail($template, $data));

        } else {
            Log::warning("Email template 'plan_subscribed' not found. Subscription confirmation email not sent to user ID: " . $user->id);
        }
    }
}
