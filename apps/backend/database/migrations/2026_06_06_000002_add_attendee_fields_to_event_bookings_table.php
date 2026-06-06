<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('event_bookings', function (Blueprint $table) {
            if (!Schema::hasColumn('event_bookings', 'user_name')) {
                $table->string('user_name')->nullable()->after('quantity');
            }

            if (!Schema::hasColumn('event_bookings', 'user_email')) {
                $table->string('user_email')->nullable()->after('user_name');
            }

            if (!Schema::hasColumn('event_bookings', 'user_phone')) {
                $table->string('user_phone')->nullable()->after('user_email');
            }
        });
    }

    public function down(): void
    {
        Schema::table('event_bookings', function (Blueprint $table) {
            foreach (['user_phone', 'user_email', 'user_name'] as $column) {
                if (Schema::hasColumn('event_bookings', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
