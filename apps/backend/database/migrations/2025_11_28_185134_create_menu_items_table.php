<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateMenuItemsTable
 * Provisoning the navigation link schema for the CMS,
 * supporting hierarchical (submenu) structures via self-referential parent_id relationships.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // This table stores the individual links for all menus.
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            
            // Foreign key linking the item to its Menu Location
            $table->foreignId('menu_id')
                  ->constrained('menus')
                  ->onDelete('cascade');

            $table->string('title');
            $table->string('url');
            
            // Used for nesting/submenus: relates to another item's ID
            $table->foreignId('parent_id')
                  ->nullable()
                  ->constrained('menu_items')
                  ->onDelete('cascade');

            $table->integer('order')->default(0);
            $table->string('status', 30)->default('active')->index();
            $table->text('admin_note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};





