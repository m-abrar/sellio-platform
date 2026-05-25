<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->text('partner_reply')->nullable()->after('comment');
            $table->timestamp('partner_replied_at')->nullable()->after('partner_reply');
            $table->foreignId('partner_id')->nullable()->after('partner_replied_at')->constrained('users')->nullOnDelete();
        });

        // Move legacy partner replies out of admin_note into the dedicated column.
        DB::table('reviews')
            ->whereNotNull('admin_note')
            ->whereNull('partner_reply')
            ->update([
                'partner_reply' => DB::raw('admin_note'),
                'partner_replied_at' => DB::raw('updated_at'),
            ]);
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropConstrainedForeignId('partner_id');
            $table->dropColumn(['partner_reply', 'partner_replied_at']);
        });
    }
};
