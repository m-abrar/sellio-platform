<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('service_packages', function (Blueprint $table) {
            $table->id();
            // Link to the main service
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            
            // Package Details
            $table->string('title'); // e.g., 'Gold Plan', 'Maintenance Starter'
            $table->string('slug')->nullable(); 
            $table->text('description')->nullable();
            
            // Pricing
            $table->decimal('price', 15, 2);
            $table->string('billing_period')->default('one-time'); // e.g., 'monthly', 'yearly', 'hourly'
            
            // Features & Limits
            $table->json('features')->nullable(); // Store an array of strings for list items
            $table->integer('sort_order')->default(0); // To control which shows first (Basic vs Premium)
            
            // Status
            $table->boolean('is_active')->default(true);
            $table->boolean('is_popular')->default(false); // For "Best Value" badges
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_packages');
    }
};