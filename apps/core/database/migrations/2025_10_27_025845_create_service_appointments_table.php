<?php

// database/migrations/..._create_service_appointments_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // The customer
            $table->foreignId('service_id')->constrained()->cascadeOnDelete(); // The service listing
            
            // Link to the specific package tier selected
            $table->foreignId('service_package_id')
                  ->nullable()
                  ->constrained('service_packages')
                  ->nullOnDelete(); 

            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('topic')->nullable();
            
            $table->dateTime('scheduled_at')->nullable(); // Required for ordering/sorting
            $table->string('status', 50)->default('pending');
            $table->text('notes')->nullable();
            $table->decimal('price', 8, 2)->nullable();
            $table->timestamp('viewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_appointments');
    }
};