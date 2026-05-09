<?php

namespace App\Traits\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Cache;

trait HasMarketplaceMetrics
{
    /**
     * Aggregates active listings across all verticals.
     * Uses direct counts to prevent N+1 overhead.
     */
    protected function listingsActiveCount(): Attribute
    {
        return Attribute::make(
            get: fn () => Cache::remember("user_metrics_{$this->id}_listings_active", 300, fn () => 
                \App\Models\Property::where('user_id', $this->id)->where('is_published', true)->count() +
                \App\Models\Event::where('user_id', $this->id)->where('is_published', true)->count() +
                \App\Models\JobListing::where('user_id', $this->id)->where('is_published', true)->count() +
                \App\Models\Service::where('user_id', $this->id)->where('is_published', true)->count() +
                \App\Models\Classified::where('user_id', $this->id)->where('is_published', true)->count() +
                \App\Models\Auto::where('user_id', $this->id)->where('is_published', true)->count()
            ),
        );
    }

    // --- SELLER METRICS (Lead Counts) ---

    protected function propertiesBookingsNewCount(): Attribute 
    { 
        return Attribute::make(get: fn () => Cache::remember("user_metrics_{$this->id}_prop_bookings_new", 300, fn() => \App\Models\PropertyBooking::whereHas('property', fn($q) => $q->where('user_id', $this->id))->where('status', 'new')->count())); 
    }

    protected function propertiesVisitsNewCount(): Attribute 
    { 
        return Attribute::make(get: fn () => Cache::remember("user_metrics_{$this->id}_prop_visits_new", 300, fn() => \App\Models\PropertyVisit::whereHas('property', fn($q) => $q->where('user_id', $this->id))->where('status', 'new')->count())); 
    }

    protected function eventsBookingsNewCount(): Attribute 
    { 
        return Attribute::make(get: fn () => Cache::remember("user_metrics_{$this->id}_event_bookings_new", 300, fn() => \App\Models\EventBooking::whereHas('event', fn($q) => $q->where('user_id', $this->id))->where('status', 'new')->count())); 
    }

    protected function jobsApplicationsNewCount(): Attribute 
    { 
        return Attribute::make(get: fn () => Cache::remember("user_metrics_{$this->id}_job_apps_new", 300, fn() => \App\Models\JobApplication::whereHas('job', fn($q) => $q->where('user_id', $this->id))->where('status', 'new')->count())); 
    }

    protected function servicesQuotesNewCount(): Attribute 
    { 
        return Attribute::make(get: fn () => Cache::remember("user_metrics_{$this->id}_service_quotes_new", 300, fn() => \App\Models\ServiceQuote::whereHas('service', fn($q) => $q->where('user_id', $this->id))->where('status', 'new')->count())); 
    }

    protected function servicesAppointmentsNewCount(): Attribute 
    { 
        return Attribute::make(get: fn () => Cache::remember("user_metrics_{$this->id}_service_appts_new", 300, fn() => \App\Models\ServiceAppointment::whereHas('service', fn($q) => $q->where('user_id', $this->id))->where('status', 'new')->count())); 
    }

    protected function autosInquiriesNewCount(): Attribute 
    { 
        return Attribute::make(get: fn () => Cache::remember("user_metrics_{$this->id}_auto_inquiries_new", 300, fn() => \App\Models\AutoInquiry::whereHas('auto', fn($q) => $q->where('user_id', $this->id))->where('status', 'new')->count())); 
    }

    protected function classifiedsInquiriesNewCount(): Attribute 
    { 
        return Attribute::make(get: fn () => Cache::remember("user_metrics_{$this->id}_class_inquiries_new", 300, fn() => \App\Models\ClassifiedInquiry::whereHas('classifiedAd', fn($q) => $q->where('user_id', $this->id))->where('status', 'new')->count())); 
    }

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
        );
    }

    // --- BUYER METRICS (Pending Counts) ---

    protected function pendingBookingsCount(): Attribute { return Attribute::make(get: fn () => Cache::remember("user_metrics_{$this->id}_pending_bookings", 300, fn() => $this->propertyBookings()->where('status', 'pending')->count() + $this->eventBookings()->where('status', 'pending')->count())); }
    protected function pendingApplicationsCount(): Attribute { return Attribute::make(get: fn () => Cache::remember("user_metrics_{$this->id}_pending_apps", 300, fn() => $this->jobApplications()->where('status', 'pending')->count())); }
    protected function pendingQuotesCount(): Attribute { return Attribute::make(get: fn () => Cache::remember("user_metrics_{$this->id}_pending_quotes", 300, fn() => $this->serviceQuotes()->where('status', 'pending')->count())); }
    protected function pendingAppointmentsCount(): Attribute { return Attribute::make(get: fn () => Cache::remember("user_metrics_{$this->id}_pending_appts", 300, fn() => $this->serviceAppointments()->where('status', 'pending')->count())); }
    protected function pendingInquiriesCount(): Attribute { return Attribute::make(get: fn () => Cache::remember("user_metrics_{$this->id}_pending_inquiries", 300, fn() => $this->classifiedInquiries()->wherePivot('status', 'pending')->count())); }

    // --- TOTAL BUYER COUNTS ---
    protected function totalApplicationsCount(): Attribute { return Attribute::make(get: fn () => Cache::remember("user_metrics_{$this->id}_total_apps", 300, fn() => $this->jobApplications()->count())); }
    protected function totalQuotesCount(): Attribute { return Attribute::make(get: fn () => Cache::remember("user_metrics_{$this->id}_total_quotes", 300, fn() => $this->serviceQuotes()->count())); }
    protected function totalAppointmentsCount(): Attribute { return Attribute::make(get: fn () => Cache::remember("user_metrics_{$this->id}_total_appts", 300, fn() => $this->serviceAppointments()->count())); }
    protected function totalInquiriesCount(): Attribute { return Attribute::make(get: fn () => Cache::remember("user_metrics_{$this->id}_total_inquiries", 300, fn() => $this->classifiedInquiries()->count())); }

    protected function totalBuyerActivitiesCount(): Attribute
    {
        return Attribute::make(
            get: fn () =>
                $this->pending_bookings_count +
                $this->pending_applications_count +
                $this->pending_quotes_count +
                $this->pending_appointments_count +
                $this->pending_inquiries_count
        );
    }
}
