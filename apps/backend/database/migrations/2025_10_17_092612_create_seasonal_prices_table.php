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
        Schema::create('seasonal_prices', function (Blueprint $table) {
            $table->id();
            
            // Foreign key to link to the properties table
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            
            $table->date('start_date');
            $table->date('end_date');
            
            // 🆕 New Column: Season Name/Title
            $table->string('title', 100); 
            
            $table->decimal('price', 15, 2); 
            $table->boolean('is_active')->default(true)->index();
            $table->unsignedSmallInteger('priority')->default(1)->comment('Higher number takes precedence in case of overlaps');
            
            $table->timestamps();
            
            // ✅ Composite Unique Index: Ensures one price per date range per property
            $table->unique(['property_id', 'start_date', 'end_date'], 'property_season_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seasonal_prices');
    }
};