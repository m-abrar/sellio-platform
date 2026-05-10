<?php

namespace App\Services\Admin;

use App\Models\ServiceAppointment;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Class ServiceAppointmentManagementService
 * Orchestrates administrative scheduling for professional services, 
 * managing appointment lifecycle, provider coordination, and read-receipt tracking.
 */
class ServiceAppointmentManagementService
{
    /**
     * Get paginated service appointments with associated metadata and filters.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getAppointments(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return ServiceAppointment::with(['service.category', 'user'])
            ->when($filters['service'] ?? null, fn($q, $service) => $q->where('service_id', $service))
            ->when(isset($filters['status']) && $filters['status'] !== 'all', fn($q) => $q->where('status', $filters['status']))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Securely update the "Viewed" status of an appointment upon administrative inspection.
     *
     * @param ServiceAppointment $appointment
     * @return bool
     */
    public function markAsViewed(ServiceAppointment $appointment): bool
    {
        if (!$appointment->viewed_at) {
            return $appointment->update(['viewed_at' => now()]);
        }
        return true;
    }

    /**
     * Store a newly created service appointment record in the administrative ledger.
     *
     * @param array $data
     * @return ServiceAppointment
     */
    public function createAppointment(array $data): ServiceAppointment
    {
        return ServiceAppointment::create($data);
    }

    /**
     * Update an existing service appointment and synchronize its scheduled parameters.
     *
     * @param ServiceAppointment $appointment
     * @param array $data
     * @return bool
     */
    public function updateAppointment(ServiceAppointment $appointment, array $data): bool
    {
        return $appointment->update($data);
    }

    /**
     * Securely remove a service appointment record from the database.
     *
     * @param ServiceAppointment $appointment
     * @return bool|null
     */
    public function deleteAppointment(ServiceAppointment $appointment): ?bool
    {
        return $appointment->delete();
    }
}
