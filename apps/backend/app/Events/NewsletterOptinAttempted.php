<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Subscription; // Assuming a Subscription model

/**
 * Dispatched when a user attempts to opt-in to the newsletter.
 * * @property Subscription $subscription The newly created, unconfirmed subscription record.
 */
class NewsletterOptinAttempted
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @param Subscription $subscription The database record for the attempted subscription.
     */
    public function __construct(
        public Subscription $subscription
    ) {}
}
