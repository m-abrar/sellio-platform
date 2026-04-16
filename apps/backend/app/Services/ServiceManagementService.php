<?php

namespace App\Services;

use App\Models\Service;
use App\Models\ServicePackage;
use App\Models\ServiceAppointment;
use App\Models\ServiceQuote;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use App\Models\User;

/**
 * Class ServiceManagementService
 *
 * Handles the business logic for service filtering, display preparation,
 * and the creation of appointments and consultations.
 */
class ServiceManagementService
{
    /**
     * @var array
     */
    protected $expertiseLevels = [
        1 => 'Beginner/Junior',
        2 => 'Intermediate/Mid-level',
        3 => 'Advanced/Senior',
        4 => 'Expert/Master',
    ];

    /**
     * Filter and paginate services based on request parameters.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function searchServices(array $filters, ?User $user = null): LengthAwarePaginator
    {
        return Service::orderByDesc('is_featured')
            ->latest()
            ->visibleTo($user)
            ->when($filters['search'] ?? null, function ($q, $v) {
                $q->where(fn($sub) => $sub->where('title', 'like', "%$v%")
                    ->orWhere('description', 'like', "%$v%"));
            })
            ->when($filters['category_id'] ?? null, fn($q, $v) => $q->where('category_id', $v))
            ->when($filters['location'] ?? null, fn($q, $v) => $q->where('location_id', $v))
            ->when($filters['type'] ?? null,     fn($q, $v) => $q->where('type_id', $v))
            ->when($filters['expertise'] ?? null, fn($q, $v) => $q->where('expertise_level', $v))
            ->when($filters['min_price'] ?? null, fn($q, $v) => $q->where('base_price', '>=', $v))
            ->when($filters['max_price'] ?? null, fn($q, $v) => $q->where('base_price', '<=', $v))
            ->when($filters['features'] ?? null, function ($q, $v) {
                $q->whereHas('features', fn($sub) => $sub->whereIn('features.id', (array) $v));
            })
            ->when($filters['tags'] ?? null, function ($q, $v) {
                $q->whereHas('tags', fn($sub) => $sub->whereIn('tags.id', (array) $v));
            })
            ->with(['category', 'user'])
            ->paginate(12);
    }

    /**
     * Get the expertise levels mapping.
     *
     * @return array
     */
    public function getExpertiseLevels(): array
    {
        return $this->expertiseLevels;
    }

    /**
     * Determine the correct view name based on service type.
     *
     * @param Service $service
     * @return string
     */
    public function determineViewName(Service $service): string
    {
        if ($service->is_subscription) {
            return 'bookable';
        }

        if ($service->is_project_based) {
            return 'quotable';
        }

        return 'consultation';
    }

    /**
     * Create a new consultation record.
     * * @param array $data
     * @param Service $service
     * @return ServiceAppointment
     */
    public function createConsultation(array $data, Service $service): ServiceAppointment
    {
        return $service->appointments()->create([
            'user_id' => auth()->id(),
            'name'    => $data['name']  ?? auth()->user()->name,
            'email'   => $data['email'] ?? auth()->user()->email,
            'phone'   => $data['phone'] ?? auth()->user()->phone,
            'topic'   => $data['topic'] ?? 'General Consultation',
            'notes'   => $data['notes'] ?? null,
            'status'  => 'pending',
            'price'   => $service->sale_price ?? $service->base_price,
        ]);
    }

    /**
     * Create a new service appointment linked to a specific package.
     *
     * @param array $data
     * @param Service $service
     * @return ServiceAppointment
     */
    public function createAppointment(array $data, Service $service): ServiceAppointment
    {
        // 1. Resolve the package and price internally for security
        $package = ServicePackage::findOrFail($data['service_package_id']);
        
        // 2. Parse the scheduled time from date and time strings
        $scheduledAt = Carbon::parse($data['booking_date'] . ' ' . $data['time_slot']);

        // 3. Create the appointment record
        return $service->appointments()->create([
            'user_id'            => auth()->id(),
            'service_package_id' => $package->id,
            'name'               => auth()->user()->name,
            'email'              => auth()->user()->email,
            'phone'              => auth()->user()->phone,
            'scheduled_at'       => $scheduledAt,
            'price'              => $package->price, // Uses package price (not user input)
            'topic'              => $package->title, // Automatically sets topic to package name
            'notes'              => $data['notes'] ?? null,
            'status'             => 'pending',
        ]);
    }

    public function createQuote(array $data, Service $service): ServiceQuote
    {
        // 1. Resolve the package
        $package = ServicePackage::find($data['service_package_id']);
        
        // 2. Format the 'details' text field safely
        // We use ?? to handle the case where 'notes' might be missing from the array
        $clientNotes = $data['notes'] ?? 'No additional notes provided.';
        
        $detailsText = "Package: " . ($package->title ?? 'N/A') . "\n";
        $detailsText .= "Project Scale/Size: " . ($data['scope_size'] ?? 'N/A') . "\n";
        $detailsText .= "Client Notes: " . $clientNotes;

        // 3. Create the Quote record
        return $service->quotes()->create([
            'user_id'            => auth()->id(),
            'service_package_id' => $data['service_package_id'],
            'scope_size'         => $data['scope_size'],
            'requested_date'     => $data['target_date'],
            'details'            => $detailsText, // Storing the formatted string we built above
            'status'             => 'pending',
        ]);
    }
}
