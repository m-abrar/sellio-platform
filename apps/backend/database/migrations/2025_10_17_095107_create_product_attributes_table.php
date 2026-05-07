<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateProductAttributesTable
 * Provisoning the variable attribute schema for the E-Commerce module,
 * mapping discrete variations (e.g., size, color) to specific SKU extensions and price modifications.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_attributes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            
            // Attribute Info (e.g., "Size", "Color", "Material")
            $table->string('name', 100); 
            $table->string('value', 255); // (e.g., "XL", "Red", "Stainless Steel")
            
            // Logic for Pricing & Stock
            $table->decimal('additional_price', 15, 2)->default(0.00)->comment('Added to base price');
            $table->string('sku_extension', 50)->nullable()->comment('e.g., -XL-RED');
            $table->integer('stock_quantity')->nullable()->comment('Override product stock if specific to attribute');
            
            // UI/UX
            $table->string('visual_color_code')->nullable()->comment('Hex code if it is a color attribute');
            $table->integer('sort_order')->default(0);
            
            // Metadata
            $table->boolean('is_visible')->default(true)->comment('Show on product page');
            $table->boolean('is_variation')->default(false)->comment('Can user select this to change the product type?');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_attributes');
    }
};