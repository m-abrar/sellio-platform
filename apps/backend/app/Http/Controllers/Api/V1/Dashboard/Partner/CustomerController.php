<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Http\Resources\Partner\CustomerResource;
use App\Services\Partner\CustomerService;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller
{
    public function __construct(private CustomerService $customerService)
    {
    }

    public function index()
    {
        $customers = $this->customerService->list(Auth::user());

        return $this->successResponse(CustomerResource::collection($customers));
    }

    public function show(string $customerKey)
    {
        $customer = $this->customerService->find(Auth::user(), urldecode($customerKey));

        if (!$customer) {
            return $this->errorResponse(__('Customer not found.'), 404);
        }

        return $this->successResponse(new CustomerResource($customer));
    }
}
