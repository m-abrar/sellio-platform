<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceAppointment;
use Illuminate\View\View;

class ServiceAppointmentController extends Controller
{
    /**
     * Display a listing of service appointments with advanced filters.
     */
    public function index(\Illuminate\Http\Request $request, string $status = 'all'): View
    {
        $appointments = ServiceAppointment::with(['service.category', 'user'])
            ->when($request->service, fn($q) => $q->where('service_id', $request->service))
            ->when($request->status && $request->status !== 'all', fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $services = \App\Models\Service::select('id', 'title')->get();
        $categories = \App\Models\Category::where('is_service', true)->select('id', 'title')->get();

        return view('admin.service-appointments.index', compact('appointments', 'services', 'categories', 'status'));
    }

    /**
     * Show the form for creating a new appointment.
     */
    public function create(): View
    {
        $appointment = new ServiceAppointment();
        $services = \App\Models\Service::select('id', 'title')->get();
        $users = \App\Models\User::select('id', 'name', 'email')->get();
        
        return view('admin.service-appointments.form', compact('appointment', 'services', 'users'));
    }

    /**
     * Store a newly created appointment.
     */
    public function store(\Illuminate\Http\Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'scheduled_at' => 'required|date',
            'status' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        ServiceAppointment::create($validated);

        return redirect()
            ->route('admin.service-appointments.index')
            ->with('success', __('Appointment created successfully.'));
    }

    /**
     * Display the specified appointment.
     */
    public function show(int $id): View
    {
        $appointment = ServiceAppointment::with(['service', 'user'])
            ->findOrFail($id);

        if (!$appointment->viewed_at) {
            $appointment->update(['viewed_at' => now()]);
        }

        return view('admin.service-appointments.show', compact('appointment'));
    }

    /**
     * Show the form for editing the appointment.
     */
    public function edit(int $id): View
    {
        $appointment = ServiceAppointment::findOrFail($id);
        $services = \App\Models\Service::select('id', 'title')->get();
        $users = \App\Models\User::select('id', 'name', 'email')->get();

        return view('admin.service-appointments.form', compact('appointment', 'services', 'users'));
    }

    /**
     * Update the specified appointment.
     */
    public function update(\Illuminate\Http\Request $request, int $id): \Illuminate\Http\RedirectResponse
    {
        $appointment = ServiceAppointment::findOrFail($id);

        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'scheduled_at' => 'required|date',
            'status' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $appointment->update($validated);

        return redirect()
            ->route('admin.service-appointments.index')
            ->with('success', __('Appointment updated successfully.'));
    }

    /**
     * Remove the specified appointment.
     */
    public function destroy(int $id): \Illuminate\Http\RedirectResponse
    {
        $appointment = ServiceAppointment::findOrFail($id);
        $appointment->delete();

        return redirect()
            ->route('admin.service-appointments.index')
            ->with('success', __('Appointment deleted successfully.'));
    }
}
