<?php

namespace App\Traits\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;

trait HasMarketplaceMetrics
{
    /**
     * Aggregates active listings across all verticals.
     * Includes caching to prevent N+1 overhead in dashboards.
     */
    protected function listingsActiveCount(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->properties()->where('is_published', true)->count() +
                         $this->events()->where('is_published', true)->count() +
                         $this->jobs()->where('is_published', true)->count() +
                         $this->services()->where('is_published', true)->count() +
                         $this->classifieds()->where('is_published', true)->count() +
                         $this->autos()->where('is_published', true)->count(),
        )->shouldCache();
    }

    // Lead Counts for Sellers
    protected function propertiesBookingsNewCount(): Attribute { return Attribute::make(get: fn () => $this->properties()->withCount('bookingsNew')->get()->sum('bookings_new_count'))->shouldCache(); }
    protected function propertiesVisitsNewCount(): Attribute { return Attribute::make(get: fn () => $this->properties()->withCount('visitsNew')->get()->sum('visits_new_count'))->shouldCache(); }
    protected function eventsBookingsNewCount(): Attribute { return Attribute::make(get: fn () => $this->events()->withCount('bookingsNew')->get()->sum('bookings_new_count'))->shouldCache(); }
    protected function jobsApplicationsNewCount(): Attribute { return Attribute::make(get: fn () => $this->jobs()->withCount('applicationsNew')->get()->sum('applications_new_count'))->shouldCache(); }
    protected function servicesQuotesNewCount(): Attribute { return Attribute::make(get: fn () => $this->services()->withCount('quotesNew')->get()->sum('quotes_new_count'))->shouldCache(); }
    protected function servicesAppointmentsNewCount(): Attribute { return Attribute::make(get: fn () => $this->services()->withCount('appointmentsNew')->get()->sum('appointments_new_count'))->shouldCache(); }
    protected function autosInquiriesNewCount(): Attribute { return Attribute::make(get: fn () => $this->autos()->withCount('inquiriesNew')->get()->sum('inquiries_new_count'))->shouldCache(); }
    protected function classifiedsInquiriesNewCount(): Attribute { return Attribute::make(get: fn () => $this->classifieds()->withCount('inquiriesNew')->get()->sum('inquiries_new_count'))->shouldCache(); }

    protected function totalNewActivities(): Attribute
    {
        return Attribute::make(
            get: fn () =>
                $this->properties_bookings_new_count +
                $this->properties_visits_new_count +
                $this->events_bookings_new_count +
                $this->jobs_applications_new_count +
                $this->services_quotes_new_count +
                $this->services_appointments_new_count + 
                $this->autos_inquiries_new_count +
                $this->classifieds_inquiries_new_count
        )->shouldCache();
    }

    // --- PENDING COUNTS (For Notification Badges) ---
    protected function pendingBookingsCount(): Attribute { return Attribute::make(get: fn () => $this->propertyBookings()->where('status', 'pending')->count() + $this->eventBookings()->where('status', 'pending')->count())->shouldCache(); }
    protected function pendingApplicationsCount(): Attribute { return Attribute::make(get: fn () => $this->jobApplications()->where('status', 'pending')->count())->shouldCache(); }
    protected function pendingQuotesCount(): Attribute { return Attribute::make(get: fn () => $this->serviceQuotes()->where('status', 'pending')->count())->shouldCache(); }
    protected function pendingAppointmentsCount(): Attribute { return Attribute::make(get: fn () => $this->serviceAppointments()->where('status', 'pending')->count())->shouldCache(); }
    protected function pendingInquiriesCount(): Attribute { return Attribute::make(get: fn () => $this->classifiedInquiries()->wherePivot('status', 'pending')->count())->shouldCache(); }

    // --- TOTAL SENT COUNTS (For Dashboard Stat Cards) ---
    protected function totalApplicationsCount(): Attribute { return Attribute::make(get: fn () => $this->jobApplications()->count())->shouldCache(); }
    protected function totalQuotesCount(): Attribute { return Attribute::make(get: fn () => $this->serviceQuotes()->count())->shouldCache(); }
    protected function totalAppointmentsCount(): Attribute { return Attribute::make(get: fn () => $this->serviceAppointments()->count())->shouldCache(); }
    protected function totalInquiriesCount(): Attribute { return Attribute::make(get: fn () => $this->classifiedInquiries()->count())->shouldCache(); }

    protected function totalBuyerActivitiesCount(): Attribute
    {
        return Attribute::make(
            get: fn () =>
                $this->pending_bookings_count +
                $this->pending_applications_count +
                $this->pending_quotes_count +
                $this->pending_appointments_count +
                $this->pending_inquiries_count
        )->shouldCache();
    }
}
