<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use App\Http\Resources\PaymentResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class PaymentController extends Controller
{
    /**
     * Display a listing of the user's payment history.
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
