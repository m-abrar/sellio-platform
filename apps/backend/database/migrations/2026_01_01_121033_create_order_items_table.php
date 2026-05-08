<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateOrderItemsTable
 * Provisoning the line-item schema for the E-Commerce module,
 * preserving historical purchase snapshots (name, price, attributes) per fulfilled order.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained(); // No cascade delete (keep historical record)
            
            $table->string('product_name'); // Snapshot in case product name changes
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 15, 2); // Price at time of purchase
            $table->decimal('total_price', 15, 2); // unit_price * quantity
            
            // Snapshot of chosen options
            $table->json('selected_attributes')->nullable()->comment('JSON of sizes, colors, etc.');
            $table->json('selected_addons')->nullable()->comment('JSON of gift wrap, warranty, etc.');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};





