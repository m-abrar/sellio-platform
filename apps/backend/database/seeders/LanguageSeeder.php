<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Language::updateOrCreate(
            ['code' => 'en'],
            [
                'name' => 'English',
                'is_default' => true,
                'is_active' => true,
                'flag_icon' => 'us'
            ]
        );
    }
}
