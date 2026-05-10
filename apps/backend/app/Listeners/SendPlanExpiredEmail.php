<?php

namespace App\Listeners;

use App\Events\PlanExpired;
use App\Mail\DynamicEmail;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Class SendPlanExpiredEmail
 * Orchestrates the automated dispatch of subscription expiration notifications,
 * integrating dynamic template hydration and asynchronous mail queuing.
 */
class SendPlanExpiredEmail implements ShouldQueue
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
    public function handle(PlanExpired $event): void
    {
        // Assuming PlanExpired event carries $user and $plan model (The plan that expired)
        $user = $event->user;
        $plan = $event->plan;

        // CRITICAL CHECK: Ensure the required models are present before proceeding.
        // This prevents the "Call to a member function on null" error if the job payload is corrupted.
        if (!$user || !$plan) {
            Log::error("PlanExpired event received with missing User or Plan model. User ID: " . ($user->id ?? 'N/A'));
            return;
        }else{
            Log::info($user);
            Log::info($plan);
        }

        // 1. Fetch the 'plan_expired' template from the database
        $template = EmailTemplate::fetchByKey('plan_expired');

        Log::info($template);

        if ($template) {
            // 2. Define the dynamic data for the template
            $data = [
                'user_name' => $user->name,
                'plan_name' => $plan->title, 
                'reactivate_url' => route('dashboard.partner.plans.index'), 
            ];

            // 3. Send the email using the DynamicEmail Mailable via the queue
            Mail::to($user->email)->queue(new DynamicEmail($template, $data));

        } else {
            Log::warning("Email template 'plan_expired' not found. Expiration email not sent to user ID: " . $user->id);
        }
    }
}
