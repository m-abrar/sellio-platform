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
     * Display the Revenue & Payments analytical dashboard.
     * Orchestrates date-range filtered financial auditing and revenue trend visualization.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function payments(Request $request): View
    {
        // Phase 1: Date Range Sanitation
        $endDate   = $request->query('end_date') ? Carbon::parse($request->query('end_date')) : now();
        $startDate = $request->query('start_date') ? Carbon::parse($request->query('start_date')) : now()->subDays(self::DEFAULT_DAYS_FILTER);
        
        if ($startDate->greaterThan($endDate)) {
            $startDate = $endDate->copy()->subDays(self::DEFAULT_DAYS_FILTER); 
        }

        // Phase 2: Transactional Registry Hydration
        $baseQuery = Payment::query()
            ->where('status', 'completed')
            ->whereBetween('paid_at', [$startDate->startOfDay(), $endDate->endOfDay()]);

        // Phase 3: Metric Calculation (KPIs)
        $kpis      = $this->getPaymentKpis($baseQuery);
        $trendData = $this->getMonthlyRevenueTrend();
        $recents   = $this->getRecentTransactions($baseQuery);
        
        $data = [
            'reportTitle'            => __('Revenue & Payments Report'),
            'totalRevenue'           => number_format($kpis['totalRevenue'], 2),
            'avgTransactionValue'    => number_format($kpis['avgTransactionValue'], 2),
            'successfulTransactions' => number_format($kpis['successfulTransactions']),
            'recentTransactions'     => $recents,
            'startDateFormatted'     => $startDate->format('Y-m-d'),
            'endDateFormatted'       => $endDate->format('Y-m-d'),
            'chartLabels'            => $trendData['labels'],
            'chartData'              => $trendData['data'],
        ];

        return view('admin.reports.payments', $data);
    }

    /**
     * Display the Property Booking analytical dashboard.
     * Orchestrates reservation lifecycle metrics, occupancy summaries, and revenue mapping.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function bookings(Request $request): View
    {
        $endDate   = $request->query('end_date') ? Carbon::parse($request->query('end_date')) : now();
        $startDate = $request->query('start_date') ? Carbon::parse($request->query('start_date')) : now()->subDays(self::DEFAULT_DAYS_FILTER);
        
        if ($startDate->greaterThan($endDate)) {
            $startDate = $endDate->copy()->subDays(self::DEFAULT_DAYS_FILTER);
        }
        
        $dateRange = [$startDate->startOfDay(), $endDate->endOfDay()];

        $baseQuery    = PropertyBooking::whereBetween('created_at', $dateRange);
        $revenueQuery = (clone $baseQuery)->where('status', 'completed');

        $kpis      = $this->getBookingKpis($baseQuery, $revenueQuery);
        $trendData = $this->getMonthlyBookingTrend();
        $topItems  = $this->getTopBookedProperties($baseQuery);
        $recents   = $this->getRecentBookings($baseQuery);

        $data = [
            'reportTitle'        => __('Property Booking Summary Report'),
            'totalBookings'      => number_format($kpis['totalBookings']),
            'successfulBookings' => number_format($kpis['successfulBookings']),
            'cancellations'      => number_format($kpis['cancellations']),
            'cancellationRate'   => $kpis['cancellationRate'] . '%',
            'totalRevenue'       => number_format($kpis['totalRevenue'], 2),
            'avgBookingValue'    => number_format($kpis['avgBookingValue'], 2),
            'topItems'           => $topItems,
            'recentBookings'     => $recents,
            'startDateFormatted' => $startDate->format('Y-m-d'),
            'endDateFormatted'   => $endDate->format('Y-m-d'),
            'chartLabels'        => $trendData['labels'],
            'chartData'          => $trendData['data'],
        ];

        return view('admin.reports.bookings', $data);
    }

    /**
     * Display the Property Occupancy & Availability dashboard.
     * Orchestrates unit-level utilization metrics and real-time inventory reporting.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function properties(Request $request): View
    {
        $endDate   = $request->query('end_date') ? Carbon::parse($request->query('end_date')) : now();
        $startDate = $request->query('start_date') ? Carbon::parse($request->query('start_date')) : now()->subDays(30); 
        
        if ($startDate->greaterThan($endDate)) {
            $startDate = $endDate->copy()->subDays(30);
        }

        $totalUnits = Property::count();
        
        // Occupancy Overlap Logic: (CheckOut >= RangeStart) AND (CheckIn <= RangeEnd)
        $occupiedPropertyIds = PropertyBooking::where('status', '!=', 'cancelled') 
            ->where('check_out_date', '>=', $startDate->startOfDay()) 
            ->where('check_in_date', '<=', $endDate->endOfDay()) 
            ->pluck('property_id')
            ->unique();
            
        $occupiedUnits  = $occupiedPropertyIds->count();
        $availableUnits = max(0, $totalUnits - $occupiedUnits);
        $occupancyRate  = $totalUnits > 0 ? round(($occupiedUnits / $totalUnits) * 100, 2) : 0;

        $propertyList = Property::select('id', 'title', 'slug', 'location_id', 'total_units')
            ->with('location')
            ->orderBy('title', 'asc') 
            ->paginate(50)
            ->through(function ($property) use ($occupiedPropertyIds) {
                 $isOccupied = $occupiedPropertyIds->contains($property->id);
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
            'occupancyRate'      => $occupancyRate . '%',
            'occupiedUnits'      => number_format($occupiedUnits),
            'availableUnits'     => number_format($availableUnits),
            'totalUnits'         => number_format($totalUnits),
            'propertyList'       => $propertyList,
        ];

        return view('admin.reports.properties', $data);
    }

    /**
     * Calculate core financial KPIs for the payment registry.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $baseQuery
     * @return array
     */
    private function getPaymentKpis(Builder $baseQuery): array
    {
        $totalRevenue = (clone $baseQuery)->sum('amount');
        $successful   = (clone $baseQuery)->count();
        $avgValue     = $successful > 0 ? $totalRevenue / $successful : 0;

        return [
            'totalRevenue'           => $totalRevenue,
            'successfulTransactions' => $successful,
            'avgTransactionValue'    => $avgValue,
        ];
    }

    /**
     * Retrieve monthly revenue trends for retrospective visualization.
     *
     * @return array
     */
    private function getMonthlyRevenueTrend(): array
    {
        $trendStart = Carbon::now()->subMonths(self::MONTHS_FOR_TREND)->startOfMonth();

        $revenueTrend = Payment::select(
                DB::raw('DATE_FORMAT(paid_at, "%Y-%m") as month_year'),
                DB::raw('SUM(amount) as total_amount')
            )
            ->where('status', 'completed')
            ->where('paid_at', '>=', $trendStart)
            ->groupBy('month_year')
            ->orderBy('month_year', 'asc')
            ->get();
            
        $chartLabels = [];
        $chartData   = [];

        for ($i = self::MONTHS_FOR_TREND - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $key  = $date->format('Y-m');

            $chartLabels[] = $date->format('M Y');
            $dataPoint     = $revenueTrend->firstWhere('month_year', $key);
            $chartData[]   = $dataPoint ? round($dataPoint->total_amount, 2) : 0;
        }

        return ['labels' => $chartLabels, 'data' => $chartData];
    }

    /**
     * Retrieve the recent transactional history with polymorphic subject mapping.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $baseQuery
     * @return \Illuminate\Support\Collection
     */
    private function getRecentTransactions(Builder $baseQuery): Collection
    {
        return (clone $baseQuery)
            ->with('payable') 
            ->orderByDesc('paid_at')
            ->limit(self::RECENT_TRANSACTIONS_LIMIT)
            ->get()
            ->map(fn (Payment $tx) => new Fluent([
                'id'      => $tx->id,
                'amount'  => $tx->amount,
                'method'  => $tx->payable ? class_basename($tx->payable) : $tx->method, 
                'status'  => $tx->status,
                'paid_at' => $tx->paid_at,
                'payable' => $tx->payable, 
            ]));
    }

    /**
     * Calculate core performance metrics for the reservation lifecycle.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $baseQuery
     * @param  \Illuminate\Database\Eloquent\Builder  $revenueQuery
     * @return array
     */
    private function getBookingKpis(Builder $baseQuery, Builder $revenueQuery): array
    {
        $totalBookings      = (clone $baseQuery)->count();
        $cancellations      = (clone $baseQuery)->where('status', 'cancelled')->count();
        $successfulBookings = (clone $revenueQuery)->count();
        $totalRevenue       = (clone $revenueQuery)->sum('total_price');
        
        $cancellationRate = $totalBookings > 0 ? round(($cancellations / $totalBookings) * 100, 2) : 0;
        $avgBookingValue  = $successfulBookings > 0 ? $totalRevenue / $successfulBookings : 0;

        return [
            'totalBookings'      => $totalBookings,
            'successfulBookings' => $successfulBookings,
            'cancellations'      => $cancellations,
            'cancellationRate'   => $cancellationRate,
            'totalRevenue'       => $totalRevenue,
            'avgBookingValue'    => $avgBookingValue,
        ];
    }

    /**
     * Retrieve monthly booking trends for retrospective visualization.
     *
     * @return array
     */
    private function getMonthlyBookingTrend(): array
    {
        $trendStart = Carbon::now()->subMonths(self::MONTHS_FOR_TREND)->startOfMonth();

        $bookingTrend = PropertyBooking::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month_year'),
            DB::raw('COUNT(id) as total_count')
        )
            ->where('created_at', '>=', $trendStart)
            ->groupBy('month_year')
            ->orderBy('month_year', 'asc')
            ->get();
            
        $chartLabels = [];
        $chartData   = [];

        for ($i = self::MONTHS_FOR_TREND - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $key  = $date->format('Y-m');

            $chartLabels[] = $date->format('M Y');
            $dataPoint     = $bookingTrend->firstWhere('month_year', $key);
            $chartData[]   = $dataPoint ? $dataPoint->total_count : 0;
        }

        return ['labels' => $chartLabels, 'data' => $chartData];
    }

    /**
     * Identify the top-performing properties based on booking volume.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $baseQuery
     * @return \Illuminate\Support\Collection
     */
    private function getTopBookedProperties(Builder $baseQuery): Collection
    {
        $topBookings = (clone $baseQuery)
            ->select('property_id', DB::raw('COUNT(id) as booking_count'))
            ->groupBy('property_id')
            ->orderByDesc('booking_count')
            ->limit(5)
            ->get();
            
        $properties = Property::whereIn('id', $topBookings->pluck('property_id'))->get()->keyBy('id');

        return $topBookings->map(fn ($b) => new Fluent([
            'title' => isset($properties[$b->property_id]) ? $properties[$b->property_id]->title : __('Deleted Property (ID: :id)', ['id' => $b->property_id]),
            'count' => $b->booking_count,
        ]));
    }

    /**
     * Retrieve the recent booking history with customer and property mapping.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $baseQuery
     * @return \Illuminate\Support\Collection
     */
    private function getRecentBookings(Builder $baseQuery): Collection
    {
        return (clone $baseQuery)
            ->with(['property', 'user']) 
            ->orderByDesc('created_at')
            ->limit(self::RECENT_TRANSACTIONS_LIMIT)
            ->get()
            ->map(fn (PropertyBooking $b) => new Fluent([
                'id'       => $b->id,
                'customer' => optional($b->user)->title ?? __('Guest/Unknown'),
                'service'  => optional($b->property)->title ?? __('N/A'),
                'date'     => $b->created_at,
                'amount'   => $b->total_price ?? 0,
                'status'   => $b->status,
            ]));
    }
}
