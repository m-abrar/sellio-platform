<?php

namespace Database\Seeders;

use App\Models\Campaign;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * Class CampaignSeeder
 *
 * Seeds the campaigns table with sample promotional, flash-sale, and operational
 * calendar events for testing the admin campaign management dashboard.
 */
class CampaignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Campaign::create([
            'title' => 'Summer Sale Launch',
            'description' => 'Annual summer promotion with up to 50% off on selected items.',
            'start_date' => now()->startOfMonth()->addDays(4),
            'end_date' => now()->startOfMonth()->addDays(12),
            'type' => 'promotion',
            'color' => '#FF3366',
            'status' => 'active',
            'admin_note' => 'Primary seasonal promotion.',
            'is_active' => true,
        ]);

        Campaign::create([
            'title' => 'Flash Sale: Tech Monday',
            'description' => '24-hour flash sale on electronics.',
            'start_date' => now()->startOfMonth()->addDays(15)->setHour(9)->setMinute(0),
            'end_date' => now()->startOfMonth()->addDays(15)->setHour(21)->setMinute(0),
            'type' => 'flash_sale',
            'color' => '#ff6a00',
            'status' => 'active',
            'admin_note' => 'High-intensity engagement campaign.',
            'is_active' => true,
        ]);

        Campaign::create([
            'title' => 'Inventory Audit',
            'description' => 'System-wide inventory check and synchronization.',
            'start_date' => now()->startOfMonth()->addDays(22)->setHour(8)->setMinute(0),
            'end_date' => now()->startOfMonth()->addDays(22)->setHour(18)->setMinute(0),
            'type' => 'operation',
            'color' => '#6c757d',
            'status' => 'active',
            'admin_note' => 'Internal maintenance task.',
            'is_active' => true,
        ]);

        Campaign::create([
            'title' => 'Mid-Season Clearance',
            'description' => 'Stock clearance for incoming new arrivals.',
            'start_date' => now()->addMonth()->startOfMonth()->addDays(1),
            'end_date' => now()->addMonth()->startOfMonth()->addDays(15),
            'type' => 'promotion',
            'color' => '#46a5ac',
            'status' => 'active',
            'admin_note' => 'Future scheduled clearance.',
            'is_active' => true,
        ]);
    }
}
