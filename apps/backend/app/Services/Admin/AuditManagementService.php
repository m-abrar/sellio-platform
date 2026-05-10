<?php

namespace App\Services\Admin;

use App\Models\Auto;
use App\Models\AutoInquiry;
use App\Models\Classified;
use App\Models\ClassifiedInquiry;
use App\Models\Event;
use App\Models\EventBooking;
use App\Models\JobApplication;
use App\Models\JobListing;
use App\Models\Property;
use App\Models\PropertyBooking;
use App\Models\Service;
use App\Models\ServiceAppointment;
use App\Models\ServiceQuote;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Activitylog\Models\Activity;

/**
 * Class AuditManagementService
 * Encapsulates the logic for managing administrative activity logs and audit trails.
 */
class AuditManagementService
{
    /**
     * Get the defined semantic filter groups for administrative auditing.
     *
     * @return array
     */
    public function getFilters(): array
    {
        return [
            'all' => __('All Activities'),
            'auth' => __('User Security Events'),
            'listings' => [
                'label' => __('Main Listings'),
                'models' => [
                    Property::class,
                    Auto::class,
                    Event::class,
                    JobListing::class,
                    Service::class,
                    Classified::class,
                ],
            ],
            'transactions' => [
                'label' => __('Transactions & Leads'),
                'models' => [
                    PropertyBooking::class,
                    AutoInquiry::class,
                    EventBooking::class,
                    JobApplication::class,
                    ServiceQuote::class,
                    ServiceAppointment::class,
                    ClassifiedInquiry::class,
                ],
            ],
            'property'            => Property::class,
            'property_booking'    => PropertyBooking::class,
            'auto'                => Auto::class,
            'auto_inquiry'        => AutoInquiry::class,
            'event'               => Event::class,
            'event_booking'       => EventBooking::class,
            'job_listing'         => JobListing::class,
            'job_application'     => JobApplication::class,
            'service'             => Service::class,
            'service_quote'       => ServiceQuote::class,
            'service_appointment' => ServiceAppointment::class,
            'classified'          => Classified::class,
            'classified_inquiry'  => ClassifiedInquiry::class,
        ];
    }

    /**
     * Get filtered and paginated activity logs.
     *
     * @param string $filterKey
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getLogs(string $filterKey = 'all', int $perPage = 100): LengthAwarePaginator
    {
        $filters = $this->getFilters();
        $filterData = $filters[$filterKey] ?? $filters['all'];

        $query = Activity::query()->latest();

        if ($filterKey === 'auth') {
            $query->inLog('auth');
        } elseif (isset($filterData['models'])) {
            $query->whereIn('subject_type', $filterData['models']);
        } elseif (is_string($filterData) && class_exists($filterData)) {
            $query->where('subject_type', $filterData);
        }

        return $query->with(['causer', 'subject'])->paginate($perPage);
    }

    /**
     * Securely purge activity logs.
     *
     * @param int|null $days Keep logs newer than this many days. If null, purge all.
     * @return int Number of deleted records.
     */
    public function purgeLogs(?int $days = null): int
    {
        $query = Activity::query();

        if ($days !== null) {
            $query->where('created_at', '<', now()->subDays($days));
        }

        return $query->delete();
    }
}
