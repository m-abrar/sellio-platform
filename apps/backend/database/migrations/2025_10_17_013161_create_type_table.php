<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateTypeTable
 * Provisoning the general entity types schema, supporting broad categorization
 * and module-specific filtering across all marketplace verticals.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('types', function (Blueprint $table) {
            $table->id();
            $table->string('title')->unique(); // 
            $table->text('description')->nullable(); // 
            $table->string('slug')->unique(); //
            $table->string('icon')->nullable(); //

            // Module Flags
            $table->boolean('is_property')->default(false)->index();
            $table->boolean('is_event')->default(false)->index();
            $table->boolean('is_job')->default(false)->index();
            $table->boolean('is_auto')->default(false)->index();
            $table->boolean('is_service')->default(false)->index();
            $table->boolean('is_classified')->default(false)->index();
            $table->boolean('is_product')->default(false)->index();
            $table->boolean('is_blog')->default(false)->index();

            // Publishing Status
            $table->boolean('is_published')->default(true);
            $table->string('status')->default('active')->index();
            $table->text('admin_note')->nullable();
            $table->boolean('is_premium')->default(false)->index();
            $table->string('color', 20)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('types');
    }
};







