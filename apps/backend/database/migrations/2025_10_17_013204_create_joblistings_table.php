<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Renamed table to 'joblistings'
        Schema::create('joblistings', function (Blueprint $table) {
            $table->id();
            
            // Foreign Keys
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->foreignId('type_id')->nullable()->constrained('types')->onDelete('set null')->comment('e.g., Full-Time, Part-Time, Internship'); 
            $table->foreignId('brand_id')->nullable()->constrained('brands')->onDelete('set null');
            $table->foreignId('location_id')->nullable()->constrained('locations')->onDelete('set null');

            // Core Details
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->text('description');
            
            // Salary Details
            $table->decimal('salary_min', 15, 2)->nullable()->comment('Salary Min');
            $table->decimal('salary_max', 15, 2)->nullable()->comment('Salary Max');
            $table->string('salary_frequency', 50)->nullable()->comment('e.g., Annual, Hourly, Monthly'); 
            
            // Job Specifics
            $table->unsignedTinyInteger('experience_level')->default(1)->comment('1=Entry, 2=Mid, 3=Senior, 4=Executive'); 
            $table->unsignedTinyInteger('workplace_type')->default(1)->comment('1=On-Site, 2=Hybrid, 3=Remote');
            $table->string('required_education', 255)->nullable();
            $table->dateTime('application_deadline')->nullable();

            // Location/Address
            $table->string('address', 255)->nullable();
            $table->string('city', 100);
            $table->string('state', 100)->nullable();
            $table->string('country', 100);
            $table->string('zip_code', 20)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();

            // Status/Type Flags
            $table->boolean('is_published')->default(false)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_contract')->default(false)->index();
            $table->boolean('is_full_time')->default(false)->index();

            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamp('approved_at')->nullable()->index();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 3. Updated drop to match the new table name 'joblistings'
        Schema::dropIfExists('joblistings');
    }
};