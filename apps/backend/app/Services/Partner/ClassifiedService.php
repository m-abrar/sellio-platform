<?php

namespace App\Services\Partner;

use App\Models\Category;
use App\Models\Classified;
use App\Models\Location;
use App\Models\Type;
use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

/**
 * Class ClassifiedService
 * Handles business logic for Classified listings.
 */
class ClassifiedService
{
    public function getPartnerClassifieds(User $partner, int $perPage = 120)
    {
        return $partner->classifieds()
            ->with(['category', 'brand', 'type', 'location', 'media', 'tags'])
            ->latest()
            ->paginate($perPage);
    }

    public function getFormData(): array
    {
        return [
            'categories' => Category::where('is_classified', true)->get(['id', 'title']),
            'types'      => Type::where('is_classified', true)->get(['id', 'title']),
            'locations'  => Location::where('is_classified', true)->get(['id', 'title']),
            'brands'     => \App\Models\Brand::where('is_classified', true)->get(['id', 'title']),
        ];
    }

    public function saveClassified(User $user, array $data, ?Classified $classified = null): Classified
    {
        return \Illuminate\Support\Facades\DB::transaction(function () use ($user, $data, $classified) {
            unset($data['main_image'], $data['gallery'], $data['existing_main_media_id'], $data['existing_media_ids'], $data['sync_existing_media']);

            $data['slug'] = $this->generateUniqueSlug($data['title'], $classified?->id);
            $data['is_for_rent'] = (bool) ($data['is_for_rent'] ?? false);
            $data['is_for_sale'] = (bool) ($data['is_for_sale'] ?? true);
            $data['is_published'] = (bool) ($data['is_published'] ?? false);
            $data['is_featured'] = (bool) ($data['is_featured'] ?? false);
            $data['item_condition'] = (int) ($data['item_condition'] ?? 6);
            $data['item_quantity'] = (int) ($data['item_quantity'] ?? 1);
            $data['city'] = $data['city'] ?? 'Remote';
            $data['country'] = $data['country'] ?? 'Global';

            if (empty($data['type_id'])) {
                $data['type_id'] = Type::where('is_classified', true)->value('id');
            }

            $payload = Arr::only($data, (new Classified())->getFillable());

            if ($classified) {
                $classified->update($payload);
            } else {
                $classified = $user->classifieds()->create($payload);
            }

            // Sync polymorphic tags
            if (isset($data['tags'])) {
                $tagIds = [];
                foreach ($data['tags'] as $tagName) {
                    $tag = \App\Models\Tag::firstOrCreate(
                        ['title' => trim($tagName)],
                        ['slug' => \Illuminate\Support\Str::slug($tagName), 'is_classified' => true, 'is_published' => true]
                    );
                    $tagIds[] = $tag->id;
                }
                $classified->tags()->sync($tagIds);
            } else if (array_key_exists('tags', $data)) {
                $classified->tags()->sync([]);
            }

            return $classified->fresh(['category', 'brand', 'type', 'location', 'media', 'tags']);
        });
    }

    public function deleteClassified(Classified $classified): void
    {
        $classified->delete();
    }

    protected function generateUniqueSlug(string $title, ?int $currentId = null): string
    {
        $slug = Str::slug($title);
        $original = $slug;
        $count = 1;

        while (
            Classified::where('slug', $slug)
                ->when($currentId, fn ($query) => $query->where('id', '!=', $currentId))
                ->exists()
        ) {
            $slug = $original . '-' . $count++;
        }

        return $slug;
    }
}
