<?php

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
        Schema::create('property_visits', function (Blueprint $table) {
            $table->id();
            
            // Foreign Keys
            // user_id is nullable to allow for guest bookings
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            
            // Visitor Contact Information (required for all bookings, even guests)
            $table->string('full_name', 255)->nullable();
            $table->string('email', 255)->nullable();
            $table->string('phone', 50)->nullable();

            // Visit Details
            $table->dateTime('scheduled_at');
            $table->string('status', 50)->default('pending')->comment('pending, confirmed, cancelled, completed');
            $table->text('notes')->nullable();
            $table->timestamp('viewed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_visits');
    }
};