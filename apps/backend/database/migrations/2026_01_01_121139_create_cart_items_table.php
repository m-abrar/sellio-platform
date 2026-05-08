<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateCartItemsTable
 * Provisoning the cart line-item schema for the E-Commerce module,
 * tracking quantities, price-lock snapshots, and selected variations per item in a cart.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            
            $table->integer('quantity')->default(1);
            
            // Critical for performance and price-locking
            $table->decimal('unit_price', 15, 2)->comment('Price at the time of adding to cart');

            // Variations and Addons
            $table->json('attribute_ids')->nullable()->comment('Array of product_attribute IDs');
            $table->json('addon_ids')->nullable()->comment('Array of product_addon IDs');

            $table->timestamps();

            // Indexing for performance
            $table->index(['cart_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};





