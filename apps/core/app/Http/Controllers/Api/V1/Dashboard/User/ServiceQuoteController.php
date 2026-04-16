<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\ServiceQuote;
use Illuminate\Http\Request;
use App\Http\Resources\ServiceQuoteResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class ServiceQuoteController extends Controller
{
    /**
     * Display a listing of the user's service quotes.
     */
    public function index() {
        $user = Auth::user();

        $quotes = ServiceQuote::where('user_id', $user->id)
            ->with(['service.provider'])
            ->latest()
            ->paginate(10);

        return $this->successResponse(ServiceQuoteResource::collection($quotes));
    }
}
