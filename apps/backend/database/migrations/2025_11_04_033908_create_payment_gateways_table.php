<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_gateways', function (Blueprint $table) {
            $table->id();
            $table->string('title', 100)->unique();
            $table->string('slug', 100)->unique()->comment('Used for programmatic mapping to service classes.');
            $table->string('class_name', 255)->comment('Fully Qualified Class Name (FQCN) for the integration.');
            
            $table->boolean('is_active')->default(false);
            $table->enum('mode', ['sandbox', 'live'])->default('sandbox');
            $table->unsignedSmallInteger('sort_order')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_gateways');
    }
};