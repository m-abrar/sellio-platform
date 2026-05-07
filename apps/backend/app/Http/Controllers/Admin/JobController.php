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
     * Display a filtered and paginated list of all job listings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $categories = Category::where('is_job', 1)->get();
        $locations = Location::where('is_job', 1)->get();

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
        $categories = Category::where('is_job', 1)->get();
        $locations = Location::where('is_job', 1)->get();
        
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
        $validated = $request->validated();
        $validated['user_id'] = auth()->id();
        $validated['is_published'] = $request->boolean('is_published');
        $validated['is_featured'] = $request->boolean('is_featured');
        $validated['is_contract'] = $request->boolean('is_contract');
        $validated['is_full_time'] = $request->boolean('is_full_time');

        $job = JobListing::create($validated);

        return redirect()
            ->route('admin.jobs.edit', $job->id)
            ->with('success', __('Job created successfully.'));
    }

    /**
     * Show the form for editing an existing job listing and its application metrics.
     *
     * @param  \App\Models\JobListing  $job
     * @return \Illuminate\View\View
     */
    public function edit(JobListing $job): View
    {
        $categories = Category::where('is_job', 1)->get();
        $locations = Location::where('is_job', 1)->get();
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
        $validated = $request->validated();
        $validated['is_published'] = $request->boolean('is_published');
        $validated['is_featured'] = $request->boolean('is_featured');
        $validated['is_contract'] = $request->boolean('is_contract');
        $validated['is_full_time'] = $request->boolean('is_full_time');

        $job->update($validated);

        return redirect()
            ->route('admin.jobs.edit', $job->id)
            ->with('success', __('Job updated successfully.'));
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
        $clone = $job->replicate();
        $clone->is_published = false;
        $clone->approved_at = null;
        $clone->title = $job->title . ' (Copy)';
        $clone->save();

        return redirect()
            ->route('admin.jobs.edit', $clone->id)
            ->with('success', __('Job duplicated as draft successfully.'));
    }
}
