<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Data Factory for Platform Identities
 *
 * This factory generates core user profiles, including unique identifiers,
 * verified contact credentials, and secure credential hashes, supporting
 * both guest and authenticated user states.
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $username = fake()->userName() . Str::random(4);
        
        return [
            'name' => fake()->name(),
            'username' => strtolower(Str::slug($username, '')),
            'email' => fake()->unique()->safeEmail(),
            
            // --- FIX APPLIED HERE ---
            // Add a dynamically generated phone number
            'phone' => fake()->unique()->numerify('##########'), // Generates a 10-digit number like 5551234567
            
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),

            // Identity Flags
            'is_admin' => false,
            'is_partner' => false,
            'is_buyer' => true,
            'is_verified' => false,
        ];
    }

    /**
     * Indicate that the user is an administrator.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_admin' => true,
        ]);
    }

    /**
     * Indicate that the user is a partner/seller.
     */
    public function partner(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_partner' => true,
        ]);
    }

    /**
     * Indicate that the user is verified.
     */
    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_verified' => true,
        ]);
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}