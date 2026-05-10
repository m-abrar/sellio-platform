<?php

namespace App\Listeners;

use App\Events\UserRegistered;
use App\Mail\DynamicEmail; // Import the new Mailable
use App\Models\EmailTemplate; // Import the EmailTemplate Model
use Illuminate\Contracts\Queue\ShouldQueue; // Add this
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail; // Import Mail Facade

/**
 * Class SendWelcomeEmail
 * Orchestrates the automated dispatch of platform onboarding messages,
 * integrating dynamic template hydration and asynchronous mail queuing.
 */
class SendWelcomeEmail implements ShouldQueue
{
    use InteractsWithQueue; // Use InteractsWithQueue when ShouldQueue is implemented
    
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
    public function handle(UserRegistered $event): void
    {
        $user = $event->user;

        // --- Logic to send a welcome email using a dynamic template ---
                
        // 1. Fetch the 'welcome_to_platform' template from the database
        $template = EmailTemplate::fetchByKey('welcome_to_platform');

        if ($template) {
            // 2. Define the data to be substituted in the template
            $data = [
                'user_name' => $user->name,
                'dashboard_url' => route('dashboard.user.welcome'), 
            ];

            // 3. Send the email using the DynamicEmail Mailable
            // Mail::to($user->email)->send(new DynamicEmail($template, $data));
            Mail::to($user->email)->queue(new DynamicEmail($template, $data));
            
        } else {
            Log::warning("Email template 'welcome_to_platform' not found. Welcome email not sent.");
        }


    }
}
