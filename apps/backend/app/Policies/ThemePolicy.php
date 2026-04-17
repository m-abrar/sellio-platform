<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Theme;
use Illuminate\Auth\Access\HandlesAuthorization;

class ThemePolicy
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
        return $user->can('manage-themes');
    }

    public function update(User $user, Theme $theme): bool
    {
        return $user->can('manage-themes');
    }

    public function activate(User $user, Theme $theme): bool
    {
        // Cannot activate an already-active theme
        return $user->can('manage-themes') && !$theme->is_active;
    }

    public function delete(User $user, Theme $theme): bool
    {
        // Never allow deleting the active theme
        return $user->can('manage-themes') && !$theme->is_active;
    }
}
