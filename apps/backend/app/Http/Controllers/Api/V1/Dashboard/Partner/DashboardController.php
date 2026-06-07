<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Services\Partner\DashboardService;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

/**
 * Class DashboardController
 *
 * Aggregates high-fidelity analytical data, financial summaries, and interaction 
 * metrics to provide a unified command overview for marketplace partners.
 */
class DashboardController extends Controller
{
    /**
     * @var \App\Services\Partner\DashboardService
     */
    protected $dashboardService;

    /**
     * DashboardController constructor.
     *
     * @param \App\Services\Partner\DashboardService $dashboardService
     */
    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Display the partner dashboard overview.
     * @return \Illuminate\Http\JsonResponse
     */
    public function index() {
        $data = $this->dashboardService->getDashboardData(Auth::user());

        return $this->successResponse($data);
    }
}
