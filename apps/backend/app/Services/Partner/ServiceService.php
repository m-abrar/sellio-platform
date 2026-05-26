<?php

namespace App\Services\Partner;

use App\Models\Category;
use App\Models\Location;
use App\Models\Service;
use App\Models\Type;
use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

/**
 * Class ServiceService
 * Manages business logic for Service listings.
 */
class ServiceService
{
    public function getPartnerServices(User $partner, int $perPage = 120)
    {
        return $partner->services()
            ->with(['category', 'brand', 'type', 'location', 'media'])
            ->latest()
            ->paginate($perPage);
    }

    public function getFormData(): array
    {
        return [
            'categories' => Category::where('is_service', true)->get(['id', 'title']),
            'types'      => Type::where('is_service', true)->get(['id', 'title']),
            'locations'  => Location::where('is_service', true)->get(['id', 'title']),
        ];
    }

    public function saveService(User $user, array $data, ?Service $service = null): Service
    {
        unset($data['main_image'], $data['gallery'], $data['existing_main_media_id'], $data['existing_media_ids'], $data['sync_existing_media']);

        $data['slug'] = $this->generateUniqueSlug($data['title'], $service?->id);
        $data['is_subscription'] = (bool) ($data['is_subscription'] ?? false);
        $data['is_project_based'] = (bool) ($data['is_project_based'] ?? false);
        $data['is_published'] = (bool) ($data['is_published'] ?? false);
        $data['is_featured'] = (bool) ($data['is_featured'] ?? false);
        $data['city'] = $data['city'] ?? 'Remote';
        $data['country'] = $data['country'] ?? 'Global';
        $data['expertise_level'] = (int) ($data['expertise_level'] ?? 3);
        $data['availability_schedule'] = (int) ($data['availability_schedule'] ?? 1);

        $payload = Arr::only($data, (new Service())->getFillable());

        if ($service) {
            $service->update($payload);
            return $service;
        }

        return $user->services()->create($payload);
    }

    public function deleteService(Service $service): void
    {
        $service->delete();
    }

    protected function generateUniqueSlug(string $title, ?int $currentId = null): string
    {
        $slug = Str::slug($title);
        $original = $slug;
        $count = 1;

        while (
            Service::where('slug', $slug)
                ->when($currentId, fn ($query) => $query->where('id', '!=', $currentId))
                ->exists()
        ) {
            $slug = $original . '-' . $count++;
        }

        return $slug;
    }
}
