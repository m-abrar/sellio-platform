<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateSubscriptionsTable
 * Provisoning the tenant subscription schema, managing active vendor plans,
 * billing cycles, and status tracking (active, past due, expired) across the platform.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            $table->foreignId('plan_id')->constrained()->onDelete('restrict');
            
            $table->string('title')->default('default'); // Used to identify multiple subscriptions per user
            
            $table->enum('status', ['active', 'on_trial', 'past_due', 'cancelled', 'expired'])->default('active');
            
            $table->timestamp('starts_at');
            $table->timestamp('ends_at')->nullable(); // Null for lifetime plans
            
            // The user should generally only have one active subscription of a certain 'title'
            $table->unique(['user_id', 'title']); 

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};