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
        // Creates the 'theme' table for storing theme configurations and settings.
        Schema::create('themes', function (Blueprint $table) {
            $table->id(); // bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, Primary Key
            $table->string('theme_key')->unique(); // varchar(255) NOT NULL, Unique Index
            $table->string('title')->nullable(); // varchar(255) DEFAULT NULL
            $table->integer('order');
            $table->boolean('is_active')->default(false)->index();
            
            // The 'variables' column is a longtext with a JSON check constraint.
            // In modern Laravel (8.x+), the json() type handles this efficiently.
            $table->json('variables')->nullable(); 
            
            $table->timestamps(); // created_at timestamp NULL DEFAULT NULL, updated_at timestamp NULL DEFAULT NULL
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drops the 'theme' table if the migration is rolled back.
        Schema::dropIfExists('themes');
    }
};