<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

/**
 * Class JobApplicationController
 *
 * Manages candidate applications for job listings posted by the partner.
 */
class JobApplicationController extends Controller
{
    /**
     * @var JobApplication
     */
    protected $application;

    /**
     * JobApplicationController constructor.
     *
     * @param JobApplication $application
     */
    public function __construct(JobApplication $application)
    {
        $this->application = $application;
    }

    /**
     * Display a listing of job applications.
     *
     * @return View
     */
    public function index() {
        $user = Auth::user();

        /** * Retrieve IDs of jobs owned by the partner 
         * to filter the applications.
         */
        $jobListingIds = $user->jobs()->pluck('id');

        $jobApplications = $this->application::whereIn('job_listing_id', $jobListingIds)
            ->with(['job' => function ($query) {
                $query->select('id', 'title', 'slug');
            }])
            ->latest()
            ->paginate(10);

        return JobApplicationResource::collection($jobApplications);
    }

    /**
     * Display the specified job application details.
     *
     * @param JobApplication $jobApplication
     * @return View
     */
    public function show(JobApplication $jobApplication) {
        $this->authorizeOwner($jobApplication);

        return $this->successResponse([
            'application' => $jobApplication->load(['job', 'user'])
        ]);
    }

    /**
     * Update the hiring status of the application.
     *
     * @param JobApplication $jobApplication
     * @param string $status
     * @return RedirectResponse
     */
    public function updateStatus(JobApplication $jobApplication, string $status) {
        $this->authorizeOwner($jobApplication);

        // Validation of status should happen here or in a Request class
        $jobApplication->update(['status' => $status]);

        return $this->successResponse(null, __('Application status updated to :status.', ['status' => ucfirst($status)]));
    }

    /**
     * Remove the job application record.
     *
     * @param JobApplication $jobApplication
     * @return RedirectResponse
     */
    public function destroy(JobApplication $jobApplication) {
        $this->authorizeOwner($jobApplication);

        $jobApplication->delete();

        return $this->successResponse(null, __('Job application deleted successfully.'));
    }

    /**
     * Authorize that the partner owns the job listing associated with the application.
     *
     * @param JobApplication $application
     * @return void
     */
    protected function authorizeOwner(JobApplication $application): void
    {
        if (Auth::id() !== $application->job->user_id) {
            abort(403, __('Unauthorized access to this application.'));
        }
    }
}
