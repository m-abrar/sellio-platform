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
            // 1. Drop existing FK and unique constraint
            // We must drop the FK first because it depends on the unique index in MySQL
            $table->dropForeign(['payment_gateway_id']);
            $table->dropUnique(['payment_gateway_id']);

            // 2. Add user_id to support partner-specific gateways (NULL = system global)
            $table->foreignId('user_id')->nullable()->after('payment_gateway_id')->constrained('users')->cascadeOnDelete();

            // 3. Re-add FK for payment_gateway_id and add composite unique constraint
            $table->foreign('payment_gateway_id')->references('id')->on('payment_gateways')->cascadeOnDelete();
            $table->unique(['payment_gateway_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gateway_credentials', function (Blueprint $table) {
            $table->dropForeign(['payment_gateway_id']);
            $table->dropUnique(['payment_gateway_id', 'user_id']);
            $table->dropConstrainedForeignId('user_id');
            $table->unique(['payment_gateway_id']);
            $table->foreign('payment_gateway_id')->references('id')->on('payment_gateways')->cascadeOnDelete();
        });
    }
};
