<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ClassifiedInquiry;
use App\Http\Resources\ClassifiedInquiryResource;
use Illuminate\Support\Facades\Auth;

/**
 * Class ClassifiedInquiryController
 * Orchestrates the administrative discovery and retrieval of inquiries for 
 * partner classified listings, providing centralized access to lead metadata.
 */
class ClassifiedInquiryController extends Controller
{
    /**
     * Retrieve a paginated collection of inquiries for the authenticated partner's listings.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $user = Auth::user();

        $classifiedListingIds = $user->classifieds()->pluck('id');

        $classifiedInquiries = ClassifiedInquiry::whereIn('classified_id', $classifiedListingIds)
            ->with(['classifiedAd.brand', 'user'])
            ->latest()
            ->paginate(10);

        return $this->successResponse(ClassifiedInquiryResource::collection($classifiedInquiries));
    }
}
