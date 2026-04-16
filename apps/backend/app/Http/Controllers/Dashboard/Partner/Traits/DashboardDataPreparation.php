<?php

namespace App\Http\Controllers\Dashboard\Partner\Traits;

use App\Models\Property; 
use App\Models\Event; 
use App\Models\Service; 
use App\Models\Classified;
use App\Models\Auto;
use App\Models\JobListing; 

use Illuminate\Support\Collection;
use Carbon\Carbon;

trait DashboardDataPreparation
{
    use DashboardMetrics, Listings; 
    
    protected function fetchEarningData($partner): array
    {
        $currentEarnings = $this->calculateEarnings($partner, 0, 30);
        $previousEarnings = $this->calculateEarnings($partner, 30, 60);

        $change = 0;
        $changeType = 'neutral'; 
        $color = 'text-secondary';
        $direction = 'bi-dash';

        if ($previousEarnings > 0) {
            $change = (($currentEarnings - $previousEarnings) / $previousEarnings) * 100;
            $changeType = $change >= 0 ? 'positive' : 'negative';
        } elseif ($currentEarnings > 0) {
            $change = 100; 
            $changeType = 'positive';
        }

        if ($changeType === 'positive') {
            $color = 'text-success';
            $direction = 'bi-arrow-up';
        } elseif ($changeType === 'negative') {
            $color = 'text-danger';
            $direction = 'bi-arrow-down';
        }

        return [
            'total' => $currentEarnings,
            'previous_earnings' => $previousEarnings,
            'percentage' => number_format(abs($change), 2),
            'color' => $color,
            'direction' => $direction,
            'change_type' => $changeType,
            'period_label' => 'Last 30 Days',
            'currency_symbol' => '$',
        ];
    }

    protected function fetchPerformanceMetrics($partner): array
    {
        $current = $this->calculatePerformanceMetrics($partner, 0, 30);
        $previous = $this->calculatePerformanceMetrics($partner, 30, 60);

        $results = [];
        $metricsToCompare = ['total_views', 'total_leads'];

        foreach ($metricsToCompare as $metricKey) {
            $currentValue = $current[$metricKey] ?? 0;
            $previousValue = $previous[$metricKey] ?? 0;

            $change = 0;
            $changeType = 'neutral'; 
            $color = 'text-secondary';
            $direction = 'bi-dash';


            if ($previousValue > 0) {
                $change = (($currentValue - $previousValue) / $previousValue) * 100;
                $changeType = $change >= 0 ? 'positive' : 'negative';
            } elseif ($currentValue > 0) {
                $change = 100; 
                $changeType = 'positive';
            }

            if ($changeType === 'positive') {
                $color = 'text-success';
                $direction = 'bi-arrow-up';
            } elseif ($changeType === 'negative') {
                $color = 'text-danger';
                $direction = 'bi-arrow-down';
            }

            $results[$metricKey] = $currentValue; 
            $results[$metricKey . '_total'] = $currentValue;
            $results[$metricKey . '_change_percentage'] = number_format(abs($change), 2);
            $results[$metricKey . '_change_type'] = $changeType;
            $results[$metricKey . '_color'] = $color;
            $results[$metricKey . '_direction'] = $direction;
        }
        
        $results['conversion_rate'] = $current['conversion_rate'];
        $results['avg_response_time'] = $current['avg_response_time'];
        $results['avg_occupancy_rate'] = $current['avg_occupancy_rate'];
        
        return $results;
    }

    protected function fetchChartData($partner): array
    {
        $labels = [];
        $dataViews = [];
        $dataLeads = [];
        $now = Carbon::now();

        $listingCollections = $this->getFilteredListings($partner);
        $modelMap = $this->buildModelMap($listingCollections);

        for ($i = 5; $i >= 0; $i--) {
            $date = $now->copy()->subMonths($i);
            $monthName = $date->shortMonthName;
            
            $startDate = $date->startOfMonth()->setTime(0, 0, 0);
            $endDate = $date->endOfMonth()->setTime(23, 59, 59);

            $labels[] = $monthName;

            $monthlyViews = $this->countViewsInPeriod($modelMap, $startDate, $endDate);
            $dataViews[] = $monthlyViews;

            $monthlyLeads = $this->countLeadsInPeriod($listingCollections, $startDate, $endDate);
            $dataLeads[] = $monthlyLeads;
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [ 
                    'label' => 'Total Views', 
                    'data' => $dataViews, 
                    'borderColor' => '#007bff', 
                    'backgroundColor' => 'rgba(0, 123, 255, 0.1)', 
                    'tension' => 0.4, 
                    'fill' => true, 
                ],
                [ 
                    'label' => 'Total Leads', 
                    'data' => $dataLeads, 
                    'borderColor' => '#28a745', 
                    'backgroundColor' => 'rgba(40, 167, 69, 0.1)', 
                    'tension' => 0.4, 
                    'fill' => true, 
                ],
            ]
        ];
    }

    protected function prepareDashboardData($partner): array
    {
        $subscriptionTitle = $partner->subscription && $partner->subscription->plan
            ? $partner->subscription->plan->title
            : 'Basic Tier';

        $defaultImageUrl = asset('images/fallbacks/default-card.jpg'); 

        $activityLinks = [
            [
                'count' => isset($partner->properties_bookings_new_count) ? $partner->properties_bookings_new_count : 0,
                'title' => 'New Property Booking Requests',
                'subtitle' => "Property bookings requiring your approval.",
                'icon' => 'bi-house-check-fill',
                'route' => route('dashboard.partner.properties.bookings.index'),
                'color' => 'text-danger',
                'btnText' => 'Review Bookings',
                'isMessage' => false,
            ],
            [
                'count' => isset($partner->properties_visits_new_count) ? $partner->properties_visits_new_count : 0,
                'title' => 'New Property Visit Requests',
                'subtitle' => "Requests from buyers/renters to view the property.",
                'icon' => 'bi-calendar-check-fill',
                'route' => route('dashboard.partner.properties.visits.index'),
                'color' => 'text-danger',
                'btnText' => 'Review Visits',
                'isMessage' => false,
            ],
            [
                'count' => isset($partner->events_bookings_new_count) ? $partner->events_bookings_new_count : 0,
                'title' => 'New Event Booking Requests',
                'subtitle' => "Event or venue reservations.",
                'icon' => 'bi-calendar-event-fill',
                'route' => route('dashboard.partner.events.bookings.index'),
                'color' => 'text-danger',
                'btnText' => 'Review Events',
                'isMessage' => false,
            ],
            [
                'count' => isset($partner->jobs_applications_new_count) ? $partner->jobs_applications_new_count : 0,
                'title' => 'New Job Applications',
                'subtitle' => "Pending candidates for open job listings.",
                'icon' => 'bi-briefcase-fill',
                'route' => route('dashboard.partner.joblistings.applications.index'),
                'color' => 'text-danger',
                'btnText' => 'View Applicants',
                'isMessage' => false,
            ],
            [
                'count' => (isset($partner->services_quotes_new_count) ? $partner->services_quotes_new_count : 0) + (isset($partner->services_appointments_new_count) ? $partner->services_appointments_new_count : 0),
                'title' => 'New Service/Quote Requests',
                'subtitle' => "Inquiries for your professional services.",
                'icon' => 'bi-tools',
                'route' => route('dashboard.partner.services.inquiries.index'), 
                'color' => 'text-danger',
                'btnText' => 'Manage Services',
                'isMessage' => false,
            ],
            [
                'count' => isset($partner->autos_inquiries_new_count) ? $partner->autos_inquiries_new_count : 0, 
                'title' => 'New Auto Leads', 
                'subtitle' => "Inquiries from vehicle listings.",
                'icon' => 'bi-car-front-fill',
                'route' => route('dashboard.partner.autos.inquiries.index'), 
                'color' => 'text-danger',
                'btnText' => 'View Auto Leads',
                'isMessage' => false,
            ],
            [
                'count' => isset($partner->classifieds_inquiries_new_count) ? $partner->classifieds_inquiries_new_count : 0, 
                'title' => 'New Classified Leads', 
                'subtitle' => "Inquiries from general classified listings.",
                'icon' => 'bi-tags-fill',
                'route' => route('dashboard.partner.classifieds.inquiries.index'), 
                'color' => 'text-danger',
                'btnText' => 'View Classified Leads',
                'isMessage' => false,
            ],
            [
                'count' => isset($partner->new_messages) ? $partner->new_messages : 0,
                'title' => 'Unread Messages',
                'subtitle' => "New customer replies waiting in your inbox.",
                'icon' => 'bi-chat-dots-fill',
                'route' => route('dashboard.partner.messages.index'),
                'color' => 'text-warning',
                'btnText' => 'Go to Inbox',
                'isMessage' => true,
            ]
        ];

        $highPriorityActivities = collect($activityLinks)
            ->filter(fn($item) => $item['count'] > 0)
            ->sortByDesc(fn($item) => $item['count']);

        $messages = $highPriorityActivities->where('isMessage', true);
        $otherActivities = $highPriorityActivities->where('isMessage', false);

        $sortedActivities = $otherActivities->merge($messages);
        
        return [
            'subscriptionTitle' => $subscriptionTitle,
            'defaultImageUrl' => $defaultImageUrl,
            'sortedActivities' => $sortedActivities,
        ];
    }

    protected function calculateListingHealthScore($partner): array
    {
        $selectFields = ['id', 'title'];

        $properties = $partner->properties()->withCount('media')->get($selectFields);
        $events = $partner->events()->withCount('media')->get($selectFields);
        $autos = $partner->autos()->withCount('media')->get($selectFields);
        $services = $partner->services()->withCount('media')->get($selectFields);
        $classifieds = $partner->classifieds()->withCount('media')->get($selectFields);
        $joblistings = $partner->jobs()->withCount('media')->get($selectFields);
        
        $allListings = (new Collection())
            ->merge($properties)
            ->merge($events)
            ->merge($autos)
            ->merge($services)
            ->merge($classifieds)
            ->merge($joblistings);

        $totalListings = $allListings->count();
        $suggestions = [];

        if ($totalListings === 0) {
            return [
                'score' => 0,
                'statusText' => 'No Listings',
                'statusIcon' => 'bi-x-circle-fill',
                'statusColor' => 'text-secondary',
                'suggestions' => [['status' => 'critical', 'text' => 'Create your first listing to start earning!']],
            ];
        }

        $poorTitleCount = $allListings->filter(fn($l) => 
            empty($l->title) || strlen($l->title) < self::MIN_TITLE_LENGTH
        )->count();

        $insufficientPhotoCount = $allListings->filter(fn($l) => 
            (isset($l->media_count) ? $l->media_count : 0) < self::MIN_REQUIRED_PHOTOS
        )->count();


        $scorePerListing = 100 / $totalListings;
        $scoreDeduction = 0;

        $scoreDeduction += $poorTitleCount * ($scorePerListing * 0.5);
        $scoreDeduction += $insufficientPhotoCount * ($scorePerListing * 0.5);

        $score = max(0, min(100, 100 - $scoreDeduction));
        $score = round($score);

        if ($insufficientPhotoCount > 0) {
            $suggestions[] = [
                'status' => $insufficientPhotoCount > 3 ? 'critical' : 'warning', 
                'text' => "**$insufficientPhotoCount listings** need more photos (minimum " . self::MIN_REQUIRED_PHOTOS . " required)."
            ];
        } else {
            $suggestions[] = ['status' => 'ok', 'text' => 'All listings meet the minimum photo requirement.'];
        }
        
        if ($poorTitleCount > 0) {
            $suggestions[] = [
                'status' => $poorTitleCount > 1 ? 'critical' : 'warning', 
                'text' => "**$poorTitleCount listings** have titles that are missing or too short (min. " . self::MIN_TITLE_LENGTH . " chars)."
            ];
        } else {
            $suggestions[] = ['status' => 'ok', 'text' => 'All listings have descriptive titles.'];
        }
        
        if ($score < 100) {
            $suggestions[] = ['status' => 'warning', 'text' => 'Maximize views by adding detailed descriptions and features to all listings.'];
        } else {
            $suggestions[] = ['status' => 'ok', 'text' => 'Excellent! Your listings are fully optimized for title and photos.'];
        }


        $statusText = 'Excellent';
        $statusIcon = 'bi-check-circle-fill';
        $statusColor = 'text-success';
        
        if ($score < 70) {
            $statusText = 'Needs Attention';
            $statusIcon = 'bi-exclamation-triangle-fill';
            $statusColor = 'text-danger';
        } elseif ($score < 90) {
            $statusText = 'Good';
            $statusIcon = 'bi-arrow-up';
            $statusColor = 'text-warning';
        }
        
        return [
            'score' => $score,
            'statusText' => $statusText,
            'statusIcon' => $statusIcon,
            'statusColor' => $statusColor,
            'suggestions' => $suggestions,
        ];
    }
}
