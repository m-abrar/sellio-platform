<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Fluent; 
use Illuminate\Support\Collection;
use Illuminate\View\View;

// Core Marketplace Models
use App\Models\Payment;
use App\Models\Property;
use App\Models\Auto;
use App\Models\Event;
use App\Models\Job;
use App\Models\Service;
use App\Models\Classified;
use App\Models\PropertyBooking;
use App\Models\User;

/**
 * Class ReportController
 * Orchestrates the platform's analytical hub, coordinating data aggregation, 
 * revenue trend analysis, and vertical-specific performance metrics.
 */
class ReportController extends Controller
{
    /**
     * The default duration for retrospective reporting (days).
     */
    private const DEFAULT_DAYS_FILTER = 365;

    /**
     * The default duration for trend analysis (months).
     */
    private const MONTHS_FOR_TREND = 12;

    /**
     * The limit for detailed transaction summaries.
     */
    private const RECENT_TRANSACTIONS_LIMIT = 5;

    /**
     * @var \App\Services\Admin\AnalyticsService
     */
    protected $analyticsService;

    /**
     * ReportController constructor.
     *
     * @param \App\Services\Admin\AnalyticsService $analyticsService
     */
    public function __construct(\App\Services\Admin\AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Display the Revenue & Payments analytical dashboard.
     *
     * @param  \App\Http\Requests\Admin\ReportRequest  $request
     * @return \Illuminate\View\View
     */
    public function payments(\App\Http\Requests\Admin\ReportRequest $request): View
    {
        [$startDate, $endDate] = $request->getDates(self::DEFAULT_DAYS_FILTER);
        
        $analytics = $this->analyticsService->getPaymentAnalytics($startDate, $endDate);
        
        $data = [
            'reportTitle'            => __('Revenue & Payments Report'),
            'totalRevenue'           => number_format($analytics['totalRevenue'], 2),
            'avgTransactionValue'    => number_format($analytics['avgTransactionValue'], 2),
            'successfulTransactions' => number_format($analytics['successfulTransactions']),
            'recentTransactions'     => $analytics['recentTransactions'],
            'startDateFormatted'     => $startDate->format('Y-m-d'),
            'endDateFormatted'       => $endDate->format('Y-m-d'),
            'chartLabels'            => $analytics['trendLabels'],
            'chartData'              => $analytics['trendData'],
        ];

        return view('admin.reports.payments', $data);
    }

    /**
     * Display the Property Booking analytical dashboard.
     *
     * @param  \App\Http\Requests\Admin\ReportRequest  $request
     * @return \Illuminate\View\View
     */
    public function bookings(\App\Http\Requests\Admin\ReportRequest $request): View
    {
        [$startDate, $endDate] = $request->getDates(self::DEFAULT_DAYS_FILTER);

        $analytics = $this->analyticsService->getBookingAnalytics($startDate, $endDate);

        $data = [
            'reportTitle'        => __('Property Booking Summary Report'),
            'totalBookings'      => number_format($analytics['totalBookings']),
            'successfulBookings' => number_format($analytics['successfulBookings']),
            'cancellations'      => number_format($analytics['cancellations']),
            'cancellationRate'   => $analytics['cancellationRate'] . '%',
            'totalRevenue'       => number_format($analytics['totalRevenue'], 2),
            'avgBookingValue'    => number_format($analytics['avgBookingValue'], 2),
            'topItems'           => $analytics['topItems'],
            'recentBookings'     => $analytics['recentBookings'],
            'startDateFormatted' => $startDate->format('Y-m-d'),
            'endDateFormatted'   => $endDate->format('Y-m-d'),
            'chartLabels'        => $analytics['trendLabels'],
            'chartData'          => $analytics['trendData'],
        ];

        return view('admin.reports.bookings', $data);
    }

    /**
     * Display the Property Occupancy & Availability dashboard.
     *
     * @param  \App\Http\Requests\Admin\ReportRequest  $request
     * @return \Illuminate\View\View
     */
    public function properties(\App\Http\Requests\Admin\ReportRequest $request): View
    {
        [$startDate, $endDate] = $request->getDates(30);

        $analytics = $this->analyticsService->getOccupancyAnalytics($startDate, $endDate);

        $propertyList = Property::select('id', 'title', 'slug', 'location_id', 'total_units')
            ->with('location')
            ->orderBy('title', 'asc') 
            ->paginate(50)
            ->through(function ($property) use ($analytics) {
                 $isOccupied = $analytics['occupiedIds']->contains($property->id);
                 return new Fluent([
                     'id'          => $property->id,
                     'title'       => $property->title, 
                     'location'    => optional($property->location)->title ?? __('N/A'), 
                     'status'      => $isOccupied ? __('Occupied (in range)') : __('Available (in range)'),
                     'total_units' => $property->total_units ?? 1,
                     'link'        => route('properties.show', $property->slug), 
                 ]);
            });

        $data = [
            'reportTitle'        => __('Property Occupancy & Availability Report'),
            'startDateFormatted' => $startDate->format('Y-m-d'),
            'endDateFormatted'   => $endDate->format('Y-m-d'),
            'occupancyRate'      => $analytics['occupancyRate'] . '%',
            'occupiedUnits'      => number_format($analytics['occupiedUnits']),
            'availableUnits'     => number_format($analytics['availableUnits']),
            'totalUnits'         => number_format($analytics['totalUnits']),
            'propertyList'       => $propertyList,
        ];

        return view('admin.reports.properties', $data);
    }
}
