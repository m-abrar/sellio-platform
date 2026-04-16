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
        Schema::create('locations', function (Blueprint $table) {
            $table->id();

            // Core Information
            $table->string('title', 100);
            $table->string('slug', 100);
            $table->text('description')->nullable();
            
            // Geographical Data
            // Precision for Latitude (max 90.00000000)
            $table->decimal('latitude', 10, 8)->nullable();
            // Precision for Longitude (max 180.00000000)
            $table->decimal('longitude', 11, 8)->nullable();

            // Address Components
            $table->string('state', 100)->nullable();
            $table->string('zip_code', 20)->nullable();
            $table->string('country', 100)->nullable();

            // SEO Fields
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();

            // Module Flags (Indicate which modules this location is relevant to)
            $table->boolean('is_property')->default(false);
            $table->boolean('is_event')->default(false);
            $table->boolean('is_job')->default(false);
            $table->boolean('is_auto')->default(false);
            $table->boolean('is_service')->default(false);
            $table->boolean('is_classified')->default(false);
            $table->boolean('is_product')->default(false);
            $table->boolean('is_blog')->default(false);

            // Publishing Status
            $table->boolean('is_featured')->default(true);
            $table->boolean('is_published')->default(true);

            // Timestamps
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};