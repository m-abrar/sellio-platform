<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use App\Models\Category;
use App\Models\Location;
use App\Http\Requests\Admin\JobListingRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use App\Traits\ManagesApproval;
use App\Services\Admin\JobManagementService;

/**
 * Class JobController
 * Orchestrates the recruitment vertical of the marketplace, 
 * managing job listings, employer relationship mapping, and the administrative approval lifecycle.
 */
class JobController extends Controller
{
    use ManagesApproval;

    /**
     * The model class associated with the approval trait.
     *
     * @var string
     */
    protected $modelClass = JobListing::class;

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
     * Display a filtered and paginated list of all job listings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $categories = Category::active()->where('is_job', 1)->get();
        if ($categories->isEmpty()) $categories = Category::active()->get();

        $locations = Location::active()->where('is_job', 1)->get();
        if ($locations->isEmpty()) $locations = Location::active()->get();

        $jobs = JobListing::query()
            ->with(['employer', 'category', 'location'])
            ->when($request->title, fn($q) => $q->where('title', 'like', '%' . $request->title . '%'))
            ->when($request->category_id, fn($q) => $q->where('category_id', $request->category_id))
            ->when($request->location_id, fn($q) => $q->where('location_id', $request->location_id))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return view('admin.jobs.index', compact('jobs', 'categories', 'locations'));
    }

    /**
     * Show the form for creating a new job listing.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $job = new JobListing();
        $categories = Category::active()->where('is_job', 1)->get();
        if ($categories->isEmpty()) $categories = Category::active()->get();

        $locations = Location::active()->where('is_job', 1)->get();
        if ($locations->isEmpty()) $locations = Location::active()->get();
        
        return view('admin.jobs.form', compact('job', 'categories', 'locations'));
    }

    /**
     * Store a newly created job listing in the database.
     *
     * @param  \App\Http\Requests\Admin\JobListingRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(JobListingRequest $request): RedirectResponse
    {
        try {
            $job = $this->jobService->saveJob($request->validated());

            return redirect()
                ->route('admin.jobs.edit', $job->id)
                ->with('success', __('Job created successfully.'));
        } catch (\Exception $e) {
            Log::error("Job Creation Failure: {$e->getMessage()}");
            return back()->withInput()->with('error', __('Synchronization failure.'));
        }
    }

    /**
     * Show the form for editing an existing job listing and its application metrics.
     *
     * @param  \App\Models\JobListing  $job
     * @return \Illuminate\View\View
     */
    public function edit(JobListing $job): View
    {
        $categories = Category::active()->where('is_job', 1)->get();
        if ($categories->isEmpty()) $categories = Category::active()->get();

        $locations = Location::active()->where('is_job', 1)->get();
        if ($locations->isEmpty()) $locations = Location::active()->get();
        $applicationsCount = $job->applications()->count();

        return view('admin.jobs.form', compact('job', 'categories', 'locations', 'applicationsCount'));
    }

    /**
     * Update an existing job listing in the database.
     *
     * @param  \App\Http\Requests\Admin\JobListingRequest  $request
     * @param  \App\Models\JobListing  $job
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(JobListingRequest $request, JobListing $job): RedirectResponse
    {
        try {
            $this->jobService->saveJob($request->validated(), $job);

            return redirect()
                ->route('admin.jobs.edit', $job->id)
                ->with('success', __('Job updated successfully.'));
        } catch (\Exception $e) {
            Log::error("Job Update Failure: {$e->getMessage()}", ['id' => $job->id]);
            return back()->withInput()->with('error', __('Update synchronization failure.'));
        }
    }

    /**
     * Remove a job listing from the database.
     *
     * @param  \App\Models\JobListing  $job
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(JobListing $job): RedirectResponse
    {
        $job->delete();
        return redirect()->route('admin.jobs.index')->with('success', __('Job deleted successfully.'));
    }

    /**
     * Replicate an existing job as a draft copy for quick entry.
     *
     * @param  \App\Models\JobListing  $job
     * @return \Illuminate\Http\RedirectResponse
     */
    public function duplicate(JobListing $job): RedirectResponse
    {
        try {
            $clone = $this->jobService->duplicateJob($job);

            return redirect()
                ->route('admin.jobs.edit', $clone->id)
                ->with('success', __('Job duplicated as draft successfully.'));
        } catch (\Exception $e) {
            Log::error("Job Duplication Failure: {$e->getMessage()}", ['id' => $job->id]);
            return back()->with('error', __('Duplication failure.'));
        }
    }
}
