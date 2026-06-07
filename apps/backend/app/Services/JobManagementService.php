<?php

namespace App\Services;

use App\Models\JobListing;
use App\Models\Category;
use App\Models\Location;
use App\Models\Type;
use App\Models\Tag;
use App\Models\JobApplication;
use App\Events\JobApplicationReceived;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

/**
 * Class JobManagementService
 *
 * Handles the business logic for job filtering, retrieval, and application submissions.
 */
class JobManagementService
{
    /**
     * @var array
     */
    protected function getExperienceLevelsRaw(): array
    {
        return [
            1 => __('Entry-Level'),
            2 => __('Mid-Level'),
            3 => __('Senior/Lead'),
            4 => __('Executive'),
        ];
    }

    /**
     * @var array
     */
    protected function getWorkplaceTypesRaw(): array
    {
        return [
            1 => __('On-Site'),
            2 => __('Hybrid'),
            3 => __('Remote'),
        ];
    }

    /**
     * Retrieve filter taxonomies for the job search sidebar.
     *
     * @return array
     */
    public function getFilterTaxonomies(): array
    {
        // Define common vertical relations to count for the dashboard/sidebar
        $verticals = ['properties', 'autos', 'events', 'jobs', 'services', 'classifieds', 'products'];
        $locationVerticals = ['properties', 'autos', 'events', 'jobs', 'services', 'classifieds'];
        $tagVerticals = ['properties', 'autos', 'events', 'jobs', 'services', 'classifieds'];

        return [
            'categories' => Category::where('is_job', true)->withCount($verticals)->get(),
            'locations'  => Location::where('is_job', true)->withCount($locationVerticals)->get(),
            'types'      => Type::where('is_job', true)->withCount($verticals)->get(),
            'tags'       => Tag::where('is_job', true)->withCount($tagVerticals)->get(),
        ];
    }

    /**
     * Filter and paginate job listings based on request parameters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function searchJobs(array $filters, ?User $user = null): LengthAwarePaginator
    {
        return JobListing::orderByDesc('is_featured')
            ->latest()
            ->visibleTo($user)
            ->when($filters['q'] ?? null, function ($q, $v) {
                $q->where(fn($sub) => $sub->where('title', 'like', "%$v%")
                    ->orWhere('description', 'like', "%$v%"));
            })
            ->when($filters['category'] ?? null, fn($q, $v) => $q->where('category_id', $v))
            ->when($filters['location'] ?? null, fn($q, $v) => $q->where('location_id', $v))
            ->when($filters['type'] ?? null,     fn($q, $v) => $q->where('type_id', $v))
            ->when($filters['experience_level'] ?? null, fn($q, $v) => $q->where('experience_level', (int)$v))
            ->when($filters['workplace_type'] ?? null,   fn($q, $v) => $q->where('workplace_type', (int)$v))
            ->when($filters['min_salary'] ?? null, fn($q, $v) => $q->where('salary_min', '>=', $v))
            ->when($filters['max_salary'] ?? null, fn($q, $v) => $q->where('salary_max', '<=', $v))
            ->when($filters['tags'] ?? null, function ($q, $v) {
                $q->whereHas('tags', fn($sub) => $sub->whereIn('tags.id', (array) $v));
            })
            ->with(['employer', 'user', 'category', 'location', 'brand', 'tags', 'media'])
            ->paginate(12);
    }

    /**
     * Get related jobs based on category.
     *
     * @param JobListing $job
     * @param int $limit
     * @return Collection
     */
    public function getRelatedJobs(JobListing $job, int $limit = 4): Collection
    {
        return JobListing::where('category_id', $job->category_id)
            ->where('id', '!=', $job->id)
            ->active()
            ->latest()
            ->with(['employer', 'user', 'category', 'location', 'brand', 'tags', 'media'])
            ->limit($limit)
            ->get();
    }

    /**
     * Handle the logic for submitting a job application.
     *
     * @param JobListing $job
     * @param array $data
     * @return JobApplication
     */
    public function submitApplication(JobListing $job, array $data): JobApplication
    {
        $application = $job->applications()->create([
            'user_id'      => Auth::id(),
            'cover_letter' => $data['cover_letter'] ?? null,
            'status'       => 'pending',
        ]);

        // Log the activity (compatible with Spatie Activitylog)
        if (function_exists('activity')) {
            activity()
                ->performedOn($application)
                ->causedBy(Auth::user())
                ->log(__('Submitted application for job listing: :title', ['title' => $job->title]));
        }

        JobApplicationReceived::dispatch($application);

        return $application;
    }

    /**
     * Check if the authenticated user has already applied for this job.
     *
     * @param JobListing $job
     * @return bool
     */
    public function userHasApplied(JobListing $job): bool
    {
        if (!Auth::check()) {
            return false;
        }

        return $job->applications()
            ->where('user_id', Auth::id())
            ->exists();
    }

    /**
     * @return array
     */
    public function getExperienceLevels(): array
    {
        return $this->getExperienceLevelsRaw();
    }

    /**
     * @return array
     */
    public function getWorkplaceTypes(): array
    {
        return $this->getWorkplaceTypesRaw();
    }
}
