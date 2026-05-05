<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Illuminate\View\View;

class JobApplicationController extends Controller
{
    /**
     * Display a listing of job applications with advanced filters.
     */
    public function index(Request $request, string $status = 'all'): View
    {
        $status = $request->get('status', $status);
        
        $applications = JobApplication::with(['job.category', 'job.location', 'user'])
            ->when($request->job, fn($q) => $q->where('job_listing_id', $request->job))
            ->when($request->job_title, fn($q) => $q->whereHas('job', fn($j) => $j->where('title', 'LIKE', "%{$request->job_title}%")))
            ->when($request->category, function($q) use ($request) {
                $q->whereHas('job', fn($j) => $j->where('category_id', $request->category));
            })
            ->when($status !== 'all', fn($q) => $q->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $jobs = JobListing::select('id', 'title', 'category_id')->with('category:id,title')->get();
        $categories = \App\Models\Category::where('is_job', true)->select('id', 'title')->get();

        return view('admin.job-applications.index', compact('applications', 'jobs', 'categories', 'status'));
    }

    /**
     * Show the form for creating a new job application.
     */
    public function create(): View
    {
        $application = new JobApplication();
        $jobs = JobListing::select('id', 'title')->get();
        $users = \App\Models\User::select('id', 'name', 'email')->get();
        
        return view('admin.job-applications.form', compact('application', 'jobs', 'users'));
    }

    /**
     * Store a newly created job application.
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'job_listing_id' => 'required|exists:joblistings,id',
            'user_id' => 'required|exists:users,id',
            'cover_letter' => 'nullable|string',
            'status' => 'required|string',
        ]);

        JobApplication::create($validated);

        return redirect()
            ->route('admin.job-applications.index')
            ->with('success', __('Application logged successfully.'));
    }

    /**
     * Show the form for editing the specified job application.
     */
    public function edit(int $id): View
    {
        $application = JobApplication::findOrFail($id);
        $jobs = JobListing::select('id', 'title')->get();
        $users = \App\Models\User::select('id', 'name', 'email')->get();

        return view('admin.job-applications.form', compact('application', 'jobs', 'users'));
    }

    /**
     * Update the specified job application.
     */
    public function update(Request $request, int $id): \Illuminate\Http\RedirectResponse
    {
        $application = JobApplication::findOrFail($id);

        $validated = $request->validate([
            'job_listing_id' => 'required|exists:joblistings,id',
            'user_id' => 'required|exists:users,id',
            'cover_letter' => 'nullable|string',
            'status' => 'required|string',
        ]);

        $application->update($validated);

        return redirect()
            ->route('admin.job-applications.index')
            ->with('success', __('Application updated successfully.'));
    }

    /**
     * Remove the specified job application.
     */
    public function destroy(int $id): \Illuminate\Http\RedirectResponse
    {
        $application = JobApplication::findOrFail($id);
        $application->delete();

        return redirect()
            ->route('admin.job-applications.index')
            ->with('success', __('Application deleted successfully.'));
    }

    /**
     * Display the specified job application.
     */
    public function show(int $id): View
    {
        $application = JobApplication::with(['job.category', 'user'])->findOrFail($id);
        return view('admin.job-applications.show', compact('application'));
    }
}
