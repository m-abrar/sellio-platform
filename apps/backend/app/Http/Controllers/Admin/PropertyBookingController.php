<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PropertyBooking;
use App\Models\Property;
use App\Models\User;
use App\Http\Requests\Dashboard\Admin\UpdatePropertyBookingRequest;
use App\Services\Admin\PropertyBookingManagementService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Support\Carbon;

/**
 * Class PropertyBookingController
 * Orchestrates administrative reservations for the real estate vertical, managing 
 * listing availability, calendar visualization, and financial status reconciliation.
 */
class PropertyBookingController extends Controller
{
    /**
     * @var PropertyBookingManagementService
     */
    protected PropertyBookingManagementService $bookingService;

    /**
     * PropertyBookingController constructor.
     *
     * @param PropertyBookingManagementService $bookingService
     */
    public function __construct(PropertyBookingManagementService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    /**
     * Display a filtered and paginated listing of all property bookings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $status
     * @return \Illuminate\View\View
     */
    public function index(Request $request, string $status = 'all'): View
    {
        $status = $request->route('status') ?: ($request->query('status') ?: 'all');
        $filters = array_merge($request->only(['property', 'start_date', 'end_date']), ['status' => $status]);

        return $this->renderIndex($filters, $status);
    }

    /**
     * Display property bookings scoped to one specific property.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Property  $property
     * @param  string  $status
     * @return \Illuminate\View\View
     */
    public function forProperty(Request $request, Property $property, string $status = 'all'): View
    {
        $status = $request->route('status') ?: ($request->query('status') ?: 'all');
        $filters = array_merge($request->only(['start_date', 'end_date']), [
            'property' => $property->id,
            'status' => $status,
        ]);

        return $this->renderIndex($filters, $status, $property);
    }

    /**
     * Render the shared property bookings index view.
     *
     * @param array $filters
     * @param string $status
     * @param \App\Models\Property|null $selectedProperty
     * @return \Illuminate\View\View
     */
    private function renderIndex(array $filters, string $status, ?Property $selectedProperty = null): View
    {
        $bookings = $this->bookingService->getBookings($filters);

        // Performance: Cap selection to prevent memory exhaustion in high-volume environments.
        // RECOMMENDATION: Replace with AJAX search for true scalability
        $properties = Property::select('id', 'title')->limit(100)->get();

        return view('admin.property-bookings.index', compact('bookings', 'properties', 'status', 'selectedProperty'));
    }

    /**
     * Display the comprehensive details and financial ledger of a specific property booking.
     *
     * @param  \App\Models\PropertyBooking  $propertyBooking
     * @return \Illuminate\View\View
     */
    public function show(PropertyBooking $propertyBooking): View
    {
        $propertyBooking->load([
            'property', 
            'user', 
            'payments', 
            'transactionLines'
        ]);

        return view('admin.property-bookings.show', ['booking' => $propertyBooking]);
    }

    /**
     * Show the form for creating a manual property reservation record.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $booking = new PropertyBooking();
        // Performance: Cap selection to prevent memory exhaustion.
        $properties = Property::select('id', 'title')->limit(100)->get();
        $users = User::select('id', 'name', 'email')->limit(100)->get();
        
        return view('admin.property-bookings.form', compact('booking', 'properties', 'users'));
    }

    /**
     * Store a newly created property booking record in the database.
     *
     * @param  \App\Http\Requests\Dashboard\Admin\UpdatePropertyBookingRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(UpdatePropertyBookingRequest $request): RedirectResponse
    {
        $booking = $this->bookingService->createBooking($request->validated());

        return redirect()
            ->route('admin.property-bookings.edit', $booking->id)
            ->with('success', __('Booking initialized successfully.'));
    }

    /**
     * Show the form for editing an existing property booking with an integrated availability calendar.
     *
     * @param  \App\Models\PropertyBooking  $propertyBooking
     * @return \Illuminate\View\View
     */
    public function edit(PropertyBooking $propertyBooking): View
    {
        // Performance: Cap selection to prevent memory exhaustion.
        $properties = Property::select('id', 'title')->limit(100)->get();
        $users = User::select('id', 'name', 'email')->limit(100)->get();

        // Hydrate Sibling Bookings: Build the availability map for the host property
        $calendarEvents = $this->bookingService->getCalendarEvents($propertyBooking->property_id, $propertyBooking->id);

        // Interactive Highlight: Emphasize the current booking context
        $calendarEvents->push([
            'start' => Carbon::parse($propertyBooking->check_in_date)->toDateString(),
            'end'   => Carbon::parse($propertyBooking->check_out_date)->toDateString(),
            'color' => '#93c5fd', 
            'title' => ($propertyBooking->full_name ?? __('Current Selection')) . ' ' . __('(Editing)'),
        ]);

        return view('admin.property-bookings.form', [
            'booking'        => $propertyBooking, 
            'properties'     => $properties, 
            'users'          => $users, 
            'calendarEvents' => $calendarEvents
        ]);
    }

    /**
     * Update an existing property booking and synchronize its reservation parameters.
     *
     * @param  \App\Http\Requests\Dashboard\Admin\UpdatePropertyBookingRequest  $request
     * @param  \App\Models\PropertyBooking  $propertyBooking
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdatePropertyBookingRequest $request, PropertyBooking $propertyBooking): RedirectResponse
    {
        $this->bookingService->updateBooking($propertyBooking, $request->validated());

        return redirect()
            ->route('admin.property-bookings.index')
            ->with('success', __('Booking parameters updated successfully.'));
    }

    /**
     * Remove a property booking record from the database.
     *
     * @param  \App\Models\PropertyBooking  $propertyBooking
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(PropertyBooking $propertyBooking): RedirectResponse
    {
        $this->bookingService->deleteBooking($propertyBooking);

        return redirect()
            ->route('admin.property-bookings.index')
            ->with('success', __('Booking record removed successfully.'));
    }
}
