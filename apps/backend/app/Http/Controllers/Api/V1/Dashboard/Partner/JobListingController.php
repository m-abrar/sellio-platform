<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Partner\JobListingRequest;
use App\Http\Resources\JobListingResource;
use App\Models\JobListing;
use App\Services\Partner\JobListingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Class JobListingController
 * Manages the partner's recruitment listings.
 */
class JobListingController extends Controller
{
    protected JobListingService $jobService;

    public function __construct(JobListingService $jobService)
    {
        $this->jobService = $jobService;
    }

    public function index(Request $request): JsonResponse
    {
        $jobs = $this->jobService->getPartnerJobs(
            Auth::user(),
            $request->integer('per_page', 120)
        );

        return $this->successResponse(
            JobListingResource::collection($jobs),
            null,
            200,
            ['form' => $this->jobService->getFormData()]
        );
    }

    public function create(): JsonResponse
    {
        return $this->successResponse($this->jobService->getFormData());
    }

    public function store(JobListingRequest $request): JsonResponse
    {
        $user = Auth::user();
        if ($user->hasReachedListingLimit()) {
            return $this->successResponse(null, __('You have reached your listing limit. Please upgrade your plan.'), 403);
        }

        $data = $request->validated();
        $job = $this->jobService->saveJob($user, $data);
        $this->handleMedia($job, $request);

        return $this->successResponse(
            new JobListingResource($job->load(['media', 'category', 'location', 'brand', 'tags', 'employer'])),
            __('Job created successfully!'),
            201
        );
    }

    public function show($joblisting): JsonResponse
    {
        $model = JobListing::where('user_id', Auth::id())
            ->where(is_numeric($joblisting) ? 'id' : 'slug', $joblisting)
            ->withCount(['applications', 'applicationsNew'])
            ->with(['media', 'category', 'location', 'brand', 'tags', 'employer'])
            ->firstOrFail();

        return $this->successResponse(new JobListingResource($model));
    }

    public function edit(JobListing $joblisting): JsonResponse
    {
        $this->authorizeOwner($joblisting);

        return $this->successResponse(
            new JobListingResource($joblisting->load(['media', 'category', 'location', 'brand', 'tags', 'employer']))
        );
    }

    public function update(JobListingRequest $request, JobListing $joblisting): JsonResponse
    {
        $this->authorizeOwner($joblisting);
        $this->jobService->saveJob(Auth::user(), $request->validated(), $joblisting);
        $this->handleMedia($joblisting, $request);

        return $this->successResponse(
            new JobListingResource($joblisting->fresh(['media', 'category', 'location', 'brand', 'tags', 'employer'])),
            __('Job updated successfully!')
        );
    }

    public function destroy(JobListing $joblisting): JsonResponse
    {
        $this->authorizeOwner($joblisting);
        $this->jobService->deleteJob($joblisting);

        return $this->successResponse(null, __('Job deleted successfully.'));
    }

    protected function authorizeOwner(JobListing $job): void
    {
        if (Auth::id() !== $job->user_id) {
            abort(403, __('You do not have permission to modify this job.'));
        }
    }

    protected function handleMedia(JobListing $job, Request $request): void
    {
        if ($request->hasFile('main_image')) {
            $job->clearMediaCollection(JobListing::PRIMARY_MEDIA);
            $job->addMediaFromRequest('main_image')->toMediaCollection(JobListing::PRIMARY_MEDIA);
        }

        if ($request->has('existing_media_ids')) {
            $keepIds = array_map('intval', (array) $request->input('existing_media_ids'));

            $job->getMedia(JobListing::GALLERY_MEDIA)
                ->reject(fn ($media) => in_array($media->id, $keepIds))
                ->each(fn ($media) => $media->delete());

            Media::setNewOrder($keepIds);
        }

        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $job->addMedia($file)->toMediaCollection(JobListing::GALLERY_MEDIA);
            }
        }
    }
}
