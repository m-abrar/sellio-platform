<?php

// database/migrations/..._create_property_fees_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreatePropertyFeesTable
 * Provisoning the supplemental fee schema for the Real Estate module,
 * supporting flat or percentage-based surcharges (e.g., cleaning fees, taxes) applied to bookings.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_fees', function (Blueprint $table) {
            $table->id();
            
            // 🔑 One-to-Many link: A fee belongs to one property
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            
            $table->string('title', 100); // e.g., "Cleaning Fee", "Sales Tax"
            
            // --- Fields for Flat Fees ---
            $table->decimal('amount', 15, 2)->nullable(); 
            $table->string('type', 30)->nullable()->comment('refundable, non_refundable'); 
            
            // --- Fields for Percentage Fees ---
            $table->decimal('rate', 15, 4)->nullable()->comment('The percentage rate (e.g., 0.0500 for 5%)');
            
            $table->string('charge_type', 20)->default('flat')->index(); 
            $table->boolean('is_active')->default(true)->index();
            
            // Ensures a property only has one fee entry with a specific title
            $table->unique(['property_id', 'title']); 

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_fees');
    }
};