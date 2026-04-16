<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_quotes', function (Blueprint $table) {
            $table->id();

            // Foreign Keys
            $table->foreignId('service_id')->constrained('services')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Link to the specific package selected in the sidebar
            $table->foreignId('service_package_id')->nullable()->constrained('service_packages')->onDelete('set null');

            // Request Details
            $table->string('scope_size')->nullable(); // Stores the "Project Size / Guest Count"
            $table->dateTime('requested_date')->nullable(); // The target_date from form
            $table->text('details')->nullable(); // Stores additional 'notes' from the user
            
            // Quote Status and Price
            $table->enum('status', ['pending', 'quoted', 'accepted', 'rejected', 'completed'])->default('pending');
            $table->decimal('quoted_price', 15, 2)->nullable(); 

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