<?php

namespace App\Services\Admin;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserManagementService
{
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
            $user->roles()->sync($data['roles']);
        }

        return $user;
    }
}
