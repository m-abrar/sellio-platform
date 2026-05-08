<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateNeighborhoodsTable
 * Provisoning the points-of-interest schema for the Real Estate module,
 * cataloging walkability data like transit, schools, and amenities per property.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_neighborhoods', function (Blueprint $table) {
            $table->id();

            $table->foreignId('property_id')->constrained()->onDelete('cascade');

            $table->string('title', 100); // e.g., "Subway Station", "City Park"
            
            // NEW: Column to hold the Bootstrap Icon class title for easy display
            $table->string('icon_class', 50)->nullable(); // e.g., "bi-train-front"

            // NEW: Column to explicitly categorize the point of interest
            $table->enum('category', ['Commute', 'Essential', 'Recreation', 'School', 'Other'])->default('Essential');

            // Existing column to show distance in a standardized unit
            $table->float('distance_value')->nullable(); 
            
            // NEW: Column for the unit of the distance value (e.g., 'mi', 'blocks', 'min drive')
            $table->string('distance_unit', 20)->nullable(); 
            
            // Deprecated/Replaced: The original text description is now often covered by title/distance_unit
            $table->text('description')->nullable(); 
            
            // Constraint to prevent adding the same titled feature twice on one property
            $table->unique(['property_id', 'title']);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_neighborhoods');
    }
};





