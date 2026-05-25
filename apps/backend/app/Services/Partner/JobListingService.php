<?php

namespace App\Services\Partner;

use App\Models\Category;
use App\Models\JobListing;
use App\Models\Location;
use App\Models\Type;
use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

/**
 * Class JobListingService
 * Handles the business logic for managing job listings.
 */
class JobListingService
{
    public function getPartnerJobs(User $partner, int $perPage = 120)
    {
        return $partner->jobs()
            ->withCount(['applications', 'applicationsNew'])
            ->with(['category', 'location', 'brand', 'tags', 'employer', 'media'])
            ->latest()
            ->paginate($perPage);
    }

    public function getFormData(): array
    {
        return [
            'categories' => Category::where('is_job', true)->get(['id', 'title']),
            'types'      => Type::where('is_job', true)->get(['id', 'title']),
            'locations'  => Location::where('is_job', true)->get(['id', 'title']),
        ];
    }

    public function saveJob(User $user, array $data, ?JobListing $jobListing = null): JobListing
    {
        unset($data['main_image'], $data['gallery'], $data['existing_media_ids'], $data['employment_type']);

        $data['slug'] = $this->generateUniqueSlug($data['title'], $jobListing?->id);
        $data['is_published'] = (bool) ($data['is_published'] ?? false);
        $data['is_featured'] = (bool) ($data['is_featured'] ?? false);
        $data['is_contract'] = (bool) ($data['is_contract'] ?? false);
        $data['is_full_time'] = (bool) ($data['is_full_time'] ?? false);
        $data['experience_level'] = (int) ($data['experience_level'] ?? 1);
        $data['workplace_type'] = (int) ($data['workplace_type'] ?? 1);
        $data['city'] = $data['city'] ?? 'Remote';
        $data['country'] = $data['country'] ?? 'Global';
        $data['salary_frequency'] = $data['salary_frequency'] ?? 'yearly';

        $payload = Arr::only($data, (new JobListing())->getFillable());

        if ($jobListing) {
            $jobListing->update($payload);
            return $jobListing;
        }

        return $user->jobs()->create($payload);
    }

    public function deleteJob(JobListing $jobListing): void
    {
        $jobListing->delete();
    }

    protected function generateUniqueSlug(string $title, ?int $currentId = null): string
    {
        $slug = Str::slug($title);
        $original = $slug;
        $count = 1;

        while (
            JobListing::where('slug', $slug)
                ->when($currentId, fn ($query) => $query->where('id', '!=', $currentId))
                ->exists()
        ) {
            $slug = $original . '-' . $count++;
        }

        return $slug;
    }
}
