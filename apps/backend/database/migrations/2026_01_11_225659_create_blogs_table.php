<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateBlogsTable
 * Provisoning the content publishing schema for the Blog module,
 * supporting SEO metadata, view counters, featured flags, and category associations.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            
            // Relationships
            $table->foreignId('user_id')->nullable()->constrained('users')->restrictOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            
            // Content
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->string('subtitle', 255)->nullable();
            $table->longText('content'); 
            
            // Blog Specifics
            $table->integer('reading_time')->nullable();
            $table->unsignedBigInteger('view_count')->default(0)->index();
            $table->text('video')->nullable(); // Added to align with Seeder
            
            // Status & Visibility
            $table->boolean('is_published')->default(false)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('allow_comments')->default(true);
            
            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();

            $table->timestamp('published_at')->nullable()->index();
            
            // --- Production Hardening & Audit Columns ---
            $table->string('status')->default('active')->index();
            $table->text('admin_note')->nullable();
            $table->boolean('is_premium')->default(false)->index();
            $table->boolean('is_verified_author')->default(false)->index();
            $table->string('color', 20)->nullable();
            
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};





