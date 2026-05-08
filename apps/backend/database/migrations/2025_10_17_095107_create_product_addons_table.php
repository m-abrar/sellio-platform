<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateProductAddonsTable
 * Provisoning the supplementary pricing schema for the E-Commerce module,
 * supporting selectable product variations or cross-sells (e.g., gift wrapping, extended warranty).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_addons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            
            $table->string('title'); // Default 255
            $table->text('description')->nullable();
            $table->string('icon')->default('bi bi-plus-circle');
            
            // Increased precision for global currency support
            $table->decimal('price', 15, 2)->default(0.00);
            
            // Changed to string for easier extensibility
            $table->string('pricing_type', 30)->default('one_time')->comment('one_time, per_unit');
            
            $table->integer('max_qty')->default(1); 
            $table->boolean('is_required')->default(false);
            $table->boolean('is_popular')->default(false);
            $table->integer('sort_order')->default(0); 
            $table->boolean('is_published')->default(true); // Usually better to default to true for UX

            $table->timestamps();

            // Composite indexes for rapid frontend fetching
            $table->unique(['product_id', 'title']);
            $table->index(['product_id', 'is_published', 'sort_order'], 'addons_sorting_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_addons');
    }
};





