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

class JobController extends Controller
{
    use ManagesApproval;

    protected $modelClass = JobListing::class;

    public function index(Request $request): View
    {
        $categories = Category::where('is_job', 1)->get();
        $locations = Location::where('is_job', 1)->get();

        $jobs = JobListing::query()
            ->when($request->title, fn($q) => $q->where('title', 'like', '%' . $request->title . '%'))
            ->when($request->category_id, fn($q) => $q->where('category_id', $request->category_id))
            ->when($request->location_id, fn($q) => $q->where('location_id', $request->location_id))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return view('admin.jobs.index', compact('jobs', 'categories', 'locations'));
    }

    public function create(): View
    {
        $job = new JobListing();
        $categories = Category::all();
        $locations = Location::all();
        return view('admin.jobs.form', compact('job', 'categories', 'locations'));
    }

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

    public function edit(JobListing $job): View
    {
        // Explicitly load the model to plural name if route parameter is plural
        // But Laravel will pass single model bound object if bound correctly
        $categories = Category::all();
        $locations = Location::all();
        
        // Count applications manually
        $applicationsCount = $job->applications()->count();

        return view('admin.jobs.form', compact('job', 'categories', 'locations', 'applicationsCount'));
    }

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

    public function destroy(JobListing $job): RedirectResponse
    {
        $job->delete();
        return redirect()->route('admin.jobs.index')->with('success', __('Job deleted successfully.'));
    }

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
