<?php

// database/migrations/YYYY_MM_DD_HHMMSS_create_conversations_table.php

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
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            
            // The authenticated User who owns this conversation (Client)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // The Partner (Service Provider, Vendor, etc.)
            $table->foreignId('partner_id')->constrained('users')->onDelete('cascade');
            
            $table->string('subject')->nullable();
            
            // Link to the item being discussed (Property, Product, etc.)
            $table->nullableMorphs('inquiriable'); 
            
            $table->unique(['user_id', 'partner_id', 'inquiriable_id', 'inquiriable_type'], 'conversation_context_unique'); 
            $table->index(['user_id', 'partner_id']);
            
            $table->timestamps(); // created_at, updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};