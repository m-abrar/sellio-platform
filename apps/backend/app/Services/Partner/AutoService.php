<?php

namespace App\Services\Partner;

use App\Models\Auto;
use App\Models\User;
use Illuminate\Support\Str;

/**
 * Class AutoService
 * Aligned with the latest autos migration schema.
 */
class AutoService
{
    /**
     * Get paginated listings for a specific partner.
     */
    public function getPartnerAutos(User $partner, int $perPage = 10)
    {
        return $partner->autos()
            ->with(['category', 'brand', 'type', 'location', 'media'])
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Get discovery data for automotive forms.
     */
    public function getFormData(): array
    {
        return [
            'categories' => \App\Models\Category::where('is_auto', true)->get(),
            'brands'     => \App\Models\Brand::where('is_auto', true)->get(),
            'types'      => \App\Models\Type::where('is_auto', true)->get(),
            'locations'  => \App\Models\Location::all(),
        ];
    }

    /**
     * Save the vehicle listing with migration-aligned data.
     *
     * @param User $user
     * @param array $data
     * @param Auto|null $auto
     * @return Auto
     */
    public function saveAuto(User $user, array $data, ?Auto $auto = null): Auto
    {
        $data['slug'] = $this->generateUniqueSlug($data['title'], $auto?->id);
        
        // Ensure boolean logic from checkboxes
        $data['is_published'] = (bool) ($data['is_published'] ?? false);
        $data['is_featured']  = (bool) ($data['is_featured'] ?? false);
        $data['is_lease']     = (bool) ($data['is_lease'] ?? false);
        $data['is_selling']   = (bool) ($data['is_selling'] ?? true);

        if ($auto) {
            $auto->update($data);
            return $auto;
        }

        return $user->autos()->create($data);
    }

    /**
     * Remove a vehicle listing.
     */
    public function deleteAuto(Auto $auto): void
    {
        $auto->delete();
    }

    /**
     * Generate a unique slug for the vehicle.
     *
     * @param string $title
     * @param int|null $currentId
     * @return string
     */
    protected function generateUniqueSlug(string $title, ?int $currentId = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $count = 1;

        while (Auto::where('slug', $slug)->where('id', '!=', $currentId)->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }

        return $slug;
    }
}
