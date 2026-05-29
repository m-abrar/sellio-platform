<?php
// File: apps/backend/database/migrations/2026_05_29_140000_create_payout_methods_table.php

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
        Schema::create('payout_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('type', 50); // e.g. 'bank_transfer', 'paypal', 'stripe'
            $table->text('details'); // Encrypted JSON store containing account info
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
            
            $table->index(['user_id', 'is_primary']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payout_methods');
    }
};
