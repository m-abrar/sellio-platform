<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Spatie\Permission\PermissionRegistrar;

/**
 * Class RolesAndPermissionsSeeder
 *
 * Seeds the necessary roles and permissions into the database using the Spatie
 * Laravel Permission package. It defines various user tiers (Super Admin, Admin,
 * Moderator, Partner, User) and assigns a comprehensive set of permissions to manage
 * application features, ensuring the application's access control is correctly initialized.
 */
class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Initializes permissions, creates five core roles, assigns specific permissions
     * to each role, and finally attaches the 'super-admin' and 'partner' roles to
     * specific, pre-existing User IDs (1 and 2, respectively) for demonstration.
     *
     * @return void
     */
    public function run(): void
    {
        // Get initial counts before running the seeder logic
        $initialPermissionCount = Permission::count();
        $initialRoleCount = Role::count();
        
        // 1. Display the Header Line
        $this->command->info('✨ Starting **RolesAndPermissions Seeder**...');
        $this->command->line("Existing Permissions: {$initialPermissionCount} | Existing Roles: {$initialRoleCount}");
        $this->command->newLine();

        // Reset cached roles and permissions
        // This is crucial to ensure the system loads the latest permissions immediately
        // after seeding, preventing potential permission bugs during the first run.
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Define Permissions
        // Define a comprehensive list of all granular permissions used across the application.
        $permissions = [
            'view',                  // Basic view permission (e.g., viewing listings, profile)
            'create',                // Permission to create new content (e.g., listings, offers)
            'edit',                  // Permission to modify existing content
            'delete',                // Permission to remove content
            'manage-withdrawals',    // Permission to process and manage user withdrawal requests
            'manage-users',          // High-level permission to view/manage all users (typically for Admin)
            'app-settings',          // Super high-level permission to modify core application configurations (Super Admin only)
        ];

        foreach ($permissions as $permission) {
            // Use firstOrCreate to prevent duplicates if the seeder is run multiple times (idempotency).
            Permission::firstOrCreate(['name' => $permission]);
        }
        
        $this->command->info('🛡️ **Permissions** created/checked.');
        $this->command->newLine();

        // 2. Create Roles and Assign Permissions
        $this->command->line('Defining Core Roles...');

        // A. Super Admin Role (The highest authority)
        $superAdminRole = Role::firstOrCreate(['name' => 'super-admin']);
        // Use syncPermissions to assign all available permissions to the Super Admin role.
        $superAdminRole->syncPermissions(Permission::all()); 

        // B. Admin Role
        // The Admin role typically manages core site operations and high-level content.
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo(['create', 'edit', 'delete', 'view', 'manage-withdrawals', 'manage-users']);

        // C. Moderator Role
        // The Moderator role focuses on content maintenance and approval workflows.
        $moderatorRole = Role::firstOrCreate(['name' => 'moderator']);
        $moderatorRole->givePermissionTo(['edit', 'delete', 'view']);

        // D. Standard Partner Role (Users who offer services/products)
        $partnerRole = Role::firstOrCreate(['name' => 'partner']);
        // Partners can view the site and create/manage their own listings.
        $partnerRole->givePermissionTo(['view', 'create']);

        // E. Standard User Role (General customers/consumers)
        $userRole = Role::firstOrCreate(['name' => 'user']);
        // Standard users can only view content.
        $userRole->givePermissionTo(['view']);

        $this->command->info('👑 **Roles** created/checked and permissions assigned.');
        $this->command->newLine();

        // 3. Assign Roles to Users
        $this->command->line('Assigning Roles to specific Users...');

        // Assign 'super-admin' role to the first user created (typically the main system account).
        $superAdminUser = User::find(1);
        
        if ($superAdminUser) {
            // Assign both super-admin and admin roles for full administrative access.
            $superAdminUser->assignRole(['super-admin', 'admin']);
            $this->command->info('🔑 Super-Admin/Admin role assigned to **User ID 1**.');
        } else {
            $this->command->line('⚠️ User with ID 1 not found. Super-Admin role was not assigned.');
        }

        // Assign 'partner' role to the second user (e.g., a dedicated vendor account).
        $partnerUser = User::find(2);
        
        if ($partnerUser) {
            $partnerUser->assignRole('partner');
            $this->command->info('🤝 Partner role assigned to **User ID 2**.');
        } else {
            $this->command->line('⚠️ User with ID 2 not found. Partner role was not assigned.');
        }

        // Assign 'user' role to all other users (all remaining IDs > 2) for standard consumer access.
        $remainingUsersCount = User::where('id', '>', 2)->count();

        User::where('id', '>', 2)->get()->each(function ($user) {
            if ($user->is_partner) {
                $user->assignRole('partner');
            } else {
                // Both buyers and general users are assigned the 'user' role
                $user->assignRole('user');
            }
        });

        $this->command->info("👤 User role assigned to **{$remainingUsersCount}** other users.");
        $this->command->newLine();

        // 4. Display the Count of Created Records
        $finalPermissionCount = Permission::count();
        $finalRoleCount = Role::count();
        
        $permissionsCreated = $finalPermissionCount - $initialPermissionCount;
        $rolesCreated = $finalRoleCount - $initialRoleCount;

        $this->command->info("📊 **Created Records**:");
        $this->command->info(" - **{$permissionsCreated}** New Permissions");
        $this->command->info(" - **{$rolesCreated}** New Roles");
        $this->command->line("Total Entities: {$finalPermissionCount} Permissions, {$finalRoleCount} Roles now exist.");
        
        // 5. Display the Success Footer
        $this->command->newLine();
        $this->command->info('✅ Roles and Permissions seeded successfully!');
    }
}