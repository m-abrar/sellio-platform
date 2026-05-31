<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PendingPartnerApplicationSeeder extends Seeder
{
    /**
     * Create partner applicants that intentionally do not have the partner role yet.
     */
    public function run(): void
    {
        $applicants = [
            [
                'name' => 'Maya Hartwell',
                'email' => 'partner.applicant1@sellio-platform.test',
                'company' => 'Hartwell Living Group',
                'bio' => 'Applicant partner focused on managed rental homes and local concierge services.',
            ],
            [
                'name' => 'Omar Whitestone',
                'email' => 'partner.applicant2@sellio-platform.test',
                'company' => 'Whitestone Motors',
                'bio' => 'Applicant partner preparing premium auto inventory for moderation review.',
            ],
        ];

        foreach ($applicants as $applicant) {
            $user = User::firstOrCreate(
                ['email' => $applicant['email']],
                [
                    'uuid' => Str::uuid(),
                    'name' => $applicant['name'],
                    'email_verified_at' => now(),
                    'password' => Hash::make('partner123'),
                    'phone' => '+1 (555) 210-' . random_int(1000, 9999),
                    'is_admin' => false,
                    'username' => Str::slug($applicant['name'], '_'),
                    'company' => $applicant['company'],
                    'bio' => $applicant['bio'],
                    'status' => 'pending',
                    'is_premium' => false,
                    'admin_note' => 'Demo partner application awaiting admin approval.',
                    'is_partner' => true,
                    'is_buyer' => true,
                    'is_verified' => false,
                    'remember_token' => Str::random(10),
                ]
            );

            $user->roles()->detach();
        }
    }
}
