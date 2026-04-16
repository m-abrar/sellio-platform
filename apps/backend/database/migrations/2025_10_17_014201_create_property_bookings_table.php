<?php
// database/migrations/..._create_property_bookings_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            
            $table->string('full_name');
            $table->string('phone');
            $table->string('email');
            $table->text('message')->nullable();

            $table->date('check_in_date');
            $table->date('check_out_date');
            $table->integer('guests');
            $table->decimal('total_price', 10, 2);
            $table->string('status', 50)->default('confirmed');


            // Ensure no overlapping bookings for the same property

            $table->unique(
                ['property_id', 'check_in_date', 'check_out_date'], 
                'prop_booking_dates_unique'
            );

            $table->timestamp('viewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_bookings');
    }
};