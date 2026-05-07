<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\JobApplication;
use App\Models\JobListing;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class JobApplicationController
 * Orchestrates administrative recruitment management, 
 * coordinating job applications, candidate relationship mapping, and status tracking.
 */
class JobApplicationController extends Controller
{
    /**
     * Display a filtered and paginated list of all job applications.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $status
     * @return \Illuminate\View\View
     */
    public function index(Request $request, string $status = 'all'): View
    {
        $status = $request->query('status', $status);
        
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
        $categories = Category::where('is_job', true)->select('id', 'title')->get();

        return view('admin.job-applications.index', compact('applications', 'jobs', 'categories', 'status'));
    }

    /**
     * Show the form for creating a manual job application record.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $application = new JobApplication();
        $jobs = JobListing::select('id', 'title')->get();
        $users = User::select('id', 'name', 'email')->get();
        
        return view('admin.job-applications.form', compact('application', 'jobs', 'users'));
    }

    /**
     * Store a newly created job application record in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'job_listing_id' => 'required|exists:job_listings,id',
            'user_id'        => 'required|exists:users,id',
            'cover_letter'   => 'nullable|string',
            'status'         => 'required|string|max:255',
        ]);

        JobApplication::create($validated);

        return redirect()
            ->route('admin.job-applications.index')
            ->with('success', __('Application logged successfully.'));
    }

    /**
     * Display the specific details of a job application.
     *
     * @param  \App\Models\JobApplication  $jobApplication
     * @return \Illuminate\View\View
     */
    public function show(JobApplication $jobApplication): View
    {
        $jobApplication->load(['job.category', 'user']);
        return view('admin.job-applications.show', ['application' => $jobApplication]);
    }

    /**
     * Show the form for editing an existing job application.
     *
     * @param  \App\Models\JobApplication  $jobApplication
     * @return \Illuminate\View\View
     */
    public function edit(JobApplication $jobApplication): View
    {
        $jobs = JobListing::select('id', 'title')->get();
        $users = User::select('id', 'name', 'email')->get();

        return view('admin.job-applications.form', [
            'application' => $jobApplication, 
            'jobs'        => $jobs, 
            'users'       => $users
        ]);
    }

    /**
     * Update an existing job application record in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\JobApplication  $jobApplication
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, JobApplication $jobApplication): RedirectResponse
    {
        $validated = $request->validate([
            'job_listing_id' => 'required|exists:job_listings,id',
            'user_id'        => 'required|exists:users,id',
            'cover_letter'   => 'nullable|string',
            'status'         => 'required|string|max:255',
        ]);

        $jobApplication->update($validated);

        return redirect()
            ->route('admin.job-applications.index')
            ->with('success', __('Application updated successfully.'));
    }

    /**
     * Remove a job application record from the database.
     *
     * @param  \App\Models\JobApplication  $jobApplication
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(JobApplication $jobApplication): RedirectResponse
    {
        $jobApplication->delete();

        return redirect()
            ->route('admin.job-applications.index')
            ->with('success', __('Application deleted successfully.'));
    }
}
