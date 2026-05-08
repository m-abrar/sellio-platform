<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateEventOccurrencesTicketTable
 * Provisoning the occurrence-specific ticketing pivot schema,
 * allowing dynamic pricing overrides and independent capacity tracking per event instance.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_occurrence_tickets', function (Blueprint $table) {
            $table->id();

            $table->foreignId('event_occurrence_id')->constrained('event_occurrences')->cascadeOnDelete();
            $table->foreignId('event_ticket_type_id')->constrained('event_ticket_types')->cascadeOnDelete();

            $table->integer('available_quantity');
            $table->integer('sold_count');
            $table->decimal('override_price', 10, 2)->nullable();
            $table->decimal('sale_price', 10, 2)->nullable();

            $table->unique(['event_occurrence_id', 'event_ticket_type_id'], 'occurrence_ticket_unique');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_occurrence_tickets');
    }
};





