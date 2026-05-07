<?php
// database/migrations/..._create_amenity_property_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateAmenityPropertyTable
 * Provisoning the Many-to-Many pivot schema for the Real Estate module,
 * establishing strict composite key linkages between properties and shared amenities.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('amenity_property', function (Blueprint $table) {
            // A pivot table uses foreign keys to link two tables.
            
            // 1. Foreign key to the 'amenities' table
            $table->foreignId('amenity_id')
                  ->constrained() // Assumes a standard 'amenities' table
                  ->cascadeOnDelete();

            // 2. Foreign key to the 'properties' table
            $table->foreignId('property_id')
                  ->constrained() // Assumes a standard 'properties' table
                  ->cascadeOnDelete();

            // 3. Define the composite primary key
            // This ensures that an amenity can only be attached to a property once.
            $table->primary(['amenity_id', 'property_id']);
            
            // NOTE: Primary keys on pivot tables typically do not need $table->id() or $table->timestamps() 
            // unless you track specific data on the relationship itself. We'll include timestamps 
            // for tracking when the relationship was created, but remove the unnecessary $table->id().
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('amenity_property');
    }
};