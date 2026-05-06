<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

// Base Models
use App\Services\Admin\DashboardService;

class DashboardController extends Controller
{
    protected $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }
    public function index()
    {
        $metrics = $this->dashboardService->getGlobalMetrics();
        return view('admin.dashboard.dashboard', compact('metrics'));
    }

    public function ecommerceIndex()
    {
        $metrics = $this->dashboardService->getEcommerceMetrics();
        return view('admin.dashboard.ecommerce', compact('metrics'));
    }

    public function pendingListings()
    {
        $pendingListings = $this->dashboardService->getPendingListings();
        return view('admin.listings.index', compact('pendingListings'));
    }
}
