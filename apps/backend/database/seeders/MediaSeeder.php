<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

/**
 * Class MediaSeeder
 *
 * This is a proxy seeder that delegates to MediaFullSeeder for optimized, 
 * production-ready media generation.
 */
class MediaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🚀 Delegating to MediaFullSeeder for optimized attachment processing...');
        
        $this->call(MediaFullSeeder::class);
    }
}