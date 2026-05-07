<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class ProductionHardeningMigration
 * Cross-module schema evolution: applies platform-wide audit columns (admin_note, is_premium,
 * color, status) across all core entities to achieve production-grade consistency.
 */
return new class extends Migration
{
    /**
     * Run the migrations to achieve "Golden" production standards.
     * This adds administrative audit trails (admin_note), moderation status systems,
     * aesthetic tokens (color), and premium identifiers across the platform.
     */
    public function up(): void
    {
        $tablesToHarden = [
            'amenities', 'features', 'tags', 'brands', 'plans', 
            'subscriptions', 'conversations', 'payments', 
            'newsletter_subscribers', 'advertisements', 'categories',
            'job_listings', 'autos', 'properties', 'events', 'services', 'classifieds', 'products'
        ];

        foreach ($tablesToHarden as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                    if (!Schema::hasColumn($tableName, 'status')) {
                        $table->string('status')->default('active')->after('id');
                    }
                    if (!Schema::hasColumn($tableName, 'admin_note')) {
                        $table->text('admin_note')->nullable()->after('status');
                    }
                    if (!Schema::hasColumn($tableName, 'is_premium')) {
                        $table->boolean('is_premium')->default(false)->after('admin_note');
                    }
                    if (!Schema::hasColumn($tableName, 'color')) {
                        $table->string('color', 20)->nullable()->after('is_premium');
                    }
                });
            }
        }

        // Specific adjustments for tables with existing 'status' columns that need conversion
        if (Schema::hasTable('advertisements')) {
            Schema::table('advertisements', function (Blueprint $table) {
                $table->string('status')->default('active')->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Rollback logic would be complex due to shared column names, 
        // typically we don't rollback hardening in production.
    }
};
