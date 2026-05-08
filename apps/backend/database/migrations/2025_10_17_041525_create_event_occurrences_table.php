<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateEventOccurrencesTable
 * Provisoning the scheduling schema for the Events module,
 * supporting recurring instances, variable durations, and specific venue details per occurrence.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_occurrences', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
            
            $table->dateTime('start_date_time');
            $table->dateTime('end_date_time');
            $table->float('duration_hours')->nullable();
            $table->integer('max_attendees')->nullable();
            
            $table->string('venue_details')->nullable(); 

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_occurrences');
    }
};





