<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceAppointment;
use App\Models\User;
use App\Models\Category;
use App\Services\Admin\ServiceAppointmentManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class ServiceAppointmentController
 * Orchestrates administrative scheduling for professional services, 
 * managing appointment lifecycle, provider coordination, and read-receipt tracking.
 */
class ServiceAppointmentController extends Controller
{
    /**
     * @var ServiceAppointmentManagementService
     */
    protected ServiceAppointmentManagementService $appointmentService;

    /**
     * ServiceAppointmentController constructor.
     *
     * @param ServiceAppointmentManagementService $appointmentService
     */
    public function __construct(ServiceAppointmentManagementService $appointmentService)
    {
        $this->appointmentService = $appointmentService;
    }

    /**
     * Display a filtered and paginated listing of all service appointments.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $status
     * @return \Illuminate\View\View
     */
    public function index(Request $request, string $status = 'all'): View
    {
        $status = $request->query('status', $status);
        $filters = ['service' => $request->query('service'), 'status' => $status];

        $appointments = $this->appointmentService->getAppointments($filters);

        // Performance: Cap selection to prevent memory exhaustion in high-volume environments.
        // RECOMMENDATION: Replace with AJAX search for true scalability
        $services = Service::select('id', 'title')->limit(100)->get();
        $categories = Category::where('is_service', true)->select('id', 'title')->get();

        return view('admin.service-appointments.index', compact('appointments', 'services', 'categories', 'status'));
    }

    /**
     * Show the interface for initializing a new manual service appointment.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $appointment = new ServiceAppointment();
        // Performance: Cap selection to prevent memory exhaustion.
        $services = Service::select('id', 'title')->limit(100)->get();
        $users = User::select('id', 'name', 'email')->limit(100)->get();
        
        return view('admin.service-appointments.form', compact('appointment', 'services', 'users'));
    }

    /**
     * Store a newly created service appointment and initialize its lifecycle.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'service_id'   => 'required|exists:services,id',
            'user_id'      => 'required|exists:users,id',
            'name'         => 'required|string|max:255',
            'email'        => 'required|email',
            'phone'        => 'nullable|string|max:20',
            'scheduled_at' => 'required|date',
            'status'       => 'required|string|max:50',
            'notes'        => 'nullable|string',
        ]);

        $this->appointmentService->createAppointment($validated);

        return redirect()
            ->route('admin.service-appointments.index')
            ->with('success', __('Appointment created successfully.'));
    }

    /**
     * Display the comprehensive details of a specific service appointment and track read status.
     *
     * @param  \App\Models\ServiceAppointment  $serviceAppointment
     * @return \Illuminate\View\View
     */
    public function show(ServiceAppointment $serviceAppointment): View
    {
        $serviceAppointment->load(['service', 'user']);

        $this->appointmentService->markAsViewed($serviceAppointment);

        return view('admin.service-appointments.show', ['appointment' => $serviceAppointment]);
    }

    /**
     * Show the form for editing an existing service appointment.
     *
     * @param  \App\Models\ServiceAppointment  $serviceAppointment
     * @return \Illuminate\View\View
     */
    public function edit(ServiceAppointment $serviceAppointment): View
    {
        // Performance: Cap selection to prevent memory exhaustion.
        $services = Service::select('id', 'title')->limit(100)->get();
        $users = User::select('id', 'name', 'email')->limit(100)->get();

        return view('admin.service-appointments.form', [
            'appointment' => $serviceAppointment, 
            'services'    => $services, 
            'users'       => $users
        ]);
    }

    /**
     * Update an existing service appointment configuration and its scheduled parameters.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ServiceAppointment  $serviceAppointment
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, ServiceAppointment $serviceAppointment): RedirectResponse
    {
        $validated = $request->validate([
            'service_id'   => 'required|exists:services,id',
            'user_id'      => 'required|exists:users,id',
            'name'         => 'required|string|max:255',
            'email'        => 'required|email',
            'phone'        => 'nullable|string|max:20',
            'scheduled_at' => 'required|date',
            'status'       => 'required|string|max:50',
            'notes'        => 'nullable|string',
        ]);

        $this->appointmentService->updateAppointment($serviceAppointment, $validated);

        return redirect()
            ->route('admin.service-appointments.index')
            ->with('success', __('Appointment updated successfully.'));
    }

    /**
     * Remove a service appointment record from the database.
     *
     * @param  \App\Models\ServiceAppointment  $serviceAppointment
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(ServiceAppointment $serviceAppointment): RedirectResponse
    {
        $this->appointmentService->deleteAppointment($serviceAppointment);

        return redirect()
            ->route('admin.service-appointments.index')
            ->with('success', __('Appointment deleted successfully.'));
    }
}
