<?php

namespace App\Traits\Models;

use App\Models\AutoInquiry;
use App\Models\ClassifiedInquiry;
use App\Models\EventBooking;
use App\Models\JobApplication;
use App\Models\PropertyBooking;
use App\Models\PropertyVisit;
use App\Models\ServiceAppointment;
use App\Models\ServiceQuote;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

trait HasMarketplaceMetrics
{
    /**
     * Centralized metrics engine.
     * Consolidates all marketplace counts into a single cached object
     * to prevent N+1 'Query Storms'.
     */
    public function getMarketplaceMetrics(): array
    {
        return Cache::remember("user_metrics_{$this->id}_v3", 300, function () {
            return [
                'listings_active' => $this->calculateListingsActive(),
                'leads_new'       => $this->calculateNewLeads(),
                'buyer_pending'   => $this->calculateBuyerPending(),
                'buyer_total'     => $this->calculateBuyerTotals(),
            ];
        });
    }

    /**
     * Individual Accessors (Refactored to use Centralized Engine)
     */
    protected function listingsActiveCount(): Attribute { return Attribute::make(get: fn() => $this->getMarketplaceMetrics()['listings_active']); }
    
    protected function propertiesBookingsNewCount(): Attribute { return Attribute::make(get: fn() => $this->getMarketplaceMetrics()['leads_new']['prop_bookings']); }
    protected function propertiesVisitsNewCount(): Attribute   { return Attribute::make(get: fn() => $this->getMarketplaceMetrics()['leads_new']['prop_visits']); }
    protected function eventsBookingsNewCount(): Attribute     { return Attribute::make(get: fn() => $this->getMarketplaceMetrics()['leads_new']['event_bookings']); }
    protected function jobsApplicationsNewCount(): Attribute   { return Attribute::make(get: fn() => $this->getMarketplaceMetrics()['leads_new']['job_apps']); }
    protected function servicesQuotesNewCount(): Attribute     { return Attribute::make(get: fn() => $this->getMarketplaceMetrics()['leads_new']['service_quotes']); }
    protected function servicesAppointmentsNewCount(): Attribute { return Attribute::make(get: fn() => $this->getMarketplaceMetrics()['leads_new']['service_appts']); }
    protected function autosInquiriesNewCount(): Attribute     { return Attribute::make(get: fn() => $this->getMarketplaceMetrics()['leads_new']['auto_inquiries']); }
    protected function classifiedsInquiriesNewCount(): Attribute { return Attribute::make(get: fn() => $this->getMarketplaceMetrics()['leads_new']['class_inquiries']); }

    protected function totalNewActivities(): Attribute
    {
        return Attribute::make(get: fn() => array_sum($this->getMarketplaceMetrics()['leads_new']));
    }

    // Buyer Accessors
    protected function pendingBookingsCount(): Attribute { return Attribute::make(get: fn() => $this->getMarketplaceMetrics()['buyer_pending']['bookings']); }
    protected function pendingApplicationsCount(): Attribute { return Attribute::make(get: fn() => $this->getMarketplaceMetrics()['buyer_pending']['apps']); }
    protected function pendingQuotesCount(): Attribute { return Attribute::make(get: fn() => $this->getMarketplaceMetrics()['buyer_pending']['quotes']); }
    protected function pendingAppointmentsCount(): Attribute { return Attribute::make(get: fn() => $this->getMarketplaceMetrics()['buyer_pending']['appts']); }
    protected function pendingInquiriesCount(): Attribute { return Attribute::make(get: fn() => $this->getMarketplaceMetrics()['buyer_pending']['inquiries']); }

    protected function totalBuyerActivitiesCount(): Attribute
    {
        return Attribute::make(get: fn() => array_sum($this->getMarketplaceMetrics()['buyer_pending']));
    }

    // --- Internal Calculation Engine (Optimized Queries) ---

    private function calculateListingsActive(): int
    {
        $tables = ['properties', 'events', 'joblistings', 'services', 'classified_ads', 'autos'];
        $total = 0;
        foreach ($tables as $table) {
            $total += DB::table($table)
                ->where('user_id', $this->id)
                ->where('is_published', true)
                ->whereNull('deleted_at')
                ->count();
        }
        return $total;
    }

    private function calculateNewLeads(): array
    {
        $id = $this->id;
        return [
            'prop_bookings'    => PropertyBooking::join('properties', 'property_bookings.property_id', '=', 'properties.id')->where('properties.user_id', $id)->where('property_bookings.status', 'new')->count(),
            'prop_visits'      => PropertyVisit::join('properties', 'property_visits.property_id', '=', 'properties.id')->where('properties.user_id', $id)->where('property_visits.status', 'new')->count(),
            'event_bookings'   => EventBooking::join('events', 'event_bookings.event_id', '=', 'events.id')->where('events.user_id', $id)->where('event_bookings.status', 'new')->count(),
            'job_apps'         => JobApplication::join('joblistings', 'job_applications.job_listing_id', '=', 'joblistings.id')->where('joblistings.user_id', $id)->where('job_applications.status', 'new')->count(),
            'service_quotes'   => ServiceQuote::join('services', 'service_quotes.service_id', '=', 'services.id')->where('services.user_id', $id)->where('service_quotes.status', 'new')->count(),
            'service_appts'    => ServiceAppointment::join('services', 'service_appointments.service_id', '=', 'services.id')->where('services.user_id', $id)->where('service_appointments.status', 'new')->count(),
            'auto_inquiries'   => AutoInquiry::join('autos', 'auto_inquiries.auto_id', '=', 'autos.id')->where('autos.user_id', $id)->where('auto_inquiries.status', 'new')->count(),
            'class_inquiries'  => ClassifiedInquiry::join('classified_ads', 'classified_inquiries.classified_id', '=', 'classified_ads.id')->where('classified_ads.user_id', $id)->where('classified_inquiries.status', 'new')->count(),
        ];
    }

    private function calculateBuyerPending(): array
    {
        return [
            'bookings'  => $this->propertyBookings()->where('status', 'pending')->count() + $this->eventBookings()->where('status', 'pending')->count(),
            'apps'      => $this->jobApplications()->where('status', 'pending')->count(),
            'quotes'    => $this->serviceQuotes()->where('status', 'pending')->count(),
            'appts'     => $this->serviceAppointments()->where('status', 'pending')->count(),
            'inquiries' => $this->classifiedInquiries()->wherePivot('status', 'pending')->count(),
        ];
    }

    private function calculateBuyerTotals(): array
    {
        return [
            'apps'      => $this->jobApplications()->count(),
            'quotes'    => $this->serviceQuotes()->count(),
            'appts'     => $this->serviceAppointments()->count(),
            'inquiries' => $this->classifiedInquiries()->count(),
        ];
    }
}
