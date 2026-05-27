<?php

namespace App\Http\Controllers\Dashboard\Partner\Traits;

use Illuminate\Support\Collection;

trait Activities
{
    protected function getPartnerActivityData($partner): array
    {
        $awaitingCount = 0;
        $expiredCount = 0;
        $reviewsCount = 0;

        $modulesConfig = [
            'properties'  => 'properties',
            'events'      => 'events',
            'autos'       => 'autos',
            'services'    => 'services',
            'classifieds' => 'classifieds',
            'jobs'        => 'jobs',
            'products'    => 'products',
        ];

        foreach ($modulesConfig as $mod => $relation) {
            if (module_enabled($mod) && method_exists($partner, $relation)) {
                try {
                    // Awaiting Approval Count (not published)
                    $awaitingCount += $partner->$relation()->where('is_published', false)->count();

                    // Expired Count (status is expired or expires_at is in the past)
                    $expiredCount += $partner->$relation()
                        ->where(function ($q) {
                            $q->where('status', 'expired')
                              ->orWhere(function ($sub) {
                                  $sub->whereNotNull('expires_at')
                                      ->where('expires_at', '<', now());
                              });
                        })->count();

                    // Reviews Count matching partner listing IDs
                    $itemIds = $partner->$relation()->pluck('id')->toArray();
                    if (!empty($itemIds)) {
                        $modelName = 'App\\Models\\' . \Illuminate\Support\Str::studly(\Illuminate\Support\Str::singular($mod));
                        if ($mod === 'jobs') $modelName = 'App\\Models\\JobListing';
                        if ($mod === 'classifieds') $modelName = 'App\\Models\\Classified';

                        $reviewsCount += \App\Models\Review::where('reviewable_type', $modelName)
                            ->whereIn('reviewable_id', $itemIds)
                            ->count();
                    }
                } catch (\Exception $e) {
                    // Fail silently
                }
            }
        }

        $aggregatedActivities = collect([
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
            // --- MESSAGES & STATUS CHECKS ---
            [
                'count' => isset($partner->new_messages) ? $partner->new_messages : 0,
                'title' => 'Unread Messages',
                'subtitle' => "New customer replies waiting in your inbox.",
                'icon' => 'bi-chat-dots-fill',
                'route' => route('dashboard.partner.messages.index'),
                'color' => 'text-warning',
                'btnText' => 'Go to Inbox',
                'isMessage' => true,
            ],
            [
                'count' => $reviewsCount, 
                'title' => 'New Reviews',
                'subtitle' => 'Check out your latest customer feedback.',
                'icon' => 'bi-star-fill',
                'color' => 'text-primary',
                'route' => route('dashboard.partner.reviews.index') ?? '#',
                'isMessage' => false,
                'btnText' => 'View Reviews',
            ],
            [
                'count' => $awaitingCount, 
                'title' => 'Awaiting Approval',
                'subtitle' => 'Listings submitted and pending admin review.',
                'icon' => 'bi-clock-history',
                'color' => 'text-info',
                'route' => route('dashboard.partner.listings.index', ['status' => 'pending']) ?? '#',
                'isMessage' => false,
                'btnText' => 'Check Status',
            ],
            [
                'count' => $expiredCount, 
                'title' => 'Expired Listings',
                'subtitle' => 'Requires immediate renewal to be visible.',
                'icon' => 'bi-hourglass-split',
                'color' => 'text-danger',
                'route' => route('dashboard.partner.listings.index', ['status' => 'expired']) ?? '#',
                'isMessage' => false,
                'btnText' => 'Renew',
            ],
        ]);
        
        return ['sortedActivities' => $aggregatedActivities];
    }
}
