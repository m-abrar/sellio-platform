<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\PropertyBooking;
use App\Models\TransactionLine;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

/**
 * Seeds property-level financial ledger rows.
 *
 * The seeder is intentionally backfill-friendly: it only creates rows for
 * properties that do not already have transaction lines, so it can repair an
 * existing demo database without wiping booking history.
 */
class TransactionLineSeeder extends Seeder
{
    public function run(): void
    {
        $this->command?->info('Starting Transaction Line Seeder...');

        $createdCount = 0;

        Property::doesntHave('transactionLines')
            ->orderBy('id')
            ->chunkById(25, function ($properties) use (&$createdCount) {
                $batchLines = [];

                foreach ($properties as $property) {
                    $propertyBookings = PropertyBooking::where('property_id', $property->id)->get();

                    foreach (range(1, mt_rand(5, 15)) as $unused) {
                        $bookingId = null;

                        if ($propertyBookings->isNotEmpty() && mt_rand(1, 10) <= 7) {
                            $bookingId = $propertyBookings->random()->id;
                        }

                        $lineData = TransactionLine::factory()->make([
                            'property_id' => $property->id,
                            'property_booking_id' => $bookingId,
                        ])->toArray();

                        $lineData['transaction_date'] = Carbon::parse($lineData['transaction_date'])->format('Y-m-d');
                        $lineData['created_at'] = now()->toDateTimeString();
                        $lineData['updated_at'] = now()->toDateTimeString();

                        $batchLines[] = $lineData;
                        $createdCount++;
                    }
                }

                if ($batchLines !== []) {
                    TransactionLine::insert($batchLines);
                }
            });

        $totalCount = TransactionLine::count();
        $coveredProperties = TransactionLine::distinct('property_id')->count('property_id');

        $this->command?->info("  Created {$createdCount} new transaction line items.");
        $this->command?->info("  {$totalCount} total transaction line items now cover {$coveredProperties} of " . Property::count() . ' properties.');
        $this->command?->info('--- Transaction Line Seeding Complete ---');
    }
}
