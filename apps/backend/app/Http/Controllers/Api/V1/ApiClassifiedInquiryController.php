<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ClassifiedInquiryResource;
use App\Models\Classified;
use App\Models\ClassifiedInquiry;
use App\Services\ClassifiedInquiryService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ApiClassifiedInquiryController extends Controller
{
    public function __construct(
        protected ClassifiedInquiryService $inquiryService,
    ) {
    }

    public function store(Request $request, string $slug): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'message' => ['nullable', 'string', 'max:2000'],
            'offer_price' => ['nullable', 'string', 'max:100'],
        ]);

        try {
            $buyer = $request->user('sanctum');
            $classified = Classified::where('slug', $slug)
                ->visibleTo($buyer)
                ->firstOrFail();

            $inquiry = $this->inquiryService->createInquiry($classified, [
                ...$validated,
                'user_id' => $buyer?->id,
            ]);

            return $this->successResponse(
                new ClassifiedInquiryResource($inquiry->load(['classifiedAd', 'user'])),
                __('Your inquiry has been sent to the seller.'),
                201,
            );
        } catch (Exception $e) {
            Log::error('API classified inquiry failed: ' . $e->getMessage());

            return $this->errorResponse(__('Failed to submit inquiry. Please try again.'), 500);
        }
    }

    public function show(ClassifiedInquiry $inquiry): JsonResponse
    {
        return $this->successResponse(
            new ClassifiedInquiryResource($inquiry->load(['classifiedAd', 'user'])),
        );
    }
}
