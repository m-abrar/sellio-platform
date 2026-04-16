<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Category;
use App\Models\Location;
use App\Models\Feature;
use App\Models\Type;
use App\Models\Tag;
use App\Services\ServiceManagementService;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\StoreConsultationRequest;
use App\Http\Requests\StoreQuoteRequest;
use Illuminate\Http\Request;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;

/**
 * Class ServiceController
 *
 * Manages service discovery, detailed display, and appointment scheduling.
 */
class ServiceController extends Controller
{
    /**
     * @var ServiceManagementService
     */
    protected $serviceManagement;

    /**
     * ServiceController constructor.
     *
     * @param ServiceManagementService $serviceManagement
     */
    public function __construct(ServiceManagementService $serviceManagement)
    {
        $this->serviceManagement = $serviceManagement;
    }

    /**
     * Display the service listing.
     *
     * @param Request $request
     * @return View
     */
    public function index(Request $request): View
    {
        return $this->search($request);
    }

    /**
     * Perform service search with advanced filters.
     *
     * @param Request $request
     * @return View
     */
    public function search(Request $request): View
    {
        $categories = Category::where('is_service', true)->get();
        $locations  = Location::where('is_service', true)->get();
        $types      = Type::where('is_service', true)->get();
        $features   = Feature::where('is_service', true)->get(); 
        $tags       = Tag::where('is_service', true)->get();

        $services = $this->serviceManagement->searchServices($request->all());

        return view('frontend.services.index', [
            'services'        => $services,
            'categories'      => $categories,
            'locations'       => $locations,
            'features'        => $features,
            'tags'            => $tags,
            'types'           => $types,
            'expertiseLevels' => $this->serviceManagement->getExpertiseLevels(),
        ]);
    }

    /**
     * Show detailed information for a specific service.
     *
     * @param string $slug
     * @return View
     */
    public function show(string $slug): View
    {
        $service = Service::where('slug', $slug)
            ->with(['category', 'user.reviews', 'location', 'brand', 'features'])
            ->firstOrFail();

        $badges = [
            'featured'      => $service->is_featured,
            'subscription'  => $service->is_subscription,
            'project_based' => $service->is_project_based,
        ];

        $viewName = $this->serviceManagement->determineViewName($service);
        $appointments = collect([]); 

        return view("frontend.services.show.{$viewName}", compact(
            'service', 
            'badges', 
            'appointments'
        ));
    }

    /**
     * Store a newly created appointment.
     *
     * @param StoreAppointmentRequest $request
     * @param string $slug
     * @return RedirectResponse
     */
    public function consultationStore(StoreConsultationRequest $request, string $slug): RedirectResponse
    {
        $service = Service::where('slug', $slug)->firstOrFail();

        try {
            $this->serviceManagement->createConsultation($request->validated(), $service);

            return back()->with('success', __('Your consultation request has been saved successfully.'));
        } catch (\Exception $e) {
            Log::error("Consultation request failed for service ID {$service->id}: " . $e->getMessage());
            return back()->with('error', __('Something went wrong. Please try again.'));
        }
    }

    /**
     * Store a newly created appointment.
     *
     * @param StoreAppointmentRequest $request
     * @param string $slug
     * @return RedirectResponse
     */
    public function appointmentStore(StoreAppointmentRequest $request, string $slug): RedirectResponse
    {
        $service = Service::where('slug', $slug)->firstOrFail();

        try {
            $this->serviceManagement->createAppointment($request->validated(), $service);

            return back()->with('success', __('Your appointment request has been sent successfully.'));
        } catch (\Exception $e) {
            Log::error("Appointment failed for service ID {$service->id}: " . $e->getMessage());
            return back()->with('error', __('Something went wrong. Please try again.'));
        }
    }

    /**
     * Store a newly created service quote request.
     *
     * @param Request $request
     * @param string $slug
     * @return RedirectResponse
     */
    public function quoteStore(StoreQuoteRequest $request, string $slug): RedirectResponse
    {
        $service = Service::where('slug', $slug)->firstOrFail();

        // Use the validated data from the FormRequest
        // This ensures all keys defined in the rules exist in the array
        $validated = $request->validated();

        // Ensure 'notes' exists even if empty to prevent array key errors
        $validated['notes'] = $validated['notes'] ?? null;

        try {
            $this->serviceManagement->createQuote($validated, $service);

            return back()->with('success', __('Your quote request has been submitted. The provider will review your details shortly.'));
        } catch (\Exception $e) {
            Log::error("Quote creation failed: " . $e->getMessage());
            return back()->with('error', __('We could not process your request at this time.'));
        }
    }

    /**
     * Calculate service price based on dynamic parameters.
     *
     * @return void
     */
    public function calculatePrice()
    {
        // To be implemented based on your pricing logic
    }
}
