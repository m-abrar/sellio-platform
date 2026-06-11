<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AutoInquiryResource;
use App\Models\Auto;
use App\Services\AutoInquiryService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ApiAutoInquiryController extends Controller
{
    public function __construct(
        protected AutoInquiryService $inquiryService,
    ) {
    }

    public function store(Request $request, Auto $auto): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'message' => ['nullable', 'string', 'max:500'],
            'preferred_date' => ['nullable', 'date', 'after:today'],
            'preferred_time' => ['nullable', 'string', 'in:AM,PM,Anytime'],
        ]);

        try {
            $inquiry = $this->inquiryService->createInquiry($auto, [
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'preferred_date' => $validated['preferred_date']
                    ?? Carbon::now()->addDays(3)->toDateString(),
                'preferred_time' => $validated['preferred_time'] ?? 'Anytime',
                'message' => $validated['message'] ?? null,
            ]);

            return $this->successResponse(
                new AutoInquiryResource($inquiry->load('auto')),
                __('Your inquiry has been sent to the dealer.'),
                201,
            );
        } catch (Exception $e) {
            Log::error('API auto inquiry failed: ' . $e->getMessage());

            return $this->errorResponse(__('Failed to submit inquiry. Please try again.'), 500);
        }
    }
}
