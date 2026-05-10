<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateBrandsTable
 * Provisoning the brand taxonomy schema, supporting SEO metadata
 * and module-specific filtering for cross-vertical product mapping.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('brands', function (Blueprint $table) {
            $table->id();

            // Basic Information
            $table->string('title', 100);
            $table->string('slug', 100)->unique();
            $table->text('description')->nullable();

            // SEO Fields
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();

            // Module Flags (You might want to associate brands with certain modules)
            // Keeping them for consistency, though you may remove them if not needed for brands
            $table->boolean('is_property')->default(false)->index();
            $table->boolean('is_event')->default(false)->index();
            $table->boolean('is_job')->default(false)->index();
            $table->boolean('is_auto')->default(false)->index();
            $table->boolean('is_service')->default(false)->index();
            $table->boolean('is_classified')->default(false)->index();
            $table->boolean('is_product')->default(false)->index();
            $table->boolean('is_blog')->default(false)->index();

            // Publishing Status
            $table->boolean('is_published')->default(true);

            // Timestamps
            $table->string('status')->default('active')->index();
            $table->text('admin_note')->nullable();
            $table->boolean('is_premium')->default(false)->index();
            $table->string('color', 20)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('brands');
    }
};







