<?php

namespace App\Services\Partner;

use App\Models\Auto;
use App\Models\AutoInquiry;
use App\Models\Classified;
use App\Models\ClassifiedInquiry;
use App\Models\Event;
use App\Models\EventBooking;
use App\Models\JobApplication;
use App\Models\JobListing;
use App\Models\Message;
use App\Models\Property;
use App\Models\PropertyBooking;
use App\Models\PropertyVisit;
use App\Models\Review;
use App\Models\Service;
use App\Models\ServiceAppointment;
use App\Models\ServiceQuote;
use App\Models\User;
use App\Notifications\Partner\PartnerAlertNotification;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Collection;

class NotificationService
{
    public function syncUnread(User $partner): void
    {
        $partnerId = $partner->id;
        $listingIds = $this->partnerListingIds($partner);

        $this->syncModelNotifications(
            $partner,
            Review::query()
                ->whereIn('reviewable_id', $listingIds['flat'])
                ->whereIn('reviewable_type', $listingIds['types'])
                ->whereNull('viewed_at')
                ->with(['reviewable', 'user'])
                ->latest()
                ->limit(25)
                ->get(),
            fn (Review $review) => [
                'type' => 'review',
                'title' => __('New Review'),
                'message' => __('Received a new :rating-star review on ":title".', [
                    'rating' => $review->rating,
                    'title' => $review->reviewable->title ?? __('Listing'),
                ]),
                'route' => '/dashboard/reviews',
                'source_type' => Review::class,
                'source_id' => $review->id,
            ]
        );

        $this->syncModelNotifications(
            $partner,
            PropertyBooking::query()
                ->whereHas('property', fn (Builder $q) => $q->where('user_id', $partnerId))
                ->whereNull('viewed_at')
                ->with(['property', 'user'])
                ->latest()
                ->limit(25)
                ->get(),
            fn (PropertyBooking $booking) => [
                'type' => 'booking',
                'title' => __('New Property Booking'),
                'message' => __('New booking request for ":title".', [
                    'title' => $booking->property->title ?? __('Property'),
                ]),
                'route' => '/dashboard/properties/bookings',
                'source_type' => PropertyBooking::class,
                'source_id' => $booking->id,
            ]
        );

        $this->syncModelNotifications(
            $partner,
            EventBooking::query()
                ->whereHas('event', fn (Builder $q) => $q->where('user_id', $partnerId))
                ->whereNull('viewed_at')
                ->with(['event', 'user'])
                ->latest()
                ->limit(25)
                ->get(),
            fn (EventBooking $booking) => [
                'type' => 'booking',
                'title' => __('New Event Booking'),
                'message' => __('New booking for ":title".', [
                    'title' => $booking->event->title ?? __('Event'),
                ]),
                'route' => '/dashboard/events/bookings',
                'source_type' => EventBooking::class,
                'source_id' => $booking->id,
            ]
        );

        $this->syncModelNotifications(
            $partner,
            JobApplication::query()
                ->whereHas('job', fn (Builder $q) => $q->where('user_id', $partnerId))
                ->whereNull('viewed_at')
                ->with(['job', 'user'])
                ->latest()
                ->limit(25)
                ->get(),
            fn (JobApplication $application) => [
                'type' => 'inquiry',
                'title' => __('New Job Application'),
                'message' => __('New application received for ":title".', [
                    'title' => $application->job->title ?? __('Job'),
                ]),
                'route' => '/dashboard/joblistings/applications',
                'source_type' => JobApplication::class,
                'source_id' => $application->id,
            ]
        );

        $this->syncModelNotifications(
            $partner,
            ServiceQuote::query()
                ->whereHas('service', fn (Builder $q) => $q->where('user_id', $partnerId))
                ->whereNull('viewed_at')
                ->with(['service', 'user'])
                ->latest()
                ->limit(25)
                ->get(),
            fn (ServiceQuote $quote) => [
                'type' => 'inquiry',
                'title' => __('New Service Quote Request'),
                'message' => __('New quote request for ":title".', [
                    'title' => $quote->service->title ?? __('Service'),
                ]),
                'route' => '/dashboard/services/quotes',
                'source_type' => ServiceQuote::class,
                'source_id' => $quote->id,
            ]
        );

        $this->syncModelNotifications(
            $partner,
            ServiceAppointment::query()
                ->whereHas('service', fn (Builder $q) => $q->where('user_id', $partnerId))
                ->whereNull('viewed_at')
                ->with(['service', 'user'])
                ->latest()
                ->limit(25)
                ->get(),
            fn (ServiceAppointment $appointment) => [
                'type' => 'booking',
                'title' => __('New Service Appointment'),
                'message' => __('New appointment for ":title".', [
                    'title' => $appointment->service->title ?? __('Service'),
                ]),
                'route' => '/dashboard/services/appointments',
                'source_type' => ServiceAppointment::class,
                'source_id' => $appointment->id,
            ]
        );

        $this->syncModelNotifications(
            $partner,
            AutoInquiry::query()
                ->whereHas('auto', fn (Builder $q) => $q->where('user_id', $partnerId))
                ->whereNull('viewed_at')
                ->with(['auto', 'user'])
                ->latest()
                ->limit(25)
                ->get(),
            fn (AutoInquiry $inquiry) => [
                'type' => 'inquiry',
                'title' => __('New Auto Inquiry'),
                'message' => __('New inquiry for ":title".', [
                    'title' => $inquiry->auto->title ?? __('Auto'),
                ]),
                'route' => '/dashboard/autos/inquiries',
                'source_type' => AutoInquiry::class,
                'source_id' => $inquiry->id,
            ]
        );

        $this->syncModelNotifications(
            $partner,
            ClassifiedInquiry::query()
                ->whereHas('classifiedad', fn (Builder $q) => $q->where('user_id', $partnerId))
                ->whereNull('viewed_at')
                ->with(['classifiedad', 'user'])
                ->latest()
                ->limit(25)
                ->get(),
            fn (ClassifiedInquiry $inquiry) => [
                'type' => 'inquiry',
                'title' => __('New Listing Inquiry'),
                'message' => __('New inquiry for ":title".', [
                    'title' => $inquiry->classifiedad->title ?? __('Classified'),
                ]),
                'route' => '/dashboard/classifieds/inquiries',
                'source_type' => ClassifiedInquiry::class,
                'source_id' => $inquiry->id,
            ]
        );

        $this->syncModelNotifications(
            $partner,
            PropertyVisit::query()
                ->whereHas('property', fn (Builder $q) => $q->where('user_id', $partnerId))
                ->whereNull('viewed_at')
                ->with(['property'])
                ->latest()
                ->limit(25)
                ->get(),
            fn (PropertyVisit $visit) => [
                'type' => 'booking',
                'title' => __('New Property Visit Request'),
                'message' => __('New visit request for ":title".', [
                    'title' => $visit->property->title ?? __('Property'),
                ]),
                'route' => '/dashboard/properties/visits',
                'source_type' => PropertyVisit::class,
                'source_id' => $visit->id,
            ]
        );

        $conversationIds = $partner->allConversations()->pluck('id');
        $this->syncModelNotifications(
            $partner,
            Message::query()
                ->whereIn('conversation_id', $conversationIds)
                ->where('sender_id', '!=', $partnerId)
                ->whereNull('read_at')
                ->with(['sender'])
                ->latest()
                ->limit(25)
                ->get(),
            fn (Message $message) => [
                'type' => 'inquiry',
                'title' => __('New Message'),
                'message' => __('New message from :name.', [
                    'name' => $message->sender->name ?? __('Customer'),
                ]),
                'route' => '/dashboard/messages',
                'source_type' => Message::class,
                'source_id' => $message->id,
            ]
        );
    }

    public function paginate(User $partner, ?bool $unreadOnly = null, int $perPage = 20): LengthAwarePaginator
    {
        $query = $partner->notifications()->latest();

        if ($unreadOnly) {
            $query->whereNull('read_at');
        }

        return $query->paginate($perPage);
    }

    public function markAsRead(User $partner, string $notificationId): DatabaseNotification
    {
        /** @var DatabaseNotification $notification */
        $notification = $partner->notifications()->where('id', $notificationId)->firstOrFail();
        $notification->markAsRead();

        return $notification->fresh();
    }

    public function markAllAsRead(User $partner): int
    {
        $count = $partner->unreadNotifications()->count();
        $partner->unreadNotifications->markAsRead();

        return $count;
    }

    public function delete(User $partner, string $notificationId): void
    {
        $partner->notifications()->where('id', $notificationId)->delete();
    }

    protected function syncModelNotifications(User $partner, Collection $records, callable $mapper): void
    {
        foreach ($records as $record) {
            $payload = $mapper($record);

            if ($this->notificationExists($partner, $payload['source_type'], $payload['source_id'])) {
                continue;
            }

            $partner->notify(new PartnerAlertNotification(
                type: $payload['type'],
                title: $payload['title'],
                message: $payload['message'],
                route: $payload['route'],
                sourceType: $payload['source_type'],
                sourceId: $payload['source_id'],
            ));
        }
    }

    protected function notificationExists(User $partner, string $sourceType, int|string|null $sourceId): bool
    {
        return $partner->notifications()
            ->where('data->source_type', $sourceType)
            ->where('data->source_id', $sourceId)
            ->exists();
    }

    protected function partnerListingIds(User $partner): array
    {
        $types = [
            Property::class,
            Event::class,
            JobListing::class,
            Service::class,
            Classified::class,
            Auto::class,
        ];

        $flat = collect([
            $partner->properties()->pluck('id'),
            $partner->events()->pluck('id'),
            $partner->jobs()->pluck('id'),
            $partner->services()->pluck('id'),
            $partner->classifieds()->pluck('id'),
            $partner->autos()->pluck('id'),
        ])->flatten()->filter()->values()->all();

        return [
            'types' => $types,
            'flat' => $flat,
        ];
    }
}
