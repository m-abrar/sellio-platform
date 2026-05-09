<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Production Hardening Migration
     * Addresses P1 database debt identified in the master audit:
     * 1. Performance: Unindexed timestamps and price columns across critical modules.
     * 2. Financial Integrity: Missing snapshot columns for historical audit (currency, unit_price).
     * 3. Consistency: Uniform audit columns (status, admin_note) for all verticals.
     */
    public function up(): void
    {
        // 1. ADD INDEXES FOR PERFORMANCE
        $tablesToIndex = [
            'properties', 'autos', 'events', 'joblistings', 'services', 
            'products', 'classified_ads', 'blogs', 'property_bookings', 
            'event_bookings', 'auto_inquiries', 'job_applications',
            'service_quotes', 'service_appointments', 'classified_inquiries',
            'transactions', 'payments', 'withdrawals'
        ];

        foreach ($tablesToIndex as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->index('created_at');
                });
            }
        }

        // Index price columns for sorting/filtering
        $priceTables = [
            'properties' => 'base_price',
            'autos' => 'base_price',
            'events' => 'base_price',
            'products' => 'base_price',
        ];

        foreach ($priceTables as $tableName => $column) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) use ($column) {
                    $table->index($column);
                });
            }
        }

        // 2. FINANCIAL AUDIT INTEGRITY (SNAPSHOTS)
        $bookingTables = ['property_bookings', 'event_bookings', 'order_items'];
        foreach ($bookingTables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) {
                    if (!Schema::hasColumn($table->getTable(), 'currency')) {
                        $table->string('currency', 3)->default('USD')->after('total_price');
                    }
                    if (!Schema::hasColumn($table->getTable(), 'unit_price')) {
                        $table->decimal('unit_price', 15, 2)->nullable()->after('total_price');
                    }
                });
            }
        }

        // 3. CONSISTENCY: Ensure all verticals have standard audit columns
        $verticals = ['autos', 'events', 'joblistings', 'services', 'classified_ads', 'products'];
        foreach ($verticals as $vertical) {
            if (Schema::hasTable($vertical)) {
                Schema::table($vertical, function (Blueprint $table) use ($vertical) {
                    if (!Schema::hasColumn($vertical, 'status')) {
                        $table->string('status', 30)->default('active')->index();
                    }
                    if (!Schema::hasColumn($vertical, 'admin_note')) {
                        $table->text('admin_note')->nullable();
                    }
                    if (!Schema::hasColumn($vertical, 'deleted_at')) {
                        $table->softDeletes();
                    }
                });
            }
        }
    }

    public function down(): void
    {
        // Down logic omitted for brevity as this is a hardening migration
    }
};
