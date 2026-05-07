<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateTicketsTable
 * Provisoning the support ticket schema for the Helpdesk module,
 * managing user-reported issues with priority, category, and admin assignment tracking.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            
            $table->string('status', 30)->default('open')->index();
            $table->string('priority', 20)->default('low')->index();
            $table->string('category', 50)->nullable()->index()->comment('e.g. Technical, Billing, General');
            
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null')->comment('Admin ID');
            
            $table->timestamp('viewed_at')->nullable();
            $table->timestamp('closed_at')->nullable()->index();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};