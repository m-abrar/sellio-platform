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
 * * Manages administrative tasks for property-specific bookings, including
 * filtering, calendar availability visualization, and status management.
 */
class PropertyBookingController extends Controller
{
    /**
     * @var PropertyBooking
     */
    protected $model;

    /**
     * PropertyBookingController constructor.
     * * @param PropertyBooking $model
     */
    public function __construct(PropertyBooking $model)
    {
        $this->model = $model;
    }

    /**
     * Display a listing of property bookings with advanced filters.
     *
     * @param Request $request
     * @param string $status
     * @return View
     */
    public function index(Request $request, string $status = 'all'): View
    {
        $status = $request->route('status') ?: ($request->status ?: 'all');

        $bookings = $this->model::with(['property', 'user'])
            ->when($request->property, fn($q) => $q->where('property_id', $request->property))
            ->when($status !== 'all', fn($q) => $q->where('status', $status))
            ->when($request->start_date, fn($q) => $q->where('check_in_date', '>=', $request->start_date))
            ->when($request->end_date, fn($q) => $q->where('check_out_date', '<=', $request->end_date))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $properties = Property::select('id', 'title')->get();

        return view('admin.property-bookings.index', compact('bookings', 'properties', 'status'));
    }

    /**
     * Display the specified property booking details.
     * * This method eager loads the property, the customer, and any associated 
     * polymorphic payments or transaction lines to provide a comprehensive 
     * financial overview in the detail view.
     * * @param int $id
     * @return View
     */
    public function show(int $id): View
    {
        $booking = $this->model::with([
            'property', 
            'user', 
            'payments', 
            'transactionLines' // Relationship defined in your model
        ])->findOrFail($id);

        return view('admin.property-bookings.show', compact('booking'));
    }

    /**
     * Show the form for creating a new property booking.
     * * @return View
     */
    public function create(): View
    {
        $booking = new PropertyBooking();
        $properties = Property::all();
        $users = User::all();
        return view('admin.property-bookings.form', compact('booking', 'properties', 'users'));
    }

    /**
     * Store a newly created property booking.
     * * @param UpdatePropertyBookingRequest $request
     * @return RedirectResponse
     */
    public function store(UpdatePropertyBookingRequest $request): RedirectResponse
    {
        $booking = $this->model::create($request->validated());

        return redirect()
            ->route('admin.property-bookings.edit', $booking->id)
            ->with('success', __('Booking created successfully.'));
    }

    /**
     * Show the edit form with an availability calendar for the property.
     * * @param int $id
     * @return View
     */
    public function edit(int $id): View
    {
        $booking = $this->model::findOrFail($id);
        $properties = Property::all();
        $users = User::all();

        $statusColors = [
            'confirmed' => '#bbf7d0',
            'pending'   => '#fde68a',
            'cancelled' => '#fecaca',
        ];

        // Fetch sibling bookings to build availability calendar
        $calendarEvents = $this->model::where('property_id', $booking->property_id)
            ->where('id', '!=', $booking->id)
            ->get()
            ->map(function ($b) use ($statusColors) {
                return [
                    'start' => Carbon::parse($b->check_in_date)->toDateString(),
                    'end'   => Carbon::parse($b->check_out_date)->toDateString(),
                    'color' => $statusColors[$b->status] ?? '#e5e7eb',
                    'title' => $b->full_name ?? __('Booked'),
                ];
            });

        // Highlight the current booking being edited
        $calendarEvents->push([
            'start' => Carbon::parse($booking->check_in_date)->toDateString(),
            'end'   => Carbon::parse($booking->check_out_date)->toDateString(),
            'color' => '#93c5fd', // Soft Blue
            'title' => ($booking->full_name ?? __('Current Selection')) . ' ' . __('(Editing)'),
        ]);

        return view('admin.property-bookings.form', compact('booking', 'properties', 'users', 'calendarEvents'));
    }

    /**
     * Update the specified property booking.
     * * @param UpdatePropertyBookingRequest $request
     * @param int $id
     * @return RedirectResponse
     */
    public function update(UpdatePropertyBookingRequest $request, int $id): RedirectResponse
    {
        $booking = $this->model::findOrFail($id);
        $booking->update($request->validated());

        return redirect()
            ->route('admin.property-bookings.index')
            ->with('success', __('Booking updated successfully.'));
    }

    /**
     * Remove the specified property booking.
     * * @param int $id
     * @return RedirectResponse
     */
    public function destroy(int $id): RedirectResponse
    {
        $booking = $this->model::findOrFail($id);
        $booking->delete();

        return redirect()
            ->route('admin.property-bookings.index')
            ->with('success', __('Booking deleted successfully.'));
    }
}
