<?php

namespace App\Services\Partner;

use App\Models\AutoInquiry;
use App\Models\ClassifiedInquiry;
use App\Models\EventBooking;
use App\Models\JobApplication;
use App\Models\PropertyBooking;
use App\Models\PropertyVisit;
use App\Models\ServiceAppointment;
use App\Models\ServiceQuote;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class PartnerLeadEmailResolver
{
    /**
     * Map a partner lead record to owner, listing, and contact fields for email templates.
     *
     * @return array{owner: User, listing: Model, leadName: string, leadEmail: string, leadMessage: string}|null
     */
    public function resolve(Model $record): ?array
    {
        $record->loadMissing(match ($record::class) {
            AutoInquiry::class => ['auto.user', 'user'],
            ClassifiedInquiry::class => ['classifiedad.user', 'user'],
            EventBooking::class => ['event.user', 'user'],
            JobApplication::class => ['job.user', 'user'],
            PropertyBooking::class => ['property.user', 'user'],
            PropertyVisit::class => ['property.user', 'user'],
            ServiceAppointment::class => ['service.user', 'user'],
            ServiceQuote::class => ['service.user', 'user'],
            default => [],
        });

        $resolved = match ($record::class) {
            AutoInquiry::class => [
                'owner' => $record->auto?->user,
                'listing' => $record->auto,
                'leadName' => $record->full_name ?? $record->user?->name ?? __('Guest'),
                'leadEmail' => $record->email ?? $record->user?->email ?? '',
                'leadMessage' => $record->message ?? '',
            ],
            ClassifiedInquiry::class => [
                'owner' => $record->classifiedad?->user,
                'listing' => $record->classifiedad,
                'leadName' => $record->full_name ?? $record->user?->name ?? __('Guest'),
                'leadEmail' => $record->email ?? $record->user?->email ?? '',
                'leadMessage' => $record->message ?? '',
            ],
            EventBooking::class => [
                'owner' => $record->event?->user,
                'listing' => $record->event,
                'leadName' => $record->user_name ?? $record->user?->name ?? __('Guest'),
                'leadEmail' => $record->user_email ?? $record->user?->email ?? '',
                'leadMessage' => $record->message ?? '',
            ],
            JobApplication::class => [
                'owner' => $record->job?->user,
                'listing' => $record->job,
                'leadName' => $record->user?->name ?? __('Applicant'),
                'leadEmail' => $record->user?->email ?? '',
                'leadMessage' => $record->cover_letter ?? '',
            ],
            PropertyBooking::class => [
                'owner' => $record->property?->user,
                'listing' => $record->property,
                'leadName' => $record->full_name ?? $record->user?->name ?? __('Guest'),
                'leadEmail' => $record->email ?? $record->user?->email ?? '',
                'leadMessage' => $record->message ?? '',
            ],
            PropertyVisit::class => [
                'owner' => $record->property?->user,
                'listing' => $record->property,
                'leadName' => $record->full_name ?? $record->user?->name ?? __('Guest'),
                'leadEmail' => $record->email ?? $record->user?->email ?? '',
                'leadMessage' => $record->message ?? '',
            ],
            ServiceAppointment::class => [
                'owner' => $record->service?->user,
                'listing' => $record->service,
                'leadName' => $record->user?->name ?? __('Guest'),
                'leadEmail' => $record->user?->email ?? '',
                'leadMessage' => $record->notes ?? '',
            ],
            ServiceQuote::class => [
                'owner' => $record->service?->user,
                'listing' => $record->service,
                'leadName' => $record->user?->name ?? __('Guest'),
                'leadEmail' => $record->user?->email ?? '',
                'leadMessage' => $record->message ?? '',
            ],
            default => null,
        };

        if (!$resolved || !$resolved['owner'] || !$resolved['listing'] || blank($resolved['leadEmail'])) {
            return null;
        }

        return $resolved;
    }
}
