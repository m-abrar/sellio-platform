<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateSettingsTable
 * Provisoning the global key-value store for platform configurations,
 * managing system-wide variables like site name, currency, and API keys.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Creates the 'settings' table.
        // This table is designed to store key-value configuration settings for the application.
        Schema::create('settings', function (Blueprint $table) {
            $table->id(); // bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, Primary Key
            $table->string('group')->default('general')->index(); 
            $table->string('key')->unique(); 
            $table->text('value')->nullable(); // text DEFAULT NULL
            $table->timestamps(); // created_at timestamp NULL DEFAULT NULL, updated_at timestamp NULL DEFAULT NULL
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drops the 'settings' table if the migration is rolled back.
        Schema::dropIfExists('settings');
    }
};





