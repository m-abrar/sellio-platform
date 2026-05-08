<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateGatewayFieldBlueprintsTable
 * Provisoning the dynamic form schema for payment gateways,
 * allowing each integration to declaratively define its required configuration fields.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gateway_field_blueprints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_gateway_id')->constrained('payment_gateways')->cascadeOnDelete();

            $table->string('key', 100)->comment('The programmatic key expected by the service class.');
            $table->string('label', 100);
            $table->enum('input_type', ['text', 'password', 'textarea', 'checkbox', 'select']);
            
            $table->boolean('is_required')->default(false);
            $table->boolean('is_sensitive')->default(false)->comment('Mask value in UI/logs if true.');
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            
            // Ensures a gateway cannot have two fields with the same key
            $table->unique(['payment_gateway_id', 'key']);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gateway_field_blueprints');
    }
};





