<?php

namespace Tests\Feature;

use App\Events\JobApplicationReceived;
use App\Models\JobListing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class BuyerJobApplicationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_buyer_can_apply_once_to_a_job(): void
    {
        Event::fake([JobApplicationReceived::class]);

        $buyer = User::factory()->create();
        $job = JobListing::factory()->create();
        $payload = [
            'cover_letter' => 'I have relevant experience and would like to join your team.',
            'portfolio_url' => 'https://example.com/portfolio',
        ];

        $this->actingAs($buyer, 'sanctum')
            ->postJson("/api/v1/jobs/{$job->slug}/applications", $payload)
            ->assertCreated()
            ->assertJsonPath('data.user_id', $buyer->id)
            ->assertJsonPath('data.job_listing_id', $job->id)
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('job_applications', [
            'user_id' => $buyer->id,
            'job_listing_id' => $job->id,
            'portfolio_url' => 'https://example.com/portfolio',
            'status' => 'pending',
        ]);

        $this->actingAs($buyer, 'sanctum')
            ->postJson("/api/v1/jobs/{$job->slug}/applications", $payload)
            ->assertUnprocessable()
            ->assertJsonPath('message', 'You have already submitted an application for this job.');
    }
}
