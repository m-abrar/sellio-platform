<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateAmenitiesTable
 * Provisoning the shared amenities dictionary, providing reusable features
 * (e.g., WiFi, Parking) across all applicable marketplace modules via polymorphic flags.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('amenities', function (Blueprint $table) {
            $table->id();
            $table->string('title')->unique();
            $table->string('slug')->unique();
            $table->string('icon')->nullable(); // e.g fa fa-wifi
            $table->text('description')->nullable();

            $table->boolean('is_published')->default(false);
            
            // ADDED Boolean module columns
            $table->boolean('is_property')->default(false);
            $table->boolean('is_event')->default(false);
            $table->boolean('is_job')->default(false);
            $table->boolean('is_auto')->default(false);
            $table->boolean('is_service')->default(false);
            $table->boolean('is_classified')->default(false);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('amenities');
    }
};