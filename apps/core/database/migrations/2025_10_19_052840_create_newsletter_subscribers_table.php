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
        Schema::create('newsletter_subscribers', function (Blueprint $table) {
            $table->id();
            
            // The email address of the subscriber
            $table->string('email')->unique();
            
            // Track if the subscription is confirmed (for double opt-in)
            $table->boolean('is_confirmed')->default(false); 
            
            // Track the source (e.g., 'footer', 'popup', 'checkout')
            $table->string('source')->nullable(); 

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('newsletter_subscribers');
    }
};