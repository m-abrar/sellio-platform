<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateServiceQuotesTable
 * Provisoning the project inquiry schema for the Professional Services module,
 * capturing project scope, target dates, and linking requests to specific service tiers.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_quotes', function (Blueprint $table) {
            $table->id();

            // Foreign Keys
            $table->foreignId('service_id')->constrained('services')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            
            // Guest Contact Details (if user_id is null)
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 30)->nullable();

            // Link to the specific package selected in the sidebar
            $table->foreignId('service_package_id')->nullable()->constrained('service_packages')->onDelete('set null');

            // Request Details
            $table->string('scope_size')->nullable(); // Stores the "Project Size / Guest Count"
            $table->dateTime('requested_date')->nullable(); // The target_date from form
            $table->text('details')->nullable(); // Stores additional 'notes' from the user
            
            // Quote Status and Price
            $table->string('status', 30)->default('pending')->index();
            $table->decimal('quoted_price', 15, 2)->nullable(); 
            $table->text('admin_notes')->nullable();

            // Analytics & Notifications
            $table->timestamp('viewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_quotes');
    }
};