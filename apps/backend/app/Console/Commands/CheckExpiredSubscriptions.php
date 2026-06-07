<?php

namespace App\Console\Commands;

use App\Services\SubscriptionService;
use Illuminate\Console\Command;

class CheckExpiredSubscriptions extends Command
{
    protected $signature = 'app:check-expired-subscriptions';

    protected $description = 'Expire overdue subscriptions and notify affected partners.';

    public function handle(SubscriptionService $subscriptionService): int
    {
        $this->info('Checking for expired subscriptions...');

        $processedCount = $subscriptionService->dispatchExpiredSubscriptions();

        if ($processedCount === 0) {
            $this->info('No subscriptions required expiration handling.');
        } else {
            $this->info("Processed {$processedCount} expired subscription(s).");
        }

        return Command::SUCCESS;
    }
}
