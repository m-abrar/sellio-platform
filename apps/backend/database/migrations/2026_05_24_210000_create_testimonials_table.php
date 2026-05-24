<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('author_name');
            $table->string('author_title')->nullable();
            $table->string('company')->nullable();
            $table->text('quote');
            $table->unsignedTinyInteger('rating')->nullable();
            $table->string('status')->default('draft')->index();
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('testimonial_theme', function (Blueprint $table) {
            $table->id();
            $table->foreignId('testimonial_id')->constrained()->cascadeOnDelete();
            $table->foreignId('theme_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('priority')->default(0)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->timestamps();

            $table->unique(['testimonial_id', 'theme_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonial_theme');
        Schema::dropIfExists('testimonials');
    }
};
