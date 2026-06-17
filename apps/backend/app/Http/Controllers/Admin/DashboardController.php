<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\DashboardService;
use App\Services\Admin\QueueHealthService;
use Illuminate\View\View;

/**
 * Class DashboardController
 * Serves as the primary analytical hub for the administrative backend, 
 * orchestrating global marketplace metrics, e-commerce performance, and pending inventory audits.
 */
class DashboardController extends Controller
{
    /**
     * The dashboard analytical service.
     *
     * @var \App\Services\Admin\DashboardService
     */
    protected DashboardService $dashboardService;
    protected QueueHealthService $queueHealth;

    public function __construct(DashboardService $dashboardService, QueueHealthService $queueHealth)
    {
        $this->dashboardService = $dashboardService;
        $this->queueHealth      = $queueHealth;
    }

    public function index(): View
    {
        $metrics     = $this->dashboardService->getGlobalMetrics();
        $queueHealth = $this->queueHealth->getStatus();
        return view('admin.dashboard.dashboard', compact('metrics', 'queueHealth'));
    }

    /**
     * Display the e-commerce specialized dashboard focusing on sales and revenue metrics.
     *
     * @return \Illuminate\View\View
     */
    public function ecommerceIndex(): View
    {
        $metrics = $this->dashboardService->getEcommerceMetrics();
        return view('admin.dashboard.ecommerce', compact('metrics'));
    }

    /**
     * Display a comprehensive list of all listings pending administrative approval.
     *
     * @return \Illuminate\View\View
     */
    public function pendingListings(): View
    {
        $pendingListings = $this->dashboardService->getPendingListings();
        return view('admin.listings.index', compact('pendingListings'));
    }
}
