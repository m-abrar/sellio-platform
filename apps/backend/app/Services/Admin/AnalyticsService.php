<?php

namespace App\Services\Admin;

use App\Models\Payment;
use App\Models\Property;
use App\Models\PropertyBooking;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use Illuminate\Support\Fluent;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Class AnalyticsService
 * Orchestrates the complex data aggregation and analytical logic for the platform's reporting hub.
 */
class AnalyticsService
{
    private const MONTHS_FOR_TREND = 12;

    /**
     * Get Payment Analytics including KPIs and Trends.
     *
     * @param Carbon $start
     * @param Carbon $end
     * @return array
     */
    public function getPaymentAnalytics(Carbon $start, Carbon $end): array
    {
        $baseQuery = Payment::query()
            ->where('status', 'completed')
            ->whereBetween('paid_at', [$start->startOfDay(), $end->endOfDay()]);

        $totalRevenue = (clone $baseQuery)->sum('amount');
        $successful   = (clone $baseQuery)->count();
        $avgValue     = $successful > 0 ? $totalRevenue / $successful : 0;

        $trendData = $this->getMonthlyRevenueTrend();
        $recents   = (clone $baseQuery)
            ->with('payable')
            ->orderByDesc('paid_at')
            ->limit(5)
            ->get()
            ->map(fn ($tx) => new Fluent([
                'id'      => $tx->id,
                'amount'  => $tx->amount,
                'method'  => $tx->payable ? class_basename($tx->payable) : $tx->payment_method,
                'status'  => $tx->status,
                'paid_at' => $tx->paid_at,
                'payable' => $tx->payable,
            ]));

        return [
            'totalRevenue'           => $totalRevenue,
            'successfulTransactions' => $successful,
            'avgTransactionValue'    => $avgValue,
            'trendLabels'            => $trendData['labels'],
            'trendData'              => $trendData['data'],
            'recentTransactions'     => $recents,
        ];
    }

    /**
     * Get Property Booking Analytics.
     *
     * @param Carbon $start
     * @param Carbon $end
     * @return array
     */
    public function getBookingAnalytics(Carbon $start, Carbon $end): array
    {
        $dateRange = [$start->startOfDay(), $end->endOfDay()];
        $baseQuery = PropertyBooking::whereBetween('created_at', $dateRange);
        $revenueQuery = (clone $baseQuery)->where('status', 'completed');

        $totalBookings      = (clone $baseQuery)->count();
        $cancellations      = (clone $baseQuery)->where('status', 'cancelled')->count();
        $successfulBookings = (clone $revenueQuery)->count();
        $totalRevenue       = (clone $revenueQuery)->sum('total_price');
        
        $cancellationRate = $totalBookings > 0 ? round(($cancellations / $totalBookings) * 100, 2) : 0;
        $avgBookingValue  = $successfulBookings > 0 ? $totalRevenue / $successfulBookings : 0;

        $trendData = $this->getMonthlyBookingTrend();
        
        $topItems = (clone $baseQuery)
            ->select('property_id', DB::raw('COUNT(id) as booking_count'))
            ->groupBy('property_id')
            ->orderByDesc('booking_count')
            ->limit(5)
            ->get();
            
        $properties = Property::whereIn('id', $topItems->pluck('property_id'))->get()->keyBy('id');
        $topItemsFormatted = $topItems->map(fn ($b) => new Fluent([
            'title' => isset($properties[$b->property_id]) ? $properties[$b->property_id]->title : __('Deleted Property'),
            'count' => $b->booking_count,
        ]));

        $recents = (clone $baseQuery)
            ->with(['property', 'user'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn (PropertyBooking $b) => new Fluent([
                'id'       => $b->id,
                'customer' => $b->user->name ?? __('Guest'),
                'service'  => $b->property->title ?? __('N/A'),
                'date'     => $b->created_at,
                'amount'   => $b->total_price ?? 0,
                'status'   => $b->status,
            ]));

        return [
            'totalBookings'      => $totalBookings,
            'successfulBookings' => $successfulBookings,
            'cancellations'      => $cancellations,
            'cancellationRate'   => $cancellationRate,
            'totalRevenue'       => $totalRevenue,
            'avgBookingValue'    => $avgBookingValue,
            'trendLabels'        => $trendData['labels'],
            'trendData'          => $trendData['data'],
            'topItems'           => $topItemsFormatted,
            'recentBookings'     => $recents,
        ];
    }

    /**
     * Get Property Occupancy Analytics.
     *
     * @param Carbon $start
     * @param Carbon $end
     * @return array
     */
    public function getOccupancyAnalytics(Carbon $start, Carbon $end): array
    {
        $totalUnits = Property::count();
        
        $occupiedPropertyIds = PropertyBooking::where('status', '!=', 'cancelled')
            ->where('check_out_date', '>=', $start->startOfDay())
            ->where('check_in_date', '<=', $end->endOfDay())
            ->pluck('property_id')
            ->unique();
            
        $occupiedUnits  = $occupiedPropertyIds->count();
        $availableUnits = max(0, $totalUnits - $occupiedUnits);
        $occupancyRate  = $totalUnits > 0 ? round(($occupiedUnits / $totalUnits) * 100, 2) : 0;

        return [
            'totalUnits'     => $totalUnits,
            'occupiedUnits'  => $occupiedUnits,
            'availableUnits' => $availableUnits,
            'occupancyRate'  => $occupancyRate,
            'occupiedIds'    => $occupiedPropertyIds,
        ];
    }

    /**
     * Get paginated occupancy list for properties with formatted status.
     *
     * @param Carbon $start
     * @param Carbon $end
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPropertyOccupancyList(Carbon $start, Carbon $end, int $perPage = 50): LengthAwarePaginator
    {
        $analytics = $this->getOccupancyAnalytics($start, $end);
        
        return Property::select('id', 'title', 'slug', 'location_id', 'total_units')
            ->with('location')
            ->orderBy('title', 'asc') 
            ->paginate($perPage)
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
    }

    /**
     * Internal helper to calculate monthly revenue trends.
     *
     * @return array
     */
    protected function getMonthlyRevenueTrend(): array
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
            
        $labels = [];
        $data   = [];

        for ($i = self::MONTHS_FOR_TREND - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $key  = $date->format('Y-m');
            $labels[] = $date->format('M Y');
            $dataPoint = $revenueTrend->firstWhere('month_year', $key);
            $data[] = $dataPoint ? (float) $dataPoint->total_amount : 0;
        }

        return ['labels' => $labels, 'data' => $data];
    }

    /**
     * Internal helper to calculate monthly booking trends.
     *
     * @return array
     */
    protected function getMonthlyBookingTrend(): array
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
            
        $labels = [];
        $data   = [];

        for ($i = self::MONTHS_FOR_TREND - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $key  = $date->format('Y-m');
            $labels[] = $date->format('M Y');
            $dataPoint = $bookingTrend->firstWhere('month_year', $key);
            $data[] = $dataPoint ? (int) $dataPoint->total_count : 0;
        }

        return ['labels' => $labels, 'data' => $data];
    }
}
