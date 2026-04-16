<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Collection;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

// Import necessary Models
use App\Models\Message;
use App\Models\Review;
use App\Models\Property;
use App\Models\Event;
use App\Models\JobListing;
use App\Models\Service;
use App\Models\Classified;
use App\Models\Auto;
// Import Incoming Activity Models
use App\Models\PropertyBooking;
use App\Models\JobApplication;
use App\Models\ServiceQuote;
use App\Models\EventBooking;
use App\Models\ServiceAppointment;
use App\Models\ClassifiedInquiry;
use App\Models\AutoInquiry;
use App\Services\ActivityService;


class ActivityController extends Controller
{
    /**
     * Display the main partner activity dashboard, summarizing new interactions.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request, ActivityService $service)
    {
        $data = $service->getPartnerDashboardData(Auth::user());

        return $this->successResponse([
            'partner' => Auth::user(),
            'activityChartData' => $data['activityChartData'],
            'modules' => $data['modules'],
            'recentActivity' => $data['recentActivity']
        ]);
    }

}
