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
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class CustomerService
{
    public function list(User $partner): Collection
    {
        return $this->aggregateCustomers($partner)->values();
    }

    public function find(User $partner, string $identifier): ?array
    {
        $customers = $this->aggregateCustomers($partner);

        if ($customers->has($identifier)) {
            return $customers->get($identifier);
        }

        return $customers->first(fn (array $customer) => (string) $customer['id'] === (string) $identifier);
    }

    protected function aggregateCustomers(User $partner): Collection
    {
        $customers = collect();
        $partnerId = $partner->id;
        $nextId = 1;

        $records = collect()
            ->merge(
                PropertyBooking::query()
                    ->whereHas('property', fn (Builder $q) => $q->where('user_id', $partnerId))
                    ->with(['property', 'user'])
                    ->latest()
                    ->get()
                    ->map(fn ($record) => $this->normalizeLeadRecord($record, 'properties', 'bookings'))
            )
            ->merge(
                PropertyVisit::query()
                    ->whereHas('property', fn (Builder $q) => $q->where('user_id', $partnerId))
                    ->with(['property'])
                    ->latest()
                    ->get()
                    ->map(fn ($record) => $this->normalizeLeadRecord($record, 'properties', 'visits'))
            )
            ->merge(
                AutoInquiry::query()
                    ->whereHas('auto', fn (Builder $q) => $q->where('user_id', $partnerId))
                    ->with(['auto', 'user'])
                    ->latest()
                    ->get()
                    ->map(fn ($record) => $this->normalizeLeadRecord($record, 'autos', 'inquiries'))
            )
            ->merge(
                EventBooking::query()
                    ->whereHas('event', fn (Builder $q) => $q->where('user_id', $partnerId))
                    ->with(['event', 'user'])
                    ->latest()
                    ->get()
                    ->map(fn ($record) => $this->normalizeLeadRecord($record, 'events', 'bookings'))
            )
            ->merge(
                ServiceQuote::query()
                    ->whereHas('service', fn (Builder $q) => $q->where('user_id', $partnerId))
                    ->with(['service', 'user'])
                    ->latest()
                    ->get()
                    ->map(fn ($record) => $this->normalizeLeadRecord($record, 'services', 'quotes'))
            )
            ->merge(
                ServiceAppointment::query()
                    ->whereHas('service', fn (Builder $q) => $q->where('user_id', $partnerId))
                    ->with(['service', 'user'])
                    ->latest()
                    ->get()
                    ->map(fn ($record) => $this->normalizeLeadRecord($record, 'services', 'appointments'))
            )
            ->merge(
                JobApplication::query()
                    ->whereHas('job', fn (Builder $q) => $q->where('user_id', $partnerId))
                    ->with(['job', 'user'])
                    ->latest()
                    ->get()
                    ->map(fn ($record) => $this->normalizeLeadRecord($record, 'joblistings', 'applications'))
            )
            ->merge(
                ClassifiedInquiry::query()
                    ->whereHas('classifiedad', fn (Builder $q) => $q->where('user_id', $partnerId))
                    ->with(['classifiedad', 'user'])
                    ->latest()
                    ->get()
                    ->map(fn ($record) => $this->normalizeLeadRecord($record, 'classifieds', 'inquiries'))
            );

            if (!$customers->has($key)) {
                $customers->put($key, [
                    'id' => $nextId++,
                    'key' => $key,
                    'name' => $record['name'],
                    'email' => $record['email'],
                    'phone' => $record['phone'],
                    'avatar_url' => $record['avatar_url'] ?? null,
                    'total_orders' => 0,
                    'total_spent' => 0.0,
                    'status' => 'Active',
                    'joined' => $record['created_at'],
                    'last_interaction_at' => $record['created_at'],
                    'interactions' => [],
                ]);
            }

            $customer = $customers->get($key);
            $customer['total_orders']++;
            $customer['total_spent'] += $record['amount'];
            // Keep the avatar if the record has one and the customer doesn't yet have it
            if (empty($customer['avatar_url']) && !empty($record['avatar_url'])) {
                $customer['avatar_url'] = $record['avatar_url'];
            }
            $customer['interactions'][] = [
                'id' => $record['id'],
                'module' => $record['module'],
                'type' => $record['type'],
                'asset' => $record['asset'],
                'status' => $record['status'],
                'amount' => $record['amount'],
                'created_at' => $record['created_at'],
            ];

            if ($record['created_at'] && ($customer['joined'] === null || $record['created_at']->lt($customer['joined']))) {
                $customer['joined'] = $record['created_at'];
            }

            if ($record['created_at'] && ($customer['last_interaction_at'] === null || $record['created_at']->gt($customer['last_interaction_at']))) {
                $customer['last_interaction_at'] = $record['created_at'];
            }

            $customers->put($key, $customer);
        }

        return $customers->map(function (array $customer) {
            $customer['total_spent'] = '$' . number_format($customer['total_spent'], 0);
            $customer['joined'] = $customer['joined'] instanceof Carbon
                ? $customer['joined']->format('M Y')
                : '—';

            return $customer;
        });
    }

    protected function normalizeLeadRecord(object $record, string $module, string $type): array
    {
        $user = $record->user ?? null;
        $email = $record->email ?? $user?->email;
        $name = $record->full_name ?? $user?->name ?? __('Customer');
        $phone = $record->phone ?? $user?->phone ?? '—';

        $customerKey = $user?->id
            ? 'user:' . $user->id
            : 'guest:' . md5(strtolower((string) $email) . '|' . strtolower((string) $name));

        $asset = $record->property->title
            ?? $record->auto->title
            ?? $record->event->title
            ?? $record->service->title
            ?? $record->job->title
            ?? $record->classifiedad->title
            ?? __('Listing');

        $amount = (float) ($record->total_price ?? $record->quoted_price ?? $record->price ?? 0);

        return [
            'id' => $record->id,
            'customer_key' => $customerKey,
            'module' => $module,
            'type' => $type,
            'name' => $name,
            'email' => $email ?: '—',
            'phone' => $phone ?: '—',
            'avatar_url' => $user?->avatar_url,
            'asset' => $asset,
            'status' => $record->status ?? 'pending',
            'amount' => $amount,
            'created_at' => $record->created_at,
        ];
    }
}
