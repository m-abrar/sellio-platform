<?php

// database/migrations/YYYY_MM_DD_HHMMSS_create_classified_inquiries_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateClassifiedInquiriesTable
 * Provisoning the peer-to-peer communication schema for the Classifieds module,
 * supporting direct messaging and negotiation histories between buyers and sellers.
 */
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
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade'); 
            $table->foreignId('classified_id')->constrained('classified_ads')->onDelete('cascade');
            
            // Guest Contact Details
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 30)->nullable();

            // Inquiry Details
            $table->string('status', 30)->default('pending')->index();
            $table->text('message')->nullable();
            
            $table->index(['user_id', 'classified_id']);
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