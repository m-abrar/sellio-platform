<?php

namespace App\Services;

use App\Models\Service;
use App\Models\ServicePackage;
use App\Models\ServiceAppointment;
use App\Models\ServiceQuote;
use App\Events\Partner\PartnerLeadCreated;
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
    protected function getExpertiseLevelsRaw(): array
    {
        return [
            1 => __('Beginner/Junior'),
            2 => __('Intermediate/Mid-level'),
            3 => __('Advanced/Senior'),
            4 => __('Expert/Master'),
        ];
    }

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
            ->with(['category', 'user.reviews', 'media'])
            ->paginate($filters['per_page'] ?? 12);
    }

    /**
     * Compile all data required for the service search/index page.
     *
     * @param array $filters
     * @param User|null $user
     * @return array
     */
    public function getSearchPageData(array $filters, ?User $user = null): array
    {
        // Define common vertical relations to count for the dashboard/sidebar
        $verticals = ['properties', 'autos', 'events', 'jobs', 'services', 'classifieds', 'products'];
        $locationVerticals = ['properties', 'autos', 'events', 'jobs', 'services', 'classifieds'];
        $tagVerticals = ['properties', 'autos', 'events', 'jobs', 'services', 'classifieds'];

        // Centralized taxonomy retrieval with active scope and eager-loaded counts
        $categories = \App\Models\Category::active()->where('is_service', true)->withCount($verticals)->get();
        $locations  = \App\Models\Location::active()->where('is_service', true)->withCount($locationVerticals)->get();
        $types      = \App\Models\Type::active()->where('is_service', true)->withCount($verticals)->get();
        $features   = \App\Models\Feature::active()->where('is_service', true)->get();
        $tags       = \App\Models\Tag::active()->where('is_service', true)->withCount($tagVerticals)->get();

        $services = $this->searchServices($filters, $user);

        return [
            'services'        => $services,
            'categories'      => $categories,
            'locations'       => $locations,
            'features'        => $features,
            'tags'            => $tags,
            'types'           => $types,
            'expertiseLevels' => $this->getExpertiseLevels(),
            'filters'         => $filters
        ];
    }

    /**
     * Get the expertise levels mapping.
     *
     * @return array
     */
    public function getExpertiseLevels(): array
    {
        return $this->getExpertiseLevelsRaw();
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
            'topic'   => $data['topic'] ?? __('General Consultation'),
            'notes'   => $data['notes'] ?? null,
            'status'  => 'pending',
            'price'   => $service->sale_price ?? $service->base_price,
        ])->tap(fn ($appointment) => PartnerLeadCreated::dispatch($appointment));
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
        $appointment = $service->appointments()->create([
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

        PartnerLeadCreated::dispatch($appointment);

        return $appointment;
    }

    /**
     * Create a new service quote record.
     *
     * @param array $data
     * @param Service $service
     * @return ServiceQuote
     */
    public function createQuote(array $data, Service $service): ServiceQuote
    {
        // 1. Resolve the package
        $package = ServicePackage::find($data['service_package_id']);
        
        // 2. Format the 'details' text field safely
        // We use ?? to handle the case where 'notes' might be missing from the array
        $clientNotes = $data['notes'] ?? __('No additional notes provided.');
        
        $detailsText = __("Package: :title", ['title' => $package->title ?? __('N/A')]) . "\n";
        $detailsText .= __("Project Scale/Size: :size", ['size' => $data['scope_size'] ?? __('N/A')]) . "\n";
        $detailsText .= __("Client Notes: :notes", ['notes' => $clientNotes]);

        // 3. Create the Quote record
        $quote = $service->quotes()->create([
            'user_id'            => auth()->id(),
            'service_package_id' => $data['service_package_id'],
            'scope_size'         => $data['scope_size'],
            'requested_date'     => $data['target_date'],
            'details'            => $detailsText,
            'status'             => 'pending',
        ]);

        PartnerLeadCreated::dispatch($quote);

        return $quote;
    }

    /**
     * Calculate estimated service price based on selected package and scale.
     *
     * @param Service $service
     * @param array $data
     * @return array
     */
    public function calculateServicePrice(Service $service, array $data): array
    {
        $packageId = $data['service_package_id'] ?? null;
        $package = $packageId ? ServicePackage::where('service_id', $service->id)->find($packageId) : null;
        
        $basePrice = $package ? (float) $package->price : (float) ($service->sale_price ?? $service->base_price);
        $multiplier = 1.0;

        // Optional: Add scale-based multipliers if scope_size is provided
        if (isset($data['scope_size'])) {
            $multiplier = match ($data['scope_size']) {
                'small'  => 1.0,
                'medium' => 1.5,
                'large'  => 2.5,
                'enterprise' => 5.0,
                default  => 1.0,
            };
        }

        $total = $basePrice * $multiplier;

        return [
            'base_price' => $basePrice,
            'multiplier' => $multiplier,
            'total'      => $total,
            'formatted_total' => number_format($total, 2),
        ];
    }
}
