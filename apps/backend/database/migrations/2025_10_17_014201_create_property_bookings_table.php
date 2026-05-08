<?php
// database/migrations/..._create_property_bookings_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreatePropertyBookingsTable
 * Provisoning the reservation schema for the Real Estate module,
 * capturing check-in/out dates, guest counts, and preventing overlapping bookings.
 */
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
            $table->integer('guests')->default(1);
            $table->decimal('total_price', 15, 2);
            $table->string('status', 30)->default('confirmed')->index();
            $table->string('payment_status', 20)->default('unpaid')->index();
            $table->string('transaction_id')->nullable()->index();
            $table->text('notes')->nullable();


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





