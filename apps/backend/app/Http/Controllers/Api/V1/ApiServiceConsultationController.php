<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceAppointmentResource;
use App\Models\Service;
use App\Models\ServiceAppointment;
use App\Services\ServiceManagementService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ApiServiceConsultationController extends Controller
{
    public function __construct(
        protected ServiceManagementService $serviceManagement,
    ) {
    }

    public function store(Request $request, Service $service): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'preferred_date' => ['nullable', 'date', 'after_or_equal:today'],
            'requirements' => ['nullable', 'string', 'max:1000'],
            'topic' => ['nullable', 'string', 'max:255'],
        ]);

        try {
            $appointment = $this->serviceManagement->createGuestConsultation([
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'preferred_date' => $validated['preferred_date'] ?? null,
                'requirements' => $validated['requirements'] ?? null,
                'topic' => $validated['topic'] ?? __('Service consultation'),
            ], $service);

            return $this->successResponse(
                new ServiceAppointmentResource($appointment->load('service')),
                __('Your consultation request has been sent to the provider.'),
                201,
            );
        } catch (Exception $e) {
            Log::error('API service consultation failed: ' . $e->getMessage());

            return $this->errorResponse(__('Failed to submit consultation request. Please try again.'), 500);
        }
    }

    public function show(ServiceAppointment $appointment): JsonResponse
    {
        return $this->successResponse(
            new ServiceAppointmentResource($appointment->load('service')),
        );
    }
}
