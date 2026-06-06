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

        // 2. Implement actual mailing logic with safety try-catch block
        try {
            $adminEmail = setting('email_contact', config('mail.from.address', 'admin@sellio.com'));
            Mail::raw(
                "You have received a new contact form inquiry on Sellio:\n\n" .
                "Name: " . ($data['name'] ?? 'N/A') . "\n" .
                "Email: " . ($data['email'] ?? 'N/A') . "\n" .
                "Subject: " . ($data['subject'] ?? 'General Inquiry') . "\n\n" .
                "Message:\n" . ($data['message'] ?? 'No message body provided.'),
                function ($message) use ($data, $adminEmail) {
                    $message->to($adminEmail)
                        ->subject("Contact Form Submission: " . ($data['subject'] ?? 'General Inquiry'))
                        ->replyTo($data['email'] ?? $adminEmail, $data['name'] ?? 'Inquirer');
                }
            );
        } catch (\Exception $e) {
            Log::error("Failed to send contact form mailable: " . $e->getMessage());
        }

        // 3. Optional: Store in database if a 'contacts' table exists
        // \App\Models\Contact::create($data);
    }
}
