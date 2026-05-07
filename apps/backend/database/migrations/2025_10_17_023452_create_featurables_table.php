<?php
// database/migrations/..._create_featurable_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateFeaturablesTable
 * Provisoning the polymorphic pivot schema for attaching global features 
 * (with optional custom values) to any compatible entity across the platform.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('featurables', function (Blueprint $table) {
            $table->foreignId('feature_id')->constrained()->cascadeOnDelete();
            
            // Polymorphic Columns: featurable_id and featurable_type
            $table->morphs('featurable'); 
            $table->string('value', 255)->nullable();

            $table->primary(['feature_id', 'featurable_id', 'featurable_type'], 'featurable_unique_index');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('featurables');
    }
};