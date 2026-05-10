<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateLocationsTable
 * Provisoning the geographical taxonomy schema, supporting nested locations,
 * high-precision coordinate tracking, and module-specific geographic filtering.
 */
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
            $table->string('slug', 100)->unique();
            $table->text('description')->nullable();
            
            // Hierarchical Relationship (Self-Referencing)
            $table->foreignId('parent_id')
                  ->nullable()
                  ->constrained('locations')
                  ->restrictOnDelete();
            
            $table->unsignedTinyInteger('level')->default(1)->comment('1: Country, 2: State, 3: City, 4: Area');
            
            // Geographical Data
            // Precision for Latitude (max 90.00000000)
            $table->decimal('latitude', 10, 8)->nullable()->index();
            // Precision for Longitude (max 180.00000000)
            $table->decimal('longitude', 11, 8)->nullable()->index();

            // Address Components
            $table->string('state', 100)->nullable();
            $table->string('zip_code', 20)->nullable();
            $table->string('country', 100)->nullable();

            // SEO Fields
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();

            // Module Flags (Indicate which modules this location is relevant to)
            $table->boolean('is_property')->default(false)->index();
            $table->boolean('is_event')->default(false)->index();
            $table->boolean('is_job')->default(false)->index();
            $table->boolean('is_auto')->default(false)->index();
            $table->boolean('is_service')->default(false)->index();
            $table->boolean('is_classified')->default(false)->index();
            $table->boolean('is_product')->default(false)->index();
            $table->boolean('is_blog')->default(false)->index();

            // Publishing Status
            $table->boolean('is_featured')->default(true)->index();
            $table->boolean('is_published')->default(true)->index();

            // Timestamps
            // --- Production Hardening & Audit Columns ---
            $table->string('status')->default('active')->index();
            $table->text('admin_note')->nullable();
            $table->boolean('is_premium')->default(false)->index();
            $table->string('color', 20)->nullable();

            $table->softDeletes();
            $table->timestamps();
            
            // Indeces for performance
            $table->index('parent_id');
            $table->index('level');
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





