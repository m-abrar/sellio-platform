<?php

namespace App\Services\Partner;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

/**
 * Class ProfileService
 * Manages the dual identity of Account Security and Public Business Profile.
 */
class ProfileService
{
    /**
     * Update account and business profile data.
     *
     * @param User $user
     * @param array $data
     * @return User
     */
    public function updateProfile(User $user, array $data): User
    {
        // 1. Update Core User Data
        $user->fill([
            'name'  => $data['name'],
            'email' => $data['email'],
        ]);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // 2. Handle Password Update if provided
        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        // 3. Update Partner/Business Meta
        // Assuming a relation or JSON field for business details
        $user->update([
            'company'        => $data['company_name'] ?? $user->company,
            'website_url'    => $data['website_url'] ?? null,
            'bio'            => $data['bio'] ?? null,
            'phone'          => $data['phone_number'] ?? null,
            'social_links'   => $data['social_links'] ?? [], // Array cast in Model
        ]);

        return $user;
    }
}
