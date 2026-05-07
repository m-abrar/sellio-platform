<?php

// database/migrations/YYYY_MM_DD_HHMMSS_create_tags_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateTagsTable
 * Provisoning the platform-wide tagging vocabulary, enabling polymorphic 
 * categorization and filtering across all marketplace entities and blog posts.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('title', 100)->unique();
            $table->string('slug', 100)->unique();
            $table->text('description')->nullable();

            $table->boolean('is_property')->default(false);
            $table->boolean('is_event')->default(false);
            $table->boolean('is_job')->default(false);
            $table->boolean('is_auto')->default(false);
            $table->boolean('is_service')->default(false);
            $table->boolean('is_classified')->default(false);
            $table->boolean('is_product')->default(false);
            $table->boolean('is_blog')->default(false);

            $table->boolean('is_published')->default(true)->index();
            $table->string('color', 20)->default('#6c757d')->comment('Hex color for UI badges');
            $table->unsignedSmallInteger('sort_order')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tags');
    }
};