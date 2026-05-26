<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\ServiceAppointment;
use Illuminate\Http\Request;
use App\Http\Resources\ServiceAppointmentResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

/**
 * Class ServiceAppointmentController
 * Orchestrates the user-facing discovery and retrieval of professional service appointments,
 * managing scheduled history and provider relationship metadata.
 */
class ServiceAppointmentController extends Controller
{
    /**
     * Retrieve a paginated collection of service appointments for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index() {
        $user = Auth::user();

        $appointments = ServiceAppointment::where('user_id', $user->id)
            ->with(['service.provider'])
            ->latest()
            ->paginate(10);

        return $this->successResponse(ServiceAppointmentResource::collection($appointments));
    }

    /**
     * Cancel a service appointment.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $appointment = ServiceAppointment::where('user_id', $user->id)->where('id', $id)->first();

        if (!$appointment) {
            return $this->errorResponse(__('Service appointment not found or unauthorized.'), 404);
        }

        $appointment->update(['status' => 'cancelled']);

        return $this->successResponse(null, __('Service appointment successfully cancelled.'));
    }
}
