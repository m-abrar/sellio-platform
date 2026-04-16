<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaction_lines', function (Blueprint $table) {
            $table->id();
            
            // 🔑 Mandatory link: Every line item belongs to a property
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            
            // 🔑 Optional link: The line item may belong to a specific booking (Revenue/Booking Expense)
            // It is nullable for general property expenses (e.g., annual insurance)
            $table->foreignId('property_booking_id')
                  ->nullable()
                  ->constrained()
                  ->onDelete('set null'); // If booking is deleted, the transaction remains but the link is cleared
            
            $table->string('description', 255);
            $table->decimal('amount', 10, 2); 
            
            // Type field to distinguish between revenue (income) and expense (cost)
            $table->enum('type', ['revenue', 'expense']); 
            
            $table->date('transaction_date');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaction_lines');
    }
};