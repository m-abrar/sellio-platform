<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\JobApplicationResource;
use App\Models\JobListing;
use App\Services\JobManagementService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ApiJobApplicationController extends Controller
{
    public function __construct(
        protected JobManagementService $jobService,
    ) {
    }

    public function store(Request $request, string $slug): JsonResponse
    {
        $validated = $request->validate([
            'cover_letter' => ['required', 'string', 'max:5000'],
            'portfolio_url' => ['nullable', 'url', 'max:255'],
        ]);

        try {
            $job = JobListing::where('slug', $slug)
                ->visibleTo(Auth::user())
                ->firstOrFail();

            if ($this->jobService->userHasApplied($job)) {
                return $this->errorResponse(__('You have already submitted an application for this job.'), 422);
            }

            $application = $this->jobService->submitApplication($job, $validated);

            return $this->successResponse(
                new JobApplicationResource($application->load(['job', 'user'])),
                __('Your application has been submitted successfully.'),
                201,
            );
        } catch (Exception $e) {
            Log::error('API job application failed: ' . $e->getMessage());

            return $this->errorResponse(__('Failed to submit application. Please try again.'), 500);
        }
    }
}
