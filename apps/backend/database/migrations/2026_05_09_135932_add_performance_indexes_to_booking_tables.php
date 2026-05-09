<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The list of tables involved in the unified booking feed.
     */
    protected array $tables = [
        'property_bookings',
        'auto_inquiries',
        'event_bookings',
        'job_applications',
        'service_quotes',
        'service_appointments',
        'classified_inquiries'
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        foreach ($this->tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) {
                    // Optimized index for the UNION ALL feed used in BookingManagementService
                    // Covers filtering by status and ordering by created_at
                    $table->index(['status', 'created_at']);
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        foreach ($this->tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->dropIndex(['status', 'created_at']);
                });
            }
        }
    }
};
