<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\AutoInquiry;
use Illuminate\Http\Request;
use App\Http\Resources\AutoInquiryResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class AutoInquiryController extends Controller
{
    /**
     * Display a listing of the user's auto inquiries.
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
