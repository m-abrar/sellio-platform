<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('addons')) {
            Schema::create('addons', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->text('description')->nullable();
                $table->decimal('price', 10, 2)->default(0);
                $table->string('status', 20)->default('active');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('line_items')) {
            Schema::create('line_items', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->text('description')->nullable();
                $table->string('type', 30)->default('fixed');
                $table->decimal('amount', 10, 2)->default(0);
                $table->string('applies_on', 30)->default('booking');
                $table->unsignedInteger('order')->default(0);
                $table->string('status', 20)->default('active');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('booking_line_items')) {
            Schema::create('booking_line_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('property_booking_id')->constrained()->cascadeOnDelete();
                $table->string('title');
                $table->unsignedInteger('quantity')->default(1);
                $table->decimal('price', 10, 2)->default(0);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('ledger_transactions')) {
            Schema::create('ledger_transactions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('property_booking_id')->nullable()->constrained()->nullOnDelete();
                $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
                $table->string('reference_number')->nullable();
                $table->decimal('amount', 15, 2)->default(0);
                $table->string('status', 30)->default('pending');
                $table->string('payment_method', 100)->nullable();
                $table->text('description')->nullable();
                $table->text('notes')->nullable();
                $table->timestamp('transaction_date')->nullable();
                $table->softDeletes();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('subscription_quotas')) {
            Schema::create('subscription_quotas', function (Blueprint $table) {
                $table->id();
                $table->foreignId('subscription_id')->constrained()->cascadeOnDelete();
                $table->unsignedInteger('listings_used')->default(0);
                $table->unsignedInteger('featured_used')->default(0);
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_quotas');
        Schema::dropIfExists('ledger_transactions');
        Schema::dropIfExists('booking_line_items');
        Schema::dropIfExists('line_items');
        Schema::dropIfExists('addons');
    }
};
