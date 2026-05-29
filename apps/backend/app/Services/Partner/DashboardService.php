<?php

namespace App\Services\Partner;

use App\Models\User;
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
use App\Models\PropertyVisit;
use App\Models\AutoInquiry;
use App\Models\ClassifiedInquiry;
use App\Models\JobApplication;
use Spatie\Activitylog\Models\Activity as ActivityLog;
use Illuminate\Support\Collection;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Builder;

class DashboardService
{
    private const MIN_TITLE_LENGTH = 15;
    private const MIN_REQUIRED_PHOTOS = 1;

    /**
     * Aggregate all dashboard data for a partner.
     *
     * @param User $partner
     * @return array
     */
    public function getDashboardData(User $partner): array
    {
        // 1. Pre-fetch all listing IDs once to prevent redundant 'pluck' queries in sub-methods
        $listingIds = $this->getPartnerListingIds($partner);

        $earningData     = $this->fetchEarningData($partner, $listingIds);
        $performanceData = $this->fetchPerformanceMetrics($partner, $listingIds);
        $chartData       = $this->fetchChartData($partner, $listingIds);
        $healthScoreData = $this->calculateListingHealthScore($partner);
        $uiData          = $this->prepareUiData($partner);

        $baseSelect = ['id', 'title', 'created_at', 'is_published', 'slug'];
        $recentListings = $this->getUnifiedRecentListings($partner, $baseSelect);

        // Load relationship counts dynamically for Julian Sterling
        $partner->loadCount(['properties', 'autos', 'events', 'jobs', 'services', 'classifieds', 'products']);

        // Fetch unread notifications count
        $unreadNotifications = $partner->unreadNotifications()->count();

        // Fetch unread messages count across all active conversations
        $unreadMessages = \App\Models\Message::whereIn('conversation_id', $partner->allConversations()->pluck('id'))
            ->where('sender_id', '!=', $partner->id)
            ->whereNull('read_at')
            ->count();

        // Calculate total approved withdrawals / payouts in dollars
        $totalPayouts = (float) ($partner->withdrawals()
            ->where('status', \App\Models\Withdrawal::STATUS_APPROVED)
            ->sum('amount') / 100);

        // Calculate total lifetime earnings (revenue) in dollars - Exclude refunded withdrawals to prevent double-counting
        $lifetimeEarnings = (float) (($partner->transactions()
            ->where('type', 'deposit')
            ->where(function ($query) {
                $query->whereNull('meta')
                      ->orWhereJsonDoesntContain('meta->type', 'withdrawal_refund');
            })
            ->sum('amount') ?? 0) / 100);

        $plan = $partner->getPlan();
        $maxListings = (int) ($plan?->max_listings ?? 0);
        $usage = $partner->getListingUsageDetails();
        $currentListingsCount = array_sum($usage);
        $isLimitExceeded = $partner->hasReachedListingLimit();

        $subscriptionLimits = [
            'plan_title' => $plan?->title ?? 'Basic Tier',
            'max_listings' => $maxListings,
            'current_listings_count' => $currentListingsCount,
            'is_limit_exceeded' => $isLimitExceeded,
        ];

        return array_merge([
            'partner'           => $partner,
            'earningChangeData' => $earningData,
            'performanceData'   => $performanceData,
            'chartData'         => $chartData,
            'healthScoreData'   => $healthScoreData,
            'recentListings'    => $recentListings,
            'extraStats'        => [
                'unread_notifications' => $unreadNotifications,
                'unread_messages'      => $unreadMessages,
                'total_payouts'        => $totalPayouts,
                'lifetime_earnings'    => $lifetimeEarnings,
                'wallet_balance'       => (float) $partner->wallet_balance,
            ],
            'subscription_limits' => $subscriptionLimits,
        ], $uiData);

    }

    /**
     * Fetch, merge, and enrich listings from all verticals.
     *
     * @param User $partner
     * @param array $columns
     * @return Collection
     */
    public function getUnifiedRecentListings(User $partner, array $columns): Collection
    {
        $limit = 3;

        $queries = [
            $partner->properties()->latest()->take($limit)->select($columns),
            $partner->events()->latest()->take($limit)->select($columns),
            $partner->autos()->latest()->take($limit)->select($columns),
            $partner->services()->latest()->take($limit)->select($columns),
            $partner->classifieds()->latest()->take($limit)->select($columns),
            $partner->jobs()->latest()->take($limit)->select($columns),
            $partner->products()->latest()->take($limit)->select($columns),
        ];

        $results = collect();
        foreach ($queries as $query) {
            $results = $results->concat($query->get());
        }

        return $results->sortByDesc('created_at')
            ->take(15)
            ->values()
            ->map(fn($listing) => $this->enrichListingData($listing));
    }

    protected function enrichListingData($listing): object
    {
        $listing->type_label = class_basename($listing);
        $listing->formatted_date = $listing->created_at->diffForHumans();

        $vertical = Str::lower(Str::plural($listing->type_label));
        if ($listing instanceof JobListing) {
            $vertical = 'joblistings';
        }

        $listing->edit_url = "/dashboard/{$vertical}/edit/{$listing->slug}";

        return $listing;
    }

    protected function fetchEarningData(User $partner, array $listingIds): array
    {
        $currentEarnings = $this->calculateEarnings($partner, $listingIds, 0, 30);
        $previousEarnings = $this->calculateEarnings($partner, $listingIds, 30, 60);

        $change = 0;
        $changeType = 'neutral'; 
        
        if ($previousEarnings > 0) {
            $change = (($currentEarnings - $previousEarnings) / $previousEarnings) * 100;
            $changeType = $change >= 0 ? 'positive' : 'negative';
        } elseif ($currentEarnings > 0) {
            $change = 100; 
            $changeType = 'positive';
        }

        return [
            'total' => $currentEarnings,
            'previous_earnings' => $previousEarnings,
            'percentage' => number_format(abs($change), 2),
            'change_type' => $changeType,
            'period_label' => 'Last 30 Days',
            'currency_symbol' => '$',
        ];
    }

    protected function calculateEarnings(User $partner, array $ids, int $startOffset, int $endOffset): float
    {
        $endDate = Carbon::now()->subDays($startOffset);
        $startDate = Carbon::now()->subDays($endOffset);

        $propertyRevenue = PropertyBooking::whereIn('property_id', $ids[Property::class])
            ->where('status', 'confirmed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('total_price');

        $eventRevenue = EventBooking::whereIn('event_id', $ids[Event::class])
            ->where('status', 'confirmed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('total_price');

        $serviceRevenue = ServiceAppointment::whereIn('service_id', $ids[Service::class])
            ->where('status', 'confirmed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('price');

        $quoteRevenue = ServiceQuote::whereIn('service_id', $ids[Service::class])
            ->where('status', 'accepted')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('quoted_price');
        
        return (float) ($propertyRevenue + $eventRevenue + $serviceRevenue + $quoteRevenue);
    }

    protected function fetchPerformanceMetrics(User $partner, array $listingIds): array
    {
        $current = $this->calculateDetailedMetrics($partner, $listingIds, 0, 30);
        
        return [
            'total_views' => $current['total_views'],
            'total_leads' => $current['total_leads'],
            'conversion_rate' => $current['conversion_rate'],
            'avg_response_time' => 'TBD',
            'avg_occupancy_rate' => 'TBD',
        ];
    }

    protected function calculateDetailedMetrics(User $partner, array $ids, int $startOffset, int $endOffset): array
    {
        $endDate = Carbon::now()->subDays($startOffset);
        $startDate = Carbon::now()->subDays($endOffset);

        $totalViews = ActivityLog::where('description', 'viewed_listing')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->where(function ($query) use ($ids) {
                foreach ($ids as $type => $pluckedIds) {
                    if ($pluckedIds->isNotEmpty()) {
                        $query->orWhere(fn ($q) => $q->where('subject_type', $type)->whereIn('subject_id', $pluckedIds));
                    }
                }
            })->count();

        $totalLeads = $this->countLeads($partner, $ids, $startDate, $endDate);
        $conversionRate = $totalViews > 0 ? ($totalLeads / $totalViews) * 100 : 0;

        return [
            'total_views' => $totalViews,
            'total_leads' => $totalLeads,
            'conversion_rate' => number_format($conversionRate, 2),
        ];
    }

    protected function countLeads(User $partner, array $ids, Carbon $startDate, Carbon $endDate): int
    {
        $total = 0;
        $statuses = ['cancelled', 'rejected', 'refused', 'refunded'];

        $total += PropertyBooking::whereIn('property_id', $ids[Property::class])
            ->whereBetween('created_at', [$startDate, $endDate])->whereNotIn('status', $statuses)->count();
        
        $total += PropertyVisit::whereIn('property_id', $ids[Property::class])
            ->whereBetween('created_at', [$startDate, $endDate])->whereNotIn('status', $statuses)->count();

        $total += EventBooking::whereIn('event_id', $ids[Event::class])
            ->whereBetween('created_at', [$startDate, $endDate])->whereNotIn('status', $statuses)->count();

        $total += ServiceAppointment::whereIn('service_id', $ids[Service::class])
            ->whereBetween('created_at', [$startDate, $endDate])->whereNotIn('status', $statuses)->count();

        $total += AutoInquiry::whereIn('auto_id', $ids[Auto::class])
            ->whereBetween('created_at', [$startDate, $endDate])->whereNotIn('status', $statuses)->count();

        $total += JobApplication::whereIn('job_listing_id', $ids[JobListing::class])
            ->whereBetween('created_at', [$startDate, $endDate])->whereNotIn('status', $statuses)->count();

        return $total;
    }

    protected function fetchChartData(User $partner, array $listingIds): array
    {
        $labels = [];
        $dataViews = [];
        $dataLeads = [];
        $now = Carbon::now();

        for ($i = 5; $i >= 0; $i--) {
            $date = $now->copy()->subMonths($i);
            $startDate = $date->startOfMonth()->setTime(0, 0, 0);
            $endDate = $date->endOfMonth()->setTime(23, 59, 59);

            $labels[] = $date->shortMonthName;
            
            $metrics = $this->calculateDetailedMetricsForDates($partner, $listingIds, $startDate, $endDate);
            $dataViews[] = $metrics['total_views'];
            $dataLeads[] = $metrics['total_leads'];
        }

        return [
            'labels' => $labels,
            'datasets' => [
                ['label' => 'Views', 'data' => $dataViews],
                ['label' => 'Leads', 'data' => $dataLeads],
            ]
        ];
    }

    protected function calculateDetailedMetricsForDates(User $partner, array $ids, Carbon $start, Carbon $end): array
    {
        $totalViews = ActivityLog::where('description', 'viewed_listing')
            ->whereBetween('created_at', [$start, $end])
            ->where(function ($query) use ($ids) {
                foreach ($ids as $type => $pluckedIds) {
                    if ($pluckedIds->isNotEmpty()) {
                        $query->orWhere(fn ($q) => $q->where('subject_type', $type)->whereIn('subject_id', $pluckedIds));
                    }
                }
            })->count();

        $totalLeads = $this->countLeads($partner, $ids, $start, $end);

        return ['total_views' => $totalViews, 'total_leads' => $totalLeads];
    }

    protected function getPartnerListingIds(User $partner): array
    {
        return [
            Property::class   => $partner->properties()->pluck('id'),
            Event::class      => $partner->events()->pluck('id'),
            Auto::class       => $partner->autos()->pluck('id'),
            Service::class    => $partner->services()->pluck('id'),
            Classified::class => $partner->classifieds()->pluck('id'),
            JobListing::class => $partner->jobs()->pluck('id'),
        ];
    }

    protected function calculateListingHealthScore(User $partner): array
    {
        $listings = collect()
            ->concat($partner->properties()->withCount('media')->get(['id', 'title']))
            ->concat($partner->events()->withCount('media')->get(['id', 'title']))
            ->concat($partner->autos()->withCount('media')->get(['id', 'title']))
            ->concat($partner->services()->withCount('media')->get(['id', 'title']))
            ->concat($partner->classifieds()->withCount('media')->get(['id', 'title']))
            ->concat($partner->jobs()->withCount('media')->get(['id', 'title']));

        $total = $listings->count();
        if ($total === 0) return ['score' => 0, 'statusText' => 'No Listings'];

        $poorTitles = $listings->filter(fn($l) => strlen($l->title) < self::MIN_TITLE_LENGTH)->count();
        $poorPhotos = $listings->filter(fn($l) => $l->media_count < self::MIN_REQUIRED_PHOTOS)->count();

        $score = 100 - (($poorTitles + $poorPhotos) * (100 / ($total * 2)));
        $score = max(0, round($score));

        return [
            'score' => $score,
            'statusText' => $score > 80 ? 'Excellent' : ($score > 50 ? 'Good' : 'Needs Attention'),
        ];
    }

    protected function prepareUiData(User $partner): array
    {
        $subscriptionTitle = $partner->subscription->plan->title ?? 'Basic Tier';
        
        return [
            'subscriptionTitle' => $subscriptionTitle,
            'sortedActivities' => $this->getSortedActivities($partner),
        ];
    }

    protected function getSortedActivities(User $partner): Collection
    {
        // This is a simplified version for the API service
        return collect();
    }
}
