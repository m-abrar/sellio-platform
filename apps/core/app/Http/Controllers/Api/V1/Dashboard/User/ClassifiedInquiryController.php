<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\Classified;
use App\Models\ClassifiedInquiry;
use App\Models\Favorite;
use Illuminate\Http\Request;
use App\Http\Resources\ClassifiedInquiryResource;
use App\Http\Resources\FavoriteResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class ClassifiedInquiryController extends Controller
{
    /**
     * Display a listing of the user's classified inquiries and recent favorites.
     */
    public function index() {
        $user = Auth::user();

        // 1. Fetch inquiries made by the user
        $inquiries = ClassifiedInquiry::where('user_id', $user->id)
            ->with(['classifiedAd.user']) 
            ->latest() 
            ->paginate(10); 
        
        // 2. Fetch recent classified-specific favorites
        $favorites = Favorite::where('user_id', $user->id)
            ->where('favoritable_type', Classified::class) 
            ->with(['favoritable']) 
            ->latest()
            ->limit(5) 
            ->get();

        return $this->successResponse([
            'inquiries' => ClassifiedInquiryResource::collection($inquiries),
            'favorites' => FavoriteResource::collection($favorites),
        ]);
    }
}
