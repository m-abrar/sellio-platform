<?php

namespace App\Services\Partner;

use App\Models\Service;
use App\Models\User;
use Illuminate\Support\Str;

/**
 * Class ServiceService
 * Manages business logic for Service listings.
 */
class ServiceService
{
    /**
     * Store or update a service listing.
     *
     * @param User $user
     * @param array $data
     * @param Service|null $service
     * @return Service
     */
    public function saveService(User $user, array $data, ?Service $service = null): Service
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        
        // Handle boolean toggles from request
        $data['is_subscription']  = (bool) ($data['is_subscription'] ?? false);
        $data['is_project_based'] = (bool) ($data['is_project_based'] ?? false);
        $data['is_published']     = (bool) ($data['is_published'] ?? false);
        $data['is_featured']      = (bool) ($data['is_featured'] ?? false);

        if ($service) {
            $service->update($data);
            return $service;
        }

        return $user->services()->create($data);
    }
}
