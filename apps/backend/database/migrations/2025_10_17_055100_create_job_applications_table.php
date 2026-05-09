<?php

// database/migrations/YYYY_MM_DD_HHMMSS_create_job_applications_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateJobApplicationsTable
 * Provisoning the applicant tracking schema for the Recruitment module,
 * capturing candidate resumes, cover letters, and enforcing single-application constraints.
 */
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
            $table->foreignId('job_listing_id')->constrained('joblistings')->onDelete('restrict');
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict'); // The applicant

            // Application details
            $table->string('status', 30)->default('pending')->index();
            $table->text('cover_letter')->nullable();
            $table->string('resume_path')->nullable()->comment('Path to uploaded PDF/Docx');
            $table->string('portfolio_url')->nullable();
            
            // Unique index: A user can only apply to a job once
            $table->unique(['job_listing_id', 'user_id']); 
            $table->timestamp('viewed_at')->nullable();
            $table->text('admin_note')->nullable();
            $table->boolean('is_premium')->default(false)->index();
            $table->string('color', 20)->nullable();
            $table->softDeletes();
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






