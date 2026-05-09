<?php

namespace App\Http\Controllers\Dashboard\Partner\Traits;

use App\Models\Property; 
use App\Models\Event; 
use App\Models\Service; 
use App\Models\Classified;
use App\Models\Auto;
use App\Models\JobListing; 
use App\Models\PropertyBooking;
use App\Models\EventBooking;
use App\Models\ServiceAppointment;
use App\Models\ServiceQuote;
use Spatie\Activitylog\Models\Activity as ActivityLog; 
use App\Models\PropertyVisit; 
use App\Models\AutoInquiry; 
use App\Models\ClassifiedInquiry; 
use App\Models\JobApplication; 

use Illuminate\Support\Collection;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Builder;

trait DashboardMetrics
{
    use Listings; 

    /**
     * Request-level cache to prevent redundant ID fetching.
     */
    private static $listingIdCache = [];

    private function getFilteredListings($partner, $listingId = null, $listingType = null): array
    {
        $cacheKey = $partner->id . '_' . ($listingId ?? 'all') . '_' . ($listingType ?? 'all');
        
        if (isset(self::$listingIdCache[$cacheKey])) {
            return self::$listingIdCache[$cacheKey];
        }

        $listings = [];
        $models = [Property::class, Event::class, Service::class, Auto::class, Classified::class, JobListing::class]; 

        foreach ($models as $modelClass) {
            $relationName = Str::lower(class_basename($modelClass)) . 's';
            if ($modelClass === JobListing::class) $relationName = 'jobs'; 
            
            if (method_exists($partner, $relationName)) {
                if ($listingType && $listingType !== $modelClass) continue;
                
                $query = $partner->$relationName();
                if ($listingId) $query->where('id', $listingId);

                $listings[$modelClass] = $query->pluck('id');
            }
        }

        $result = collect($listings)->map(fn($ids) => collect($ids->map(fn($id) => (object)['id' => $id])) )->all();
        self::$listingIdCache[$cacheKey] = $result;
        
        return $result;
    }

    private function calculateEarnings($partner, int $startDayOffset, int $endDayOffset, $listingId = null, $listingType = null): float
    {
        $endDate = Carbon::now()->subDays($startDayOffset);
        $startDate = Carbon::now()->subDays($endDayOffset);

        $listingCollections = $this->getFilteredListings($partner, $listingId, $listingType);
        
        $propertyIds = ($listingCollections[Property::class] ?? collect())->pluck('id');
        $eventIds = ($listingCollections[Event::class] ?? collect())->pluck('id');
        $serviceIds = ($listingCollections[Service::class] ?? collect())->pluck('id');
        
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
        
        return (float) ($propertyRevenue + $eventRevenue + $serviceAppointmentRevenue + $serviceQuoteRevenue);
    }

    private function buildModelMap(array $listingCollections): array
    {
        $modelMap = [];
        foreach ($listingCollections as $modelClass => $collection) {
            $modelMap[$modelClass] = $collection->pluck('id');
        }
        return $modelMap;
    }

    private function countViewsInPeriod(array $modelMap, Carbon $startDate, Carbon $endDate): int
    {
        $viewsQuery = ActivityLog::where('description', 'viewed_listing')
            ->whereBetween('created_at', [$startDate, $endDate]);

        $viewsQuery->where(function (Builder $query) use ($modelMap) {
            $hasCondition = false;
            foreach ($modelMap as $type => $ids) {
                if ($ids->isNotEmpty()) {
                    $hasCondition = true;
                    $query->orWhere(fn ($q) => $q->where('subject_type', $type)->whereIn('subject_id', $ids));
                }
            }
            if (!$hasCondition) $query->whereRaw('1 = 0'); 
        });

        return $viewsQuery->count();
    }
    
    private function countLeadsInPeriod(array $listingCollections, Carbon $startDate, Carbon $endDate): int
    {
        $totalLeads = 0;
        $nonLeadStatuses = ['cancelled', 'rejected', 'refused', 'refunded'];

        $leadConfig = [
            Property::class => [[PropertyBooking::class, 'property_id'], [PropertyVisit::class, 'property_id']],
            Event::class => [[EventBooking::class, 'event_id']],
            Service::class => [[ServiceAppointment::class, 'service_id'], [ServiceQuote::class, 'service_id']],
            Auto::class => [[AutoInquiry::class, 'auto_id']],
            Classified::class => [[ClassifiedInquiry::class, 'classified_id']],
            JobListing::class => [[JobApplication::class, 'job_listing_id']],
        ];

        foreach ($leadConfig as $listingModel => $leadModels) {
            $listingIds = ($listingCollections[$listingModel] ?? collect())->pluck('id');

            if ($listingIds->isNotEmpty()) {
                foreach ($leadModels as [$leadModel, $foreignKey]) {
                    $totalLeads += $leadModel::whereIn($foreignKey, $listingIds)
                        ->whereBetween('created_at', [$startDate, $endDate])
                        ->whereNotIn('status', $nonLeadStatuses)
                        ->count();
                }
            }
        }

        return $totalLeads;
    }

    private function calculatePerformanceMetrics($partner, int $startDayOffset, int $endDayOffset, $listingId = null, $listingType = null): array
    {
        $endDate = Carbon::now()->subDays($startDayOffset);
        $startDate = Carbon::now()->subDays($endDayOffset);

        $listingCollections = $this->getFilteredListings($partner, $listingId, $listingType);
        $modelMap = $this->buildModelMap($listingCollections);

        $totalViews = $this->countViewsInPeriod($modelMap, $startDate, $endDate);
        $totalLeads = $this->countLeadsInPeriod($listingCollections, $startDate, $endDate);
        
        $conversionRate = $totalViews > 0 ? ($totalLeads / $totalViews) * 100 : 0;
        
        return [
            'total_views' => $totalViews,
            'total_leads' => $totalLeads,
            'conversion_rate' => number_format($conversionRate, 2),
            'avg_response_time' => 'TBD',
            'avg_occupancy_rate' => 'TBD',
        ];
    }
}
