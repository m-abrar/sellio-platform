<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Contracts\User as UserImport;

class AuthService
{
    /**
     * Attempt to authenticate a user and return the user and a fresh token.
     *
     * @param string $email
     * @param string $password
     * @return array
     * @throws ValidationException
     */
    public function login(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => [__('The provided credentials are incorrect.')],
            ]);
        }

        return [
            'user'  => $user,
            'token' => $user->createToken('auth_token')->plainTextToken,
        ];
    }

    /**
     * Register a new user with the specified role and return the user and a token.
     *
     * @param array $data
     * @param string $role
     * @return array
     */
    public function register(array $data, string $role): array
    {
        $user = new User([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'phone'    => $data['phone'] ?? null,
            'username' => $data['username'] ?? null,
            'password' => $data['password'],
        ]);

        // Security: Explicit Role Whitelisting
        $allowedRoles = ['user', 'partner'];
        $assignedRole = in_array($role, $allowedRoles) ? $role : 'user';

        // Business Logic: Buyer/Partner Flagging
        $user->is_buyer = ($assignedRole === 'user');
        $user->save();

        // Security: Explicit Role Assignment
        $user->assignRole($assignedRole);

        return [
            'user'  => $user,
            'token' => $user->createToken('auth_token')->plainTextToken,
        ];
    }

    /**
     * Invalidate the user's current token.
     *
     * @param User $user
     * @return void
     */
    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }

    /**
     * Refresh the user's current token.
     *
     * @param User $user
     * @return string
     */
    public function refreshToken(User $user): string
    {
        $user->currentAccessToken()->delete();
        return $user->createToken('auth_token')->plainTextToken;
    }
    /**
     * Resolve a social user from OAuth data.
     *
     * @param string $provider
     * @param \Laravel\Socialite\Contracts\User $socialUser
     * @return User
     */
    public function findOrCreateSocialUser(string $provider, UserImport $socialUser): User
    {
        // Security: Attempt to find user by provider identity first
        $user = User::where('provider_name', $provider)
            ->where('provider_id', $socialUser->getId())
            ->first();

        if ($user) {
            return $user;
        }

        // Fallback: Match by email if the provider verifies it
        // Note: For production, ensure the provider guarantees email verification.
        $user = User::where('email', $socialUser->getEmail())->first();

        if ($user) {
            // Link the account to the existing user
            $user->update([
                'provider_name' => $provider,
                'provider_id'   => $socialUser->getId(),
            ]);
            return $user;
        }

        // Create a new user
        $user = User::create([
            'name'              => $socialUser->getName(),
            'email'             => $socialUser->getEmail(),
            'social_avatar_url' => $socialUser->getAvatar(),
            'provider_name'     => $provider,
            'provider_id'       => $socialUser->getId(),
            'password'          => Hash::make(Str::random(24)),
            'email_verified_at' => now(), // Social accounts are pre-verified
            'is_buyer'          => true,
        ]);

        $user->assignRole('user');

        return $user;
    }
}
