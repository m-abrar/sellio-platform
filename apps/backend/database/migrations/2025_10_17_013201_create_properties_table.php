<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->foreignId('type_id')->nullable()->constrained('types')->onDelete('set null');
            $table->foreignId('brand_id')->nullable()->constrained('brands')->onDelete('set null');
            $table->foreignId('location_id')->nullable()->constrained('locations')->onDelete('set null');
            
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->text('description');
            $table->decimal('base_price', 15, 2);
            $table->decimal('sale_price', 15, 2)->nullable();
            $table->decimal('price_per_night', 5, 2)->nullable();
            
            // Property Specifics
            $table->integer('total_units')->default(1);
            $table->integer('number_of_bedrooms');
            $table->integer('number_of_bathrooms');
            $table->integer('maximum_guests');
            $table->integer('minimum_rental_days');
            $table->integer('maximum_rental_days');
            $table->float('area_sq_ft')->nullable();
            $table->float('area_sq_m')->nullable();
            $table->string('number_of_parking_spots', 255)->nullable();
            $table->decimal('hoa', 10, 2)->nullable()->comment('Home Owners Association (HOA) fee');
            $table->text('rules')->nullable()->comment('Specific property rules');
            $table->text('policies')->nullable()->comment('Specific property policies');
            $table->year('year_built')->nullable();
            
            // --- UPDATED VIDEO AND VIRTUAL TOUR FIELDS TO TEXT ---
            // Text type allows for longer embedding code (e.g., iframe) or a simple URL.
            $table->text('video')->nullable()->comment('Link or embedding code for property video tour');
            $table->text('virtual_tour')->nullable()->comment('Link or embedding code for 360-degree virtual tour');
            // --- END UPDATED FIELDS ---

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
            $table->boolean('is_rental')->default(false)->index()->comment('Is For Rent');
            $table->boolean('is_sale')->default(false)->index()->comment('Is For Sale');

            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamp('approved_at')->nullable()->index();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};