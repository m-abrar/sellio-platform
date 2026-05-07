<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyVisit;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\View\View;

/**
 * Class PropertyVisitController
 * Orchestrates the scheduling, management, and cancellation of physical property viewing appointments.
 * Serves as a primary lead generation engine for sale-type listings.
 */
class PropertyVisitController extends Controller
{
    /**
     * Display the viewing appointment creation form for a specific property.
     *
     * @param  \App\Models\Property  $property
     * @return \Illuminate\View\View|\Illuminate\Http\RedirectResponse
     */
    public function create(Property $property): View|RedirectResponse
    {
        if (!$property->is_sale) {
            return redirect()
                ->route('properties.show', $property->slug)
                ->with('error', __('This property is not currently available for viewing appointments.'));
        }

        return view('frontend.properties.visits.create', compact('property'));
    }

    /**
     * Store a newly scheduled property visit and record lead generation activity.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'property_id'  => ['required', 'exists:properties,id'],
            'scheduled_at' => ['required', 'date', 'after:now'], 
            'notes'        => ['nullable', 'string', 'max:500'],
            'full_name'    => ['required', 'string', 'max:255'],
            'email'        => ['required', 'email', 'max:255'],
            'phone'        => ['nullable', 'string', 'max:20'],
        ]);

        $property = Property::findOrFail($validated['property_id']);

        if (!$property->is_sale) {
            return back()->with('error', __('Cannot schedule a visit for a rental property.'));
        }

        // Log the 'lead' activity for performance analytics
        activity('listings')
           ->performedOn($property)
           ->by(Auth::user())
           ->log('submitted_lead');

        try {
            $visit = PropertyVisit::create([
                'user_id'      => Auth::id(),
                'property_id'  => $property->id,
                'scheduled_at' => $validated['scheduled_at'],
                'status'       => 'scheduled',
                'notes'        => $validated['notes'],
                'full_name'    => $validated['full_name'], 
                'email'        => $validated['email'],
                'phone'        => $validated['phone'] ?? null,
            ]);

            $message = __('✅ Your viewing appointment has been successfully scheduled for :date.', [
                'date' => $visit->scheduled_at->format('F jS, Y \a\t h:i A')
            ]);

            return redirect()
                ->route('property.visit.show', ['property' => $property->slug, 'visit' => $visit->id])
                ->with('success', $message);

        } catch (Exception $e) {
            Log::error("Property visit scheduling failed: " . $e->getMessage());

            return back()
                ->withInput()
                ->with('error', __('❌ A system error occurred while scheduling your visit. Please try again.'));
        }
    }

    /**
     * Display a specific visit confirmation record.
     *
     * @param  \App\Models\Property  $property
     * @param  \App\Models\PropertyVisit  $visit
     * @return \Illuminate\View\View
     */
    public function show(Property $property, PropertyVisit $visit): View
    {
        if ($visit->property_id !== $property->id) {
            abort(404);
        }

        if (Auth::check() && Auth::id() !== $visit->user_id && $visit->user_id !== null) {
            abort(403, __('Unauthorized access to this visit record.'));
        }
        
        return view('frontend.properties.visits.confirmation', compact('property', 'visit'));
    }

    /**
     * Cancel an existing property visit appointment.
     *
     * @param  \App\Models\Property  $property
     * @param  \App\Models\PropertyVisit  $visit
     * @return \Illuminate\Http\RedirectResponse
     */
    public function cancel(Property $property, PropertyVisit $visit): RedirectResponse
    {
        if ($visit->property_id !== $property->id) {
            abort(404);
        }

        if (!Auth::check() || (Auth::id() !== $visit->user_id && $visit->user_id !== null)) {
            abort(403, __('You do not have permission to cancel this visit.'));
        }

        if ($visit->status === 'scheduled' || $visit->status === 'rescheduled') {
            $visit->status = 'cancelled';
            $visit->save();

            return redirect()
                ->route('properties.show', $property->slug)
                ->with('success', __('Appointment successfully cancelled.'));
        }

        return back()->with('warning', __('This appointment cannot be cancelled because its status is already :status.', [
            'status' => $visit->status
        ]));
    }
}
