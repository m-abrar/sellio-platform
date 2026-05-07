<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreatePropertyAddonsTable
 * Provisoning the supplementary pricing schema for the Real Estate module,
 * supporting selectable upsell items (e.g., airport pickup, cleaning) linked to reservations.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_addons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            
            $table->string('title', 100);
            $table->text('description')->nullable();
            $table->string('icon')->default('bi bi-stars'); // Store Bootstrap icon class
            
            $table->decimal('price', 8, 2);
            
            // Intellectual Logic Fields
            $table->enum('type', ['per_night', 'per_stay'])->default('per_stay');
            $table->integer('max_qty')->default(1); // Limit how many a user can buy
            $table->boolean('is_popular')->default(false);
            $table->integer('sort_order')->default(0); // For UI ordering
            
            $table->unique(['property_id', 'title']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_addons');
    }
};