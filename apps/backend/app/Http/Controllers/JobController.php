<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchJobRequest;
use App\Models\JobListing;
use App\Services\JobManagementService;
use Illuminate\Contracts\View\View;

/**
 * Class JobController
 *
 * Manages job discovery, search filtering, and detailed job views.
 */
class JobController extends Controller
{
    /**
     * @var JobManagementService
     */
    protected $jobService;

    /**
     * JobController constructor.
     *
     * @param JobManagementService $jobService
     */
    public function __construct(JobManagementService $jobService)
    {
        $this->jobService = $jobService;
    }

    /**
     * Display the initial job listing page.
     *
     * @param Request $request
     * @return View
     */
    public function index(SearchJobRequest $request): View
    {
        return $this->search($request);
    }

    /**
     * Filter jobs based on search criteria.
     *
     * @param SearchJobRequest $request
     * @return View
     */
    public function search(SearchJobRequest $request): View
    {
        $taxonomies = $this->jobService->getFilterTaxonomies();
        $jobs = $this->jobService->searchJobs($request->validated());

        return view('frontend.jobs.index', array_merge($taxonomies, [
            'jobs'             => $jobs,
            'experienceLevels' => $this->jobService->getExperienceLevels(),
            'workplaceTypes'   => $this->jobService->getWorkplaceTypes(),
        ]));
    }

    /**
     * Display a specific job listing and its related jobs.
     *
     * @param string $slug
     * @return View
     */
    public function show(string $slug): View
    {
        $job = JobListing::where('slug', $slug)
            ->active()
            ->with(['employer', 'category', 'location', 'tags', 'brand'])
            ->firstOrFail();

        $relatedJobs = $this->jobService->getRelatedJobs($job);

        return view('frontend.jobs.show.job-detail', [
            'job'         => $job,
            'related_jobs' => $relatedJobs
        ]);
    }
}
