<?php

namespace App\Mail;

use App\Models\EmailTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DynamicEmail extends Mailable implements ShouldQueue // Implement ShouldQueue for better performance
{
    use Queueable, SerializesModels;

    public $template;
    public $data;

    /**
     * Create a new message instance.
     */
    public function __construct(EmailTemplate $template, array $data = [])
    {
        $this->template = $template;
        $this->data = $data;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        // Replace placeholders in the subject line
        $subject = str_replace(
            array_map(fn($key) => "{{ {$key} }}", array_keys($this->data)),
            array_values($this->data),
            $this->template->subject
        );

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content.
     */
    public function content(): Content
    {
        // Replace placeholders in the body content
        $body = str_replace(
            array_map(fn($key) => "{{ {$key} }}", array_keys($this->data)),
            array_values($this->data),
            $this->template->body
        );

        return new Content(
            html: 'emails.dynamic', // Use a simple view that echoes the HTML content
            with: [
                'bodyContent' => $body,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
