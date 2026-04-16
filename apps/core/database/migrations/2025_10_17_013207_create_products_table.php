<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            // Relationships
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained('categories');
            $table->foreignId('type_id')->nullable()->constrained('types');
            $table->foreignId('brand_id')->nullable()->constrained('brands');
            
            // Basic Info
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->string('sku', 100)->unique()->nullable();
            $table->text('description');
            $table->text('short_description')->nullable();
            
            // Pricing
            $table->decimal('base_price', 15, 2);
            $table->decimal('sale_price', 15, 2)->nullable();
            $table->decimal('cost_price', 15, 2)->nullable()->comment('Internal purchase cost');
            
            // Inventory Specifics
            $table->integer('stock_quantity')->default(0);
            $table->integer('low_stock_threshold')->nullable();
            $table->boolean('manage_stock')->default(true);
            $table->boolean('in_stock')->default(true);
            
            // Physical Attributes
            $table->decimal('weight', 8, 2)->nullable()->comment('Weight in kg/lbs');
            $table->decimal('length', 8, 2)->nullable();
            $table->decimal('width', 8, 2)->nullable();
            $table->decimal('height', 8, 2)->nullable();
            
            // Media
            $table->text('video')->nullable()->comment('Product demo video link');
            $table->string('main_image')->nullable();
            
            // Status/Flags
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->boolean('on_sale')->default(false);
            $table->boolean('is_digital')->default(false);

            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};