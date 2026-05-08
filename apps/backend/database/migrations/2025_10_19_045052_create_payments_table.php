<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreatePaymentsTable
 * Provisoning the centralized payment processing schema, linking polymorphic
 * transactions (subscriptions, bookings, product orders) to their gateway records.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            // Link to the user who made the payment
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Amount details
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('USD'); // e.g., USD, EUR, PKR

            // Transaction Details
            $table->string('transaction_id')->unique()->nullable()->comment('Stripe, PayPal, etc. reference ID');
            $table->string('payment_method')->nullable()->index()->comment('e.g., credit_card, paypal, wallet');

            // Status tracking
            $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('pending')->index();
            $table->timestamp('paid_at')->nullable();

            // Link the payment to what was purchased (Polymorphic Relation)
            // This allows a payment to be for a 'Subscription', 'Booking', 'Ticket', etc.
            $table->nullableMorphs('payable'); 
            $table->text('admin_note')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};





