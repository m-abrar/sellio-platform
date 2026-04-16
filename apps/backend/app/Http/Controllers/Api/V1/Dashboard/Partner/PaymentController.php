<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Http\Resources\PaymentResource;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
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
