<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use App\Http\Resources\PaymentResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

/**
 * Class PaymentController
 * Orchestrates the user-facing discovery and retrieval of payment transactions,
 * providing centralized access to financial history and polymorphic billing metadata.
 */
class PaymentController extends Controller
{
    /**
     * Retrieve a paginated collection of payment records for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index() {
        $user = Auth::user();

        $payments = Payment::where('user_id', $user->id)
            ->with(['payable']) // Eager load the polymorphic relationship
            ->latest()
            ->paginate(10);
        
        // Corrected view path to match the User namespace
        return $this->successResponse(PaymentResource::collection($payments));
    }
}
