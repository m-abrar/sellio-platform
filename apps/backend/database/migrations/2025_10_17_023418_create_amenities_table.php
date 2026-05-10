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
            
            // --- Production Hardening & Audit Columns ---
            $table->string('status')->default('active')->index();
            $table->text('admin_note')->nullable();
            $table->boolean('is_premium')->default(false)->index();
            $table->string('color', 20)->nullable();
            
            // ADDED Boolean module columns
            $table->boolean('is_property')->default(false)->index();
            $table->boolean('is_event')->default(false)->index();
            $table->boolean('is_job')->default(false)->index();
            $table->boolean('is_auto')->default(false)->index();
            $table->boolean('is_service')->default(false)->index();
            $table->boolean('is_classified')->default(false)->index();
            
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('amenities');
    }
};





