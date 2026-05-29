<?php

namespace App\Services\Partner;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Spatie\Activitylog\Models\Activity as ActivityLog;
use Illuminate\Support\Str;

// Models
use App\Models\{Property, Event, JobListing, Service, Classified, Auto, Product};
use App\Models\{PropertyBooking, EventBooking, JobApplication, ServiceAppointment, ServiceQuote, ClassifiedInquiry, AutoInquiry};

class AnalyticsService
{
    /**
     * Get the complete dashboard data for a partner.
     */
    public function getDashboardData(User $partner, int $days = 30): array
    {
        $cacheKey = "partner_analytics_{$partner->id}_{$days}";

        return Cache::remember($cacheKey, 3600, function () use ($partner, $days) {
            $startDate = Carbon::now()->subDays($days)->startOfDay();
            
            return [
                'performanceData'     => $this->calculatePerformanceMetrics($partner, $startDate),
                'totalEarnings'       => $this->calculateEarnings($partner, $startDate),
                'chartData'           => $this->generateChartData($partner, $startDate, $days),
                'detailedPerformance' => $this->getDetailedListingPerformance($partner, $startDate),
                'allListings'         => $this->getAllListings($partner),
                'verticalsData'       => $this->calculateVerticalsData($partner, $startDate, $days),
            ];
        });
    }

    /**
     * Get analytics specifically for a single listing.
     */
    public function getListingAnalytics(User $partner, string $type, int $id, int $days = 30): array
    {
        $startDate = Carbon::now()->subDays($days)->startOfDay();

        // 1. Resolve model and relation configuration
        $listingTypes = [
            'Property'   => ['model' => Property::class,   'relation' => 'properties',   'lead_col' => 'property_id'],
            'Event'      => ['model' => Event::class,      'relation' => 'events',       'lead_col' => 'event_id'],
            'JobListing' => ['model' => JobListing::class, 'relation' => 'jobs',         'lead_col' => 'job_listing_id'],
            'Auto'       => ['model' => Auto::class,       'relation' => 'autos',        'lead_col' => 'auto_id'],
            'Service'    => ['model' => Service::class,    'relation' => 'services',     'lead_col' => 'service_id'],
            'Classified' => ['model' => Classified::class, 'relation' => 'classifieds',  'lead_col' => 'classified_id'],
            'Product'    => ['model' => Product::class,    'relation' => 'products',     'lead_col' => 'product_id'],
        ];

        if (!isset($listingTypes[$type])) {
            throw new \InvalidArgumentException("Invalid listing type: {$type}");
        }

        $config = $listingTypes[$type];

        // 2. Fetch listing details and verify ownership
        $listing = $partner->{$config['relation']}()
            ->where('id', $id)
            ->firstOrFail(['id', 'title', 'slug']);

        // 3. Generate daily date keys
        $dates = collect();
        $currentDate = $startDate->copy();
        while ($currentDate->lessThanOrEqualTo(Carbon::now())) {
            $dates->put($currentDate->toDateString(), ['views' => 0, 'leads' => 0]);
            $currentDate->addDay();
        }

        // 4. Fetch daily views
        $viewsData = ActivityLog::selectRaw('DATE(created_at) as date, count(*) as count')
            ->where('description', 'viewed_listing')
            ->where('subject_type', $config['model'])
            ->where('subject_id', $id)
            ->where('created_at', '>=', $startDate)
            ->groupBy('date')
            ->get();

        // 5. Fetch daily leads
        $leadsData = collect();
        $leadCol = $config['lead_col'] ?? null;
        if ($leadCol) {
            $leadModel = $this->getLeadModelMap()[$leadCol] ?? null;
            if ($leadModel) {
                $leadsRaw = $leadModel::selectRaw('DATE(created_at) as date, count(*) as count')
                    ->where($leadCol, $id)
                    ->where('created_at', '>=', $startDate)
                    ->groupBy('date')
                    ->get();
                
                foreach ($leadsRaw as $lr) {
                    $leadsData->push($lr);
                }
            }
        }

        // Special case: Service Quotes
        if ($type === 'Service') {
            $quoteCounts = ServiceQuote::selectRaw('DATE(created_at) as date, count(*) as count')
                ->where('service_id', $id)
                ->where('created_at', '>=', $startDate)
                ->groupBy('date')
                ->get();
            
            foreach ($quoteCounts as $qc) {
                $leadsData->push($qc);
            }
        }

        // 6. Map views and leads into the daily dates structure
        $vDates = $dates->toArray();

        foreach ($viewsData as $v) {
            if (isset($vDates[$v->date])) {
                $vDates[$v->date]['views'] += $v->count;
            }
        }

        foreach ($leadsData as $l) {
            if (isset($vDates[$l->date])) {
                $vDates[$l->date]['leads'] += $l->count;
            }
        }

        // 7. Calculate summary metrics
        $totalViews = array_sum(array_column($vDates, 'views'));
        $totalLeads = array_sum(array_column($vDates, 'leads'));
        $conversionRate = $totalViews > 0 ? ($totalLeads / $totalViews) * 100 : 0;

        // Fetch total revenue in period
        $revenueMap = $this->getBulkRevenueForListings($config['model'], [$id], $startDate);
        $totalRevenue = (float) ($revenueMap[$id] ?? 0.0);

        // 8. Generate chartpoints array
        $chartPoints = [];
        foreach ($vDates as $date => $metrics) {
            $chartPoints[] = [
                'name' => Carbon::parse($date)->format('M d'),
                'views' => $metrics['views'],
                'leads' => $metrics['leads']
            ];
        }

        return [
            'listing' => [
                'id' => $listing->id,
                'title' => $listing->title,
                'slug' => $listing->slug,
                'type' => $type,
            ],
            'performanceData' => [
                'total_views' => $totalViews,
                'total_leads' => $totalLeads,
                'conversion_rate' => number_format($conversionRate, 2),
                'total_revenue' => $totalRevenue,
            ],
            'chartPoints' => $chartPoints,
        ];
    }

    private function calculatePerformanceMetrics(User $partner, Carbon $startDate): array
    {
        $listings = $this->getPartnerListingIds($partner);
        $totalViews = $this->getTotalViews($listings, $startDate);
        $totalLeads = $this->getTotalLeads($listings, $startDate);

        $conversionRate = $totalViews > 0 ? ($totalLeads / $totalViews) * 100 : 0;

        return [
            'total_views'       => $totalViews,
            'total_leads'       => $totalLeads,
            'conversion_rate'   => number_format($conversionRate, 2),
            'avg_response_time' => '2.5 hours', 
        ];
    }

    private function calculateEarnings(User $partner, Carbon $startDate): float
    {
        $listings = $this->getPartnerListingIds($partner);
        
        $propertyRevenue = PropertyBooking::whereIn('property_id', $listings[Property::class] ?? [])
            ->where('status', 'confirmed')
            ->where('created_at', '>=', $startDate)
            ->sum('total_price');

        $eventRevenue = EventBooking::whereIn('event_id', $listings[Event::class] ?? [])
            ->where('status', 'confirmed')
            ->where('created_at', '>=', $startDate)
            ->sum('total_price');

        $serviceRevenue = ServiceAppointment::whereIn('service_id', $listings[Service::class] ?? [])
            ->where('status', 'confirmed')
            ->where('created_at', '>=', $startDate)
            ->sum('price') +
            ServiceQuote::whereIn('service_id', $listings[Service::class] ?? [])
            ->where('status', 'accepted')
            ->where('created_at', '>=', $startDate)
            ->sum('quoted_price');

        return (float) ($propertyRevenue + $eventRevenue + $serviceRevenue);
    }

    private function generateChartData(User $partner, Carbon $startDate, int $days): array
    {
        $dates = collect();
        $currentDate = $startDate->copy();
        while ($currentDate->lessThanOrEqualTo(Carbon::now())) {
            $dates->put($currentDate->toDateString(), 0);
            $currentDate->addDay();
        }

        $listings = $this->getPartnerListingIds($partner);
        
        // Views over time
        $viewsData = ActivityLog::selectRaw('DATE(created_at) as date, count(*) as count')
            ->where('description', 'viewed_listing')
            ->where('created_at', '>=', $startDate)
            ->where(function ($query) use ($listings) {
                foreach ($listings as $type => $ids) {
                    if (!empty($ids)) {
                        $query->orWhere(fn($q) => $q->where('subject_type', $type)->whereIn('subject_id', $ids));
                    }
                }
            })
            ->groupBy('date')
            ->pluck('count', 'date');

        // Leads over time
        $leadsData = collect();
        foreach ($this->getLeadModelMap() as $listingCol => $leadModel) {
            $ids = $listings[$this->getListingModelFromColumn($listingCol)] ?? [];
            if (!empty($ids)) {
                $counts = $leadModel::selectRaw('DATE(created_at) as date, count(*) as count')
                    ->whereIn($listingCol, $ids)
                    ->where('created_at', '>=', $startDate)
                    ->groupBy('date')
                    ->pluck('count', 'date');
                
                foreach ($counts as $date => $count) {
                    $leadsData[$date] = ($leadsData[$date] ?? 0) + $count;
                }
            }
        }

        $labels = $dates->keys()->map(fn($d) => Carbon::parse($d)->format('M d'))->toArray();
        $viewsPerDay = $dates->merge($viewsData)->sortKeys()->values()->toArray();
        $leadsPerDay = $dates->merge($leadsData)->sortKeys()->values()->toArray();

        return [
            'labels' => $labels,
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

    private function getDetailedListingPerformance(User $partner, Carbon $startDate): Collection
    {
        $performance = collect();
        $listingTypes = [
            'Property'   => ['model' => Property::class,   'relation' => 'properties',   'lead_col' => 'property_id'],
            'Event'      => ['model' => Event::class,      'relation' => 'events',       'lead_col' => 'event_id'],
            'JobListing' => ['model' => JobListing::class, 'relation' => 'jobs',         'lead_col' => 'job_listing_id'],
            'Auto'       => ['model' => Auto::class,       'relation' => 'autos',        'lead_col' => 'auto_id'],
            'Service'    => ['model' => Service::class,    'relation' => 'services',     'lead_col' => 'service_id'],
            'Classified' => ['model' => Classified::class, 'relation' => 'classifieds',  'lead_col' => 'classified_id'],
        ];

        foreach ($listingTypes as $type => $config) {
            $listings = $partner->{$config['relation']}()
                ->get(['id', 'title', 'slug']);

            if ($listings->isEmpty()) continue;

            $ids = $listings->pluck('id')->toArray();

            // Bulk fetch views
            $viewsMap = ActivityLog::where('subject_type', $config['model'])
                ->whereIn('subject_id', $ids)
                ->where('description', 'viewed_listing')
                ->where('created_at', '>=', $startDate)
                ->selectRaw('subject_id, count(*) as count')
                ->groupBy('subject_id')
                ->pluck('count', 'subject_id');

            // Bulk fetch leads
            $leadModel = $this->getLeadModelMap()[$config['lead_col']] ?? null;
            $leadsMap = collect();
            if ($leadModel) {
                $leadsMap = $leadModel::whereIn($config['lead_col'], $ids)
                    ->where('created_at', '>=', $startDate)
                    ->selectRaw("{$config['lead_col']} as id, count(*) as count")
                    ->groupBy($config['lead_col'])
                    ->pluck('count', 'id');
            }

            // Special case for Service (Quote + Appointment)
            if ($type === 'Service') {
                $quotesMap = ServiceQuote::whereIn('service_id', $ids)
                    ->where('created_at', '>=', $startDate)
                    ->selectRaw('service_id, count(*) as count')
                    ->groupBy('service_id')
                    ->pluck('count', 'service_id');
                
                foreach ($quotesMap as $sid => $count) {
                    $leadsMap[$sid] = ($leadsMap[$sid] ?? 0) + $count;
                }
            }

            // Bulk fetch revenue
            $revenueMap = $this->getBulkRevenueForListings($config['model'], $ids, $startDate);

            foreach ($listings as $listing) {
                $views = $viewsMap[$listing->id] ?? 0;
                $leads = $leadsMap[$listing->id] ?? 0;
                $revenue = $revenueMap[$listing->id] ?? 0.0;

                $conversionRate = $views > 0 ? ($leads / $views) * 100 : 0;

                $performance->push([
                    'title'           => $listing->title,
                    'type'            => $type,
                    'id'              => $listing->id,
                    'views'           => $views,
                    'leads'           => $leads,
                    'revenue'         => $revenue,
                    'conversion_rate' => number_format($conversionRate, 2),
                ]);
            }
        }

        return $performance;
    }

    private function getAllListings(User $partner): Collection
    {
        return collect([
            'Property'   => $partner->properties(),
            'Event'      => $partner->events(),
            'Job'        => $partner->jobs(),
            'Auto'       => $partner->autos(),
            'Service'    => $partner->services(),
            'Classified' => $partner->classifieds(),
        ])->flatMap(fn($query, $type) => $query->get(['id', 'title'])->map(fn($l) => [
            'id'    => $l->id,
            'title' => $l->title,
            'type'  => $type,
            'key'   => "{$type}_{$l->id}"
        ]))->sortBy('title')->values();
    }

    // --- Helper Methods ---

    private function getPartnerListingIds(User $partner): array
    {
        return [
            Property::class   => $partner->properties()->pluck('id')->toArray(),
            Event::class      => $partner->events()->pluck('id')->toArray(),
            JobListing::class => $partner->jobs()->pluck('id')->toArray(),
            Auto::class       => $partner->autos()->pluck('id')->toArray(),
            Service::class    => $partner->services()->pluck('id')->toArray(),
            Classified::class => $partner->classifieds()->pluck('id')->toArray(),
            Product::class    => $partner->products()->pluck('id')->toArray(),
        ];
    }

    private function getTotalViews(array $listings, Carbon $startDate): int
    {
        return ActivityLog::where('description', 'viewed_listing')
            ->where('created_at', '>=', $startDate)
            ->where(function ($query) use ($listings) {
                foreach ($listings as $type => $ids) {
                    if (!empty($ids)) {
                        $query->orWhere(fn($q) => $q->where('subject_type', $type)->whereIn('subject_id', $ids));
                    }
                }
            })->count();
    }

    private function getTotalLeads(array $listings, Carbon $startDate): int
    {
        $total = 0;
        foreach ($this->getLeadModelMap() as $column => $model) {
            $listingModel = $this->getListingModelFromColumn($column);
            $ids = $listings[$listingModel] ?? [];
            if (!empty($ids)) {
                $total += $model::whereIn($column, $ids)->where('created_at', '>=', $startDate)->count();
            }
        }
        return $total;
    }

    private function getLeadModelMap(): array
    {
        return [
            'property_id'     => PropertyBooking::class,
            'event_id'        => EventBooking::class,
            'job_listing_id'  => JobApplication::class,
            'auto_id'         => AutoInquiry::class,
            'service_id'      => ServiceAppointment::class, // Plus ServiceQuote below
            'classified_id'   => ClassifiedInquiry::class,
        ];
    }

    private function getListingModelFromColumn(string $col): string
    {
        return match($col) {
            'property_id'    => Property::class,
            'event_id'       => Event::class,
            'job_listing_id' => JobListing::class,
            'auto_id'        => Auto::class,
            'service_id'     => Service::class,
            'classified_id'  => Classified::class,
        };
    }

    private function getLeadsForListing(string $model, int $id, Carbon $startDate): int
    {
        return match($model) {
            Property::class   => PropertyBooking::where('property_id', $id)->where('created_at', '>=', $startDate)->count(),
            Event::class      => EventBooking::where('event_id', $id)->where('created_at', '>=', $startDate)->count(),
            JobListing::class => JobApplication::where('job_listing_id', $id)->where('created_at', '>=', $startDate)->count(),
            Auto::class       => AutoInquiry::where('auto_id', $id)->where('created_at', '>=', $startDate)->count(),
            Service::class    => ServiceAppointment::where('service_id', $id)->where('created_at', '>=', $startDate)->count() + ServiceQuote::where('service_id', $id)->where('created_at', '>=', $startDate)->count(),
            Classified::class => ClassifiedInquiry::where('classified_id', $id)->where('created_at', '>=', $startDate)->count(),
            default           => 0
        };
    }

    /**
     * Bulk fetch revenue for a collection of listings to prevent N+1 performance degradation.
     */
    private function getBulkRevenueForListings(string $model, array $ids, Carbon $startDate): Collection
    {
        if (empty($ids)) return collect();

        return match($model) {
            Property::class => PropertyBooking::whereIn('property_id', $ids)
                ->where('status', 'confirmed')
                ->where('created_at', '>=', $startDate)
                ->selectRaw('property_id as id, SUM(total_price) as total')
                ->groupBy('property_id')
                ->pluck('total', 'id'),

            Event::class => EventBooking::whereIn('event_id', $ids)
                ->where('status', 'confirmed')
                ->where('created_at', '>=', $startDate)
                ->selectRaw('event_id as id, SUM(total_price) as total')
                ->groupBy('event_id')
                ->pluck('total', 'id'),

            Service::class => collect(
                ServiceAppointment::whereIn('service_id', $ids)
                    ->where('status', 'confirmed')
                    ->where('created_at', '>=', $startDate)
                    ->selectRaw('service_id as id, SUM(price) as total')
                    ->groupBy('service_id')
                    ->pluck('total', 'id')
                    ->all() +
                ServiceQuote::whereIn('service_id', $ids)
                    ->where('status', 'accepted')
                    ->where('created_at', '>=', $startDate)
                    ->selectRaw('service_id as id, SUM(quoted_price) as total')
                    ->groupBy('service_id')
                    ->pluck('total', 'id')
                    ->all()
            ),

            default => collect(),
        };
    }

    /**
     * Calculate daily views, leads, and conversion metrics grouped by vertical module.
     */
    private function calculateVerticalsData(User $partner, Carbon $startDate, int $days): array
    {
        $dates = collect();
        $currentDate = $startDate->copy();
        while ($currentDate->lessThanOrEqualTo(Carbon::now())) {
            $dates->put($currentDate->toDateString(), ['views' => 0, 'leads' => 0]);
            $currentDate->addDay();
        }

        $listings = $this->getPartnerListingIds($partner);

        // Fetch daily views by vertical type
        $viewsData = ActivityLog::selectRaw('subject_type, DATE(created_at) as date, count(*) as count')
            ->where('description', 'viewed_listing')
            ->where('created_at', '>=', $startDate)
            ->where(function ($query) use ($listings) {
                foreach ($listings as $type => $ids) {
                    if (!empty($ids)) {
                        $query->orWhere(fn($q) => $q->where('subject_type', $type)->whereIn('subject_id', $ids));
                    }
                }
            })
            ->groupBy('subject_type', 'date')
            ->get();

        // Fetch daily leads by vertical type
        $leadsData = collect();
        foreach ($this->getLeadModelMap() as $listingCol => $leadModel) {
            $listingClass = $this->getListingModelFromColumn($listingCol);
            $ids = $listings[$listingClass] ?? [];
            if (!empty($ids)) {
                $counts = $leadModel::selectRaw('DATE(created_at) as date, count(*) as count')
                    ->whereIn($listingCol, $ids)
                    ->where('created_at', '>=', $startDate)
                    ->groupBy('date')
                    ->get();
                
                foreach ($counts as $count) {
                    $leadsData->push([
                        'class' => $listingClass,
                        'date' => $count->date,
                        'count' => $count->count
                    ]);
                }
            }
        }

        // Special case: Service Quote leads
        $serviceIds = $listings[Service::class] ?? [];
        if (!empty($serviceIds)) {
            $quoteCounts = ServiceQuote::selectRaw('DATE(created_at) as date, count(*) as count')
                ->whereIn('service_id', $serviceIds)
                ->where('created_at', '>=', $startDate)
                ->groupBy('date')
                ->get();
            
            foreach ($quoteCounts as $count) {
                $leadsData->push([
                    'class' => Service::class,
                    'date' => $count->date,
                    'count' => $count->count
                ]);
            }
        }

        $verticalKeys = ['Property', 'Auto', 'Service', 'Event', 'JobListing', 'Classified', 'Product'];
        $verticals = [];

        foreach ($verticalKeys as $rawType) {
            $shortName = match($rawType) {
                'JobListing' => 'Job',
                default => $rawType
            };

            // Initialize structured data
            $vDates = $dates->mapWithKeys(fn($val, $date) => [$date => ['views' => 0, 'leads' => 0]])->toArray();

            $fullClass = "App\\Models\\{$rawType}";
            
            // Map views
            $vViews = $viewsData->where('subject_type', $fullClass);
            foreach ($vViews as $v) {
                if (isset($vDates[$v->date])) {
                    $vDates[$v->date]['views'] += $v->count;
                }
            }

            // Map leads
            $vLeads = $leadsData->where('class', $fullClass);
            foreach ($vLeads as $l) {
                if (isset($vDates[$l['date']])) {
                    $vDates[$l['date']]['leads'] += $l['count'];
                }
            }

            // Totals
            $totalViews = array_sum(array_column($vDates, 'views'));
            $totalLeads = array_sum(array_column($vDates, 'leads'));
            $conversionRate = $totalViews > 0 ? ($totalLeads / $totalViews) * 100 : 0;

            // Map to chartpoints
            $chartPoints = [];
            foreach ($vDates as $date => $metrics) {
                $chartPoints[] = [
                    'name' => Carbon::parse($date)->format('M d'),
                    'views' => $metrics['views'],
                    'leads' => $metrics['leads']
                ];
            }

            $verticals[$shortName] = [
                'views' => $totalViews,
                'leads' => $totalLeads,
                'conversion_rate' => number_format($conversionRate, 2),
                'chartPoints' => $chartPoints
            ];
        }

        return $verticals;
    }
}
