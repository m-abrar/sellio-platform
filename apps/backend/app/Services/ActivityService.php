<?php

namespace App\Services;

use App\Models\{Message, Review, Property, Event, JobListing, Service, Classified, Auto};
use App\Models\{PropertyBooking, JobApplication, ServiceQuote, EventBooking, ServiceAppointment, ClassifiedInquiry, AutoInquiry, User};
use Illuminate\Support\Collection;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class ActivityService
{
    /**
     * Get aggregated dashboard data for a partner.
     *
     * @param User $partner
     * @return array
     */
    public function getPartnerDashboardData(User $partner): array
    {
        $partnerId = $partner->id;

        // --- 1. Pre-fetch Complex Data ---
        $partnerListingIds = $partner->properties->pluck('id')
            ->merge($partner->events->pluck('id'))
            ->merge($partner->jobs->pluck('id'))
            ->merge($partner->services->pluck('id'))
            ->merge($partner->classifieds->pluck('id'))
            ->merge($partner->autos->pluck('id'));

        $partnerConversationIds = $partner->allConversations()->pluck('id');

        $reviewableTypes = [
            Property::class, Event::class, JobListing::class, 
            Service::class, Classified::class, Auto::class
        ];

        $allPartnerReviews = Review::whereIn('reviewable_id', $partnerListingIds)
            ->whereIn('reviewable_type', $reviewableTypes)
            ->whereNull('viewed_at')
            ->with('user', 'reviewable')
            ->latest()
            ->get();
            
        $newReviewsCount = $allPartnerReviews->count();

        // Update counts on model (if needed for local state, better returned)
        $partner->total_new_activities = $partner->totalNewActivities + $partner->newMessages + $newReviewsCount; 
        $partner->new_messages = $partner->newMessages;
        $partner->last_message = $partner->lastMessage;
        $partner->reviews = $allPartnerReviews->take(4);
        $partner->listings_active_count = $partner->listingsActiveCount;

        // --- 2. Prepare Activity Breakdown Modules ---
        $activityData = collect([
            ['title' => 'New Property Bookings', 'count' => $partner->propertiesBookingsNewCount, 'route' => route('dashboard.partner.properties.bookings.index'), 'icon' => 'bi-house-fill'],
            ['title' => 'New Event Bookings', 'count' => $partner->eventsBookingsNewCount, 'route' => route('dashboard.partner.events.bookings.index'), 'icon' => 'bi-calendar-event-fill'],
            ['title' => 'New Job Applications', 'count' => $partner->jobsApplicationsNewCount, 'route' => route('dashboard.partner.joblistings.applications.index'), 'icon' => 'bi-briefcase-fill'],
            ['title' => 'New Service Quotes', 'count' => $partner->servicesQuotesNewCount, 'route' => route('dashboard.partner.services.quotes.index'), 'icon' => 'bi-tools'],
            ['title' => 'New Service Appointments', 'count' => $partner->servicesAppointmentsNewCount, 'route' => route('dashboard.partner.services.appointments.index'), 'icon' => 'bi-calendar-plus-fill'],
            ['title' => 'New Auto Inquiries', 'count' => $partner->autosInquiriesNewCount, 'route' => route('dashboard.partner.autos.inquiries.index'), 'icon' => 'bi-truck'],
            ['title' => 'New Classified Inquiries', 'count' => $partner->classifiedsInquiriesNewCount, 'route' => route('dashboard.partner.classifieds.inquiries.index'), 'icon' => 'bi-tags-fill'],
            ['title' => 'New Reviews', 'count' => $newReviewsCount, 'route' => route('dashboard.partner.reviews.index'), 'icon' => 'bi-star-fill'],
        ])->sortByDesc('count')->values();

        $modules = $activityData->map(function ($item) {
            $cleanedTitle = str_replace(['New ', ' Requests', ' Leads', ' Applications', ' Messages', ' Reviews', ' Listings'], '', $item['title']);
            return [
                'name' => $cleanedTitle,
                'count' => $item['count'],
                'icon' => $item['icon'],
                'interaction_name' => str_replace('New ', '', $item['title']),
                'interaction_route' => $item['route'],
            ];
        })->filter(fn($item) => $item['count'] > 0);

        // --- 3. Prepare Recent Activity Feed Log ---
        $activities = collect()
            ->merge($partner->unreadMessages()->latest()->take(3)->get())
            ->merge($allPartnerReviews->take(5))
            ->merge(JobApplication::whereHas('job', fn(Builder $q) => $q->where('user_id', $partnerId))->whereNull('viewed_at')->latest()->take(3)->get())
            ->merge(PropertyBooking::whereHas('property', fn(Builder $q) => $q->where('user_id', $partnerId))->whereNull('viewed_at')->latest()->take(3)->get())
            ->merge(ServiceQuote::whereHas('service', fn(Builder $q) => $q->where('user_id', $partnerId))->whereNull('viewed_at')->latest()->take(3)->get())
            ->merge(EventBooking::whereHas('event', fn(Builder $q) => $q->where('user_id', $partnerId))->whereNull('viewed_at')->latest()->take(3)->get())
            ->merge(ServiceAppointment::whereHas('service', fn(Builder $q) => $q->where('user_id', $partnerId))->whereNull('viewed_at')->latest()->take(3)->get())
            ->merge(ClassifiedInquiry::whereHas('classifiedad', fn(Builder $q) => $q->where('user_id', $partnerId))->whereNull('viewed_at')->latest()->take(3)->get())
            ->merge(AutoInquiry::whereHas('auto', fn(Builder $q) => $q->where('user_id', $partnerId))->whereNull('viewed_at')->latest()->take(3)->get());

        $recentActivityLog = $activities->sortByDesc('created_at')->take(15)->map(function ($activity) use ($reviewableTypes) {
            if ($activity instanceof Review) {
                return ['type' => 'Review', 'title' => 'New Review', 'description' => 'Received a new ' . $activity->rating . '-star review on the "' . ($activity->reviewable->title ?? 'N/A') . '" listing.', 'user' => $activity->user->name ?? 'Anon', 'time' => Carbon::parse($activity->created_at)->diffForHumans(), 'route' => route('dashboard.partner.reviews.show', $activity->id)];
            } elseif ($activity instanceof JobApplication) {
                return ['type' => 'Application', 'title' => 'New Job Application', 'description' => 'New application received for "' . ($activity->job->title ?? 'N/A') . '".', 'user' => $activity->user->name ?? 'Applicant', 'time' => Carbon::parse($activity->created_at)->diffForHumans(), 'route' => route('dashboard.partner.jobs.applications.show', $activity->id)];
            } elseif ($activity instanceof PropertyBooking) {
                return ['type' => 'Booking', 'title' => 'New Property Booking', 'description' => 'New booking request for "' . ($activity->property->title ?? 'N/A') . '".', 'user' => $activity->user->name ?? 'Guest', 'time' => Carbon::parse($activity->created_at)->diffForHumans(), 'route' => route('dashboard.partner.properties.bookings.show', $activity->id)];
            } elseif ($activity instanceof EventBooking) {
                return ['type' => 'Booking', 'title' => 'New Event Booking', 'description' => 'New booking for "' . ($activity->event->title ?? 'N/A') . '".', 'user' => $activity->user->name ?? 'Guest', 'time' => Carbon::parse($activity->created_at)->diffForHumans(), 'route' => route('dashboard.partner.events.bookings.show', $activity->id)];
            } elseif ($activity instanceof ServiceQuote) {
                return ['type' => 'Quote', 'title' => 'New Service Quote Request', 'description' => 'New quote request for "' . ($activity->service->title ?? 'N/A') . '".', 'user' => $activity->user->name ?? 'Customer', 'time' => Carbon::parse($activity->created_at)->diffForHumans(), 'route' => route('dashboard.partner.services.quotes.show', $activity->id)];
            } elseif ($activity instanceof ServiceAppointment) {
                return ['type' => 'Appointment', 'title' => 'New Service Appointment', 'description' => 'New appointment for "' . ($activity->service->title ?? 'N/A') . '".', 'user' => $activity->user->name ?? 'Customer', 'time' => Carbon::parse($activity->created_at)->diffForHumans(), 'route' => route('dashboard.partner.services.appointments.show', $activity->id)];
            } elseif ($activity instanceof ClassifiedInquiry) {
                $listingTitle = $activity->classifiedad->title ?? $activity->auto->title ?? 'N/A';
                return ['type' => 'Inquiry', 'title' => 'New Listing Inquiry', 'description' => 'New inquiry for "' . $listingTitle . '".', 'user' => $activity->user->name ?? 'Buyer', 'time' => Carbon::parse($activity->created_at)->diffForHumans(), 'route' => route('dashboard.partner.classifieds.inquiries.show', $activity->id)];
            } elseif ($activity instanceof Message) {
                return ['type' => 'Message', 'title' => 'New Message', 'description' => 'New message from ' . ($activity->sender->name ?? 'Guest') . '.', 'user' => $activity->sender->name ?? 'Guest', 'time' => Carbon::parse($activity->created_at)->diffForHumans(), 'route' => route('dashboard.partner.messages.show', $activity->conversation_id)];
            }
            return null;
        })->filter()->values();

        // --- 4. Prepare Chart Data ---
        $endDate = Carbon::now();
        $startDate = Carbon::now()->subDays(90);

        $dateRange = new Collection();
        for ($i = 12; $i >= 0; $i--) {
            $date = Carbon::now()->subWeeks($i);
            $dateRange->put($date->format('Y-W'), 'W' . $date->weekOfYear);
        }

        $activityModels = [
            'high' => [ [ 'model' => PropertyBooking::class, 'relation' => 'property' ], [ 'model' => EventBooking::class, 'relation' => 'event' ], [ 'model' => JobApplication::class, 'relation' => 'job' ], [ 'model' => ServiceAppointment::class, 'relation' => 'service' ] ],
            'low' => [ [ 'model' => ServiceQuote::class, 'relation' => 'service' ], [ 'model' => ClassifiedInquiry::class, 'relation' => 'classifiedad' ], [ 'model' => AutoInquiry::class, 'relation' => 'auto' ], [ 'model' => Message::class, 'relation' => null ], [ 'model' => Review::class, 'relation' => null ] ]
        ];

        $allActivities = collect();
        foreach ($activityModels as $category => $models) {
            foreach ($models as $item) {
                $modelClass = $item['model'];
                $relationship = $item['relation'];
                $query = $modelClass::where('created_at', '>=', $startDate);

                if ($modelClass === Message::class) {
                    $query->whereIn('conversation_id', $partnerConversationIds)->where('sender_id', '!=', $partnerId);
                } elseif ($modelClass === Review::class) {
                    $query->whereIn('reviewable_id', $partnerListingIds)->whereIn('reviewable_type', $reviewableTypes);
                } elseif ($relationship) {
                    $query->whereHas($relationship, fn(Builder $q) => $q->where('user_id', $partnerId));
                } else { continue; }

                $activities = $query->get()->map(function ($item) use ($category) { $item->activity_category = $category; return $item; });
                $allActivities = $allActivities->merge($activities);
            }
        }

        $activityMap = $allActivities->groupBy(fn($a) => Carbon::parse($a->created_at)->format('Y-W'))
            ->map(fn($w) => [ 'high' => $w->where('activity_category', 'high')->count(), 'low' => $w->where('activity_category', 'low')->count() ]);

        $bookingCounts = []; $inquiryCounts = [];
        foreach ($dateRange->keys() as $weekKey) {
            $counts = $activityMap->get($weekKey, ['high' => 0, 'low' => 0]);
            $bookingCounts[] = $counts['high'];
            $inquiryCounts[] = $counts['low'];
        }

        return [
            'modules' => $modules,
            'recentActivity' => $recentActivityLog,
            'activityChartData' => [ 'labels' => $dateRange->values()->all(), 'bookingCounts' => $bookingCounts, 'inquiryCounts' => $inquiryCounts ],
        ];
    }
}
