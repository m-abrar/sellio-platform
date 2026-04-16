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
    public function handle()
    {
        $this->info('Starting renewal check...');

        // 1. Define the target expiration date: exactly 7 days from now (E.g., today is Nov 14, target is Nov 21)
        $targetDate = Carbon::now()->addDays(7)->setTime(0, 0, 0);

        // Define the end of the target day for a safe range (Nov 21 23:59:59)
        $targetEndDate = $targetDate->copy()->endOfDay();
        
        // 2. Query for active subscriptions that end on the target date range.
        $subscriptions = Subscription::with('user', 'plan')
            // Subscription must be 'default' (active)
            ->where('name', 'default') 
            // Subscription must have an ends_at date (not manually cancelled for queue)
            ->whereNotNull('ends_at')
            // The ends_at date must fall within the target 24-hour window
            ->whereBetween('ends_at', [$targetDate, $targetEndDate])
            ->get();

        $count = $subscriptions->count();

        if ($count === 0) {
            $this->info('No subscriptions found expiring in 7 days.');
            return Command::SUCCESS;
        }

        $this->info("Found {$count} subscriptions expiring on {$targetDate->toFormattedDateString()}. Dispatching reminders...");

        // 3. Dispatch the event for each subscription found
        foreach ($subscriptions as $subscription) {
            // Ensure relationships are loaded before dispatching
            if ($subscription->user && $subscription->plan) {
                PlanAboutToExpire::dispatch($subscription->user, $subscription);
                $this->comment("Reminder dispatched for User ID: {$subscription->user_id}, Plan: {$subscription->plan->title}");
            } else {
                $this->error("Skipping subscription ID {$subscription->id} due to missing user or plan data.");
            }
        }

        $this->info('Renewal check complete.');
        return Command::SUCCESS;
    }
}
