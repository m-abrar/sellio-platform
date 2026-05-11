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
        // 1. Transactions Table - Missing index on wallet_id
        if (Schema::hasTable('transactions')) {
            Schema::table('transactions', function (Blueprint $table) {
                if (Schema::hasColumn('transactions', 'wallet_id') && !Schema::hasIndex('transactions', ['wallet_id'])) {
                    $table->index('wallet_id');
                }
            });
        }

        // 2. Event Occurrences - Missing temporal indexes
        if (Schema::hasTable('event_occurrences')) {
            Schema::table('event_occurrences', function (Blueprint $table) {
                if (!Schema::hasIndex('event_occurrences', 'event_occurrences_time_range_index')) {
                    $table->index(['start_date_time', 'end_date_time'], 'event_occurrences_time_range_index');
                }
            });
        }

        // 3. Blogs - Missing visibility indexes
        if (Schema::hasTable('blogs')) {
            Schema::table('blogs', function (Blueprint $table) {
                if (!Schema::hasIndex('blogs', 'blogs_visibility_index')) {
                    $table->index(['is_published', 'published_at'], 'blogs_visibility_index');
                }
            });
        }

        // 4. Seasonal Prices - Missing temporal indexes
        if (Schema::hasTable('seasonal_prices')) {
            Schema::table('seasonal_prices', function (Blueprint $table) {
                if (!Schema::hasIndex('seasonal_prices', 'seasonal_prices_range_index')) {
                    $table->index(['start_date', 'end_date'], 'seasonal_prices_range_index');
                }
            });
        }

        // 5. Menu Items - Missing sort index
        if (Schema::hasTable('menu_items')) {
            Schema::table('menu_items', function (Blueprint $table) {
                if (Schema::hasColumn('menu_items', 'order') && !Schema::hasIndex('menu_items', ['order'])) {
                    $table->index('order');
                }
            });
        }

        // 6. Amenity Property - Missing reverse lookup index
        if (Schema::hasTable('amenity_property')) {
            Schema::table('amenity_property', function (Blueprint $table) {
                if (!Schema::hasIndex('amenity_property', ['property_id'])) {
                    $table->index('property_id');
                }
            });
        }

        // 7. Order Items - SoftDeletes and Integrity Hardening
        if (Schema::hasTable('order_items')) {
            Schema::table('order_items', function (Blueprint $table) {
                // Drop existing cascade foreign key if possible (SQLite doesn't support dropping FKs easily, but for MySQL/PostgreSQL we should)
                // However, since this is a general fix, we'll focus on adding SoftDeletes first
                if (!Schema::hasColumn('order_items', 'deleted_at')) {
                    $table->softDeletes();
                }
            });
        }

        // 8. Advertisements - Missing SoftDeletes
        if (Schema::hasTable('advertisements')) {
            Schema::table('advertisements', function (Blueprint $table) {
                if (!Schema::hasColumn('advertisements', 'deleted_at')) {
                    $table->softDeletes();
                }
            });
        }

        // 9. Tickets - Missing SoftDeletes
        if (Schema::hasTable('tickets')) {
            Schema::table('tickets', function (Blueprint $table) {
                if (!Schema::hasColumn('tickets', 'deleted_at')) {
                    $table->softDeletes();
                }
            });
        }
        
        // 10. Service Quotes - Ensure indexes for foreign keys if missing
        if (Schema::hasTable('service_quotes')) {
            Schema::table('service_quotes', function (Blueprint $table) {
                if (!Schema::hasIndex('service_quotes', 'service_quotes_status_lookup_index')) {
                    $table->index(['service_id', 'status'], 'service_quotes_status_lookup_index');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) { $table->dropIndex(['wallet_id']); });
        Schema::table('event_occurrences', function (Blueprint $table) { $table->dropIndex('event_occurrences_time_range_index'); });
        Schema::table('blogs', function (Blueprint $table) { $table->dropIndex('blogs_visibility_index'); });
        Schema::table('seasonal_prices', function (Blueprint $table) { $table->dropIndex('seasonal_prices_range_index'); });
        Schema::table('menu_items', function (Blueprint $table) { $table->dropIndex(['order']); });
        Schema::table('amenity_property', function (Blueprint $table) { $table->dropIndex(['property_id']); });
        Schema::table('order_items', function (Blueprint $table) { $table->dropSoftDeletes(); });
        Schema::table('advertisements', function (Blueprint $table) { $table->dropSoftDeletes(); });
        Schema::table('tickets', function (Blueprint $table) { $table->dropSoftDeletes(); });
        Schema::table('service_quotes', function (Blueprint $table) { $table->dropIndex('service_quotes_status_lookup_index'); });
    }
};
