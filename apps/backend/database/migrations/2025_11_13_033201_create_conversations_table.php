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
            
            // --- NEW: Subject/Title for the conversation thread ---
            $table->string('subject')->nullable();
            
            // Ensure a user only has one conversation with a specific partner (optional, but good practice)
            // Note: If you want to allow a User/Partner pair to have multiple conversation threads (each with a unique subject), 
            // you might want to remove the unique constraint entirely, or include the subject in it.
            $table->unique(['user_id', 'partner_id']); 
            
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