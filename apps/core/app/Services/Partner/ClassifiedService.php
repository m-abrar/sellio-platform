<?php

namespace App\Services\Partner;

use App\Models\Classified;
use App\Models\User;
use Illuminate\Support\Str;

/**
 * Class ClassifiedService
 * Handles business logic for Classified listings.
 */
class ClassifiedService
{
    /**
     * Store or update a classified listing.
     *
     * @param User $user
     * @param array $data
     * @param Classified|null $classified
     * @return Classified
     */
    public function saveClassified(User $user, array $data, ?Classified $classified = null): Classified
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        
        // Handle boolean toggles from request
        $data['is_for_rent']   = (bool) ($data['is_for_rent'] ?? false);
        $data['is_for_sale']   = (bool) ($data['is_for_sale'] ?? true);
        $data['is_published']  = (bool) ($data['is_published'] ?? false);
        $data['is_featured']   = (bool) ($data['is_featured'] ?? false);

        // Set defaults for optional fields
        $data['item_condition'] = $data['item_condition'] ?? 'Used';
        $data['item_quantity']  = $data['item_quantity'] ?? 1;

        if ($classified) {
            $classified->update($data);
            return $classified;
        }

        return $user->classifieds()->create($data);
    }
}
