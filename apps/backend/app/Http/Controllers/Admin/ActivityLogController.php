<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Spatie\Activitylog\Models\Activity;

/**
 * Class ActivityLogController
 * Orchestrates the administrative audit trail, providing sophisticated filtering 
 * across heterogeneous marketplace verticals and authentication events.
 */
class ActivityLogController extends Controller
{
    /**
     * Define the semantic filter groups for administrative auditing.
     *
     * @var array
     */
    protected array $subjectFilters = [];

    /**
     * ActivityLogController constructor.
     * Initializes the localized filter registry.
     */
    public function __construct()
    {
        $this->subjectFilters = [
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
     * Display a filtered and paginated listing of system-wide activity logs.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $filterKey = $request->get('filter', 'all');
        $filterData = $this->subjectFilters[$filterKey] ?? $this->subjectFilters['all'];

        $query = Activity::query()->latest();

        if ($filterKey === 'auth') {
            $query->inLog('auth');
        } elseif (isset($filterData['models'])) {
            $query->whereIn('subject_type', $filterData['models']);
        } elseif (is_string($filterData) && class_exists($filterData)) {
            $query->where('subject_type', $filterData);
        }
        
        $activityLogs = $query->with(['causer', 'subject'])->paginate(100);
        
        return view('admin.activity_log.index', [
            'activityLogs'  => $activityLogs,
            'filters'       => $this->subjectFilters,
            'currentFilter' => $filterKey,
        ]);
    }

    /**
     * Securely purge activity logs. 
     * Reserved for Super Admin oversight to maintain audit integrity.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function clearLog(): RedirectResponse
    {
        if (!auth()->user()->hasRole('super-admin')) {
            return back()->with('error', __('Unauthorized: Only Super Admins can purge audit trails.'));
        }

        // Logic for partial cleanup could be implemented here (e.g. Activity::truncate())
        return back()->with('info', __('Activity log cleanup is managed by system maintenance schedules.'));
    }
}
