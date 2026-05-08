<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateAutosTable
 * Provisoning the core schema for the Automotive marketplace module,
 * integrating vehicle specifications, dealership locations, and pricing variants.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('autos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->foreignId('brand_id')->nullable()->constrained('brands')->onDelete('set null');
            $table->foreignId('type_id')->nullable()->constrained('types')->onDelete('set null');
            $table->foreignId('location_id')->nullable()->constrained('locations')->onDelete('set null');

            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->text('description');
            $table->decimal('base_price', 15, 2);
            $table->decimal('sale_price', 15, 2)->nullable();
            
            // Auto Specifics
            $table->unsignedSmallInteger('year');
            $table->string('make');
            $table->string('model');
            $table->string('engine_type');
            $table->string('transmission');
            $table->string('fuel_economy');
            $table->string('drivetrain');
            $table->string('exterior_color');

            $table->unsignedInteger('mileage_value');
            $table->string('mileage_units');
            $table->tinyInteger('condition_rating')->nullable(); // 1-10
            $table->string('vin_number', 50)->nullable()->index();
            $table->unsignedTinyInteger('warranty_months')->nullable();
            $table->unsignedTinyInteger('stock_quantity')->default(1);
            $table->boolean('is_certified')->default(false)->index();
            // --- Production Hardening & Audit Columns ---
            $table->string('status', 30)->default('active')->index();
            $table->text('admin_note')->nullable();
            $table->boolean('is_premium')->default(false)->index();
            $table->boolean('is_verified')->default(false)->index();
            $table->string('color', 20)->nullable();

            // Location/Address
            $table->string('address', 255)->nullable();
            $table->string('city', 100);
            $table->string('state', 100)->nullable();
            $table->string('country', 100);
            $table->string('zip_code', 20)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();

            // Status/Type
            $table->boolean('is_published')->default(false)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_lease')->default(false)->index();
            $table->boolean('is_selling')->default(true)->index();

            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamp('approved_at')->nullable()->index();
            $table->timestamp('expires_at')->nullable()->index();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('autos');
    }
};








