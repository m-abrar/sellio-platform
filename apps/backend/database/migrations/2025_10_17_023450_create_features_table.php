<?php

// database/migrations/..._create_features_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateFeaturesTable
 * Provisoning the global features dictionary, enabling polymorphic 
 * attachment of specific attributes across all marketplace module entities.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('features', function (Blueprint $table) {
            $table->id();

            // Core Information
            $table->string('title')->unique();
            $table->string('slug')->unique();
            $table->text('description')->nullable();

            // Module Flags (Indicate which modules this feature applies to)
            $table->boolean('is_property')->default(false);
            $table->boolean('is_event')->default(false);
            $table->boolean('is_job')->default(false);
            $table->boolean('is_auto')->default(false);
            $table->boolean('is_service')->default(false);
            $table->boolean('is_classified')->default(false);
            $table->boolean('is_product')->default(false);
            $table->boolean('is_blog')->default(false);

            $table->boolean('is_published');

            // Timestamps
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('features');
    }
};