<?php

// database/migrations/YYYY_MM_DD_HHMMSS_create_classified_inquiries_table.php

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
        Schema::create('classified_inquiries', function (Blueprint $table) {
            $table->id();
            
            // Foreign Keys
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // The user making the inquiry (buyer)
            $table->foreignId('classified_id')->constrained('classified_ads')->onDelete('cascade');
            
            // Inquiry Details
            $table->enum('status', ['pending', 'contacted', 'resolved', 'closed_sale'])->default('pending');
            $table->text('message')->nullable();
            
            // Unique Constraint: A user can only submit one *initial* inquiry per ad
            $table->unique(['user_id', 'classified_id']);
            $table->timestamp('viewed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classified_inquiries');
    }
};