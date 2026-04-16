<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyVisit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;

class PropertyVisitController extends Controller
{
    public function create(Property $property)
    {
        if (!$property->is_sale) {
            return redirect()
                ->route('properties.show', $property->slug)
                ->with('error', 'This property is not currently available for viewing appointments.');
        }

        return view('frontend.properties.visits.create', compact('property'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => ['required', 'exists:properties,id'],
            'scheduled_at' => ['required', 'date', 'after:now'], 
            'notes' => ['nullable', 'string', 'max:500'],
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        $property = Property::findOrFail($validated['property_id']);

        if (!$property->is_sale) {
            return back()->with('error', 'Cannot schedule a visit for a rental property.');
        }

        // Log the 'lead' action
        activity('listings')
           ->performedOn($property)
           ->by(auth()->user())
           ->log('submitted_lead'); // description: 'submitted_lead' (This is our 'lead' metric)

        try {
            $visit = PropertyVisit::create([
                'user_id' => Auth::id() ?? null,
                'property_id' => $property->id,
                'scheduled_at' => $validated['scheduled_at'],
                'status' => 'scheduled',
                'notes' => $validated['notes'],
                'full_name' => $validated['full_name'], 
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
            ]);

            $message = '✅ Your viewing appointment has been successfully scheduled for ' . 
                       $visit->scheduled_at->format('F jS, Y \a\t h:i A') . '.';

            return redirect()
                ->route('property.visit.show', ['property' => $property->slug, 'visit' => $visit->id])
                ->with('success', $message);

        } catch (Exception $e) {
            \Log::error("Property visit scheduling failed: " . $e->getMessage());

            return back()
                ->withInput()
                ->with('error', '❌ A system error occurred while scheduling your visit. Please try again.');
        }
    }

    public function show(Property $property, PropertyVisit $visit)
    {
        if ($visit->property_id !== $property->id) {
            abort(404);
        }

        if (Auth::check() && Auth::id() !== $visit->user_id && $visit->user_id !== null) {
            abort(403, 'Unauthorized access to this visit record.');
        }
        
        return view('frontend.properties.visits.confirmation', compact('property', 'visit'));
    }

    public function cancel(Property $property, PropertyVisit $visit)
    {
        if ($visit->property_id !== $property->id) {
            abort(404);
        }

        if (!Auth::check() || (Auth::id() !== $visit->user_id && $visit->user_id !== null)) {
            abort(403, 'You do not have permission to cancel this visit.');
        }

        if ($visit->status === 'scheduled' || $visit->status === 'rescheduled') {
            $visit->status = 'cancelled';
            $visit->save();

            return redirect()
                ->route('properties.show', $property->slug)
                ->with('success', 'Appointment successfully cancelled.');
        }

        return back()->with('warning', 'This appointment cannot be cancelled because its status is already ' . $visit->status . '.');
    }
}
