<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;

trait AuthorizesOwnership
{
    /**
     * Abort with 403 unless the authenticated user owns the given model.
     *
     * @param  mixed   $model       Any Eloquent model with a direct user ownership field.
     * @param  string  $ownerField  The column that stores the owner's user ID (default: user_id).
     */
    protected function authorizeOwner(mixed $model, string $ownerField = 'user_id'): void
    {
        if (Auth::id() !== $model->{$ownerField}) {
            abort(403, __('Unauthorized.'));
        }
    }
}
