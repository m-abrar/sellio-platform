<?php

namespace App\Services;

use App\Events\Partner\PartnerLeadCreated;
use App\Models\Property;
use App\Models\PropertyVisit;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Class PropertyVisitService
 * Orchestrates the business logic for property visit lifecycle.
 */
class PropertyVisitService
{
    /**
     * Create a new property visit record and log activity.
     */
    public function scheduleVisit(Property $property, array $data): PropertyVisit
    {
        return DB::transaction(function () use ($property, $data) {
            // Log the 'lead' activity
            activity('listings')
                ->performedOn($property)
                ->by(Auth::user())
                ->log('submitted_lead');

            $visit = PropertyVisit::create([
                'user_id'      => Auth::id(),
                'property_id'  => $property->id,
                'scheduled_at' => $data['scheduled_at'],
                'status'       => 'scheduled',
                'notes'        => $data['notes'] ?? null,
                'full_name'    => $data['full_name'],
                'email'        => $data['email'],
                'phone'        => $data['phone'] ?? null,
            ]);

            PartnerLeadCreated::dispatch($visit);

            return $visit;
        });
    }

    /**
     * Cancel an existing property visit.
     */
    public function cancelVisit(PropertyVisit $visit): bool
    {
        if ($visit->status === 'scheduled' || $visit->status === 'rescheduled') {
            $visit->status = 'cancelled';
            return $visit->save();
        }
        return false;
    }
}
