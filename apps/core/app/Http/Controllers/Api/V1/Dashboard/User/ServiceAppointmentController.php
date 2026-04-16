<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\ServiceAppointment;
use Illuminate\Http\Request;
use App\Http\Resources\ServiceAppointmentResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class ServiceAppointmentController extends Controller
{
    /**
     * Display a listing of the user's service appointments.
     */
    public function index() {
        $user = Auth::user();

        $appointments = ServiceAppointment::where('user_id', $user->id)
            ->with(['service.provider'])
            ->latest()
            ->paginate(10);

        return $this->successResponse(ServiceAppointmentResource::collection($appointments));
    }
}
