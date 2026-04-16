<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Spatie\Activitylog\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Auto;
use App\Models\Classified;
use App\Models\Event;
use App\Models\JobListing;
use App\Models\Property;
use App\Models\Service;
use App\Models\PropertyBooking;
use App\Models\AutoInquiry;
use App\Models\EventBooking;
use App\Models\JobApplication;
use App\Models\ServiceQuote;
use App\Models\ClassifiedInquiry;
use App\Models\ServiceAppointment;

class ActivityLogController extends Controller
{
    protected array $subjectFilters = [
        'all' => 'All Activities',
        'auth' => 'User Login/Logout',
        'listings' => [
            'label' => 'Main Listings',
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
            'label' => 'Transactions',
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
        'property' => Property::class,
        'property_booking' => PropertyBooking::class,
        
        'auto' => Auto::class,
        'auto_inquiry' => AutoInquiry::class, 
        
        'event' => Event::class,
        'event_booking' => EventBooking::class,
        
        'job_listing' => JobListing::class,
        'job_application' => JobApplication::class,

        'service' => Service::class,
        'service_quote' => ServiceQuote::class,
        'service_appointment' => ServiceAppointment::class,
        
        'classified' => Classified::class,
        'classified_inquiry' => ClassifiedInquiry::class,
    ];

    public function index(Request $request)
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
            'activityLogs' => $activityLogs,
            'filters' => $this->subjectFilters,
            'currentFilter' => $filterKey,
        ]);
    }

    public function clearLog()
    {
        return back()->with('info', 'Activity log cleanup would typically run on a schedule.');
    }
}
