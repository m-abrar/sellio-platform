<?php

namespace App\Services\Admin;

use App\Models\Service;
use Illuminate\Support\Facades\DB;

/**
 * Class ServiceManagementService
 *
 * Orchestrates the business logic for the Professional Services vertical, managing 
 * listing lifecycles, service types, and administrative workflows.
 */
class ServiceManagementService
{
    /**
     * Create or update a professional service listing.
     *
     * @param array $data
     * @param Service|null $service
     * @return Service
     */
    public function saveService(array $data, ?Service $service = null): Service
    {
        return DB::transaction(function () use ($data, $service) {
            $data['is_published']     = isset($data['is_published']) ? (bool)$data['is_published'] : false;
            $data['is_featured']      = isset($data['is_featured']) ? (bool)$data['is_featured'] : false;
            $data['is_subscription']  = isset($data['is_subscription']) ? (bool)$data['is_subscription'] : false;
            $data['is_project_based'] = isset($data['is_project_based']) ? (bool)$data['is_project_based'] : false;

            if ($service) {
                $service->update($data);
                return $service;
            }

            if (!isset($data['user_id'])) {
                $data['user_id'] = auth()->id();
            }

            return Service::create($data);
        });
    }

    /**
     * Replicate a professional service as a draft copy.
     *
     * @param Service $service
     * @return Service
     */
    public function duplicateService(Service $service): Service
    {
        return DB::transaction(function () use ($service) {
            $clone = $service->replicate();
            $clone->is_published = false;
            $clone->approved_at  = null;
            $clone->title        = $service->title . ' ' . __('(Copy)');
            $clone->save();

            return $clone;
        });
    }
}
