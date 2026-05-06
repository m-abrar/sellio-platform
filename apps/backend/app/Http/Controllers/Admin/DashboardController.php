<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB; 
use Illuminate\Support\Str; 
use Illuminate\Support\Facades\Auth; 

// Base Models
use App\Models\User;
use App\Models\Property; 
use App\Models\Auto; 
use App\Models\Event; 
use App\Models\JobListing; 
use App\Models\Service; 
use App\Models\Classified; 
use App\Models\Product; 
use App\Models\Category; 
use App\Models\OrderItem; 
use App\Models\Campaign; 

// Transaction/Booking Models (used for Metrics and Charts)
use App\Models\PropertyBooking; 
use App\Models\AutoInquiry; 
use App\Models\EventBooking; 
use App\Models\JobApplication; 
use App\Models\ServiceQuote; 
use App\Models\ServiceAppointment; 
use App\Models\ClassifiedInquiry; 
use App\Models\Order; 

// Utility Models
use App\Models\Ticket; 
use App\Models\NewsletterSubscriber;
use App\Models\Subscription;
use Bavix\Wallet\Models\Transaction as WalletTransaction;
use App\Models\Withdrawal;
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
