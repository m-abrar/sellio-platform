<?php

// database/migrations/..._create_service_appointments_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateServiceAppointmentsTable
 * Provisoning the scheduled appointment schema for the Professional Services module,
 * capturing booking slots, customer contact details, and payment status per engagement.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete(); // The customer
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
            
            $table->dateTime('scheduled_at')->nullable()->index(); 
            $table->string('status', 30)->default('pending')->index();
            $table->string('payment_status', 20)->default('unpaid')->index();
            $table->string('transaction_id')->nullable()->index();
            $table->text('notes')->nullable()->comment('Customer notes');
            $table->text('admin_note')->nullable()->comment('Provider notes');
            $table->decimal('price', 15, 2)->nullable();
            $table->timestamp('viewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_appointments');
    }
};





