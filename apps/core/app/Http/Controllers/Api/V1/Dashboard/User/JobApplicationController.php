<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use App\Http\Resources\JobApplicationResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class JobApplicationController extends Controller
{
    /**
     * Display a listing of the user's job applications.
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
}
