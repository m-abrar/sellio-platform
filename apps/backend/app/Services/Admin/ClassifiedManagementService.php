<?php

namespace App\Services\Admin;

use App\Models\Classified;
use Illuminate\Support\Facades\DB;

/**
 * Class ClassifiedManagementService
 *
 * Orchestrates the business logic for the Classifieds vertical, managing 
 * listing lifecycles, rental/sale flags, and administrative workflows.
 */
class ClassifiedManagementService
{
    /**
     * Create or update a classified listing.
     *
     * @param array $data
     * @param Classified|null $classified
     * @return Classified
     */
    public function saveClassified(array $data, ?Classified $classified = null): Classified
    {
        return DB::transaction(function () use ($data, $classified) {
            $data['is_published'] = isset($data['is_published']) ? (bool)$data['is_published'] : false;
            $data['is_featured']  = isset($data['is_featured']) ? (bool)$data['is_featured'] : false;
            $data['is_for_rent']  = isset($data['is_for_rent']) ? (bool)$data['is_for_rent'] : false;
            $data['is_for_sale']  = isset($data['is_for_sale']) ? (bool)$data['is_for_sale'] : false;

            if ($classified) {
                $classified->fill($data);
                $classified->is_featured = $data['is_featured'];
                $classified->save();
                return $classified;
            }

            if (!isset($data['user_id'])) {
                $data['user_id'] = auth()->id();
            }

            $classified = new Classified();
            $classified->fill($data);
            $classified->is_featured = $data['is_featured'];
            $classified->save();

            return $classified;
        });
    }

    /**
     * Replicate an existing classified listing as a draft copy.
     *
     * @param Classified $classified
     * @return Classified
     */
    public function duplicateClassified(Classified $classified): Classified
    {
        return DB::transaction(function () use ($classified) {
            $clone = $classified->replicate();
            $clone->is_published = false;
            $clone->approved_at = null;
            $clone->title = $classified->title . ' ' . __('(Copy)');
            $clone->save();

            return $clone;
        });
    }
}
