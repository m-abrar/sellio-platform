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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            
            $table->string('title', 60)->unique(); 
            $table->text('description')->nullable();
            
            // NEW COLUMN: Custom marketing label (e.g., "Popular", "Best Value")
            $table->string('label_text', 50)->nullable(); 
            
            $table->decimal('price', 8, 2);
            $table->enum('billing_period', ['monthly', 'annually']);
            
            // Core Features (Limits)
            $table->unsignedSmallInteger('max_listings')->nullable()->default(1)->comment('Max listings. NULL for unlimited.');
            $table->unsignedSmallInteger('max_addons')->nullable()->default(3)->comment('Max property addons. NULL for unlimited.');
            
            // NEW FEATURE: Featured Listings Limit
            $table->unsignedSmallInteger('max_featured_listings')->nullable()->default(0)->comment('Max number of listings that can be featured. NULL for unlimited.');
            
            // NEW FEATURE: Custom Branding (Boolean)
            $table->boolean('custom_branding')->default(false)->comment('Allows removal of platform branding.');
            
            // NEW FEATURE: Analytics Access (Tiered)
            $table->enum('analytics_access', ['none', 'basic', 'advanced'])
                  ->default('none')
                  ->comment('Level of analytics access.');
                  
            // NEW FEATURE: Listing Renewal Period
            $table->unsignedSmallInteger('listing_duration')->default(30)->comment('Days a listing remains active before manual renewal is required.');
            
            // Existing Premium Feature
            $table->boolean('priority_support')->default(false)->comment('Whether the plan includes priority support.');
            
            // Status/Timestamps
            $table->boolean('is_active')->default(true)->index()->comment('Whether the plan is currently available for subscription.');
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