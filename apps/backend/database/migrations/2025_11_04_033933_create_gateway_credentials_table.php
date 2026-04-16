<?php

// database/migrations/xxxx_xx_xx_xxxxxx_create_gateway_credentials_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gateway_credentials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_gateway_id')->unique()->constrained('payment_gateways')->cascadeOnDelete();

            // FIX: Change 'json' to 'text' or 'longText'.
            // The data is now an encrypted string, not readable JSON.
            $table->longText('live_config')->nullable(); 
            $table->longText('sandbox_config')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gateway_credentials');
    }
};