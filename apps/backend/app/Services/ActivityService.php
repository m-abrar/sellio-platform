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
        $cacheKey = "partner_dashboard_data_{$partnerId}";

        return \Illuminate\Support\Facades\Cache::remember($cacheKey, 300, function () use ($partner, $partnerId) {
            
            // --- 1. Identify Partner Assets (Listing IDs) ---
            // Optimization: Get IDs directly from the database without hydrating full models
            $partnerListingIds = [
                Property::class   => $partner->properties()->pluck('id')->toArray(),
                Event::class      => $partner->events()->pluck('id')->toArray(),
                JobListing::class => $partner->jobs()->pluck('id')->toArray(),
                Service::class    => $partner->services()->pluck('id')->toArray(),
                Classified::class => $partner->classifieds()->pluck('id')->toArray(),
                Auto::class       => $partner->autos()->pluck('id')->toArray(),
            ];

            $flatListingIds = collect($partnerListingIds)->flatten()->toArray();
            $partnerConversationIds = $partner->allConversations()->pluck('id')->toArray();

            $reviewableTypes = [
                Property::class, Event::class, JobListing::class, 
                Service::class, Classified::class, Auto::class
            ];

            // --- 2. Aggregate Recent Activity (Optimized Feed) ---
            $activities = collect()
                ->merge($partner->unreadMessages()->latest()->take(3)->get())
                ->merge(Review::whereIn('reviewable_id', $flatListingIds)->whereIn('reviewable_type', $reviewableTypes)->whereNull('viewed_at')->with('user', 'reviewable')->latest()->take(5)->get())
                ->merge(JobApplication::whereHas('job', fn(Builder $q) => $q->where('user_id', $partnerId))->whereNull('viewed_at')->latest()->with('user', 'job')->take(3)->get())
                ->merge(PropertyBooking::whereHas('property', fn(Builder $q) => $q->where('user_id', $partnerId))->whereNull('viewed_at')->latest()->with('user', 'property')->take(3)->get())
                ->merge(ServiceQuote::whereHas('service', fn(Builder $q) => $q->where('user_id', $partnerId))->whereNull('viewed_at')->latest()->with('user', 'service')->take(3)->get())
                ->merge(EventBooking::whereHas('event', fn(Builder $q) => $q->where('user_id', $partnerId))->whereNull('viewed_at')->latest()->with('user', 'event')->take(3)->get())
                ->merge(ServiceAppointment::whereHas('service', fn(Builder $q) => $q->where('user_id', $partnerId))->whereNull('viewed_at')->latest()->with('user', 'service')->take(3)->get())
                ->merge(ClassifiedInquiry::whereHas('classifiedad', fn(Builder $q) => $q->where('user_id', $partnerId))->whereNull('viewed_at')->latest()->with('user', 'classifiedad')->take(3)->get())
                ->merge(AutoInquiry::whereHas('auto', fn(Builder $q) => $q->where('user_id', $partnerId))->whereNull('viewed_at')->latest()->with('user', 'auto')->take(3)->get());

            $recentActivityLog = $activities->sortByDesc('created_at')->take(15)->map(function ($activity) {
                if ($activity instanceof Review) {
                    return ['type' => 'Review', 'title' => 'New Review', 'description' => 'Received a new ' . $activity->rating . '-star review on "' . ($activity->reviewable->title ?? 'N/A') . '".', 'user' => $activity->user->name ?? 'Anon', 'time' => Carbon::parse($activity->created_at)->diffForHumans(), 'route' => route('dashboard.partner.reviews.show', $activity->id)];
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
                    $listingTitle = $activity->classifiedad->title ?? 'N/A';
                    return ['type' => 'Inquiry', 'title' => 'New Listing Inquiry', 'description' => 'New inquiry for "' . $listingTitle . '".', 'user' => $activity->user->name ?? 'Buyer', 'time' => Carbon::parse($activity->created_at)->diffForHumans(), 'route' => route('dashboard.partner.classifieds.inquiries.show', $activity->id)];
                } elseif ($activity instanceof AutoInquiry) {
                    $listingTitle = $activity->auto->title ?? 'N/A';
                    return ['type' => 'Inquiry', 'title' => 'New Auto Inquiry', 'description' => 'New inquiry for "' . $listingTitle . '".', 'user' => $activity->user->name ?? 'Buyer', 'time' => Carbon::parse($activity->created_at)->diffForHumans(), 'route' => route('dashboard.partner.autos.inquiries.show', $activity->id)];
                } elseif ($activity instanceof Message) {
                    return ['type' => 'Message', 'title' => 'New Message', 'description' => 'New message from ' . ($activity->sender->name ?? 'Guest') . '.', 'user' => $activity->sender->name ?? 'Guest', 'time' => Carbon::parse($activity->created_at)->diffForHumans(), 'route' => route('dashboard.partner.messages.show', $activity->conversation_id)];
                }
                return null;
            })->filter()->values();

            // --- 3. Prepare Chart Data (Optimized SQL Aggregation) ---
            $startDate = Carbon::now()->subDays(90);
            
            $highPriorityModels = [
                'Property' => PropertyBooking::class,
                'Event'    => EventBooking::class,
                'Job'      => JobApplication::class,
                'Service'  => ServiceAppointment::class,
            ];

            $lowPriorityModels = [
                'Quote'      => ServiceQuote::class,
                'Classified' => ClassifiedInquiry::class,
                'Auto'       => AutoInquiry::class,
                'Message'    => Message::class,
            ];

            $chartStats = [];
            $weeks = collect();
            for ($i = 12; $i >= 0; $i--) {
                $date = Carbon::now()->subWeeks($i);
                $weekKey = $date->format('Y-W');
                $weeks->put($weekKey, 'W' . $date->weekOfYear);
                $chartStats[$weekKey] = ['high' => 0, 'low' => 0];
            }

            // Aggregate High Priority Activities
            foreach ($highPriorityModels as $type => $model) {
                $relation = strtolower($type);
                $counts = $model::where('created_at', '>=', $startDate)
                    ->whereHas($relation, fn(Builder $q) => $q->where('user_id', $partnerId))
                    ->select(\Illuminate\Support\Facades\DB::raw("FORMAT(created_at, 'yyyy-ww') as week"), \Illuminate\Support\Facades\DB::raw('COUNT(*) as total'))
                    ->groupBy('week')
                    ->pluck('total', 'week');

                foreach ($counts as $week => $count) {
                    if (isset($chartStats[$week])) $chartStats[$week]['high'] += $count;
                }
            }

            // Aggregate Low Priority Activities
            foreach ($lowPriorityModels as $type => $model) {
                $query = $model::where('created_at', '>=', $startDate);
                if ($type === 'Message') {
                    $query->whereIn('conversation_id', $partnerConversationIds)->where('sender_id', '!=', $partnerId);
                } else {
                    $relation = ($type === 'Classified') ? 'classifiedad' : strtolower($type);
                    $query->whereHas($relation, fn(Builder $q) => $q->where('user_id', $partnerId));
                }

                $counts = $query->select(\Illuminate\Support\Facades\DB::raw("FORMAT(created_at, 'yyyy-ww') as week"), \Illuminate\Support\Facades\DB::raw('COUNT(*) as total'))
                    ->groupBy('week')
                    ->pluck('total', 'week');

                foreach ($counts as $week => $count) {
                    if (isset($chartStats[$week])) $chartStats[$week]['low'] += $count;
                }
            }

            $bookingCounts = [];
            $inquiryCounts = [];
            foreach ($weeks->keys() as $weekKey) {
                $bookingCounts[] = $chartStats[$weekKey]['high'];
                $inquiryCounts[] = $chartStats[$weekKey]['low'];
            }

            // --- 4. Breakdown Modules (Counts) ---
            $modules = collect([
                ['name' => 'Properties', 'count' => $partner->propertiesBookingsNewCount, 'icon' => 'bi-house-fill', 'interaction_route' => route('dashboard.partner.properties.bookings.index')],
                ['name' => 'Events', 'count' => $partner->eventsBookingsNewCount, 'icon' => 'bi-calendar-event-fill', 'interaction_route' => route('dashboard.partner.events.bookings.index')],
                ['name' => 'Jobs', 'count' => $partner->jobsApplicationsNewCount, 'icon' => 'bi-briefcase-fill', 'interaction_route' => route('dashboard.partner.joblistings.applications.index')],
                ['name' => 'Services', 'count' => $partner->servicesQuotesNewCount + $partner->servicesAppointmentsNewCount, 'icon' => 'bi-tools', 'interaction_route' => route('dashboard.partner.services.quotes.index')],
                ['name' => 'Autos', 'count' => $partner->autosInquiriesNewCount, 'icon' => 'bi-truck', 'interaction_route' => route('dashboard.partner.autos.inquiries.index')],
                ['name' => 'Classifieds', 'count' => $partner->classifiedsInquiriesNewCount, 'icon' => 'bi-tags-fill', 'interaction_route' => route('dashboard.partner.classifieds.inquiries.index')],
            ])->filter(fn($m) => $m['count'] > 0)->values();

            return [
                'modules' => $modules,
                'recentActivity' => $recentActivityLog,
                'activityChartData' => [
                    'labels' => $weeks->values()->all(),
                    'bookingCounts' => $bookingCounts,
                    'inquiryCounts' => $inquiryCounts,
                ],
            ];
        });
    }
}
