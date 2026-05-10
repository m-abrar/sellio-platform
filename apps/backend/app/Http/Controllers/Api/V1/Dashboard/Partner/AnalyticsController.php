<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use App\Services\Partner\AnalyticsService;

// Listing Models
use App\Models\Property; 
use App\Models\Event; 
use App\Models\JobListing; 
use App\Models\Service; 
use App\Models\Classified;
use App\Models\Auto;

// Lead/Booking Models
use App\Models\PropertyBooking;
use App\Models\EventBooking;
use App\Models\JobApplication; 
use App\Models\ServiceAppointment; 
use App\Models\ServiceQuote;
use App\Models\ClassifiedInquiry;
use App\Models\AutoInquiry;

// Activity Log Model (for views)
use Spatie\Activitylog\Models\Activity as ActivityLog;


class AnalyticsController extends Controller
{
    protected $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Displays the main partner analytics dashboard.
     */
    public function index(Request $request)
    {
        $days = (int) $request->get('period', 30);
        $data = $this->analyticsService->getDashboardData(Auth::user(), $days);

        return $this->successResponse(array_merge($data, [
            'days' => $days
        ]));
    }
}
