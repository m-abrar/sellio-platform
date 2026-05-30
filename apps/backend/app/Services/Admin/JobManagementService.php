<?php

namespace App\Services\Admin;

use App\Models\JobListing;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Class JobManagementService
 *
 * Orchestrates the business logic for the Recruitment vertical, managing 
 * listing lifecycles, employment types, and administrative workflows.
 */
class JobManagementService
{
    /**
     * Create or update a job listing.
     *
     * @param array $data
     * @param JobListing|null $job
     * @return JobListing
     */
    public function saveJob(array $data, ?JobListing $job = null): JobListing
    {
        return DB::transaction(function () use ($data, $job) {
            if (empty($data['slug']) && ! empty($data['title'])) {
                $data['slug'] = Str::slug($data['title']);
            }

            $data['city'] = $data['city'] ?? 'Remote';
            $data['country'] = $data['country'] ?? 'USA';

            $data['is_published'] = isset($data['is_published']) ? (bool)$data['is_published'] : false;
            $data['is_featured']  = isset($data['is_featured']) ? (bool)$data['is_featured'] : false;
            $data['is_contract']  = isset($data['is_contract']) ? (bool)$data['is_contract'] : false;
            $data['is_full_time'] = isset($data['is_full_time']) ? (bool)$data['is_full_time'] : false;

            if ($job) {
                $job->update($data);
                return $job;
            }

            if (!isset($data['user_id'])) {
                $data['user_id'] = auth()->id();
            }

            return JobListing::create($data);
        });
    }

    /**
     * Replicate an existing job listing as a draft copy.
     *
     * @param JobListing $job
     * @return JobListing
     */
    public function duplicateJob(JobListing $job): JobListing
    {
        return DB::transaction(function () use ($job) {
            $clone = $job->replicate();
            $clone->is_published = false;
            $clone->approved_at = null;
            $clone->title = $job->title . ' ' . __('(Copy)');
            $clone->save();

            return $clone;
        });
    }
}
