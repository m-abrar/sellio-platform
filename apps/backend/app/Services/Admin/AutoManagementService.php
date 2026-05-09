<?php

namespace App\Services\Admin;

use App\Models\Auto;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Class AutoManagementService
 *
 * Orchestrates the business logic for the Automotive vertical, managing 
 * inventory updates, publication lifecycle, and replication workflows.
 */
class AutoManagementService
{
    /**
     * Create or update an automotive listing.
     *
     * @param array $data
     * @param Auto|null $auto
     * @return Auto
     */
    public function saveAuto(array $data, ?Auto $auto = null): Auto
    {
        return DB::transaction(function () use ($data, $auto) {
            $data['is_published'] = isset($data['is_published']) ? (bool)$data['is_published'] : false;
            $data['is_featured']  = isset($data['is_featured']) ? (bool)$data['is_featured'] : false;

            if ($auto) {
                $auto->update($data);
                return $auto;
            }

            if (!isset($data['user_id'])) {
                $data['user_id'] = auth()->id();
            }

            return Auto::create($data);
        });
    }

    /**
     * Replicate an existing automotive listing as a draft copy.
     *
     * @param Auto $auto
     * @return Auto
     */
    public function duplicateAuto(Auto $auto): Auto
    {
        return DB::transaction(function () use ($auto) {
            $clone = $auto->replicate();
            $clone->is_published = false;
            $clone->approved_at = null;
            $clone->title = $auto->title . ' ' . __('(Copy)');
            $clone->save();

            return $clone;
        });
    }
}
