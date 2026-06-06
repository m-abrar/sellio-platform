<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class ContactFormTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_form_submission_is_accepted_and_logged(): void
    {
        Log::spy();

        $response = $this->from('/contact')->post(route('contact.send'), [
            'name' => 'Jane Buyer',
            'email' => 'jane@example.test',
            'subject' => 'Partnership Inquiry',
            'message' => 'I would like to learn more about listing on Sellio.',
        ]);

        $response->assertRedirect('/contact')
            ->assertSessionHas('success');

        Log::shouldHaveReceived('info')
            ->once()
            ->withArgs(fn (string $message) => str_contains($message, 'Contact Form Submission'));
    }

    public function test_contact_form_requires_valid_payload(): void
    {
        $response = $this->post(route('contact.send'), [
            'name' => '',
            'email' => 'not-an-email',
            'subject' => '',
            'message' => '',
        ]);

        $response->assertSessionHasErrors(['name', 'email', 'subject', 'message']);
    }
}
