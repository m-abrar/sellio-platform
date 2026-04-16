<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

// Listing Models
use App\Models\Property; 
use App\Models\Event; 
use App\Models\JobListing; 
use App\Models\Service; 
use App\Models\Classified;
use App\Models\Auto;

// Lead/Booking Models
use App\Models\PropertyBooking;
use App\Models\EventBooking;
use App\Models\JobApplication; 
use App\Models\ServiceAppointment; 
use App\Models\ServiceQuote;
use App\Models\ClassifiedInquiry;
use App\Models\AutoInquiry;

// Activity Log Model (for views)
use Spatie\Activitylog\Models\Activity as ActivityLog;


class AnalyticsController extends Controller
{
    /**
     * Displays the main partner analytics dashboard.
     */
    public function index(Request $request)
    {
        $partner = Auth::user();

        // 1. Get the requested time period, default to 30 days
        $days = (int) $request->get('period', 30);
        
        // 2. Calculate core metrics (views, leads, conversion rate, etc.)
        $performanceData = $this->calculatePerformanceMetrics($partner, $days);

        // 3. Calculate total confirmed revenue
        $totalEarnings = $this->calculateEarnings($partner, 0, $days);
        
        // 4. Generate data structure for the main line chart
        $chartData = $this->generateChartData($partner, $days);
        
        // 5. Get performance breakdown for the detail table
        $detailedPerformance = $this->getDetailedListingPerformance($partner, $days);
        
        // 6. Fetch all active listings for the filter dropdown
        $allListings = (new Collection())
            ->merge($partner->properties()->get(['id', 'title', 'slug']))
            ->merge($partner->events()->get(['id', 'title', 'slug']))
            ->merge($partner->jobs()->get(['id', 'title', 'slug']))
            ->merge($partner->autos()->get(['id', 'title', 'slug']))
            ->merge($partner->services()->get(['id', 'title', 'slug']))
            ->merge($partner->classifieds()->get(['id', 'title', 'slug']))
            ->map(function ($listing) {
                $modelType = Str::afterLast(get_class($listing), '\\');
                // Ensure correct type name for JobListing
                if ($modelType === 'JobListing') $modelType = 'Job'; 

                return [
                    'id' => $listing->id,
                    'title' => $listing->title,
                    'type' => $modelType,
                    'key' => "{$modelType}_{$listing->id}" // e.g., 'Property_1'
                ];
            })
            ->sortBy('title');

        return $this->successResponse(compact(
            'partner', 
            'performanceData', 
            'totalEarnings', 
            'chartData', 
            'detailedPerformance', 
            'allListings',
            'days'
        ));
    }

    /**
     * Generates data for the Chart.js line chart showing views and leads over time.
     */
    private function generateChartData($partner, int $days = 30, $listingId = null, $listingType = null): array
    {
        $startDate = Carbon::now()->subDays($days)->startOfDay();
        $dates = collect();
        $currentDate = $startDate->copy();

        // Create a date range template with zero counts
        while ($currentDate->lessThanOrEqualTo(Carbon::now())) {
            $dates->put($currentDate->toDateString(), 0);
            $currentDate->addDay();
        }

        $listingCollections = $this->getFilteredListings($partner, $listingId, $listingType);
        $modelMap = $this->buildModelMap($listingCollections);
        
        // Calculate Daily Views (Activity Log)
        $rawViews = ActivityLog::selectRaw('DATE(created_at) as date, count(*) as count')
            ->where('description', 'viewed_listing')
            ->where('created_at', '>=', $startDate)
            ->where(function ($query) use ($modelMap) {
                foreach ($modelMap as $type => $ids) {
                    if ($ids->isNotEmpty()) {
                        $query->orWhere(function ($q) use ($type, $ids) {
                            $q->where('subject_type', $type)
                             ->whereIn('subject_id', $ids);
                        });
                    }
                }
            })
            ->groupBy('date')
            ->pluck('count', 'date');

        $viewsPerDay = $dates->merge($rawViews)->sortKeys()->values()->toArray();
        $datesFormatted = $dates->keys()->map(fn($date) => Carbon::parse($date)->format('M d'))->toArray();

        // Calculate Daily Leads (Leads/Bookings Models)
        $leadQueries = $this->buildLeadQueries($listingCollections, $startDate);
        
        $rawLeads = [];
        foreach ($leadQueries as $query) {
            $queryResults = $query->selectRaw('DATE(created_at) as date, count(*) as count')
                ->groupBy('date')
                ->get();
                
            foreach ($queryResults as $result) {
                $dateString = $result->date;
                $rawLeads[$dateString] = (isset($rawLeads[$dateString]) ? $rawLeads[$dateString] : 0) + $result->count;
            }
        }

        $leadsPerDay = $dates->merge($rawLeads)->sortKeys()->values()->toArray();

        return [
            'labels' => $datesFormatted,
            'datasets' => [
                [
                    'label' => 'Total Views',
                    'data' => $viewsPerDay,
                    'borderColor' => '#007bff', 
                    'backgroundColor' => 'rgba(0, 123, 255, 0.1)',
                    'tension' => 0.4,
                    'fill' => true,
                ],
                [
                    'label' => 'Total Leads',
                    'data' => $leadsPerDay,
                    'borderColor' => '#28a745', 
                    'backgroundColor' => 'rgba(40, 167, 69, 0.1)',
                    'tension' => 0.4,
                    'fill' => true,
                ],
            ]
        ];
    }


    /**
     * Retrieves partner's listings, optionally filtered by ID and Type.
     */
    private function getFilteredListings($partner, $listingId = null, $listingType = null): array
    {
        // Removed 'base_price' from the general select array as it does not exist on all models (e.g., JobListing)
        $baseSelect = ['id', 'title', 'slug']; 

        $listings = [];

        if ($listingType && $listingId) {
            $model = "App\\Models\\{$listingType}";
            $relationshipName = Str::lower(Str::plural($listingType));
            // Handle pluralization inconsistencies
            if ($listingType === 'Property') $relationshipName = 'properties';
            if ($listingType === 'JobListing') $relationshipName = 'jobs';

            $listing = $partner->{$relationshipName}()->find($listingId);
            if ($listing) {
                $listings[$model] = collect([$listing]);
            }
        } else {
            // Get all listings for the partner
            $listings[Property::class] = $partner->properties()->get($baseSelect);
            $listings[Event::class] = $partner->events()->get($baseSelect);
            $listings[JobListing::class] = $partner->jobs()->get($baseSelect);
            $listings[Auto::class] = $partner->autos()->get($baseSelect);
            $listings[Service::class] = $partner->services()->get($baseSelect);
            $listings[Classified::class] = $partner->classifieds()->get($baseSelect);
        }
        
        return $listings;
    }
    

    /**
     * Maps listing collections to an array of Model Class => [ID list]
     */
    private function buildModelMap(array $listingCollections): array
    {
        $modelMap = [];
        foreach ($listingCollections as $modelClass => $collection) {
            $modelMap[$modelClass] = $collection->pluck('id');
        }
        return $modelMap;
    }

    /**
     * Builds Eloquent query builders for all relevant lead/booking models.
     */
    private function buildLeadQueries(array $listingCollections, $startDate): array
    {
        $queries = [];
        
        $propertyIds = isset($listingCollections[Property::class]) ? $listingCollections[Property::class]->pluck('id') : collect();
        $eventIds = isset($listingCollections[Event::class]) ? $listingCollections[Event::class]->pluck('id') : collect();
        $jobIds = isset($listingCollections[JobListing::class]) ? $listingCollections[JobListing::class]->pluck('id') : collect();
        $autoIds = isset($listingCollections[Auto::class]) ? $listingCollections[Auto::class]->pluck('id') : collect();
        $serviceIds = isset($listingCollections[Service::class]) ? $listingCollections[Service::class]->pluck('id') : collect();
        $classifiedIds = isset($listingCollections[Classified::class]) ? $listingCollections[Classified::class]->pluck('id') : collect();
        
        if ($propertyIds->isNotEmpty()) {
            $queries[] = PropertyBooking::whereIn('property_id', $propertyIds)->where('created_at', '>=', $startDate);
        }
        if ($eventIds->isNotEmpty()) {
            $queries[] = EventBooking::whereIn('event_id', $eventIds)->where('created_at', '>=', $startDate);
        }
        if ($jobIds->isNotEmpty()) {
            $queries[] = JobApplication::whereIn('job_listing_id', $jobIds)->where('created_at', '>=', $startDate);
        }
        if ($autoIds->isNotEmpty()) {
            $queries[] = AutoInquiry::whereIn('auto_id', $autoIds)->where('created_at', '>=', $startDate);
        }
        if ($serviceIds->isNotEmpty()) {
            $queries[] = ServiceAppointment::whereIn('service_id', $serviceIds)->where('created_at', '>=', $startDate);
            $queries[] = ServiceQuote::whereIn('service_id', $serviceIds)->where('created_at', '>=', $startDate);
        }
        if ($classifiedIds->isNotEmpty()) {
            $queries[] = ClassifiedInquiry::whereIn('classified_id', $classifiedIds)->where('created_at', '>=', $startDate);
        }
        
        return $queries;
    }

    /**
     * Calculates total confirmed revenue within the time period.
     */
    private function calculateEarnings($partner, int $startDayOffset, int $endDayOffset, $listingId = null, $listingType = null): float
    {
        $endDate = Carbon::now()->subDays($startDayOffset);
        $startDate = Carbon::now()->subDays($endDayOffset);

        $listingCollections = $this->getFilteredListings($partner, $listingId, $listingType);
        
        $propertyIds = isset($listingCollections[Property::class]) ? $listingCollections[Property::class]->pluck('id') : collect();
        $eventIds = isset($listingCollections[Event::class]) ? $listingCollections[Event::class]->pluck('id') : collect();
        $serviceIds = isset($listingCollections[Service::class]) ? $listingCollections[Service::class]->pluck('id') : collect();
        
        // Note: Job applications, auto inquiries, and classified inquiries typically do not generate direct revenue models here.

        $propertyRevenue = $propertyIds->isNotEmpty() 
            ? PropertyBooking::whereIn('property_id', $propertyIds)
                ->where('status', 'confirmed')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('total_price')
            : 0.0;

        $eventRevenue = $eventIds->isNotEmpty()
            ? EventBooking::whereIn('event_id', $eventIds)
                ->where('status', 'confirmed')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('total_price')
            : 0.0;

        $serviceAppointmentRevenue = $serviceIds->isNotEmpty()
            ? ServiceAppointment::whereIn('service_id', $serviceIds)
                ->where('status', 'confirmed')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('price')
            : 0.0;

        $serviceQuoteRevenue = $serviceIds->isNotEmpty()
            ? ServiceQuote::whereIn('service_id', $serviceIds)
                ->where('status', 'accepted')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('quoted_price')
            : 0.0;
        
        $serviceRevenue = $serviceAppointmentRevenue + $serviceQuoteRevenue;
        
        return (float) ($propertyRevenue + $eventRevenue + $serviceRevenue);
    }

    /**
     * Calculates total views, leads, and conversion rate.
     */
    private function calculatePerformanceMetrics($partner, int $days = 30, $listingId = null, $listingType = null): array
    {
        $startDate = Carbon::now()->subDays($days);
        $totalViews = 0;
        $totalLeads = 0;
        
        $listingCollections = $this->getFilteredListings($partner, $listingId, $listingType);
        $modelMap = $this->buildModelMap($listingCollections);

        // Calculate Total Views
        $viewsQuery = ActivityLog::where('description', 'viewed_listing')
            ->where('created_at', '>=', $startDate);

        $viewsQuery->where(function ($query) use ($modelMap) {
            foreach ($modelMap as $type => $ids) {
                if ($ids->isNotEmpty()) {
                    $query->orWhere(function ($q) use ($type, $ids) {
                        $q->where('subject_type', $type)
                         ->whereIn('subject_id', $ids);
                    });
                }
            }
        });

        $totalViews = $viewsQuery->count();

        // Calculate Total Leads
        $leadQueries = $this->buildLeadQueries($listingCollections, $startDate);
        
        foreach ($leadQueries as $query) {
            $totalLeads += $query->count();
        }

        $conversionRate = $totalViews > 0 ? ($totalLeads / $totalViews) * 100 : 0;
        
        // Mocked or calculated operational metrics
        $avgResponseTime = '2.5 hours'; 
        
        return [
            'total_views' => $totalViews,
            'total_leads' => $totalLeads,
            'conversion_rate' => number_format($conversionRate, 2),
            'avg_response_time' => $avgResponseTime,
            // 'avg_occupancy_rate' is in the original code but not calculated here, removed for cleanliness
        ];
    }

    /**
     * Gets performance metrics broken down by individual listing.
     */
    private function getDetailedListingPerformance($partner, int $days = 30): Collection
    {
        $startDate = Carbon::now()->subDays($days);
        $listings = $this->getFilteredListings($partner);
        $performanceData = new Collection();

        foreach ($listings as $modelClass => $collection) {
            foreach ($collection as $listing) {
                $listingId = $listing->id;
                $modelType = Str::afterLast($modelClass, '\\');
                $viewRoute = '';

                // Determine the view route based on the model type and slug
                $listingIdentifier = $listing->slug ?? $listingId;
                if ($modelType === 'Property') $viewRoute = route('properties.show', ['property' => $listingIdentifier]);
                else if ($modelType === 'Event') $viewRoute = route('events.show', ['event' => $listingIdentifier]);
                else if ($modelType === 'JobListing') $viewRoute = route('jobs.show', ['job' => $listingIdentifier]);
                else if ($modelType === 'Auto') $viewRoute = route('autos.show', ['auto' => $listingIdentifier]);
                else if ($modelType === 'Service') $viewRoute = route('services.show', ['service' => $listingIdentifier]);
                else if ($modelType === 'Classified') $viewRoute = route('classifieds.show', ['classified' => $listingIdentifier]);
                
                // 1. Get Views
                $views = ActivityLog::where('subject_type', $modelClass)
                    ->where('subject_id', $listingId)
                    ->where('description', 'viewed_listing')
                    ->where('created_at', '>=', $startDate)
                    ->count();
                
                $leads = 0;
                $revenue = 0.0;
                
                // 2. Get Leads and Revenue (model-specific logic)
                switch ($modelType) {
                    case 'Property':
                        $leads = PropertyBooking::where('property_id', $listingId)->where('created_at', '>=', $startDate)->count();
                        $revenue = PropertyBooking::where('property_id', $listingId)->where('status', 'confirmed')->where('created_at', '>=', $startDate)->sum('total_price');
                        break;
                    case 'Event':
                        $leads = EventBooking::where('event_id', $listingId)->where('created_at', '>=', $startDate)->count();
                        $revenue = EventBooking::where('event_id', $listingId)->where('status', 'confirmed')->where('created_at', '>=', $startDate)->sum('total_price');
                        break;
                    case 'JobListing':
                        $leads = JobApplication::where('job_listing_id', $listingId)->where('created_at', '>=', $startDate)->count();
                        $revenue = 0.0; // Job applications typically do not generate revenue directly
                        break;
                    case 'Auto':
                        $leads = AutoInquiry::where('auto_id', $listingId)->where('created_at', '>=', $startDate)->count();
                        $revenue = 0.0;
                        break;
                    case 'Service':
                        $leads = ServiceAppointment::where('service_id', $listingId)->where('created_at', '>=', $startDate)->count() + 
                                     ServiceQuote::where('service_id', $listingId)->where('created_at', '>=', $startDate)->count();
                        $revenue = ServiceAppointment::where('service_id', $listingId)->where('status', 'confirmed')->where('created_at', '>=', $startDate)->sum('price') +
                                     ServiceQuote::where('service_id', $listingId)->where('status', 'accepted')->where('created_at', '>=', $startDate)->sum('quoted_price');
                        break;
                    case 'Classified':
                        $leads = ClassifiedInquiry::where('classified_id', $listingId)->where('created_at', '>=', $startDate)->count();
                        $revenue = 0.0;
                        break;
                }

                $conversionRate = $views > 0 ? ($leads / $views) * 100 : 0;
                
                $performanceData->push([
                    'title' => $listing->title,
                    'type' => $modelType,
                    'id' => $listingId,
                    'views' => $views,
                    'leads' => $leads,
                    'revenue' => $revenue,
                    'conversion_rate' => number_format($conversionRate, 2),
                    'viewRoute' => $viewRoute,
                ]);
            }
        }
        
        return $performanceData;
    }
}
