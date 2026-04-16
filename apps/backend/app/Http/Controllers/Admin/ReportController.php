<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Fluent; 

// Import your application models
use App\Models\Payment;
use App\Models\Property;
use App\Models\Auto;
use App\Models\Event;
use App\Models\JobListing;
use App\Models\Service;
use App\Models\Classified;
use App\Models\PropertyBooking;
use App\Models\User; // Assuming User model is available for customer names

class ReportController extends Controller
{
    // Constants for configuration
    private const DEFAULT_DAYS_FILTER = 365;
    private const MONTHS_FOR_TREND = 12;
    private const RECENT_TRANSACTIONS_LIMIT = 5;

    /**
     * Display the Revenue & Payments report dashboard.
     * Supports date filtering and a fixed 6-month revenue trend analysis.
     */
    public function payments(Request $request)
    {
        // 1. Define and Sanitize Date Range
        $rawEndDate = $request->input('end_date');
        $rawStartDate = $request->input('start_date');

        // Set End Date (Default: now)
        $endDate = $rawEndDate ? Carbon::parse($rawEndDate) : now();
        // Set Start Date (Default: 365 days ago)
        $startDate = $rawStartDate ? Carbon::parse($rawStartDate) : now()->subDays(self::DEFAULT_DAYS_FILTER);
        
        // Ensure start date is not after end date
        if ($startDate->greaterThan($endDate)) {
            // If invalid, reset start date to a year before the requested end date
            $startDate = $endDate->copy()->subDays(self::DEFAULT_DAYS_FILTER); 
        }

        // Base query for successful payments within the date range
        // We use $startDate->startOfDay() and $endDate->endOfDay() to ensure full day coverage
        $baseQuery = Payment::query()
            ->where('status', 'completed')
            ->whereBetween('paid_at', [$startDate->startOfDay(), $endDate->endOfDay()]);

        // 2. Fetch Key Metrics (Kpis)
        $kpis = $this->getPaymentKpis($baseQuery);
        
        // 3. Fetch Monthly Trend Data (fixed last N months)
        $trendData = $this->getMonthlyRevenueTrend();

        // 4. Fetch Recent Transactions with eager loading and modified data structure for view
        $recentTransactions = $this->getRecentTransactions($baseQuery);
        
        $data = [
            'reportTitle' => 'Revenue & Payments Report',
            'totalRevenue' => number_format($kpis['totalRevenue'], 2),
            'avgTransactionValue' => number_format($kpis['avgTransactionValue'], 2),
            'successfulTransactions' => number_format($kpis['successfulTransactions']),
            'recentTransactions' => $recentTransactions,
            'startDateFormatted' => $startDate->format('Y-m-d'),
            'endDateFormatted' => $endDate->format('Y-m-d'),
            'chartLabels' => $trendData['labels'],
            'chartData' => $trendData['data'],
        ];

        return view('admin.reports.payments', $data);
    }
    
    /**
     * Calculates key performance indicators for payments.
     */
    private function getPaymentKpis(Builder $baseQuery): array
    {
        $totalRevenue = (clone $baseQuery)->sum('amount');
        $successfulTransactions = (clone $baseQuery)->count();
        
        $avgTransactionValue = $successfulTransactions > 0
            ? $totalRevenue / $successfulTransactions
            : 0;

        return [
            'totalRevenue' => $totalRevenue,
            'successfulTransactions' => $successfulTransactions,
            'avgTransactionValue' => $avgTransactionValue,
        ];
    }
    
    /**
     * Retrieves monthly revenue trend for the last N months.
     */
    private function getMonthlyRevenueTrend(): array
    {
        // Calculate the start date for the trend analysis
        $trendStart = Carbon::now()->subMonths(self::MONTHS_FOR_TREND)->startOfMonth();

        // Query revenue grouped by year-month
        $revenueTrend = Payment::select(
                DB::raw('DATE_FORMAT(paid_at, "%Y-%m") as month_year'),
                DB::raw('SUM(amount) as total_amount')
            )
            ->where('status', 'completed')
            ->where('paid_at', '>=', $trendStart)
            ->groupBy('month_year')
            ->orderBy('month_year', 'asc')
            ->get();
            
        // Prepare Chart Data (filling in months with zero revenue for continuous chart)
        $chartLabels = [];
        $chartData = [];
        for ($i = self::MONTHS_FOR_TREND - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $key = $date->format('Y-m');

            $chartLabels[] = $date->format('M Y');
            $dataPoint = $revenueTrend->firstWhere('month_year', $key);
            $chartData[] = $dataPoint ? round($dataPoint->total_amount, 2) : 0;
        }

        return ['labels' => $chartLabels, 'data' => $chartData];
    }
    
    /**
     * Retrieves the most recent successful transactions with necessary data transformation.
     * Maps the result into Fluent objects for easy property access in the view.
     */
    private function getRecentTransactions(Builder $baseQuery): \Illuminate\Support\Collection
    {
        return (clone $baseQuery)
            // Eager load the polymorphic relationship
            ->with('payable') 
            ->orderByDesc('paid_at')
            ->limit(self::RECENT_TRANSACTIONS_LIMIT)
            ->get()
            // Transform the Eloquent model into a simple Fluent object for the report
            ->map(function (Payment $transaction) {
                $payable = $transaction->payable;
                
                return new Fluent([
                    'id' => $transaction->id,
                    'amount' => $transaction->amount,
                    // Use the Payable Type name for the 'Source Model' column
                    'method' => $payable ? class_basename($payable) : $transaction->method, 
                    'status' => $transaction->status,
                    'paid_at' => $transaction->paid_at,
                    // Keep the original payable model attached for the _payable_link partial
                    'payable' => $payable, 
                ]);
            });
    }

    // --- BOOKING REPORT METHODS ---

    /**
     * Calculates key performance indicators for PropertyBookings.
     */
    private function getBookingKpis(Builder $baseQuery, Builder $revenueQuery): array
    {
        $totalBookings = (clone $baseQuery)->count();
        $cancellations = (clone $baseQuery)->where('status', 'cancelled')->count();
        $successfulBookings = (clone $revenueQuery)->count();
        
        $totalRevenue = (clone $revenueQuery)->sum('total_price');
        
        $cancellationRate = $totalBookings > 0
            ? round(($cancellations / $totalBookings) * 100, 2)
            : 0;

        $avgBookingValue = $successfulBookings > 0
            ? $totalRevenue / $successfulBookings
            : 0;

        return [
            'totalBookings' => $totalBookings,
            'successfulBookings' => $successfulBookings,
            'cancellations' => $cancellations,
            'cancellationRate' => $cancellationRate,
            'totalRevenue' => $totalRevenue,
            'avgBookingValue' => $avgBookingValue,
        ];
    }

    /**
     * Retrieves monthly booking trend (count) for the last N months.
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
        $chartData = [];
        for ($i = self::MONTHS_FOR_TREND - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $key = $date->format('Y-m');

            $chartLabels[] = $date->format('M Y');
            $dataPoint = $bookingTrend->firstWhere('month_year', $key);
            $chartData[] = $dataPoint ? $dataPoint->total_count : 0;
        }

        return ['labels' => $chartLabels, 'data' => $chartData];
    }
    
    /**
     * Retrieves the top 5 most booked properties by count.
     */
    private function getTopBookedProperties(Builder $baseQuery): \Illuminate\Support\Collection
    {
        // Group by property_id and count bookings
        $topBookings = (clone $baseQuery)
            ->select('property_id', DB::raw('COUNT(id) as booking_count'))
            ->groupBy('property_id')
            ->orderByDesc('booking_count')
            ->limit(5)
            ->get();
            
        // Assuming PropertyBooking model has a 'property' relationship to Property model
        $topPropertyIds = $topBookings->pluck('property_id');
        $properties = Property::whereIn('id', $topPropertyIds)->get()->keyBy('id');

        // Combine booking counts with property details
        return $topBookings->map(function ($bookingData) use ($properties) {
            $property = $properties->get($bookingData->property_id);
            
            return new Fluent([
                'title' => $property ? $property->title : 'Deleted Property (ID: ' . $bookingData->property_id . ')',
                'count' => $bookingData->booking_count,
            ]);
        });
    }

    /**
     * Retrieves the most recent Property Bookings with necessary details.
     */
    private function getRecentBookings(Builder $baseQuery): \Illuminate\Support\Collection
    {
        // Assuming PropertyBooking has relationships for 'property' and 'user' (the customer)
        return (clone $baseQuery)
            ->with(['property', 'user']) 
            ->orderByDesc('created_at')
            ->limit(self::RECENT_TRANSACTIONS_LIMIT)
            ->get()
            ->map(function (PropertyBooking $booking) {
                $propertyTitle = optional($booking->property)->title ?? 'N/A';
                // Assuming the User model is related via a 'user_id' foreign key
                $customerName = optional($booking->user)->title ?? 'Guest/Unknown';
                
                return new Fluent([
                    'id' => $booking->id,
                    'customer' => $customerName,
                    'service' => $propertyTitle,
                    'date' => $booking->created_at,
                    'amount' => $booking->total_price ?? 0,
                    'status' => $booking->status,
                ]);
            });
    }

    /**
     * Display the Booking Summary report dashboard using PropertyBooking model.
     * Now supports date filtering for consistency and better reporting accuracy.
     */
    public function bookings(Request $request)
    {
        // 1. Define and Sanitize Date Range
        $rawEndDate = $request->input('end_date');
        $rawStartDate = $request->input('start_date');

        $endDate = $rawEndDate ? Carbon::parse($rawEndDate) : now();
        $startDate = $rawStartDate ? Carbon::parse($rawStartDate) : now()->subDays(self::DEFAULT_DAYS_FILTER);
        
        if ($startDate->greaterThan($endDate)) {
            $startDate = $endDate->copy()->subDays(self::DEFAULT_DAYS_FILTER);
        }
        
        $dateRange = [$startDate->startOfDay(), $endDate->endOfDay()];

        // Base query for ALL bookings in the date range (for counts, top items, and recents)
        $baseQuery = PropertyBooking::query()
            ->whereBetween('created_at', $dateRange);
            
        // Query for successful/completed bookings (for revenue and value)
        // Assuming 'completed' status means revenue collected
        $revenueQuery = (clone $baseQuery)->where('status', 'completed');

        // 2. Fetch Key Metrics (Kpis)
        $kpis = $this->getBookingKpis($baseQuery, $revenueQuery);
        
        // 3. Fetch Monthly Trend Data (fixed last N months)
        $trendData = $this->getMonthlyBookingTrend();
        
        // 4. Fetch Top Booked Items
        $topItems = $this->getTopBookedProperties($baseQuery);

        // 5. Fetch Recent Bookings
        $recentBookings = $this->getRecentBookings($baseQuery);

        $data = [
            'reportTitle' => 'Property Booking Summary Report',
            'totalBookings' => number_format($kpis['totalBookings']),
            'successfulBookings' => number_format($kpis['successfulBookings']),
            'cancellations' => number_format($kpis['cancellations']),
            'cancellationRate' => $kpis['cancellationRate'] . '%',
            'totalRevenue' => number_format($kpis['totalRevenue'], 2),
            'avgBookingValue' => number_format($kpis['avgBookingValue'], 2),
            'topItems' => $topItems,
            'recentBookings' => $recentBookings,
            'startDateFormatted' => $startDate->format('Y-m-d'),
            'endDateFormatted' => $endDate->format('Y-m-d'),
            'chartLabels' => $trendData['labels'],
            'chartData' => $trendData['data'],
        ];

        return view('admin.reports.bookings', $data);
    }

    /**
     * Display the Property Occupancy/Availability report.
     * Calculates occupancy rates and available units based on Properties and active Bookings.
     */
    public function properties(Request $request)
    {
        // 1. Define and Sanitize Date Range
        $rawEndDate = $request->input('end_date');
        $rawStartDate = $request->input('start_date');

        // Set End Date (Default: now)
        $endDate = $rawEndDate ? Carbon::parse($rawEndDate) : now();
        // Set Start Date (Default: 30 days ago for a more focused occupancy report)
        $startDate = $rawStartDate ? Carbon::parse($rawStartDate) : now()->subDays(30); 
        
        // Ensure start date is not after end date
        if ($startDate->greaterThan($endDate)) {
            $startDate = $endDate->copy()->subDays(30); // Use 30 days as a fallback
        }

        // Use the start and end of the day for the full range coverage
        $startDatePeriod = $startDate->startOfDay();
        $endDatePeriod = $endDate->endOfDay();
        
        // 2. Get all Property units and total count (this remains constant)
        $totalUnits = Property::count();
        
        // 3. Calculate Occupancy/Utilization over the selected date range
        
        // The definition of "Occupied" changes slightly for a range: 
        // A property is considered "occupied" during the range if ANY booking overlaps the range.
        // Overlap condition: (Booking_End >= Range_Start) AND (Booking_Start <= Range_End)
        $occupiedPropertyIds = PropertyBooking::query()
            ->where('status', '!=', 'cancelled') 
            // Booking must end ON or AFTER the report start date
            ->where('check_out_date', '>=', $startDatePeriod) 
            // Booking must start ON or BEFORE the report end date
            ->where('check_in_date', '<=', $endDatePeriod) 
            ->pluck('property_id')
            ->unique();
            
        $occupiedUnits = $occupiedPropertyIds->count();
        
        // Note: For a date range, the available units/occupancy rate calculation becomes an AVERAGE 
        // over the period, which requires more complex logic (like daily summing).
        // For simplicity, this report will show the count of properties that were occupied at least once 
        // during the range, and the current state based on total properties.
        
        // Calculate available units based on the difference (relative to total properties)
        $availableUnits = max(0, $totalUnits - $occupiedUnits);
        
        $occupancyRate = $totalUnits > 0
            ? round(($occupiedUnits / $totalUnits) * 100, 2)
            : 0;

        // 4. Get detailed Property List (with Eager Loading)
        $propertyList = Property::select('id', 'title', 'slug', 'location_id', 'total_units')
            ->with('location')
            ->orderBy('title', 'asc') 
            ->get()
            ->map(function ($property) use ($occupiedPropertyIds) {
                 // The status here indicates if the property was occupied AT ALL during the selected range.
                 $isOccupied = $occupiedPropertyIds->contains($property->id);
                 $currentStatus = $isOccupied ? 'Occupied (in range)' : 'Available (in range)'; 
                 return new Fluent([
                     'id' => $property->id,
                     'title' => $property->title, 
                     'location' => optional($property->location)->title ?? 'N/A', 
                     'status' => $currentStatus,
                     'total_units' => $property->total_units ?? 1,
                     'link' => route('properties.show', $property->slug), 
                 ]);
            });

        $data = [
            'reportTitle' => 'Property Occupancy & Availability Report',
            // Display the dates used in the report
            'startDateFormatted' => $startDate->format('Y-m-d'),
            'endDateFormatted' => $endDate->format('Y-m-d'),
            
            // Note: KPI labels should be adjusted in the Blade file to reflect they cover a period
            'occupancyRate' => $occupancyRate . '%',
            'occupiedUnits' => number_format($occupiedUnits),
            'availableUnits' => number_format($availableUnits),
            'totalUnits' => number_format($totalUnits),
            'propertyList' => $propertyList,
        ];

        return view('admin.reports.properties', $data);
    }
}
