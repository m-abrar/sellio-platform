<?php
// database/migrations/..._create_reviews_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            
            // The user who wrote the review
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            
            // Polymorphic columns for the item being reviewed (property, auto, job, etc.)
            $table->morphs('reviewable'); 
            
            $table->unsignedTinyInteger('rating'); // 1 to 5
            $table->text('comment');
            $table->string('status')->nullable();
            
            // Optional: prevent a user from reviewing the same item twice
            $table->unique(['user_id', 'reviewable_id', 'reviewable_type'], 'user_reviewable_unique');
            $table->timestamp('viewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};