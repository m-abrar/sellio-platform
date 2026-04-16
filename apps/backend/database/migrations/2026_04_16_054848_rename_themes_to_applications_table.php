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
        Schema::rename('themes', 'applications');

        Schema::table('applications', function (Blueprint $table) {
            $table->renameColumn('theme_key', 'app_key');
            $table->string('vertical')->after('app_key')->nullable()->index();
            $table->json('config')->after('variables')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn(['vertical', 'config']);
            $table->renameColumn('app_key', 'theme_key');
        });

        Schema::rename('applications', 'themes');
    }
};
