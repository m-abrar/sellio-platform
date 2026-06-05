<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\PropertyFee;
use Illuminate\Database\Seeder;

class PropertyFeeSeeder extends Seeder
{
    private array $feeDefinitions = [
        [
            'title' => 'Cleaning Fee',
            'amount' => 95.00,
            'type' => 'non_refundable',
            'rate' => null,
            'charge_type' => 'flat',
        ],
        [
            'title' => 'Security Deposit',
            'amount' => 250.00,
            'type' => 'refundable',
            'rate' => null,
            'charge_type' => 'flat',
        ],
        [
            'title' => 'Damage Surety Advance',
            'amount' => 75.00,
            'type' => 'refundable',
            'rate' => null,
            'charge_type' => 'flat',
        ],
        [
            'title' => 'Sales Tax',
            'amount' => null,
            'type' => 'non_refundable',
            'rate' => 0.0500,
            'charge_type' => 'percentage',
        ],
        [
            'title' => 'City Lodging Tax',
            'amount' => null,
            'type' => 'non_refundable',
            'rate' => 0.0350,
            'charge_type' => 'percentage',
        ],
        [
            'title' => 'Service & Amenity Fee',
            'amount' => null,
            'type' => 'non_refundable',
            'rate' => 0.0150,
            'charge_type' => 'percentage',
        ],
    ];

    public function run(): void
    {
        $created = 0;

        Property::orderBy('id')->chunkById(50, function ($properties) use (&$created) {
            foreach ($properties as $property) {
                foreach ($this->feeDefinitions as $fee) {
                    $record = PropertyFee::updateOrCreate(
                        [
                            'property_id' => $property->id,
                            'title' => $fee['title'],
                        ],
                        $fee
                    );

                    if ($record->wasRecentlyCreated) {
                        $created++;
                    }
                }
            }
        });

        $coveredProperties = PropertyFee::distinct('property_id')->count('property_id');

        $this->command?->info("Property fees backfilled: {$created} new rows.");
        $this->command?->info("Property fees now cover {$coveredProperties} of " . Property::count() . ' properties.');
    }
}
