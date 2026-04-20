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
        $applications = JobApplication::with(['job.category', 'job.location', 'user'])
            ->when($request->job, fn($q) => $q->where('job_listing_id', $request->job))
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
     * Display the specified job application.
     */
    public function show(int $id): View
    {
        $application = JobApplication::with(['job', 'user'])
            ->findOrFail($id);

        return view('admin.job-applications.show', compact('application'));
    }
}
