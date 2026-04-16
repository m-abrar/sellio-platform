<?php

// database/migrations/YYYY_MM_DD_HHMMSS_create_messages_table.php

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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();

            // Link to the parent conversation
            $table->foreignId('conversation_id')->constrained()->onDelete('cascade');

            // The sender of the message (either the user or the partner)
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            
            $table->text('body');
            $table->timestamp('read_at')->nullable(); // Optional: For tracking read status

            $table->timestamps(); // created_at, updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};