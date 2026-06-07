<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

/**
 * Class UserRoleAssignmentSeeder
 * 
 * This seeder ensures that all users in the system have appropriate roles assigned
 * based on their profiles (is_admin, is_partner). It is designed to be run after
 * all other seeders that might create users (e.g., TicketSeeder, WalletSeeder).
 */
class UserRoleAssignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        config(['activitylog.enabled' => false]);

        $this->command->info('🤝 Starting **UserRoleAssignment Seeder**...');

        // 1. Assign 'super-admin' and 'admin' roles to User ID 1
        $superAdminUser = User::find(1);
        if ($superAdminUser) {
            $superAdminUser->assignRole(['super-admin', 'admin']);
            $this->command->info('  - Super-Admin/Admin roles verified for User ID 1.');
        }

        // 2. Assign 'partner' role to User ID 2
        $partnerUser = User::find(2);
        if ($partnerUser) {
            $partnerUser->assignRole('partner');
            $this->command->info('  - Partner role verified for User ID 2.');
        }

        // 3. Assign roles to all other users without roles
        $totalAssigned = 0;
        
        // We use chunkById to handle large datasets efficiently
        User::whereDoesntHave('roles')->chunkById(100, function ($users) use (&$totalAssigned) {
            foreach ($users as $user) {
                $user->assignRole($user->defaultRoleName());
                $totalAssigned++;
            }
        });

        if ($totalAssigned > 0) {
            $this->command->info("  - Assigned roles to **{$totalAssigned}** users who were missing them.");
        } else {
            $this->command->info('  - All users already had roles assigned.');
        }

        $this->command->newLine();
        $this->command->info('✅ User role assignment finished successfully!');
    }
}
