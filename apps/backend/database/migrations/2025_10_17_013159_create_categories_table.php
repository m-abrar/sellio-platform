<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateCategoriesTable
 * Provisoning the polymorphic taxonomy schema, supporting nested hierarchies,
 * SEO metadata, and module-specific filtering for the marketplace entities.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();

            // Hierarchy 
            $table->foreignId('parent_id')
                ->nullable()
                ->constrained('categories')
                ->nullOnDelete(); // If a parent is deleted, children become top-level

            // Basic Information
            $table->string('title', 100);
            $table->string('slug', 100)->unique();
            $table->string('icon')->nullable();
            $table->text('description')->nullable();

            // SEO Fields
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();

            // Module Flags
            $table->boolean('is_property')->default(false);
            $table->boolean('is_event')->default(false);
            $table->boolean('is_job')->default(false);
            $table->boolean('is_auto')->default(false);
            $table->boolean('is_service')->default(false);
            $table->boolean('is_classified')->default(false);
            $table->boolean('is_product')->default(false);
            $table->boolean('is_blog')->default(false);

            // Publishing Status
            $table->boolean('is_published')->default(true);

            $table->string('status')->default('active')->index();
            $table->text('admin_note')->nullable();
            $table->boolean('is_premium')->default(false)->index();
            $table->string('color', 20)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};







