<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateEventTicketTypesTable
 * Provisoning the tiered ticketing schema for the Events module,
 * supporting dynamic pricing brackets and inventory limits per ticket class.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_ticket_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->restrictOnDelete();
            $table->string('title');
            $table->decimal('base_price', 15, 2);
            $table->text('description')->nullable();
            $table->unsignedInteger('max_quantity')->nullable()->comment('NULL for unlimited');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_ticket_types');
    }
};





