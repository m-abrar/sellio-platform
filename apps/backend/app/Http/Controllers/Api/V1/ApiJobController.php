<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\JobListingResource;
use App\Models\Category;
use App\Models\JobListing;
use App\Models\Location;
use App\Models\Tag;
use App\Models\Type;
use App\Services\JobManagementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Class ApiJobController
 * Orchestrates the API-driven discovery and retrieval of recruitment listings, 
 * integrating complex filtering, employment taxonomy, and related entity mapping.
 */
class ApiJobController extends Controller
{
    /**
     * Internal service coordinator for recruitment business logic.
     * @var JobManagementService
     */
    protected JobManagementService $jobService;

    /**
     * ApiJobController constructor.
     * @param JobManagementService $jobService
     */
    public function __construct(JobManagementService $jobService)
    {
        $this->jobService = $jobService;
    }

    /**
     * List / search job listings with sidebar filter metadata.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $jobs = $this->jobService->searchJobs($request->all(), auth()->user());

        return JobListingResource::collection($jobs)->additional([
            'sidebar' => [
                'categories'       => Category::where('is_job', true)->get(),
                'locations'        => Location::where('is_job', true)->get(),
                'types'            => Type::where('is_job', true)->get(),
                'tags'             => Tag::where('is_job', true)->get(),
                'experience_levels'=> $this->jobService->getExperienceLevels(),
                'workplace_types'  => $this->jobService->getWorkplaceTypes(),
            ]
        ]);
    }

    /**
     * Show a single job listing with related jobs.
     */
    public function show(string $slug): JsonResponse
    {
        $job = JobListing::where('slug', $slug)
            ->visibleTo(auth()->user())
            ->with(['employer', 'category', 'location', 'tags', 'brand', 'media'])
            ->firstOrFail();

        $relatedJobs = $this->jobService->getRelatedJobs($job);

        return $this->successResponse(
            new JobListingResource($job),
            null,
            200,
            [
                'related_jobs' => JobListingResource::collection($relatedJobs),
            ]
        );
    }

    /**
     * Filter jobs by category slug.
     */
    public function category(string $categorySlug): AnonymousResourceCollection
    {
        return $this->index(new Request(['category' => $categorySlug]));
    }
}
