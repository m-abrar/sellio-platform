<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ticket;
use App\Models\User; 
use Illuminate\Support\Facades\DB;

/**
 * Seeds the 'tickets' table with sample support tickets.
 *
 * This seeder is crucial for populating the database with realistic sample
 * data needed for testing the application's support system, helpdesk functionality,
 * and ensuring filters and dashboards can be tested against various ticket statuses.
 */
class TicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Creates two batches of tickets: a general randomized batch and a batch
     * explicitly set to 'unresolved' status for comprehensive testing.
     *
     * @return void
     */
    public function run(): void
    {
        if ($this->command) {
            $this->command->info('📩 Starting Ticket Seeder...');
            // Clear existing data before seeding
            DB::table('tickets')->delete();
            $this->command->line('  🗑️ Cleared existing support tickets.');
        }

        // 1. Get a collection of existing users to assign tickets to.
        // Performance: Cap user fetching to prevent memory exhaustion on large datasets
        $users = User::limit(50)->get();
        $fallbackCreated = false;

        // Guard clause: Check if the users collection is empty.
        // If it is empty, we must create fallback users to prevent factory assignment failures.
        if ($users->isEmpty()) {
            if ($this->command) $this->command->line('  ⚠️ No users found. Creating 5 fallback users for ticket assignment.');
            // Create a small batch of users just for this seeder's context if necessary.
            $users = User::factory(5)->create();
            $fallbackCreated = true;
        }

        // 2. Create 50 general tickets, randomly recycling user IDs for assignment.
        // The status (e.g., 'open', 'resolved', 'closed') for this batch will be determined 
        // randomly based on the default state defined in the TicketFactory.
        $generalTickets = Ticket::factory(50)
            // The recycle method intelligently assigns one of the existing users from the $users collection
            // to the ticket's foreign key (user_id), distributing tickets evenly among them.
            ->recycle($users) 
            ->create();

        if ($this->command) {
            $this->command->info("  Created {$generalTickets->count()} general tickets with randomized statuses.");
        }

        // 3. (Bonus) Create 10 tickets specifically with the 'unresolved' status.
        // This ensures specific edge cases (like tickets requiring immediate attention) exist 
        // for testing administrative filters and priority dashboards.
        $unresolvedTickets = Ticket::factory(10)
            // Assumes a custom state method 'unresolved' is defined in the TicketFactory, 
            // which explicitly sets the status column to an unresolved state.
            ->recycle($users)
            ->unresolved() 
            ->create();

        if ($this->command) {
            $this->command->info("  Created {$unresolvedTickets->count()} 'unresolved' tickets for dashboard testing.");
            $totalCount = $generalTickets->count() + $unresolvedTickets->count();
            $this->command->info("  Total tickets seeded: {$totalCount}.");
            if ($fallbackCreated) {
                 $this->command->line('  Cleanup recommended: These 5 fallback users should be deleted if the main UserSeeder is run later.');
            }
            $this->command->info('--- 🏁 Ticket Seeding Complete ---');
        }
    }
}