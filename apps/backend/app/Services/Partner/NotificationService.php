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

        Review::query()
            ->whereIn('reviewable_id', $listingIds['flat'])
            ->whereIn('reviewable_type', $listingIds['types'])
            ->whereNull('viewed_at')
            ->latest()
            ->limit(25)
            ->get()
            ->each(fn (Review $review) => $this->notifyForRecord($review));

        PropertyBooking::query()
            ->whereHas('property', fn (Builder $q) => $q->where('user_id', $partnerId))
            ->whereNull('viewed_at')
            ->latest()
            ->limit(25)
            ->get()
            ->each(fn (PropertyBooking $booking) => $this->notifyForRecord($booking));

        EventBooking::query()
            ->whereHas('event', fn (Builder $q) => $q->where('user_id', $partnerId))
            ->whereNull('viewed_at')
            ->latest()
            ->limit(25)
            ->get()
            ->each(fn (EventBooking $booking) => $this->notifyForRecord($booking));

        JobApplication::query()
            ->whereHas('job', fn (Builder $q) => $q->where('user_id', $partnerId))
            ->whereNull('viewed_at')
            ->latest()
            ->limit(25)
            ->get()
            ->each(fn (JobApplication $application) => $this->notifyForRecord($application));

        ServiceQuote::query()
            ->whereHas('service', fn (Builder $q) => $q->where('user_id', $partnerId))
            ->whereNull('viewed_at')
            ->latest()
            ->limit(25)
            ->get()
            ->each(fn (ServiceQuote $quote) => $this->notifyForRecord($quote));

        ServiceAppointment::query()
            ->whereHas('service', fn (Builder $q) => $q->where('user_id', $partnerId))
            ->whereNull('viewed_at')
            ->latest()
            ->limit(25)
            ->get()
            ->each(fn (ServiceAppointment $appointment) => $this->notifyForRecord($appointment));

        AutoInquiry::query()
            ->whereHas('auto', fn (Builder $q) => $q->where('user_id', $partnerId))
            ->whereNull('viewed_at')
            ->latest()
            ->limit(25)
            ->get()
            ->each(fn (AutoInquiry $inquiry) => $this->notifyForRecord($inquiry));

        ClassifiedInquiry::query()
            ->whereHas('classifiedad', fn (Builder $q) => $q->where('user_id', $partnerId))
            ->whereNull('viewed_at')
            ->latest()
            ->limit(25)
            ->get()
            ->each(fn (ClassifiedInquiry $inquiry) => $this->notifyForRecord($inquiry));

        PropertyVisit::query()
            ->whereHas('property', fn (Builder $q) => $q->where('user_id', $partnerId))
            ->whereNull('viewed_at')
            ->latest()
            ->limit(25)
            ->get()
            ->each(fn (PropertyVisit $visit) => $this->notifyForRecord($visit));

        $conversationIds = $partner->allConversations()->pluck('id');

        Message::query()
            ->whereIn('conversation_id', $conversationIds)
            ->where('sender_id', '!=', $partnerId)
            ->whereNull('read_at')
            ->latest()
            ->limit(25)
            ->get()
            ->each(fn (Message $message) => $this->notifyForMessage($message, $partner));
    }

    public function notifyForRecord(Model $record): void
    {
        $this->loadRecordRelations($record);

        $partner = $this->resolvePartnerForRecord($record);
        $payload = $this->buildPayloadForRecord($record);

        if (!$partner || !$payload) {
            return;
        }

        $this->notifyPartner($partner, $payload);
    }

    public function notifyForMessage(Message $message, User $partner): void
    {
        $message->loadMissing('sender');

        $this->notifyPartner($partner, [
            'type' => 'inquiry',
            'title' => __('New Message'),
            'message' => __('New message from :name.', [
                'name' => $message->sender->name ?? __('Customer'),
            ]),
            'route' => '/dashboard/messages',
            'source_type' => Message::class,
            'source_id' => $message->id,
        ]);
    }

    public function notifyPartner(User $partner, array $payload): void
    {
        if ($this->notificationExists($partner, $payload['source_type'], $payload['source_id'])) {
            return;
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

    protected function buildPayloadForRecord(Model $record): ?array
    {
        return match ($record::class) {
            Review::class => [
                'type' => 'review',
                'title' => __('New Review'),
                'message' => __('Received a new :rating-star review on ":title".', [
                    'rating' => $record->rating,
                    'title' => $record->reviewable->title ?? __('Listing'),
                ]),
                'route' => '/dashboard/reviews',
                'source_type' => Review::class,
                'source_id' => $record->id,
            ],
            PropertyBooking::class => [
                'type' => 'booking',
                'title' => __('New Property Booking'),
                'message' => __('New booking request for ":title".', [
                    'title' => $record->property->title ?? __('Property'),
                ]),
                'route' => '/dashboard/properties/bookings',
                'source_type' => PropertyBooking::class,
                'source_id' => $record->id,
            ],
            PropertyVisit::class => [
                'type' => 'booking',
                'title' => __('New Property Visit Request'),
                'message' => __('New visit request for ":title".', [
                    'title' => $record->property->title ?? __('Property'),
                ]),
                'route' => '/dashboard/properties/visits',
                'source_type' => PropertyVisit::class,
                'source_id' => $record->id,
            ],
            AutoInquiry::class => [
                'type' => 'inquiry',
                'title' => __('New Auto Inquiry'),
                'message' => __('New inquiry for ":title".', [
                    'title' => $record->auto->title ?? __('Auto'),
                ]),
                'route' => '/dashboard/autos/inquiries',
                'source_type' => AutoInquiry::class,
                'source_id' => $record->id,
            ],
            EventBooking::class => [
                'type' => 'booking',
                'title' => __('New Event Booking'),
                'message' => __('New booking for ":title".', [
                    'title' => $record->event->title ?? __('Event'),
                ]),
                'route' => '/dashboard/events/bookings',
                'source_type' => EventBooking::class,
                'source_id' => $record->id,
            ],
            JobApplication::class => [
                'type' => 'inquiry',
                'title' => __('New Job Application'),
                'message' => __('New application received for ":title".', [
                    'title' => $record->job->title ?? __('Job'),
                ]),
                'route' => '/dashboard/joblistings/applications',
                'source_type' => JobApplication::class,
                'source_id' => $record->id,
            ],
            ServiceQuote::class => [
                'type' => 'inquiry',
                'title' => __('New Service Quote Request'),
                'message' => __('New quote request for ":title".', [
                    'title' => $record->service->title ?? __('Service'),
                ]),
                'route' => '/dashboard/services/quotes',
                'source_type' => ServiceQuote::class,
                'source_id' => $record->id,
            ],
            ServiceAppointment::class => [
                'type' => 'booking',
                'title' => __('New Service Appointment'),
                'message' => __('New appointment for ":title".', [
                    'title' => $record->service->title ?? __('Service'),
                ]),
                'route' => '/dashboard/services/appointments',
                'source_type' => ServiceAppointment::class,
                'source_id' => $record->id,
            ],
            ClassifiedInquiry::class => [
                'type' => 'inquiry',
                'title' => __('New Listing Inquiry'),
                'message' => __('New inquiry for ":title".', [
                    'title' => $record->classifiedad->title ?? __('Classified'),
                ]),
                'route' => '/dashboard/classifieds/inquiries',
                'source_type' => ClassifiedInquiry::class,
                'source_id' => $record->id,
            ],
            default => null,
        };
    }

    protected function resolvePartnerForRecord(Model $record): ?User
    {
        return match ($record::class) {
            Review::class => $record->reviewable?->user,
            PropertyBooking::class, PropertyVisit::class => $record->property?->user,
            AutoInquiry::class => $record->auto?->user,
            EventBooking::class => $record->event?->user,
            JobApplication::class => $record->job?->user,
            ServiceQuote::class, ServiceAppointment::class => $record->service?->user,
            ClassifiedInquiry::class => $record->classifiedad?->user,
            default => null,
        };
    }

    protected function loadRecordRelations(Model $record): void
    {
        $record->loadMissing(match ($record::class) {
            Review::class => ['reviewable', 'user'],
            PropertyBooking::class, PropertyVisit::class => ['property'],
            AutoInquiry::class => ['auto', 'user'],
            EventBooking::class => ['event', 'user'],
            JobApplication::class => ['job', 'user'],
            ServiceQuote::class, ServiceAppointment::class => ['service', 'user'],
            ClassifiedInquiry::class => ['classifiedad', 'user'],
            default => [],
        });
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
