<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->foreignId('brand_id')->nullable()->constrained('brands')->onDelete('set null');
            $table->foreignId('type_id')->nullable()->constrained('types')->onDelete('set null');
            $table->foreignId('location_id')->nullable()->constrained('locations')->onDelete('set null');

            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->text('description');

            $table->string('operating_hours', 100)->nullable()->comment('e.g. 09:00 AM - 06:00 PM');
            $table->string('operating_days_label', 100)->nullable()->comment('e.g. Monday - Friday');
            
            $table->decimal('base_price', 15, 2)->nullable();
            $table->decimal('sale_price', 15, 2)->nullable()->comment('Deposit/Min Fee');
            
            // Service Specifics
            $table->integer('expertise_level'); // Enum ID
            $table->integer('availability_schedule'); // Enum ID
            $table->float('service_radius')->nullable();
            $table->string('licenses_certs', 255)->nullable();
            $table->integer('min_contract_months')->nullable();
            $table->integer('max_client_slots')->nullable();

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
            $table->boolean('is_subscription')->default(false)->index();
            $table->boolean('is_project_based')->default(false)->index();

            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamp('approved_at')->nullable()->index();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};