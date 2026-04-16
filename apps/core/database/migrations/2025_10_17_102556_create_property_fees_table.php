<?php

// database/migrations/..._create_property_fees_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

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
            $table->decimal('amount', 8, 2)->nullable(); // The dollar amount (e.g., 100.00)
            $table->enum('type', ['refundable', 'non_refundable'])->nullable(); // e.g., 'refundable' for deposit
            
            // --- Fields for Percentage Fees ---
            $table->decimal('rate', 4, 3)->nullable(); // The percentage rate (e.g., 0.050 for 5%)
            
            // Discriminator field: 'flat' uses amount/type, 'percentage' uses rate
            $table->enum('charge_type', ['flat', 'percentage'])->default('flat'); 
            
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