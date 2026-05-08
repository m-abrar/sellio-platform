<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreatePageContentsTable
 * Provisoning the theme-aware CMS content schema, enabling granular admin overrides
 * for per-section text, images, and media across different frontend themes.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('page_contents', function (Blueprint $table) {
            $table->id();
            
            // Content Identifier Columns (The lookup keys)
            $table->string('theme_key', 50)->default('default')->index();
            $table->string('page', 50)->index();
            $table->string('section', 50)->index();
            $table->string('content_key', 50);

            // Admin Logic Column (Determines form element: 'text', 'textarea', 'file', etc.)
            $table->string('input_type', 20)->default('text'); 
            
            // The Editable Content
            $table->longText('value')->nullable();
            
            $table->timestamps();

            // Compound Unique Index
            $table->unique(['theme_key', 'page', 'section', 'content_key'], 'content_unique_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('page_contents');
    }
};






