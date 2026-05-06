<?php

// File: database/seeders/JobSeeder.php
// Purpose: Seeds job listings (JobListing model) and their corresponding applications
// (JobApplication model) for development and demonstration. It ensures data integrity by
// linking listings to existing partner Users, Locations, Job Categories, and Types.

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Faker\Factory as Faker;
use App\Models\JobListing;
use App\Models\JobApplication; // Make sure to import JobApplication model
use App\Models\User; 
use Illuminate\Support\Facades\Schema; // <-- ADDED: For foreign key management

/**
 * Class JobSeeder
 *
 * Populates the job module tables with realistic mock data, including listing details,
 * geographical information, and sample applications.
 */
class JobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        // Initialize the Faker instance for generating random data
        $faker = Faker::create();
        
        $initialJobCount = JobListing::count();
        $initialApplicationCount = JobApplication::count();

        $this->command->info('💼✨ Starting **Job Module Seeder**...');
        $this->command->line("Initial Counts | Listings: {$initialJobCount}, Applications: {$initialApplicationCount}");
        $this->command->newLine();
        
        // --- FIX: Disable/Enable foreign key constraints for safe truncation ---
        Schema::disableForeignKeyConstraints();
        
        // Truncating in any order is now safe
        JobApplication::query()->delete();
        JobListing::query()->delete();
        
        Schema::enableForeignKeyConstraints();
        // --- END FIX ---
        
        $this->command->line(' 🗑️ Cleared existing job listings and applications.');
        $jobsCreatedCount = 0;
        $applicationsCreatedCount = 0;

        // 1. Get IDs from base tables required for foreign key relationships
        
        // 1. Get IDs from base tables required for foreign key relationships
        
        // Jobs must be posted by users designated as 'partners' (e.g., companies/recruiters)
        $userIds = DB::table('users')->where('is_partner', true)->pluck('id')->toArray();
        // Pick only Level 2 locations (Cities) to ensure listing specificity
        $locationIds = DB::table('locations')->where('level', 2)->pluck('id')->toArray();
        
        // Ensure we only grab job-specific categories, types, and brands using module flags
        $categoryIds = DB::table('categories')->where('is_job', true)->pluck('id')->toArray();
        $typeIds = DB::table('types')->where('is_job', true)->pluck('id')->toArray();
        $brandIds = DB::table('brands')->where('is_job', true)->pluck('id')->toArray();
        
        $maxUsers = count($userIds);

        // Prerequisite check: ensure minimum data exists before attempting to seed
        if (empty($userIds) || empty($locationIds) || empty($categoryIds) || $maxUsers < 2) {
            $this->command->error('❌ **Skipping JobSeeder**: Missing base data or not enough partners.');
            $this->command->line('Required: Partner Users (found: ' . count($userIds) . '), Locations (found: ' . count($locationIds) . '), Job Categories (found: ' . count($categoryIds) . ').');
            $this->command->info('✅ Job module seeding finished (Skipped).');
            return;
        }

        $numberOfListings = 15;
        $this->command->info("--- Seeding **{$numberOfListings}** Job Listings ---");

        // Define simple Enum IDs for job specifics (these must align with application logic/database schema)
        $experienceLevels = [1, 2, 3, 4]; // 1=Junior, 4=Lead
        $workplaceTypes = [1, 2, 3];  // 1=On-site, 2=Hybrid, 3=Remote

        $jobs = [];
        
        // 2. CREATE JOB LISTINGS
        $jobTitles = [
            'Senior Full-Stack Engineer', 'UX/UI Design Lead', 'Digital Marketing Strategist',
            'Cloud Solutions Architect', 'Data Scientist (AI/ML)', 'Product Manager',
            'Cybersecurity Analyst', 'DevOps Engineer', 'Mobile App Developer (iOS/Android)',
            'Creative Content Director', 'Customer Success Manager', 'Financial Analyst',
            'Human Resources Business Partner', 'Operations Manager', 'Project Management Officer'
        ];

        foreach (range(1, $numberOfListings) as $index) {
            $title = $jobTitles[$index - 1] ?? $faker->jobTitle;
            $salaryMin = $faker->numberBetween(60000, 110000);
            $salaryMax = $faker->numberBetween($salaryMin + 20000, $salaryMin + 80000);
            $createdAt = now()->subDays($faker->numberBetween(1, 30));

            $job = JobListing::create([ 
                // Foreign Keys
                'user_id' => $faker->randomElement($userIds),
                'category_id' => $faker->randomElement($categoryIds),
                'type_id' => $faker->randomElement($typeIds),
                'brand_id' => !empty($brandIds) ? $faker->randomElement($brandIds) : null,
                'location_id' => $faker->randomElement($locationIds),
                
                // Core Data
                'title' => $title,
                'slug' => Str::slug($title . '-' . $index) . '-' . Str::random(5),
                'description' => $faker->realText(1000), // Professional corporate description
                'salary_min' => $salaryMin,
                'salary_max' => $salaryMax,
                'salary_frequency' => 'yearly',
                
                // Job Specifics
                'experience_level' => $faker->randomElement($experienceLevels),
                'workplace_type' => $faker->randomElement($workplaceTypes),
                'required_education' => $faker->randomElement(['Bachelors Degree', 'Masters Degree', 'PhD preferred']),
                'application_deadline' => $faker->dateTimeBetween('now +1 week', 'now +2 months'),

                // Detailed Location/Address fields
                'address' => $faker->streetAddress,
                'city' => $faker->city,
                'state' => $faker->stateAbbr,
                'country' => 'USA',
                'zip_code' => $faker->postcode,
                'latitude' => $faker->latitude(34, 42),
                'longitude' => $faker->longitude(-118, -74),

                // Hardened Moderation & Status
                'status'        => 'approved',
                'admin_note'    => 'Verified corporate recruitment partner.',
                'is_verified'   => true,

                // Status/Visibility Flags
                'is_published' => true,
                'is_featured' => $faker->boolean(20),
                'is_contract' => $faker->boolean(20),
                'is_full_time' => true,
                'approved_at'       => now(),
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);
            
            $jobs[] = $job;
            $jobsCreatedCount++;
        }
        $this->command->line(" ✓ Created {$jobsCreatedCount} job listings.");


        // 3. CREATE JOB APPLICATIONS
        
        // Get all user IDs (potential applicants) regardless of 'is_partner' status
        $allUserIds = DB::table('users')->pluck('id')->toArray();
        $maxApplicants = count($allUserIds);
        
        // Check if there are listings and at least 2 potential unique applicants
        if (empty($jobs) || $maxApplicants < 2) {
            $this->command->line('⚠️ Skipping JobApplication seeding: Not enough jobs or unique users available for applicants.');
            return;
        }

        $this->command->info('--- Seeding Job Applications ---');

        $applicationStatuses = ['pending', 'reviewed', 'interview', 'rejected', 'hired'];
        
        foreach ($jobs as $job) {
            
            // Business Logic: Exclude the job poster from the applicant pool to ensure separation of duties
            $availableApplicants = array_diff($allUserIds, [$job->user_id]);
            $maxPossibleApplications = count($availableApplicants);
            $minApplicationsToCreate = 2;
            
            if ($maxPossibleApplications < $minApplicationsToCreate) {
                // Not enough unique users available to satisfy the minimum application count
                continue;
            }

            // Determine number of applications (between 2 and 5 for a realistic density)
            $maxLimit = min(5, $maxPossibleApplications);
            $numApplications = $faker->numberBetween($minApplicationsToCreate, $maxLimit);
            
            // Select unique applicant IDs randomly from the available pool
            // array_rand can return a single key (integer) if $numApplications is 1, so cast to array
            $randomKeys = (array) array_rand($availableApplicants, $numApplications);
            // Re-map keys to their corresponding user IDs
            $applicantIds = array_map(fn($key) => $availableApplicants[$key], $randomKeys);
            
            // Create the application records
            foreach ($applicantIds as $applicantId) {
                
                $job->applications()->create([
                    'user_id' => $applicantId,
                    'status' => $faker->randomElement($applicationStatuses),
                    'cover_letter' => $faker->paragraphs(1, true),
                    'resume_path' => 'resumes/demo-resume-' . $index . '.pdf',
                    'portfolio_url' => $faker->url(),
                    'admin_note'    => $faker->boolean(30) ? 'Strong candidate based on initial review.' : null,
                    'created_at' => $faker->dateTimeBetween($job->created_at, 'now'),
                ]);
                $applicationsCreatedCount++;
            }
        }
        $this->command->line(" ✓ Created {$applicationsCreatedCount} job applications.");

        // Seeder completion message
        $finalJobCount = JobListing::count();
        $finalApplicationCount = JobApplication::count();

        $this->command->newLine();
        $this->command->info("📊 **Summary of Created Records**:");
        $this->command->info(" - Job Listings Created: **{$jobsCreatedCount}**");
        $this->command->info(" - Applications Created: **{$applicationsCreatedCount}**");
        $this->command->line("Total Job Listings: {$finalJobCount} | Total Applications: {$finalApplicationCount}");
        
        $this->command->newLine();
        $this->command->info('✅ Job module (Listings and Applications) seeded successfully.');
    }
}