<?php

namespace App\Services\Partner;

use App\Models\JobListing;
use App\Models\User;
use Illuminate\Support\Str;

/**
 * Class JobListingService
 * Handles the business logic for managing job listings.
 */
class JobListingService
{
    /**
     * Save or update a job listing.
     *
     * @param User $user
     * @param array $data
     * @param JobListing|null $jobListing
     * @return JobListing
     */
    public function saveJob(User $user, array $data, ?JobListing $jobListing = null): JobListing
    {
        $data['slug'] = Str::slug($data['slug'] ?: $data['name']);

        // Explicitly cast checkbox booleans
        $data['is_published'] = (bool) ($data['is_published'] ?? false);
        $data['is_featured']  = (bool) ($data['is_featured'] ?? false);
        $data['is_contract']  = (bool) ($data['is_contract'] ?? false);
        $data['is_full_time'] = (bool) ($data['is_full_time'] ?? false);

        if ($jobListing) {
            $jobListing->update($data);
            return $jobListing;
        }

        return $user->joblistings()->create($data);
    }
}
