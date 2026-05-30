<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReportRequest;
use App\Services\Admin\AnalyticsService;
use Illuminate\View\View;

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
     * @var AnalyticsService
     */
    protected AnalyticsService $analyticsService;

    /**
     * ReportController constructor.
     *
     * @param AnalyticsService $analyticsService
     */
    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function index(): View
    {
        return view('admin.reports.index');
    }

    /**
     * Display the Revenue & Payments analytical dashboard.
     *
     * @param  \App\Http\Requests\Admin\ReportRequest  $request
     * @return \Illuminate\View\View
     */
    public function payments(ReportRequest $request): View
    {
        [$startDate, $endDate] = $request->getDates(self::DEFAULT_DAYS_FILTER);
        
        $analytics = $this->analyticsService->getPaymentAnalytics($startDate, $endDate);
        
        return view('admin.reports.payments', [
            'reportTitle'            => __('Revenue & Payments Report'),
            'totalRevenue'           => number_format($analytics['totalRevenue'], 2),
            'avgTransactionValue'    => number_format($analytics['avgTransactionValue'], 2),
            'successfulTransactions' => number_format($analytics['successfulTransactions']),
            'recentTransactions'     => $analytics['recentTransactions'],
            'startDateFormatted'     => $startDate->format('Y-m-d'),
            'endDateFormatted'       => $endDate->format('Y-m-d'),
            'chartLabels'            => $analytics['trendLabels'],
            'chartData'              => $analytics['trendData'],
        ]);
    }

    /**
     * Display the Property Booking analytical dashboard.
     *
     * @param  \App\Http\Requests\Admin\ReportRequest  $request
     * @return \Illuminate\View\View
     */
    public function bookings(ReportRequest $request): View
    {
        [$startDate, $endDate] = $request->getDates(self::DEFAULT_DAYS_FILTER);

        $analytics = $this->analyticsService->getBookingAnalytics($startDate, $endDate);

        return view('admin.reports.bookings', [
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
        ]);
    }

    /**
     * Display the Property Occupancy & Availability dashboard.
     *
     * @param  \App\Http\Requests\Admin\ReportRequest  $request
     * @return \Illuminate\View\View
     */
    public function properties(ReportRequest $request): View
    {
        [$startDate, $endDate] = $request->getDates(30);

        $analytics = $this->analyticsService->getOccupancyAnalytics($startDate, $endDate);
        $propertyList = $this->analyticsService->getPropertyOccupancyList($startDate, $endDate);

        return view('admin.reports.properties', [
            'reportTitle'        => __('Property Occupancy & Availability Report'),
            'startDateFormatted' => $startDate->format('Y-m-d'),
            'endDateFormatted'   => $endDate->format('Y-m-d'),
            'occupancyRate'      => $analytics['occupancyRate'] . '%',
            'occupiedUnits'      => number_format($analytics['occupiedUnits']),
            'availableUnits'     => number_format($analytics['availableUnits']),
            'totalUnits'         => number_format($analytics['totalUnits']),
            'propertyList'       => $propertyList,
        ]);
    }
}
