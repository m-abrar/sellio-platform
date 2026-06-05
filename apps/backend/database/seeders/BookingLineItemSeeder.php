<?php

namespace Database\Seeders;

use App\Models\PropertyBooking;
use App\Services\PropertyService;
use Illuminate\Database\Seeder;

class BookingLineItemSeeder extends Seeder
{
    public function run(): void
    {
        $propertyService = app(PropertyService::class);
        $created = 0;

        PropertyBooking::doesntHave('lineItems')
            ->with(['property.fees', 'property.prices'])
            ->orderBy('id')
            ->chunkById(50, function ($bookings) use ($propertyService, &$created) {
                foreach ($bookings as $booking) {
                    if (!$booking->property || !$booking->check_in_date || !$booking->check_out_date) {
                        continue;
                    }

                    $breakdown = $propertyService->calculateBookingBreakdown(
                        $booking->property,
                        $booking->check_in_date->toDateString(),
                        $booking->check_out_date->toDateString(),
                        (int) $booking->guests
                    );

                    $lineItems = collect($breakdown['lines'])
                        ->map(fn(array $line) => [
                            'title' => $line['title'],
                            'quantity' => 1,
                            'price' => round((float) $line['amount'], 2),
                        ])
                        ->all();

                    if ($lineItems === []) {
                        continue;
                    }

                    $booking->lineItems()->createMany($lineItems);
                    $booking->forceFill(['total_price' => $breakdown['initial_total']])->save();
                    $created += count($lineItems);
                }
            });

        $coveredBookings = PropertyBooking::has('lineItems')->count();

        $this->command?->info("Booking line items backfilled: {$created} new rows.");
        $this->command?->info("Booking line items now cover {$coveredBookings} of " . PropertyBooking::count() . ' property bookings.');
    }
}
