<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use App\Models\Category;
use App\Models\Location;
use App\Services\Partner\JobListingService;
use App\Http\Requests\Partner\JobListingRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;
use App\Http\Resources\JobListingResource;

/**
 * Class JobListingController
 * Manages the partner's recruitment listings.
 */
class JobListingController extends Controller
{
    /**
     * @var JobListingService
     */
    protected $jobService;

    /**
     * JobListingController constructor.
     *
     * @param JobListingService $jobService
     */
    public function __construct(JobListingService $jobService)
    {
        $this->jobService = $jobService;
    }

    /**
     * Display a listing of the partner's jobs.
     *
     * @return View
     */
    /**
     * Display a listing of the partner's jobs.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $jobs = JobListing::where('user_id', Auth::id())
            ->withCount(['applications', 'applicationsNew'])
            ->with(['category', 'location', 'brand', 'tags', 'employer'])
            ->latest()
            ->paginate(15);

        return $this->successResponse(JobListingResource::collection($jobs));
    }

    /**
     * Show the form for creating a new job.
     *
     * @return View
     */
    public function create() {
        return $this->successResponse($this->getFormData());
    }

    /**
     * Store a newly created job.
     *
     * @param JobListingRequest $request
     * @return RedirectResponse
     */
    public function store(JobListingRequest $request)
    {
        $job = $this->jobService->saveJob(Auth::user(), $request->validated());

        if ($request->wantsJson()) {
            return $this->successResponse(
                new JobListingResource($job),
                __('Job created successfully!'),
                201
            );
        }

        return $this->successResponse(null, __('Job created successfully!'));
    }

    /**
     * Show the form for editing a specific job.
     *
     * @param JobListing $joblisting
     * @return View
     */
    public function edit(JobListing $joblisting) {
        $this->authorizeOwner($joblisting);

        $data = array_merge($this->getFormData(), ['job' => $joblisting]);

        return $this->successResponse(null, 'Success');
    }

    /**
     * Update the specified job.
     *
     * @param JobListingRequest $request
     * @param JobListing $joblisting
     * @return RedirectResponse
     */
    public function update(JobListingRequest $request, JobListing $joblisting)
    {
        $this->authorizeOwner($joblisting);

        $this->jobService->saveJob(Auth::user(), $request->validated(), $joblisting);

        if ($request->wantsJson()) {
            return $this->successResponse(
                new JobListingResource($joblisting->fresh()),
                __('Job updated successfully!')
            );
        }

        return $this->successResponse(null, __('Job updated successfully!'));
    }

    /**
     * Remove the specified job.
     *
     * @param JobListing $joblisting
     * @return RedirectResponse
     */
    public function destroy(JobListing $joblisting)
    {
        $this->authorizeOwner($joblisting);
        $joblisting->delete();

        if (request()->wantsJson()) {
            return $this->successResponse(null, __('Job deleted successfully.')
            );
        }

        return $this->successResponse(null, __('Job deleted successfully.'));
    }

    /**
     * Get categories and locations filtered for jobs.
     *
     * @return array
     */
    protected function getFormData(): array
    {
        return [
            'categories' => Category::where('is_job', true)->get(),
            'locations'  => Location::where('is_job', true)->get(),
        ];
    }

    /**
     * Authorize that the partner owns the job listing.
     *
     * @param JobListing $job
     * @return void
     */
    protected function authorizeOwner(JobListing $job): void
    {
        if (Auth::id() !== $job->user_id) {
            abort(403, __('You do not have permission to modify this job.'));
        }
    }
}
