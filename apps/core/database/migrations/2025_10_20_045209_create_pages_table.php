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
        // Creates the 'pages' table for storing CMS pages, headers, and footers.
        Schema::create('pages', function (Blueprint $table) {
            $table->id(); // bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, Primary Key
            $table->string('title'); // varchar(255) NOT NULL
            $table->string('slug')->index(); // varchar(255) NOT NULL, Index for fast lookup
            $table->string('type')->nullable(); // varchar(255) DEFAULT NULL (e.g., 'page', 'header', 'footer')
            
            // These are likely foreign keys referencing other page IDs for headers/footers
            $table->tinyInteger('header_id')->nullable(); // tinyint(4) DEFAULT NULL
            $table->tinyInteger('footer_id')->nullable(); // tinyint(4) DEFAULT NULL
            
            $table->text('meta_description')->nullable(); // text DEFAULT NULL
            $table->text('meta_keywords')->nullable(); // text DEFAULT NULL
            
            $table->longText('html')->nullable(); // longtext DEFAULT NULL (for page content)
            $table->text('css')->nullable(); // text DEFAULT NULL (for page styles)
            
            $table->boolean('is_published')->default(false); // tinyint(1) NOT NULL DEFAULT 0
            $table->timestamps(); // created_at timestamp NULL DEFAULT NULL, updated_at timestamp NULL DEFAULT NULL
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drops the 'pages' table if the migration is rolled back.
        Schema::dropIfExists('pages');
    }
};