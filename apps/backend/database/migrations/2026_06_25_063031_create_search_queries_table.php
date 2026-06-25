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
        Schema::create('search_queries', function (Blueprint $table) {
            $table->id();
            $table->string('module', 50)->index();
            $table->string('keyword', 255)->nullable();
            $table->json('filters')->nullable();
            $table->unsignedInteger('result_count')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('created_at')->useCurrent()->index();

            $table->index(['module', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('search_queries');
    }
};
