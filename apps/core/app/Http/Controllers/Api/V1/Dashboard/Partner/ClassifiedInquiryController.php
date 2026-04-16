<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ClassifiedInquiry;
use App\Http\Resources\ClassifiedInquiryResource;
use Illuminate\Support\Facades\Auth;

class ClassifiedInquiryController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $classifiedListingIds = $user->classifieds()->pluck('id');

        $classifiedInquiries = ClassifiedInquiry::whereIn('classified_id', $classifiedListingIds)
            ->with('classifiedad')
            ->latest()
            ->paginate(10);

        return $this->successResponse(ClassifiedInquiryResource::collection($classifiedInquiries));
    }
}
