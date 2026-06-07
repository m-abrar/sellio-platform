<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PendingPartnerApplicationSeeder extends Seeder
{
    /**
     * Create partner applicants awaiting admin approval (is_partner=true, no partner role).
     */
    public function run(): void
    {
        $this->command?->info('📝 Seeding pending partner applications...');

        $applicants = [
            [
                'name' => 'Maya Hartwell',
                'email' => 'partner.applicant1@sellio-platform.test',
                'username' => 'maya_hartwell',
                'company' => 'Hartwell Living Group',
                'phone' => '+1 (555) 210-4401',
                'years_of_experience' => '12',
                'bio' => 'Luxury short-term rental operator with 40+ managed homes across coastal markets. Requesting partner access to publish curated vacation inventory and concierge add-ons.',
            ],
            [
                'name' => 'Omar Whitestone',
                'email' => 'partner.applicant2@sellio-platform.test',
                'username' => 'omar_whitestone',
                'company' => 'Whitestone Motors',
                'phone' => '+1 (555) 210-4402',
                'years_of_experience' => '9',
                'bio' => 'Certified pre-owned automotive dealer expanding into digital lead capture. Ready to list premium sedans, EVs, and trade-in appraisals after marketplace approval.',
            ],
            [
                'name' => 'Priya Nandakumar',
                'email' => 'partner.applicant3@sellio-platform.test',
                'username' => 'priya_nandakumar',
                'company' => 'Pulse Events Collective',
                'phone' => '+1 (555) 210-4403',
                'years_of_experience' => '7',
                'bio' => 'Independent event producer specializing in ticketed conferences and creator workshops. Applying for partner access to sell multi-tier passes and VIP experiences.',
            ],
        ];

        foreach ($applicants as $applicant) {
            $user = User::updateOrCreate(
                ['email' => $applicant['email']],
                [
                    'name' => $applicant['name'],
                    'email_verified_at' => now(),
                    'password' => Hash::make('partner123'),
                    'phone' => $applicant['phone'],
                    'is_admin' => false,
                    'username' => $applicant['username'],
                    'company' => $applicant['company'],
                    'bio' => $applicant['bio'],
                    'years_of_experience' => $applicant['years_of_experience'],
                    'status' => 'pending',
                    'is_premium' => false,
                    'admin_note' => 'Demo partner application awaiting admin approval.',
                    'is_partner' => true,
                    'is_buyer' => true,
                    'is_verified' => false,
                    'remember_token' => Str::random(10),
                ]
            );

            $user->syncRoles(['user']);
        }

        $pendingCount = User::where('is_partner', true)
            ->whereDoesntHave('roles', fn ($query) => $query->where('name', 'partner'))
            ->count();

        $this->command?->info("  - {$pendingCount} pending partner application(s) ready for admin review.");
    }
}
