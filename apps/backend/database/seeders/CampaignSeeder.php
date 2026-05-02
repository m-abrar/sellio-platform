<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CampaignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Campaign::create([
            'title' => 'Summer Sale Launch',
            'description' => 'Annual summer promotion with up to 50% off on selected items.',
            'start_date' => now()->startOfMonth()->addDays(4),
            'end_date' => now()->startOfMonth()->addDays(12),
            'type' => 'promotion',
            'color' => '#FF3366',
            'is_active' => true,
        ]);

        \App\Models\Campaign::create([
            'title' => 'Flash Sale: Tech Monday',
            'description' => '24-hour flash sale on electronics.',
            'start_date' => now()->startOfMonth()->addDays(15)->setHour(9)->setMinute(0),
            'end_date' => now()->startOfMonth()->addDays(15)->setHour(21)->setMinute(0),
            'type' => 'flash_sale',
            'color' => '#ff6a00',
            'is_active' => true,
        ]);

        \App\Models\Campaign::create([
            'title' => 'Inventory Audit',
            'description' => 'System-wide inventory check and synchronization.',
            'start_date' => now()->startOfMonth()->addDays(22)->setHour(8)->setMinute(0),
            'end_date' => now()->startOfMonth()->addDays(22)->setHour(18)->setMinute(0),
            'type' => 'operation',
            'color' => '#6c757d',
            'is_active' => true,
        ]);

        \App\Models\Campaign::create([
            'title' => 'Mid-Season Clearance',
            'description' => 'Stock clearance for incoming new arrivals.',
            'start_date' => now()->addMonth()->startOfMonth()->addDays(1),
            'end_date' => now()->addMonth()->startOfMonth()->addDays(15),
            'type' => 'promotion',
            'color' => '#46a5ac',
            'is_active' => true,
        ]);
    }
}
