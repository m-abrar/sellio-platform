<?php

namespace App\Listeners;

use App\Events\PlanUpgraded; // Use the PlanUpgraded event
use App\Mail\DynamicEmail;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Class SendPlanUpgradedEmail
 * Orchestrates the automated dispatch of subscription upgrade confirmations,
 * integrating dynamic template hydration and asynchronous mail queuing.
 */
class SendPlanUpgradedEmail implements ShouldQueue
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
    public function handle(PlanUpgraded $event): void
    {
        $user = $event->user;
        $oldPlan = $event->oldPlan; // Access the old plan
        $newPlan = $event->newPlan; // Access the new plan

        // 1. Fetch the 'plan_upgraded' template from the database
        $template = EmailTemplate::fetchByKey('plan_upgraded');

        if ($template) {
            // 2. Define the dynamic data for the template, including both plan names
            $data = [
                'user_name' => $user->name,
                'old_plan_name' => $oldPlan->title, 
                'new_plan_name' => $newPlan->title,
                'billing_url' => route('api.dashboard.partner.subscriptions.index'), 
            ];

            // 3. Send the email using the DynamicEmail Mailable via the queue
            Mail::to($user->email)->queue(new DynamicEmail($template, $data));

        } else {
            Log::warning("Email template 'plan_upgraded' not found. Upgrade confirmation email not sent to user ID: " . $user->id);
        }
    }
}
