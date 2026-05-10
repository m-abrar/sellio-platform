<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateClassifiedAdsTable
 * Provisoning the core schema for the Classifieds marketplace module,
 * capturing item condition ratings, negotiability flags, and temporal listing constraints.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('classified_ads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->foreignId('type_id')->constrained('types')->onDelete('cascade');
            $table->foreignId('brand_id')->nullable()->constrained('brands')->onDelete('set null');
            $table->foreignId('location_id')->nullable()->constrained('locations')->onDelete('set null');

            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->text('description');
            $table->decimal('base_price', 15, 2);
            $table->decimal('sale_price', 15, 2)->nullable();

            $table->timestamp('sale_starts_at')->nullable();
            $table->timestamp('sale_ends_at')->nullable();
            
            // Classifieds Specifics
            $table->integer('item_condition'); // 1-10 rating
            $table->integer('item_year_age')->nullable();
            $table->integer('item_quantity')->default(1);
            $table->float('item_dimensions')->nullable(); // Size/Weight
            $table->integer('warranty_months')->nullable();
            $table->integer('min_ad_duration')->nullable(); // in days

            // Location/Address
            $table->string('address', 255)->nullable();
            $table->string('city', 100);
            $table->string('state', 100)->nullable();
            $table->string('country', 100);
            $table->string('zip_code', 20)->nullable();
            $table->decimal('latitude', 10, 8)->nullable()->index();
            $table->decimal('longitude', 11, 8)->nullable()->index();

            // Status/Type
            $table->string('status', 30)->default('active')->index();
            $table->boolean('is_published')->default(false)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_negotiable')->default(true)->index();
            $table->boolean('is_for_rent')->default(false)->index();
            $table->boolean('is_for_sale')->default(true)->index();
            $table->boolean('is_shipping')->default(false)->index();

            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('admin_note')->nullable();
            $table->timestamp('approved_at')->nullable()->index();
            $table->timestamp('expires_at')->nullable()->index();
            $table->boolean('is_premium')->default(false)->index();
            $table->boolean('is_verified')->default(false)->index();
            $table->string('color', 20)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('classified_ads');
    }
};









