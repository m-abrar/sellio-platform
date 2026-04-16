<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $modules = [
            'products',
            'properties',
            'autos',
            'events',
            'jobs',
            'services',
            'classifieds',
        ];

        foreach ($modules as $module) {
            \App\Models\Setting::updateOrCreate(
                ['key' => 'is_section.' . $module],
                ['value' => '1']
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $modules = [
            'products',
            'properties',
            'autos',
            'events',
            'jobs',
            'services',
            'classifieds',
        ];

        foreach ($modules as $module) {
            \App\Models\Setting::where('key', 'is_section.' . $module)->delete();
        }
    }
};
