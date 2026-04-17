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
        Schema::table('themes', function (Blueprint $table) {
            $table->renameColumn('app_key', 'theme_key');
        });

        Schema::table('menus', function (Blueprint $table) {
            $table->renameColumn('app_key', 'theme_key');
        });

        Schema::table('page_contents', function (Blueprint $table) {
            $table->renameColumn('app_key', 'theme_key');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('themes', function (Blueprint $table) {
            $table->renameColumn('theme_key', 'app_key');
        });

        Schema::table('menus', function (Blueprint $table) {
            $table->renameColumn('theme_key', 'app_key');
        });

        Schema::table('page_contents', function (Blueprint $table) {
            $table->renameColumn('theme_key', 'app_key');
        });
    }
};
