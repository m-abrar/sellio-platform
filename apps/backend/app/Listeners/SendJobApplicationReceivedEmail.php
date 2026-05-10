<?php

namespace App\Listeners;

use App\Events\JobApplicationReceived;
use App\Mail\DynamicEmail;
use App\Models\EmailTemplate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Class SendJobApplicationReceivedEmail
 * Orchestrates the automated dispatch of job application notifications,
 * integrating dynamic template hydration and asynchronous mail queuing.
 */
class SendJobApplicationReceivedEmail implements ShouldQueue
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
    public function handle(JobApplicationReceived $event): void
    {
        $application = $event->application;
        $jobListing = $application->listing; // Specialized JobListing model
        $employer = $jobListing->user;

        // Critical Check: Ensure required models are present
        if (!$employer || !$jobListing) {
             Log::error("JobApplicationReceived event received with missing Employer or Job Listing model on application ID: " . ($application->id ?? 'unknown'));
             return;
        }

        // 1. Fetch the 'job_application_received' template from the database
        $template = EmailTemplate::where('key', 'job_application_received')->first();

        if ($template) {
            // 2. Define the dynamic data for the template
            $data = [
                'employer_name' => $employer->name,
                'job_title' => $jobListing->title, 
                'application_link' => route('admin.job-applications.show', $application->id),
            ];

            // 3. Send the email using the DynamicEmail Mailable via the queue
            Mail::to($employer->email)->queue(new DynamicEmail($template, $data));

        } else {
            Log::warning("Email template 'job_application_received' not found. Application notification not sent to employer ID: " . $employer->id);
        }
    }
}
