<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateEventsTable
 * Provisoning the core schema for the Events marketplace module,
 * supporting virtual/physical locations, tiered pricing, and scheduling mechanics.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->foreignId('type_id')->nullable()->constrained('types')->onDelete('set null');
            $table->foreignId('brand_id')->nullable()->constrained('brands')->onDelete('set null');
            $table->foreignId('location_id')->nullable()->constrained('locations')->onDelete('set null');

            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->text('description');

            $table->decimal('base_price', 15, 2)->nullable();
            $table->decimal('sale_price', 15, 2)->nullable();
            $table->dateTime('start_date_time');
            $table->float('duration_hours')->nullable();
            $table->unsignedInteger('max_attendees')->nullable();

            $table->string('event_genre', 100)->nullable();
            $table->float('venue_size')->nullable();

            $table->string('address', 255)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('country', 100)->nullable();
            $table->string('zip_code', 20)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();

            $table->boolean('is_published')->default(false)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_virtual')->default(false)->index();
            $table->string('virtual_link')->nullable()->comment('URL for Zoom/Meet if is_virtual is true');
            $table->boolean('is_paid')->default(false)->index();
            $table->string('status', 30)->default('active')->index();

            $table->string('organizer_name')->nullable();
            $table->string('organizer_email')->nullable();

            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('admin_note')->nullable();
            $table->timestamp('approved_at')->nullable()->index();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};