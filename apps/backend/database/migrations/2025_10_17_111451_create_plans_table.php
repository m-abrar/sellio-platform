<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreatePlansTable
 * Provisoning the subscription tier schema for the platform,
 * defining billing periods, feature limits, and analytical access levels for vendors.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            
            $table->string('title', 60)->unique(); 
            $table->string('slug', 60)->unique()->index(); 
            $table->text('description')->nullable();
            
            $table->string('label_text', 50)->nullable(); 
            
            $table->decimal('price', 8, 2);
            $table->string('color', 20)->nullable();
            $table->enum('billing_period', ['monthly', 'annually']);
            
            // Core Features (Limits)
            $table->unsignedSmallInteger('max_listings')->nullable()->default(1)->comment('Max listings. NULL for unlimited.');
            $table->unsignedSmallInteger('max_addons')->nullable()->default(3)->comment('Max property addons. NULL for unlimited.');
            
            // Featured Listings Limit
            $table->unsignedSmallInteger('max_featured_listings')->nullable()->default(0)->comment('Max number of listings that can be featured. NULL for unlimited.');
            
            // Branding & Analytics
            $table->boolean('custom_branding')->default(false)->comment('Allows removal of platform branding.');
            $table->enum('analytics_access', ['none', 'basic', 'advanced'])->default('none');
                  
            $table->unsignedSmallInteger('listing_duration')->default(30)->comment('Days a listing remains active.');
            $table->boolean('priority_support')->default(false);
            
            // Status/Timestamps
            $table->string('status', 30)->default('active')->index();
            $table->text('admin_note')->nullable();
            $table->boolean('is_premium')->default(false)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_featured')->default(false); // Merged
            $table->boolean('is_popular')->default(false);  // Merged

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};





