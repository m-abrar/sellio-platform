<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceQuoteResource;
use App\Models\Service;
use App\Services\ServiceManagementService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class ApiServiceQuoteController extends Controller
{
    public function __construct(
        protected ServiceManagementService $serviceManagement,
    ) {
    }

    public function store(Request $request, Service $service): JsonResponse
    {
        $service = Service::query()
            ->visibleTo($request->user())
            ->findOrFail($service->id);

        $validated = $request->validate([
            'service_package_id' => [
                'required',
                'integer',
                Rule::exists('service_packages', 'id')
                    ->where('service_id', $service->id)
                    ->where('is_active', true),
            ],
            'target_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
            'scope_size' => ['required', 'numeric', 'min:1'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        try {
            $quote = $this->serviceManagement->createQuote($validated, $service);

            return $this->successResponse(
                new ServiceQuoteResource($quote->load(['service', 'user'])),
                __('Your quote request has been sent to the provider.'),
                201,
            );
        } catch (Exception $e) {
            Log::error('API service quote failed: ' . $e->getMessage());

            return $this->errorResponse(__('Failed to submit quote request. Please try again.'), 500);
        }
    }
}
