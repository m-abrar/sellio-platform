<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Subscription;

/**
 * Dispatched when a user successfully confirms their subscription.
 *
 * @property Subscription $subscription The confirmed subscription record.
 */
class NewsletterSubscriptionConfirmed
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @param Subscription $subscription The database record for the confirmed subscription.
     */
    public function __construct(
        public Subscription $subscription
    ) {}
}
