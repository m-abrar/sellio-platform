<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateWithdrawalTable
 * Provisoning the payout request schema for the Finance module,
 * tracking vendor withdrawal amounts, methods, and admin approval workflows.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('withdrawals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('restrict');
            $table->decimal('amount', 15, 2);
            $table->string('method')->nullable(); // e.g., PayPal, Bank
            $table->string('details')->nullable(); // JSON or text for account info
            $table->string('status', 30)->default('pending')->index();
            $table->text('admin_note')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('withdrawals');
    }
};






