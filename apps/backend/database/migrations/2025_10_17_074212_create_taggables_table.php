<?php

// database/migrations/YYYY_MM_DD_HHMMSS_create_taggables_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateTaggablesTable
 * Provisoning the polymorphic pivot schema for applying dynamic tags 
 * to any compatible entity (e.g., properties, autos, blog posts) across the platform.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('taggables', function (Blueprint $table) {
            
            $table->foreignId('tag_id')->constrained('tags')->onDelete('cascade');
            
            // Polymorphic Columns
            $table->morphs('taggable'); // Creates taggable_id (int) and taggable_type (string)

            // Optional: You can add an extra value if needed (e.g., priority)
            // $table->string('value', 50)->nullable(); 

            // Composite Primary Key for efficiency and uniqueness
            $table->unique(['tag_id', 'taggable_id', 'taggable_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('taggables');
    }
};






