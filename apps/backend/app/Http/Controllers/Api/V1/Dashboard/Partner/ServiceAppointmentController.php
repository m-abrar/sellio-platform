<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Models\ServiceAppointment;
use App\Http\Resources\ServiceAppointmentResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

/**
 * Class ServiceAppointmentController
 *
 * Handles scheduling and appointments for services provided by the partner.
 */
class ServiceAppointmentController extends Controller
{
    /**
     * @var ServiceAppointment
     */
    protected $appointment;

    /**
     * ServiceAppointmentController constructor.
     *
     * @param ServiceAppointment $appointment
     */
    public function __construct(ServiceAppointment $appointment)
    {
        $this->appointment = $appointment;
    }

    /**
     * Display a listing of appointments for the partner's services.
     *
     * @return View
     */
    public function index() {
        $user = Auth::user();

        /** * Retrieve IDs of services owned by the partner 
         * to filter the appointments table.
         */
        $serviceListingIds = $user->services()->pluck('id');

        $serviceAppointments = $this->appointment::whereIn('service_id', $serviceListingIds)
            ->with(['service' => function ($query) {
                $query->select('id', 'name', 'slug', 'category_id');
            }])
            ->latest()
            ->paginate(10);

        return $this->successResponse(ServiceAppointmentResource::collection($serviceAppointments));
    }

    /**
     * Display details of a specific appointment.
     *
     * @param ServiceAppointment $serviceAppointment
     * @return View
     */
    public function show(ServiceAppointment $serviceAppointment) {
        $this->authorizeOwner($serviceAppointment);

        return $this->successResponse([
            'appointment' => $serviceAppointment->load('service')
        ]);
    }

    /**
     * Update the appointment status.
     *
     * @param ServiceAppointment $serviceAppointment
     * @param string $status
     * @return RedirectResponse
     */
    public function updateStatus(ServiceAppointment $serviceAppointment, string $status) {
        $this->authorizeOwner($serviceAppointment);

        // Optional: Validate status against a predefined list (e.g., confirmed, cancelled)
        $serviceAppointment->update(['status' => $status]);

        return $this->successResponse(null, __('Appointment status updated to :status.', ['status' => $status]));
    }

    /**
     * Remove the specified appointment.
     *
     * @param ServiceAppointment $serviceAppointment
     * @return RedirectResponse
     */
    public function destroy(ServiceAppointment $serviceAppointment) {
        $this->authorizeOwner($serviceAppointment);

        $serviceAppointment->delete();

        return $this->successResponse(null, __('Appointment record deleted successfully.'));
    }

    /**
     * Authorize that the partner owns the service associated with the appointment.
     *
     * @param ServiceAppointment $appointment
     * @return void
     */
    protected function authorizeOwner(ServiceAppointment $appointment): void
    {
        if (Auth::id() !== $appointment->service->user_id) {
            abort(403, __('Unauthorized access to this appointment record.'));
        }
    }
}
