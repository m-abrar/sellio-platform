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
        Schema::create('email_templates', function (Blueprint $table) {
            $table->id();
            
            // A unique key to identify the template (e.g., 'plan_subscribed')
            $table->string('key')->unique(); 
            
            // A friendly title for the admin panel
            $table->string('title');
            
            // The dynamic subject line of the email
            $table->string('subject');
            
            // The HTML body of the email (long text)
            $table->longText('body'); 
            
            // Optional: description for internal reference
            $table->text('description')->nullable();
            
            $table->boolean('is_active')->default(true)->index()->comment('Whether the emails are allowed for this subject to be triggered.');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_templates');
    }
};