<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Class ContactService
 * Handles the business logic for processing and distributing contact form inquiries.
 */
class ContactService
{
    /**
     * Handle the contact form submission.
     *
     * @param array $data
     * @return void
     */
    public function handleInquiry(array $data): void
    {
        // 1. Log the inquiry for audit purposes
        Log::info("Contact Form Submission: " . $data['subject'], [
            'name'  => $data['name'],
            'email' => $data['email'],
        ]);

        // 2. TODO: Implement actual mailing logic
        // In a production environment, this would trigger a Mailable or an Event.
        // Mail::to(setting('admin_email', 'admin@sellio.com'))->send(new \App\Mail\ContactInquiry($data));
        
        // 3. Optional: Store in database if a 'contacts' table exists
        // \App\Models\Contact::create($data);
    }
}
