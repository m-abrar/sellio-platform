<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('themes')) {
            return;
        }

        $now = now();

        DB::table('themes')->updateOrInsert(
            ['theme_key' => 'ecommerce_b2b'],
            [
                'vertical' => 'ecommerce',
                'title' => 'Ecommerce B2B Catalog / RFQ',
                'order' => 495,
                'is_active' => false,
                'is_verified' => false,
                'status' => 'active',
                'admin_note' => 'B2B catalog theme for quote-first wholesale and procurement workflows.',
                'is_premium' => false,
                'color' => null,
                'variables' => json_encode([
                    '--color-primary' => '#0f766e',
                    '--color-secondary' => '#f8fafc',
                    '--color-accent' => '#2dd4bf',
                    '--color-text' => '#102033',
                    '--font-family-heading' => "'Inter', sans-serif",
                    '--font-family-base' => "'Inter', sans-serif",
                    '--border-radius' => '10px',
                    '--shadow-premium' => '0 24px 70px rgba(16,32,51,0.12)',
                    '--glass-blur' => '18px',
                ]),
                'config' => null,
                'deleted_at' => null,
                'updated_at' => $now,
                'created_at' => $now,
            ],
        );
    }

    public function down(): void
    {
        if (! Schema::hasTable('themes')) {
            return;
        }

        DB::table('themes')
            ->where('theme_key', 'ecommerce_b2b')
            ->delete();
    }
};
