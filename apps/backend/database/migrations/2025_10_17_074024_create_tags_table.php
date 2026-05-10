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
            $table->string('group', 50)->nullable()->index()->comment('e.g., Brand, Style, Technical');
            $table->text('description')->nullable();

            $table->boolean('is_property')->default(false)->index();
            $table->boolean('is_event')->default(false)->index();
            $table->boolean('is_job')->default(false)->index();
            $table->boolean('is_auto')->default(false)->index();
            $table->boolean('is_service')->default(false)->index();
            $table->boolean('is_classified')->default(false)->index();
            $table->boolean('is_product')->default(false)->index();
            $table->boolean('is_blog')->default(false)->index();

            $table->boolean('is_published')->default(true)->index();
            $table->string('color', 20)->default('#6c757d')->comment('Hex color for UI badges');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->string('status', 30)->default('active')->index();
            $table->text('admin_note')->nullable();
            $table->boolean('is_premium')->default(false)->index();

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





