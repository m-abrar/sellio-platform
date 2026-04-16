<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * The table uses json columns for dynamic, array-based targeting fields.
     */
    public function up(): void
    {
        Schema::create('advertisements', function (Blueprint $table) {
            // Primary Key
            $table->id();

            // Core Advertisement Data
            $table->string('title')->nullable();
            $table->string('image_path')->nullable();
            $table->string('link')->nullable();
            $table->boolean('status')->default(1); // 0 or 1

            // Targeting based on placement/device (JSON column)
            // Stored as an array of strings (e.g., ["header", "footer", "sidebar"])
            $table->json('orientations')->nullable(); 

            // Geo-Targeting (Radius)
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->integer('radius')->nullable()->comment('Radius in kilometers');

            // Geo-Targeting (Specific Regions - JSON columns)
            // Stored as arrays of strings (e.g., ["Sialkot", "Lahore"])
            $table->json('cities')->nullable();
            $table->json('zipcodes')->nullable();
            $table->json('regions')->nullable();

            // Timestamps
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('advertisements');
    }
};