<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateThemesTable
 * Provisoning the frontend personalization schema, supporting modular 
 * styling variables, vertical-specific configurations, and activation tracking.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('themes', function (Blueprint $table) {
            $table->id();
            $table->string('theme_key')->unique();
            $table->string('vertical')->nullable()->index(); // e.g., 'properties', 'autos'
            $table->string('title')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(false)->index();
            $table->boolean('is_verified')->default(false)->index();
            
            // --- Production Hardening & Audit Columns ---
            $table->string('status')->default('active')->index();
            $table->text('admin_note')->nullable();
            $table->boolean('is_premium')->default(false)->index();
            $table->string('color', 20)->nullable();
            
            $table->timestamp('last_activated_at')->nullable();
            
            $table->json('variables')->nullable(); // Visual styling (colors, fonts)
            $table->json('config')->nullable();    // Modular logic/features
            
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('themes');
    }
};





