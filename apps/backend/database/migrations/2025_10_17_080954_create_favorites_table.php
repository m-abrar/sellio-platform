<?php

// database/migrations/YYYY_MM_DD_HHMMSS_create_favorites_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateFavoritesTable
 * Provisoning the cross-module wishlisting schema, enabling users to save
 * properties, autos, products, and other platform entities via polymorphic associations.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            
            $table->id();
            
            // The User who created the favorite
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Polymorphic Columns: The model being favorited
            $table->morphs('favoritable'); // Creates favoritable_id (int) and favoritable_type (string)

            // Unique Constraint: A user can only favorite a specific item once
            $table->unique(['user_id', 'favoritable_id', 'favoritable_type'], 'user_favoritable_unique');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};





