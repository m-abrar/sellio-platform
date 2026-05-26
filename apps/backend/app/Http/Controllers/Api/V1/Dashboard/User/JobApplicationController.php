<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use App\Http\Resources\JobApplicationResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

/**
 * Class JobApplicationController
 * Orchestrates the user-facing discovery and retrieval of job applications, 
 * managing recruitment history and employer relationship metadata.
 */
class JobApplicationController extends Controller
{
    /**
     * Retrieve a paginated collection of job applications for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index() {
        $user = Auth::user();

        // Changed 'job.company' to 'job.employer' to match JobListing model
        $applications = JobApplication::where('user_id', $user->id)
            ->with(['job.employer']) 
            ->latest()
            ->paginate(10);

        return $this->successResponse(JobApplicationResource::collection($applications));
    }

    /**
     * Cancel a job application.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $application = JobApplication::where('user_id', $user->id)->where('id', $id)->first();

        if (!$application) {
            return $this->errorResponse(__('Job application not found or unauthorized.'), 404);
        }

        $application->update(['status' => 'cancelled']);

        return $this->successResponse(null, __('Job application successfully cancelled.'));
    }
}
