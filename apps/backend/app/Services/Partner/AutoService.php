<?php

namespace App\Services\Partner;

use App\Models\Auto;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Feature;
use App\Models\Location;
use App\Models\Tag;
use App\Models\Type;
use App\Models\User;
use Illuminate\Support\Facades\DB;
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
            'categories' => Category::where('is_auto', true)->get(),
            'brands'     => Brand::where('is_auto', true)->get(),
            'types'      => Type::where('is_auto', true)->get(),
            'locations'  => Location::all(),
            'features'   => Feature::where('is_auto', true)->active()->get(['id', 'title']),
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
        return DB::transaction(function () use ($user, $data, $auto) {
            $coreData = collect($data)->except(['features', 'tags'])->toArray();
            $coreData['slug'] = $this->generateUniqueSlug($coreData['title'], $auto?->id);
            
            // Ensure boolean logic from checkboxes
            $coreData['is_published'] = (bool) ($coreData['is_published'] ?? false);
            $coreData['is_featured']  = (bool) ($coreData['is_featured'] ?? false);
            $coreData['is_lease']     = (bool) ($coreData['is_lease'] ?? false);
            $coreData['is_selling']   = (bool) ($coreData['is_selling'] ?? true);

            if ($auto) {
                $auto->update($coreData);
            } else {
                $auto = $user->autos()->create($coreData);
            }

            // 1. Sync polymorphic Features
            if (isset($data['features'])) {
                $auto->features()->sync($data['features']);
            } else {
                $auto->features()->sync([]);
            }

            // 2. Sync polymorphic Tags
            if (isset($data['tags'])) {
                $tagIds = [];
                foreach ($data['tags'] as $tagName) {
                    $tag = Tag::firstOrCreate(
                        ['title' => trim($tagName)],
                        ['slug' => Str::slug($tagName), 'is_auto' => true, 'is_published' => true]
                    );
                    $tagIds[] = $tag->id;
                }
                $auto->tags()->sync($tagIds);
            } else {
                $auto->tags()->sync([]);
            }

            return $auto;
        });
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
