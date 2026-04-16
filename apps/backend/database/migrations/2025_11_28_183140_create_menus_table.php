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
        // This table defines the menu 'location' (slot) within a specific theme.
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->string('theme_key'); // e.g., 'default-theme'
            $table->string('location_key')->index(); // e.g., 'main_header'
            $table->string('title'); // Human-readable title for the admin area
            $table->timestamps();
            
            // Ensures only one record exists for a given theme and location key
            $table->unique(['theme_key', 'location_key']); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};