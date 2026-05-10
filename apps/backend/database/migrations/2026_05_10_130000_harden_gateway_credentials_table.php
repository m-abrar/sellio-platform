<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Hardens the gateway credentials table to support multi-tenant partner gateways.
     */
    public function up(): void
    {
        Schema::table('gateway_credentials', function (Blueprint $table) {
            // 1. Drop existing unique constraint if it exists (it was defined as unique() on foreignId)
            // The name of the index is typically gateway_credentials_payment_gateway_id_unique
            $table->dropUnique(['payment_gateway_id']);

            // 2. Add user_id to support partner-specific gateways (NULL = system global)
            $table->foreignId('user_id')->nullable()->after('payment_gateway_id')->constrained('users')->cascadeOnDelete();

            // 3. Add composite unique constraint to prevent duplicate gateways per user
            $table->unique(['payment_gateway_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gateway_credentials', function (Blueprint $table) {
            $table->dropUnique(['payment_gateway_id', 'user_id']);
            $table->dropConstrainedForeignId('user_id');
            $table->unique(['payment_gateway_id']);
        });
    }
};
