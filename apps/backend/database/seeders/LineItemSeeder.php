<?php

namespace Database\Seeders;

use App\Models\LineItem;
use Illuminate\Database\Seeder;

class LineItemSeeder extends Seeder
{
    public function run(): void
    {
        $legacyDamageTemplate = LineItem::where('title', 'Damage Protection Advance')->first();
        $currentDamageTemplate = LineItem::where('title', 'Damage Surety Advance')->first();

        if ($legacyDamageTemplate && !$currentDamageTemplate) {
            $legacyDamageTemplate->update(['title' => 'Damage Surety Advance']);
        } elseif ($legacyDamageTemplate && $currentDamageTemplate) {
            $legacyDamageTemplate->delete();
        }

        $templates = [
            [
                'title' => 'Cleaning Fee',
                'description' => 'Standard post-stay cleaning charge for rental bookings.',
                'type' => 'fixed',
                'amount' => 95.00,
                'applies_on' => 'booking',
                'order' => 10,
                'status' => 'active',
            ],
            [
                'title' => 'Security Deposit',
                'description' => 'Refundable surety deposit held against property damage.',
                'type' => 'fixed',
                'amount' => 250.00,
                'applies_on' => 'booking',
                'order' => 20,
                'status' => 'active',
            ],
            [
                'title' => 'Damage Surety Advance',
                'description' => 'Refundable surety advance held against accidental property damage.',
                'type' => 'fixed',
                'amount' => 75.00,
                'applies_on' => 'booking',
                'order' => 30,
                'status' => 'active',
            ],
            [
                'title' => 'Sales Tax',
                'description' => 'Percentage tax template applied to booking subtotal.',
                'type' => 'percentage',
                'amount' => 5.00,
                'applies_on' => 'booking',
                'order' => 40,
                'status' => 'active',
            ],
            [
                'title' => 'City Lodging Tax',
                'description' => 'Local lodging tax template applied to rental stays.',
                'type' => 'percentage',
                'amount' => 3.50,
                'applies_on' => 'booking',
                'order' => 50,
                'status' => 'active',
            ],
            [
                'title' => 'Service & Amenity Fee',
                'description' => 'Marketplace service and amenity support fee.',
                'type' => 'percentage',
                'amount' => 1.50,
                'applies_on' => 'booking',
                'order' => 60,
                'status' => 'active',
            ],
        ];

        foreach ($templates as $template) {
            LineItem::updateOrCreate(
                ['title' => $template['title']],
                $template
            );
        }

        $this->command?->info('Line item templates seeded.');
    }
}
