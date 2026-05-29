<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\JobListing;
use App\Models\Location;
use App\Models\Type;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PartnerJobApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_partner_can_create_update_and_delete_job_listing(): void
    {
        Storage::fake('public');

        // Create partner user and role
        $partner = User::factory()->partner()->create();
        Role::create(['name' => 'partner']);
        $partner->assignRole('partner');

        // Create metadata for jobs
        $category = Category::factory()->create(['is_job' => true]);
        $type = Type::factory()->create(['is_job' => true]);
        $location = Location::factory()->create(['is_job' => true]);

        // 1. Create a Job Listing
        $createResponse = $this->actingAs($partner, 'sanctum')
            ->post('/api/dashboard/partner/joblistings', [
                'title' => 'Senior React Developer',
                'description' => 'We are looking for a Senior React Developer with 5+ years of experience in front-end web development.',
                'category_id' => $category->id,
                'type_id' => $type->id,
                'location_id' => $location->id,
                'salary_min' => '90000',
                'salary_max' => '120000',
                'salary_frequency' => 'yearly',
                'experience_level' => 'Senior', // Will map to 3 in prepareForValidation
                'workplace_type' => '1', // Remote
                'required_education' => 'Bachelors Degree',
                'application_deadline' => '2026-08-31',
                'address' => '100 Tech Lane',
                'city' => 'San Francisco',
                'country' => 'USA',
                'is_published' => '1',
                'is_featured' => '0',
                'is_contract' => '0',
                'is_full_time' => '1',
                'tags' => ['React', 'TypeScript', 'Frontend'],
                'main_image' => UploadedFile::fake()->image('job-logo.jpg', 400, 400),
            ], ['Accept' => 'application/json']);

        $createResponse->assertCreated()
            ->assertJsonPath('data.title', 'Senior React Developer')
            ->assertJsonPath('data.specs.salary_min', 90000)
            ->assertJsonPath('data.specs.salary_max', 120000)
            ->assertJsonPath('data.specs.experience_level', 3) // mapped Senior to 3
            ->assertJsonPath('data.specs.workplace_type', 1)
            ->assertJsonPath('data.location.address', '100 Tech Lane')
            ->assertJsonPath('data.location.city', 'San Francisco');

        $jobListing = JobListing::with(['media', 'category', 'type', 'location', 'tags'])->findOrFail($createResponse->json('data.id'));
        $this->assertNotNull($jobListing->getFirstMedia(JobListing::PRIMARY_MEDIA));
        $this->assertCount(3, $jobListing->tags);

        $this->assertDatabaseHas('joblistings', [
            'id' => $jobListing->id,
            'user_id' => $partner->id,
            'title' => 'Senior React Developer',
            'salary_min' => '90000',
            'salary_max' => '120000',
            'experience_level' => 3,
            'workplace_type' => 1,
            'address' => '100 Tech Lane',
            'city' => 'San Francisco',
        ]);

        // 2. Update the Job Listing
        $updateResponse = $this->actingAs($partner, 'sanctum')
            ->post("/api/dashboard/partner/joblistings/{$jobListing->id}", [
                '_method' => 'PATCH',
                'title' => 'Lead Frontend Engineer', // Modified Title
                'description' => 'We are looking for a Lead Frontend Engineer with 7+ years of experience.',
                'category_id' => $category->id,
                'type_id' => $type->id,
                'location_id' => $location->id,
                'salary_min' => '110000', // Modified Salary
                'salary_max' => '140000',
                'salary_frequency' => 'yearly',
                'experience_level' => 'Lead', // Will map to 4
                'workplace_type' => '2', // Hybrid
                'required_education' => 'Bachelors Degree',
                'application_deadline' => '2026-08-31',
                'address' => '200 Tech Lane',
                'city' => 'San Francisco',
                'country' => 'USA',
                'is_published' => '1',
                'is_featured' => '1',
                'is_contract' => '0',
                'is_full_time' => '1',
                'tags' => ['React', 'TypeScript', 'Lead'],
                'sync_existing_media' => '1',
                'existing_main_media_id' => (string) $jobListing->getFirstMedia(JobListing::PRIMARY_MEDIA)->id,
            ], ['Accept' => 'application/json']);

        $updateResponse->assertOk()
            ->assertJsonPath('data.title', 'Lead Frontend Engineer')
            ->assertJsonPath('data.specs.salary_min', 110000)
            ->assertJsonPath('data.specs.salary_max', 140000)
            ->assertJsonPath('data.specs.experience_level', 4); // mapped Lead to 4

        $this->assertDatabaseHas('joblistings', [
            'id' => $jobListing->id,
            'title' => 'Lead Frontend Engineer',
            'salary_min' => '110000',
            'salary_max' => '140000',
            'experience_level' => 4,
            'workplace_type' => 2,
        ]);

        // 3. Delete the Job Listing
        $deleteResponse = $this->actingAs($partner, 'sanctum')
            ->delete("/api/dashboard/partner/joblistings/{$jobListing->id}", [], ['Accept' => 'application/json']);

        $deleteResponse->assertOk();
        $this->assertSoftDeleted('joblistings', [
            'id' => $jobListing->id,
        ]);
    }

    public function test_unauthorized_partner_cannot_delete_other_jobs(): void
    {
        Role::create(['name' => 'partner']);
        
        $partnerOne = User::factory()->partner()->create();
        $partnerOne->assignRole('partner');
        
        $partnerTwo = User::factory()->partner()->create();
        $partnerTwo->assignRole('partner');

        $job = JobListing::factory()->create([
            'user_id' => $partnerOne->id,
        ]);

        $response = $this->actingAs($partnerTwo, 'sanctum')
            ->delete("/api/dashboard/partner/joblistings/{$job->id}", [], ['Accept' => 'application/json']);

        $response->assertStatus(403);
        $this->assertDatabaseHas('joblistings', [
            'id' => $job->id,
            'deleted_at' => null,
        ]);
    }
}
