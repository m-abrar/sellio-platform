<?php

namespace App\Services\Admin;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Illuminate\Auth\Access\AuthorizationException;

/**
 * Class UserManagementService
 * Orchestrates the administrative lifecycle of user accounts, managing credential 
 * hashing, profile updates, and authorized role synchronization.
 */
class UserManagementService
{
    /**
     * Persist or update a user entity with synchronized roles.
     *
     * @param  array  $data
     * @param  \App\Models\User|null  $user
     * @return \App\Models\User
     * 
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function saveUser(array $data, ?User $user = null): User
    {
        $preparedData = [
            'name'  => $data['name'],
            'email' => $data['email'],
        ];

        if (!empty($data['password'])) {
            $preparedData['password'] = Hash::make($data['password']);
        }

        if ($user) {
            $user->update($preparedData);
        } else {
            $user = User::create($preparedData);
        }

        if (isset($data['roles'])) {
            $superAdminRole = Role::where('name', 'super-admin')->first();
            if ($superAdminRole && in_array($superAdminRole->id, $data['roles'])) {
                if (!auth()->user()->hasRole('super-admin')) {
                    throw new AuthorizationException(__('You are not allowed to assign the Super Admin role.'));
                }
            }
            $user->roles()->sync($data['roles']);
        }

        return $user;
    }
}
