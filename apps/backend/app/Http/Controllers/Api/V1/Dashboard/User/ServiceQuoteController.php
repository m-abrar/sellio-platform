<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\ServiceQuote;
use Illuminate\Http\Request;
use App\Http\Resources\ServiceQuoteResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

/**
 * Class ServiceQuoteController
 * Orchestrates the user-facing discovery and retrieval of service quotes, 
 * managing estimation history and provider relationship metadata.
 */
class ServiceQuoteController extends Controller
{
    /**
     * Retrieve a paginated collection of service quotes for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index() {
        $user = Auth::user();

        $quotes = ServiceQuote::where('user_id', $user->id)
            ->with(['service.provider'])
            ->latest()
            ->paginate(10);

        return $this->successResponse(ServiceQuoteResource::collection($quotes));
    }

    /**
     * Cancel a service quote.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $quote = ServiceQuote::where('user_id', $user->id)->where('id', $id)->first();

        if (!$quote) {
            return $this->errorResponse(__('Service quote not found or unauthorized.'), 404);
        }

        $quote->update(['status' => 'cancelled']);

        return $this->successResponse(null, __('Service quote successfully cancelled.'));
    }
}
