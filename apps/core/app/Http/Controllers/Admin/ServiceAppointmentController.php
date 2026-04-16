<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceAppointment;
use Illuminate\View\View;

class ServiceAppointmentController extends Controller
{
    /**
     * Display the service appointment aligned with the migration.
     */
    public function show(int $id): View
    {
        $appointment = ServiceAppointment::with(['service', 'user'])
            ->findOrFail($id);

        // Logic to track viewed status
        if (!$appointment->viewed_at) {
            $appointment->update(['viewed_at' => now()]);
        }

        return view('admin.service-appointments.show', compact('appointment'));
    }
}
