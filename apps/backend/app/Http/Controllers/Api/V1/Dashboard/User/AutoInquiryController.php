<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\AutoInquiry;
use Illuminate\Http\Request;
use App\Http\Resources\AutoInquiryResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

/**
 * Class AutoInquiryController
 * Orchestrates the user-facing retrieval of automotive inquiries, providing 
 * centralized access to inquiry history and vehicle relationship metadata.
 */
class AutoInquiryController extends Controller
{
    /**
     * Retrieve a paginated collection of automotive inquiries for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index() {
        $user = Auth::user();

        $userInquiries = AutoInquiry::where('user_id', $user->id)
            ->with(['auto'])
            ->latest()
            ->paginate(10);

        return $this->successResponse(AutoInquiryResource::collection($userInquiries));
    }
}
