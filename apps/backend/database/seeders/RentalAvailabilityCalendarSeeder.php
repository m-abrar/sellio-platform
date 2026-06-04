<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\PropertyBooking;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class RentalAvailabilityCalendarSeeder extends Seeder
{
    public function run(): void
    {
        $property = Property::query()
            ->where('is_rental', true)
            ->where('is_published', true)
            ->orderByDesc('is_featured')
            ->orderBy('id')
            ->first();

        $user = User::query()->orderBy('id')->first();

        if (! $property || ! $user) {
            $this->command?->warn('Skipping RentalAvailabilityCalendarSeeder: requires one published rental property and one user.');

            return;
        }

        $marker = '[demo availability calendar]';

        $ranges = [
            [
                'check_in' => now()->addDays(12),
                'check_out' => now()->addDays(16),
                'status' => PropertyBooking::STATUS_CONFIRMED,
                'name' => 'Demo Confirmed Guest',
            ],
            [
                'check_in' => now()->addDays(23),
                'check_out' => now()->addDays(26),
                'status' => PropertyBooking::STATUS_PENDING,
                'name' => 'Demo Pending Guest',
            ],
            [
                'check_in' => now()->addDays(41),
                'check_out' => now()->addDays(45),
                'status' => PropertyBooking::STATUS_CONFIRMED,
                'name' => 'Demo Returning Guest',
            ],
        ];

        foreach ($ranges as $range) {
            $checkIn = Carbon::parse($range['check_in'])->toDateString();
            $checkOut = Carbon::parse($range['check_out'])->toDateString();
            $nights = max(1, Carbon::parse($checkIn)->diffInDays(Carbon::parse($checkOut)));

            PropertyBooking::query()->updateOrCreate(
                [
                    'property_id' => $property->id,
                    'check_in_date' => $checkIn,
                    'check_out_date' => $checkOut,
                ],
                [
                    'user_id' => $user->id,
                    'guests' => 2,
                    'full_name' => $range['name'],
                    'email' => 'demo-calendar@sellio.test',
                    'phone' => '+1 555 010 2026',
                    'message' => $marker,
                    'status' => $range['status'],
                    'total_price' => $nights * (float) ($property->price_per_night ?: 180),
                ]
            );
        }

        $this->command?->info("Seeded demo availability calendar bookings for property #{$property->id}.");
    }
}
