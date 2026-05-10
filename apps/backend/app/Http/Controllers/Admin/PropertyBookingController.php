<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PropertyBooking;
use App\Models\Property;
use App\Models\User;
use App\Http\Requests\Dashboard\Admin\UpdatePropertyBookingRequest;
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
     * Display a filtered and paginated listing of all property bookings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $status
     * @return \Illuminate\View\View
     */
    public function index(Request $request, string $status = 'all'): View
    {
        $status = $request->route('status') ?: ($request->query('status') ?: 'all');

        $bookings = PropertyBooking::with(['property', 'user'])
            ->when($request->query('property'), fn($q) => $q->where('property_id', $request->query('property')))
            ->when($status !== 'all', fn($q) => $q->where('status', $status))
            ->when($request->query('start_date'), fn($q) => $q->where('check_in_date', '>=', $request->query('start_date')))
            ->when($request->query('end_date'), fn($q) => $q->where('check_out_date', '<=', $request->query('end_date')))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        // Performance: Cap selection to prevent memory exhaustion in high-volume environments.
        $properties = Property::select('id', 'title')->limit(100)->get();

        return view('admin.property-bookings.index', compact('bookings', 'properties', 'status'));
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
        $booking = PropertyBooking::create($request->validated());

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

        $statusColors = [
            'confirmed' => '#bbf7d0',
            'pending'   => '#fde68a',
            'cancelled' => '#fecaca',
        ];

        // Hydrate Sibling Bookings: Build the availability map for the host property
        $calendarEvents = PropertyBooking::where('property_id', $propertyBooking->property_id)
            ->where('id', '!=', $propertyBooking->id)
            ->get()
            ->map(function ($b) use ($statusColors) {
                return [
                    'start' => Carbon::parse($b->check_in_date)->toDateString(),
                    'end'   => Carbon::parse($b->check_out_date)->toDateString(),
                    'color' => $statusColors[$b->status] ?? '#e5e7eb',
                    'title' => $b->full_name ?? __('Booked'),
                ];
            });

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
        $propertyBooking->update($request->validated());

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
        $propertyBooking->delete();

        return redirect()
            ->route('admin.property-bookings.index')
            ->with('success', __('Booking record removed successfully.'));
    }
}
