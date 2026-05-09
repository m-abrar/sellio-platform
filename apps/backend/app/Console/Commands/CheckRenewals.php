<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Subscription;
use App\Events\PlanAboutToExpire;
use Carbon\Carbon;

class CheckRenewals extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-renewals';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Checks for subscriptions due to expire/renew in 7 days and sends a reminder email.';

    /**
     * Execute the console command.
     */
    public function handle(\App\Services\SubscriptionService $subscriptionService)
    {
        $this->info('Starting renewal check...');

        $processedCount = $subscriptionService->dispatchRenewalReminders(7);

        if ($processedCount === 0) {
            $this->info('No subscriptions found expiring in 7 days.');
        } else {
            $this->info("Processed {$processedCount} subscriptions. Dispatching reminders...");
        }

        $this->info('Renewal check complete.');
        return Command::SUCCESS;
    }
}
