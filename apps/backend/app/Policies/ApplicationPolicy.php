<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Application;
use Illuminate\Auth\Access\HandlesAuthorization;

class ApplicationPolicy
{
    use HandlesAuthorization;

    /**
     * Super-Admin check: Grants all permissions automatically.
     */
    public function before(User $user, $ability)
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }
    }

    public function viewAny(User $user): bool
    {
        return $user->can('manage-applications');
    }

    public function update(User $user, Application $application): bool
    {
        return $user->can('manage-applications');
    }

    public function activate(User $user, Application $application): bool
    {
        // Logic: Cannot "activate" what is already active
        return $user->can('manage-applications') && !$application->is_active;
    }

    public function delete(User $user, Application $application): bool
    {
        // Critical Logic: Never allow deleting the active application
        return $user->can('manage-applications') && !$application->is_active;
    }
}
