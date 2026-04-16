<?php

namespace App\Listeners;

use App\Events\PlanDowngraded;
use App\Mail\DynamicEmail;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendPlanDowngradedEmail implements ShouldQueue
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
    public function handle(PlanDowngraded $event): void
    {
        $user = $event->user;
        $newPlan = $event->newPlan;
        $subscription = $event->subscription;

        // Critical Check: Ensure required models and date are present
        if (!$user || !$newPlan || !$subscription || !$subscription->ends_at) {
             Log::error("PlanDowngraded event received with missing User, Plan, or subscription ends_at date.");
             return;
        }

        // 1. Fetch the 'plan_downgraded' template from the database
        $template = EmailTemplate::where('key', 'plan_downgraded')->first();

        if ($template) {
            // 2. Define the dynamic data for the template
            $data = [
                'user_name' => $user->name,
                'new_plan_name' => $newPlan->title,
                // The downgrade takes effect when the current subscription ends.
                'next_billing_date' => $subscription->ends_at->toFormattedDateString(), 
            ];

            // 3. Send the email using the DynamicEmail Mailable via the queue
            Mail::to($user->email)->queue(new DynamicEmail($template, $data));

        } else {
            Log::warning("Email template 'plan_downgraded' not found. Downgrade confirmation email not sent to user ID: " . $user->id);
        }
    }
}
