<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            
            // Relationships
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            
            // Content
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->string('subtitle', 255)->nullable();
            $table->longText('content'); 
            
            // Blog Specifics
            $table->integer('reading_time')->nullable();
            $table->unsignedBigInteger('view_count')->default(0);
            $table->text('video')->nullable(); // Added to align with Seeder
            
            // Status & Visibility
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->boolean('allow_comments')->default(true);
            
            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();

            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};