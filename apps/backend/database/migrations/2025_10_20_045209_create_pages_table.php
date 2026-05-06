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
            $table->string('slug')->unique(); 
            $table->string('type')->nullable()->index(); // varchar(255) DEFAULT NULL (e.g., 'page', 'header', 'footer')
            
            // Scalability fix: using unsignedBigInteger to avoid the tinyInteger 127-limit
            $table->unsignedBigInteger('header_id')->nullable(); 
            $table->unsignedBigInteger('footer_id')->nullable(); 
            
            $table->text('meta_description')->nullable(); 
            $table->text('meta_keywords')->nullable(); 
            
            $table->longText('html')->nullable(); 
            $table->text('css')->nullable(); 
            
            $table->boolean('is_published')->default(true)->index(); 
            $table->boolean('is_system')->default(false)->comment('If true, cannot be deleted via UI');
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