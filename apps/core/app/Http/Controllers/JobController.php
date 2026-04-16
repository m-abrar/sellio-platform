<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Models\Category;
use App\Models\Location;
use App\Models\Type;
use App\Models\Tag;
use App\Services\JobManagementService;
use Illuminate\Http\Request;
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
    public function index(Request $request): View
    {
        return $this->search($request);
    }

    /**
     * Filter jobs based on search criteria.
     *
     * @param Request $request
     * @return View
     */
    public function search(Request $request): View
    {
        $categories = Category::where('is_job', true)->get();
        $locations  = Location::where('is_job', true)->get();
        $types      = Type::where('is_job', true)->get();
        $tags       = Tag::where('is_job', true)->get();
        

        $jobs = $this->jobService->searchJobs($request->all());

        return view('frontend.jobs.index', [
            'jobs'             => $jobs,
            'categories'       => $categories,
            'locations'        => $locations,
            'tags'             => $tags,
            'types'            => $types,
            'experienceLevels' => $this->jobService->getExperienceLevels(),
            'workplaceTypes'   => $this->jobService->getWorkplaceTypes(),
        ]);
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
            ->with(['employer', 'category', 'location', 'tags', 'brand'])
            ->firstOrFail();

        $relatedJobs = $this->jobService->getRelatedJobs($job);

        return view('frontend.jobs.show.job-detail', [
            'job'         => $job,
            'related_jobs' => $relatedJobs
        ]);
    }
}
