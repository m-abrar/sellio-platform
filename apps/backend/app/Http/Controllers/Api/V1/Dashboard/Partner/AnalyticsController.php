<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Models\Auto;
use App\Models\AutoInquiry;
use App\Models\Classified;
use App\Models\ClassifiedInquiry;
use App\Models\Event;
use App\Models\EventBooking;
use App\Models\JobApplication;
use App\Models\JobListing;
use App\Models\Property;
use App\Models\PropertyBooking;
use App\Models\Service;
use App\Models\ServiceAppointment;
use App\Models\ServiceQuote;
use App\Services\Partner\AnalyticsService;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
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

    /**
     * Displays analytics specifically for a single selected listing.
     */
    public function listingAnalytics(Request $request, string $type, int $id)
    {
        $days = (int) $request->get('period', 30);
        
        try {
            $data = $this->analyticsService->getListingAnalytics($request->user(), $type, $id, $days);
            return $this->successResponse($data);
        } catch (\InvalidArgumentException $e) {
            return $this->errorResponse($e->getMessage(), 400);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse(__('Listing not found or access denied.'), 404);
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
