<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Http\Resources\PaymentResource;
use Illuminate\Support\Facades\Auth;

/**
 * Class PaymentController
 * Orchestrates the administrative discovery and retrieval of payment transactions
 * for the authenticated partner, providing centralized access to financial history.
 */
class PaymentController extends Controller
{
    /**
     * Retrieve a paginated collection of payment records for the authenticated partner.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $user = Auth::user();

        $payments = Payment::where('user_id', $user->id)
                           ->with('payable')
                           ->latest()
                           ->paginate(10);
        
        return $this->successResponse(PaymentResource::collection($payments));
    }
}
