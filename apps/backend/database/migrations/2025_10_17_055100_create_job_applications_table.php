<?php

// database/migrations/YYYY_MM_DD_HHMMSS_create_job_applications_table.php

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
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            
            // Foreign keys
            $table->foreignId('job_listing_id')->constrained('joblistings')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // The applicant

            // Application details
            $table->string('status', 30)->default('pending')->index();
            $table->text('cover_letter')->nullable();
            $table->string('resume_path')->nullable()->comment('Path to uploaded PDF/Docx');
            $table->string('portfolio_url')->nullable();
            $table->text('admin_notes')->nullable()->comment('Internal recruitment notes');
            
            // Unique index: A user can only apply to a job once
            $table->unique(['job_listing_id', 'user_id']); 
            $table->timestamp('viewed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};