<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyVisitResource;
use App\Models\Property;
use App\Services\PropertyVisitService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ApiPropertyLeadController extends Controller
{
    public function __construct(
        protected PropertyVisitService $visitService,
    ) {
    }

    public function store(Request $request, Property $property): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'message' => ['nullable', 'string', 'max:500'],
            'check_in' => ['nullable', 'date'],
            'check_out' => ['nullable', 'date', 'after:check_in'],
            'scheduled_at' => ['nullable', 'date', 'after:now'],
        ]);

        try {
            if ($property->is_rental && !$property->is_sale) {
                return $this->errorResponse(__('Use the booking endpoint for rental reservations.'), 422);
            }

            $notes = $validated['message'] ?? null;
            if (!empty($validated['check_in']) || !empty($validated['check_out'])) {
                $notes = trim(($notes ? $notes . "\n\n" : '') . __('Preferred stay: :in to :out', [
                    'in' => $validated['check_in'] ?? '—',
                    'out' => $validated['check_out'] ?? '—',
                ]));
            }

            $visit = $this->visitService->scheduleVisit($property, [
                'scheduled_at' => $validated['scheduled_at']
                    ?? Carbon::now()->addDays(3)->setTime(10, 0)->toDateTimeString(),
                'notes' => $notes,
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
            ]);

            return $this->successResponse(
                new PropertyVisitResource($visit->load('property')),
                __('Your inquiry has been sent to the listing agent.'),
                201,
            );
        } catch (Exception $e) {
            Log::error('API property inquiry failed: ' . $e->getMessage());

            return $this->errorResponse(__('Failed to submit inquiry. Please try again.'), 500);
        }
    }
}
