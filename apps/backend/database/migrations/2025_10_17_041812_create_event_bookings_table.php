<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();

            $table->foreignId('event_occurrence_id')->constrained('event_occurrences')->cascadeOnDelete();

            $table->foreignId('event_ticket_type_id')->constrained('event_ticket_types')->cascadeOnDelete();
            $table->foreignId('occurrence_ticket_id')->constrained('event_occurrence_tickets')->cascadeOnDelete();

            $table->integer('quantity')->default(1);
            $table->decimal('total_price', 15, 2);
            $table->string('status', 30)->default('confirmed')->index();
            $table->string('payment_status', 20)->default('unpaid')->index();
            $table->string('transaction_id')->nullable()->index();

            $table->index(['user_id', 'event_occurrence_id'], 'user_occurrence_index');
            $table->timestamp('viewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_bookings');
    }
};