<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Models\JobApplication;
use App\Http\Requests\JobApplicationStoreRequest;
use App\Services\JobManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/**
 * Class JobApplicationController
 *
 * Manages the submission, viewing, and confirmation of job applications.
 */
class JobApplicationController extends Controller
{
    /**
     * @var JobManagementService
     */
    protected $jobService;

    /**
     * JobApplicationController constructor.
     *
     * @param JobManagementService $jobService
     */
    public function __construct(JobManagementService $jobService)
    {
        $this->jobService = $jobService;
    }

    /**
     * Display the application form or the "already applied" status.
     *
     * @param JobListing $job
     * @return View
     */
    public function apply(JobListing $job): View
    {
        $hasApplied = $this->jobService->userHasApplied($job);

        return view('frontend.jobs.application.show', [
            'job'        => $job,
            'hasApplied' => $hasApplied,
        ]);
    }

    /**
     * Store a new job application draft.
     *
     * @param JobApplicationStoreRequest $request
     * @param JobListing $job
     * @return RedirectResponse
     */
    public function store(JobApplicationStoreRequest $request, JobListing $job): RedirectResponse
    {
        try {
            $application = $this->jobService->submitApplication($job, $request->validated());

            return redirect()->route('jobs.application.confirmation', [
                'job'         => $job->slug,
                'application' => $application->id,
            ])->with('success', __('Your job application has been successfully submitted!'));

        } catch (\Exception $e) {
            Log::error('Job Application Submission Error: ' . $e->getMessage(), [
                'exception' => $e,
                'job_id'    => $job->id
            ]);

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => __('There was an unexpected error. Please try again.')]);
        }
    }

    /**
     * Show the confirmation page for a submitted application.
     *
     * @param JobListing $job
     * @param JobApplication $application
     * @return View
     */
    public function confirmation(JobListing $job, JobApplication $application): View
    {
        if ($application->user_id !== Auth::id()) {
            abort(403, __('Unauthorized action.'));
        }

        if ($application->job_listing_id !== $job->id) {
            abort(404);
        }

        return view('frontend.jobs.application.confirmation', compact('job', 'application'));
    }
}
