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
        Schema::table('users', function (Blueprint $table) {
            // Add new columns for profile details
            
            // Username: unique and required
            $table->string('username', 50)->nullable()->unique()->after('email'); 
            $table->string('social_avatar_url')->nullable()->after('username'); 
            
            // Bio: optional text field
            $table->text('company')->nullable()->after('username');
            $table->text('bio')->nullable()->after('company');
            $table->string('years_of_experience')->nullable()->after('bio');
            // Date of Birth: optional date field
            $table->date('date_of_birth')->nullable()->after('phone');

            // Verification flag: boolean with a default value of false
            $table->boolean('is_verified')->default(false)->index()->after('date_of_birth');

            $table->boolean('is_partner')->default(false)->index()->after('is_admin');
            $table->boolean('is_buyer')->default(true)->index()->after('is_partner');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop all the columns added in the 'up' method
            $table->dropColumn([
                'username',
                'bio',
                'phone',
                'date_of_birth',
                'profile_image_url',
                'is_verified',
            ]);
        });
    }
};