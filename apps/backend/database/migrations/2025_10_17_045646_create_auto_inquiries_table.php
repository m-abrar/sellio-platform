<?php

// database/migrations/..._create_auto_inquiries_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateAutoInquiriesTable
 * Provisoning the lead generation schema for the Automotive module,
 * supporting test drive scheduling and direct dealership communication.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('auto_inquiries', function (Blueprint $table) {
            $table->id();
            // user_id is nullable if guests can inquire
            $table->foreignId('user_id')->nullable()->constrained()->restrictOnDelete(); 
            $table->foreignId('auto_id')->constrained()->restrictOnDelete();
            
            // New Contact Details (mandatory if user_id is null, but we'll enforce in the form)
            $table->string('full_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();

            // New Inquiry/Test Drive Details
            $table->date('preferred_date')->nullable();
            $table->string('preferred_time', 50)->nullable(); // e.g., 'AM', 'PM', 'Anytime'
            
            // Message is now optional as the structure holds the details
            $table->text('message')->nullable();
            
            $table->string('status', 50)->default('pending')->index(); // e.g., 'pending', 'contacted', 'resolved'
            
            // Note: Removed the unique constraint to allow multiple inquiries by the same user, 
            // but kept the unique index on user_id/auto_id implicitly via the primary key/other fields.
            $table->timestamp('viewed_at')->nullable();
            $table->text('admin_note')->nullable();
            $table->boolean('is_premium')->default(false)->index();
            $table->string('color', 20)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auto_inquiries');
    }
};






