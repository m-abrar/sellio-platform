<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreatePropertyScoresTable
 * Provisoning the analytical rating schema for the Real Estate module,
 * storing third-party-sourced scores (Walk Score, School Ratings) per property.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_scores', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            
            $table->string('title', 100); // e.g., "Walk Score", "School Rating", "Crime Index"
            $table->text('description')->nullable(); // Context or source for the score
            
            $table->decimal('score', 4, 2); // The actual score (e.g., 8.50 or 85.00)
            $table->string('units', 20)->nullable(); // e.g., "/10", "/100", "A+"
            
            // Constraint to prevent adding the same titled score twice on one property
            $table->unique(['property_id', 'title']);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_scores');
    }
};





