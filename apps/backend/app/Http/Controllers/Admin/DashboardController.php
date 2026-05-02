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

class DashboardController extends Controller
{
    public function index()
    {
        // ====================================================================
        // SECTION 1: CONSTANTS & DATE RANGES
        // ====================================================================

        $today = now();
        $limit = 5; 
        $lastWeek = $today->copy()->subWeek();
        $last24Hours = $today->copy()->subHours(24);
        $last30Days = $today->copy()->subDays(30);
        $previous30Days = $last30Days->copy()->subDays(30);
        $currentYear = $today->year;
        
        // Date ranges for calendar events (6 months ago to 6 months in the future)
        $last180Days = $today->copy()->subDays(180);
        $next180Days = $today->copy()->addDays(180);
        
        $partnerRole = 'partner';
        $pendingStatus = 'pending';

        // ====================================================================
        // SECTION 2: CORE METRICS & KPIS
        // ====================================================================

        // --- 2.1 North Star / Urgent Actions ---

        // Calculate All-Time Gross Revenue with module enforcement checks
        $propertyRevenue = module_enabled('properties') ? PropertyBooking::where('status', 'confirmed')->sum('total_price') : 0;
        $eventRevenue = module_enabled('events') ? EventBooking::where('status', 'confirmed')->sum('total_price') : 0;
        $serviceRevenue = module_enabled('services') ? (ServiceAppointment::where('status', 'confirmed')->sum('price') + ServiceQuote::where('status', 'accepted')->sum('quoted_price')) : 0;
        
        $classifiedRevenue = 0;
        if (module_enabled('classifieds')) {
            $classifiedRevenue = ClassifiedInquiry::where('status', 'confirmed')
                ->join('classified_ads', 'classified_inquiries.classified_id', '=', 'classified_ads.id')
                ->sum('classified_ads.base_price');
        }

        $productRevenue = module_enabled('products') ? Order::where('payment_status', 'paid')->sum('total_amount') : 0;
            
        $totalEarned = $propertyRevenue + $eventRevenue + $serviceRevenue + $classifiedRevenue + $productRevenue;
        $northStarEarnings = '$' . number_format($totalEarned, 0);

        // --- DYNAMIC YOY CALCULATION ---
        $currentYearEarnings = 0;
        $lastYearEarnings = 0;

        if (module_enabled('properties')) {
            $currentYearEarnings += PropertyBooking::where('status', 'confirmed')->whereYear('created_at', now()->year)->sum('total_price');
            $lastYearEarnings += PropertyBooking::where('status', 'confirmed')->whereYear('created_at', now()->subYear()->year)->sum('total_price');
        }
        if (module_enabled('events')) {
            $currentYearEarnings += EventBooking::where('status', 'confirmed')->whereYear('created_at', now()->year)->sum('total_price');
            $lastYearEarnings += EventBooking::where('status', 'confirmed')->whereYear('created_at', now()->subYear()->year)->sum('total_price');
        }
        if (module_enabled('services')) {
            $currentYearEarnings += ServiceAppointment::where('status', 'confirmed')->whereYear('created_at', now()->year)->sum('price') + ServiceQuote::where('status', 'accepted')->whereYear('created_at', now()->year)->sum('quoted_price');
            $lastYearEarnings += ServiceAppointment::where('status', 'confirmed')->whereYear('created_at', now()->subYear()->year)->sum('price') + ServiceQuote::where('status', 'accepted')->whereYear('created_at', now()->subYear()->year)->sum('quoted_price');
        }
        if (module_enabled('classifieds')) {
            $currentYearEarnings += ClassifiedInquiry::where('status', 'confirmed')->join('classified_ads', 'classified_inquiries.classified_id', '=', 'classified_ads.id')->whereYear('classified_inquiries.created_at', now()->year)->sum('classified_ads.base_price');
            $lastYearEarnings += ClassifiedInquiry::where('status', 'confirmed')->join('classified_ads', 'classified_inquiries.classified_id', '=', 'classified_ads.id')->whereYear('classified_inquiries.created_at', now()->subYear()->year)->sum('classified_ads.base_price');
        }
        if (module_enabled('products')) {
            $currentYearEarnings += Order::where('payment_status', 'paid')->whereYear('created_at', now()->year)->sum('total_amount');
            $lastYearEarnings += Order::where('payment_status', 'paid')->whereYear('created_at', now()->subYear()->year)->sum('total_amount');
        }

        $yoyChangePercent = 0;
        if ($lastYearEarnings > 0) {
            $yoyChangePercent = round((($currentYearEarnings - $lastYearEarnings) / $lastYearEarnings) * 100);
        } else {
             $yoyChangePercent = $currentYearEarnings > 0 ? 100 : 0;
        }
        $yoyChange = ($yoyChangePercent >= 0 ? '+' : '-') . abs($yoyChangePercent) . '%';

        // --- 2.2 User Metrics (Growth, Subscriptions) ---

        $totalUsers = User::count();
        $usersLast30Days = User::where('created_at', '>=', $last30Days)->count();
        $usersPrevious30Days = User::where('created_at', '>=', $previous30Days)->where('created_at', '<', $last30Days)->count();
        
        $userGrowthPercent = 0;
        if ($usersPrevious30Days > 0) {
            $userGrowthPercent = round((($usersLast30Days - $usersPrevious30Days) / $usersPrevious30Days) * 100);
        }

        $newNewsletterSubscribers = class_exists(NewsletterSubscriber::class) 
            ? NewsletterSubscriber::where('created_at', '>=', $last30Days)->count() 
            : 0;

        $activeSubscriptions = class_exists(Subscription::class) 
            ? Subscription::where('status', 'active')->count() 
            : 0;
            
        $subscriptionsDue = class_exists(Subscription::class) 
            ? Subscription::where('status', 'active')
                ->whereBetween('ends_at', [$today, $today->copy()->addDays(30)])
                ->count() 
            : 0;
        
        // --- DYNAMIC CALCULATIONS ADDED HERE ---
        
        $newsletterConversionPercent = 0;
        if ($usersLast30Days > 0) {
            // Conversion: New Subscribers (L30D) / New Users (L30D) * 100
            $newsletterConversionPercent = round(($newNewsletterSubscribers / $usersLast30Days) * 100);
        }

        $activeSubscriptionPercent = 0;
        if ($totalUsers > 0) {
            // Percentage: Active Subscriptions / Total Users * 100
            $activeSubscriptionPercent = round(($activeSubscriptions / $totalUsers) * 100);
        }
        
        // --- END DYNAMIC CALCULATIONS ---

        $dynamicUserMetrics = [
            'total_users' => number_format($totalUsers),
            'users_growth_percent' => abs($userGrowthPercent),
            'users_growth_desc' => ($userGrowthPercent >= 0 ? '+' : '-') . abs($userGrowthPercent) . '% Growth (L30D)',
            'newsletter_subscribers' => '+' . number_format($newNewsletterSubscribers),
            'newsletter_conversion' => $newsletterConversionPercent, // DYNAMIC
            'newsletter_desc' => $newsletterConversionPercent . '% Subscriber Conversion (L30D)', // DYNAMIC
            'active_subscriptions' => number_format($activeSubscriptions),
            'subscriptions_percent' => $activeSubscriptionPercent, // DYNAMIC
            'subscriptions_desc' => $activeSubscriptionPercent . '% of Total Users are Active Subscribers', // DYNAMIC: Changed description to match new metric
        ];

        // ====================================================================
        // SECTION 3: CHART DATA (REVENUE & TYPE BREAKDOWN)
        // ====================================================================

        // --- 3.1 Revenue Breakdown (Type Chart) - No Change ---
        
        // --- 3.1 Revenue Breakdown (Dynamic Type Chart) ---
        $chartLabels = [];
        $typeChartData = [];

        if (module_enabled('properties')) {
            $chartLabels[] = 'Property Bookings';
            $typeChartData[] = PropertyBooking::where('status', 'confirmed')->count();
        }
        if (module_enabled('events')) {
            $chartLabels[] = 'Event Bookings';
            $typeChartData[] = EventBooking::where('status', 'confirmed')->count();
        }
        if (module_enabled('services')) {
            $chartLabels[] = 'Service Sales';
            $typeChartData[] = ServiceAppointment::where('status', 'confirmed')->count() + ServiceQuote::where('status', 'accepted')->count();
        }
        if (module_enabled('classifieds')) {
            $chartLabels[] = 'Classified Sales';
            $typeChartData[] = ClassifiedInquiry::where(function ($query) {
                $query->where('status', 'closed_sale')->orWhere('status', 'resolved'); 
            })->count();
        }
        if (module_enabled('autos')) {
            $chartLabels[] = 'Auto Inquiries';
            $typeChartData[] = AutoInquiry::count(); 
        }
        if (module_enabled('jobs')) {
            $chartLabels[] = 'Job Apps';
            $typeChartData[] = JobApplication::count();
        }
        if (module_enabled('products')) {
            $chartLabels[] = 'Product Orders';
            $typeChartData[] = Order::where('payment_status', 'paid')->count();
        }


        // --- 3.2 Monthly Revenue Chart (Dynamic) ---

        // 1. Get Monthly Gross Earnings (Assuming WalletTransaction 'deposit' = Gross Income)
        $monthlyGross = WalletTransaction::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(amount) / 100 as total_amount')
            )
            ->where('type', 'deposit')
            ->whereYear('created_at', $currentYear)
            ->groupBy('month')
            ->pluck('total_amount', 'month')
            ->toArray();

        // 2. Get Monthly Total Payouts (Using the new dedicated Withdrawal model, filtering by 'approved')
        $monthlyPayouts = Withdrawal::select(
                DB::raw('MONTH(approved_at) as month'), // Use approved_at to track when money left
                DB::raw('SUM(amount) / 100 as total_amount')
            )
            ->where('status', 'approved')
            ->whereYear('approved_at', $currentYear)
            ->groupBy('month')
            ->pluck('total_amount', 'month')
            ->toArray();
        // Note: amounts are assumed to be in dollars/currency unit, not cents, in the Withdrawal table.

        // 3. Format data for Chart JS
        $grossEarningsData = [];
        $payoutsData = [];
        foreach (range(1, 12) as $month) {
            $grossEarningsData[] = round($monthlyGross[$month] ?? 0); 
            $payoutsData[] = round($monthlyPayouts[$month] ?? 0); // Payouts data now comes from Withdrawal model
        }

        $dynamicRevenueChart = [
            'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            'gross_earnings' => $grossEarningsData, 
            'total_payouts' => $payoutsData,
        ];
        
        // ====================================================================
        // SECTION 4: LIST DATA (RECENT ACTIVITY, TOP PERFORMERS)
        // ====================================================================

        // --- 4.1 Top Partners / Listings - No Change ---
        
        $topPartner = User::role($partnerRole)->withCount('properties')->orderByDesc('properties_count')->first();
        
        $bestRatedListing = Property::where('is_published', true)
            ->withAvg('reviews', 'rating')
            ->orderByDesc('reviews_avg_rating')
            ->first();

        $mostBookedListing = Property::where('is_published', true)
            ->withCount('bookings')
            ->orderByDesc('bookings_count')
            ->first();

        $topPartnersData = [
            'partner_name' => $topPartner ? $topPartner->name : 'N/A',
            'partner_rating' => $topPartner ? (number_format($topPartner->rating_average ?? 0, 1) . ' star average') : 'N/A', 
            'listing_title' => $bestRatedListing ? $bestRatedListing->title : 'N/A',
            'listing_rating' => $bestRatedListing ? (number_format($bestRatedListing->reviews_avg_rating ?? 0, 1) . ' star average') : 'N/A',
            'booked_listing' => $mostBookedListing ? $mostBookedListing->title : 'N/A',
            'booked_count' => $mostBookedListing ? ("{$mostBookedListing->bookings_count} Bookings") : 'N/A',
        ];

        // --- 4.2 Recent Listings - No Change ---

        $listingModelsConfig = [
            'properties'   => [Property::class, 'fa-home', 'primary'],
            'events'       => [Event::class, 'fa-calendar-alt', 'success'],
            'jobs'         => [JobListing::class, 'fa-briefcase', 'warning'],
            'autos'        => [Auto::class, 'fa-car', 'info'],
            'services'     => [Service::class, 'fa-tools', 'secondary'],
            'classifieds'  => [Classified::class, 'fa-tag', 'dark'],
            'products'     => [Product::class, 'fa-shopping-bag', 'danger'],
        ];

        $listingModels = [];
        foreach ($listingModelsConfig as $module => $config) {
            if (module_enabled($module)) {
                $listingModels[$config[0]] = ['icon' => $config[1], 'color' => $config[2]];
            }
        }

        $recentListingsQuery = null;
        foreach ($listingModels as $modelClass => $meta) {
            $newQuery = $modelClass::select('id', 'title', 'created_at') 
                ->selectRaw("'" . $meta['icon'] . "' as icon_class")
                ->selectRaw("'" . $meta['color'] . "' as tag_class")
                ->selectRaw("'" . Str::afterLast($modelClass, '\\') . "' as tag");
            
            $recentListingsQuery = ($recentListingsQuery === null) 
                ? $newQuery 
                : $recentListingsQuery->unionAll($newQuery);
        }
        
        $recentListings = $recentListingsQuery
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(function($item) {
                return [
                    'id' => $item->id,
                    'title' => Str::limit($item->title ?? $item->title, 40) . ' (' . $item->created_at->diffForHumans() . ')',
                    'tag' => $item->tag,
                    'icon_class' => 'fa ' . $item->icon_class . ' text-' . $item->tag_class,
                    'tag_class' => 'bg-' . $item->tag_class,
                ];
            });

        // --- 4.3 Recent Bookings / Leads - No Change ---
        
        $bookingModelsConfig = [
            'properties'  => [PropertyBooking::class, 'Booking', 'fa-calendar-check', 'success'],
            'autos'       => [AutoInquiry::class, 'Inquiry', 'fa-question-circle', 'info'],
            'events'      => [EventBooking::class, 'Booking', 'fa-ticket-alt', 'success'],
            'jobs'        => [JobApplication::class, 'Application', 'fa-file-alt', 'primary'],
            'services'    => [ServiceQuote::class, 'Quote', 'fa-money-bill-wave', 'warning'],
            'services2'   => [ServiceAppointment::class, 'Appointment', 'fa-clock', 'primary'],
            'classifieds' => [ClassifiedInquiry::class, 'Lead', 'fa-envelope', 'info'],
            'products'    => [Order::class, 'Order', 'fa-shopping-cart', 'success'],
        ];

        $bookingModels = [];
        foreach ($bookingModelsConfig as $key => $config) {
            $module = rtrim($key, '2'); // Handle service2 mapping
            if (module_enabled($module)) {
                $bookingModels[$config[0]] = ['tag' => $config[1], 'icon' => $config[2], 'color' => $config[3]];
            }
        }

        $recentBookingsQuery = null;
        foreach ($bookingModels as $modelClass => $meta) {
            $newQuery = $modelClass::select('id', 'created_at')
                ->selectRaw("'" . $meta['icon'] . "' as icon_class")
                ->selectRaw("'" . $meta['color'] . "' as tag_class")
                ->selectRaw("'" . $meta['tag'] . "' as tag")
                ->selectRaw("'" . Str::afterLast($modelClass, '\\') . "' as model_type");
            
            $recentBookingsQuery = ($recentBookingsQuery === null) 
                ? $newQuery 
                : $recentBookingsQuery->unionAll($newQuery);
        }

        $recentBookings = $recentBookingsQuery
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(function($item) {
                return [
                    'title' => "New {$item->tag}: #{$item->id} ({$item->model_type})",
                    'value' => '', 
                    'tag' => $item->tag,
                    'icon_class' => 'fa ' . $item->icon_class . ' text-' . $item->tag_class,
                    'tag_class' => 'bg-' . $item->tag_class,
                ];
            });


        // --- 4.4 Recent Notifications (Moderation Queue) - No Change ---

        $recentNotifications = [];
        $notificationCount = 0;

        if (Auth::check() && Auth::user()->hasRole('admin')) { 
            $rawNotifications = Auth::user()->unreadNotifications()->take($limit)->get();
            $notificationCount = $rawNotifications->count();

            $recentNotifications = $rawNotifications->map(function ($notification) {
                $rawType = Str::afterLast($notification->type, '\\'); 
                $data = $notification->data;
                $customType = $data['type'] ?? 'default'; 
                $title = $data['message'] ?? 'New Admin Alert (' . $rawType . ')';

                $tag = 'New';
                $iconClass = 'fa-bell text-primary';
                $tagClass = 'bg-primary';
                
                if ($customType === 'alert') {
                    $tag = 'Urgent';
                    $iconClass = 'fa-exclamation-circle text-danger';
                    $tagClass = 'bg-danger';
                } elseif ($customType === 'flag') {
                    $tag = 'Flagged';
                    $iconClass = 'fa-flag text-warning';
                    $tagClass = 'bg-warning';
                } elseif ($customType === 'review') {
                    $tag = 'Review';
                    $iconClass = 'fa-user-check text-success';
                    $tagClass = 'bg-success';
                } elseif ($customType === 'report') {
                    $tag = 'Report';
                    $iconClass = 'fa-user-slash text-warning';
                    $tagClass = 'bg-warning';
                } elseif ($customType === 'new') {
                    $tag = 'Support';
                    $iconClass = 'fa-headset text-info';
                    $tagClass = 'bg-info';
                }

                return [
                    'title' => Str::limit($title, 35) . ' (' . $notification->created_at->diffForHumans() . ')',
                    'tag' => $tag,
                    'icon_class' => 'fa ' . $iconClass,
                    'tag_class' => $tagClass,
                ];
            })->toArray();
        }

        // --- 4.5 Top Sales/Bookings (L30D) - No Change ---
        
        $topSalesRaw = PropertyBooking::query()
            ->join('properties', 'property_bookings.property_id', '=', 'properties.id')
            ->where('property_bookings.created_at', '>=', $last30Days)
            ->select('properties.title', DB::raw('count(*) as total_bookings'))
            ->groupBy('properties.title')
            ->orderByDesc('total_bookings')
            ->limit($limit)
            ->get();

        $topSalesItems = $topSalesRaw->map(function ($item, $index) {
            return [
                'rank' => '#' . ($index + 1),
                'title' => Str::limit($item->title, 30),
                'bookings' => number_format($item->total_bookings) . ' Bookings',
            ];
        })->toArray();


        // ====================================================================
        // SECTION 5: REAL-TIME CALENDAR DATA
        // ====================================================================

        // --- 5.1 Property Bookings (Check-in/Check-out Events) ---
        $propertyBookings = PropertyBooking::with('property')
            ->where('status', 'confirmed')
            // Filter for bookings starting or ending within the 12-month window (6 months past, 6 months future)
            ->where(function ($query) use ($last180Days, $next180Days) {
                $query->whereBetween('check_in_date', [$last180Days, $next180Days])
                      ->orWhereBetween('check_out_date', [$last180Days, $next180Days]);
            })
            ->get()
            ->map(function ($booking) {
                $title = Str::limit($booking->property->title ?? 'Property', 25);
                return [
                    'title' => $title . ' (Booking)',
                    'start' => $booking->check_in_date,
                    'end' => $booking->check_out_date,
                    'color' => '#17a2b8', // Primary Blue
                    'allDay' => true,
                ];
            });

        // --- 5.2 Event Bookings (Ticketed Events) ---
        $eventBookings = EventBooking::with(['event', 'occurrence'])
            ->where('status', 'confirmed')
            // Filter for event occurrences starting within the 12-month window
            ->whereHas('occurrence', fn ($q) => $q->whereBetween('start_date_time', [$last180Days, $next180Days]))
            ->get()
            ->map(function ($booking) {
                $event = $booking->event;
                $occurrence = $booking->occurrence; // Use the occurrence relationship for dates
                
                $title = Str::limit($event->title ?? 'Event', 25);
                
                // Use the full datetime columns from EventOccurrence model
                $start = $occurrence->start_date_time;
                // Ensure end time is present, otherwise default to start time
                $end = $occurrence->end_date_time ?? $occurrence->start_date_time; 
                
                return [
                    'title' => $title . ' (Event)',
                    'start' => $start,
                    'end' => $end,
                    'color' => '#28a745', // Success Green
                ];
            });

        // --- 5.3 Service Appointments ---
        // FIX: Replaced 'start_time' with the correct 'scheduled_at' column title.
        $serviceAppointments = ServiceAppointment::with('service')
            ->where('status', 'confirmed')
            // Filter for appointments within the 12-month window, using 'scheduled_at'
            ->whereBetween('scheduled_at', [$last180Days, $next180Days])
            ->get()
            ->map(function ($appointment) {
                $title = Str::limit($appointment->service->title ?? 'Service', 25);
                
                // Use 'scheduled_at' for the start time
                $start = $appointment->scheduled_at;
                
                // Calculate end time by assuming a 1-hour appointment duration if no explicit end time field exists
                $end = $appointment->scheduled_at ? $appointment->scheduled_at->copy()->addHour() : $start; 
                
                return [
                    'title' => $title . ' (Appt.)',
                    'start' => $start,
                    'end' => $end,
                    'color' => '#ffc107', // Warning Yellow
                ];
            });

        // --- 5.4 Marketing Campaigns ---
        $marketingCampaigns = Campaign::where('is_active', true)
            ->get()
            ->map(fn($c) => [
                'title' => $c->title . ' (Campaign)',
                'start' => $c->start_date->toIso8601String(),
                'end' => $c->end_date->toIso8601String(),
                'color' => $c->color,
                'allDay' => $c->start_date->format('H:i') == '00:00' && $c->end_date->format('H:i') == '00:00',
            ]);

        // --- 5.5 Combine All Calendar Data ---
        $calendarEvents = $propertyBookings
            ->merge($eventBookings)
            ->merge($serviceAppointments)
            ->merge($marketingCampaigns)
            ->sortBy('start') // Sort by start date for a coherent calendar list
            ->values()
            ->toArray();


        // ====================================================================
        // SECTION 6: FINAL METRICS ARRAY ASSEMBLY
        // ====================================================================
        
        // --- 5.5 Dynamic Aggregator for Enabled Modules ---
        $listingApprovals = 0;
        $liveListings = 0;
        $newLeads24h = 0;
        
        $metricsConfig = [
            'properties'   => [Property::class, PropertyBooking::class],
            'events'       => [Event::class, EventBooking::class],
            'jobs'         => [JobListing::class, JobApplication::class],
            'autos'        => [Auto::class, AutoInquiry::class],
            'services'     => [Service::class, ServiceQuote::class], 
            'classifieds'  => [Classified::class, ClassifiedInquiry::class],
            'products'     => [Product::class, Order::class],
        ];

        foreach ($metricsConfig as $module => $models) {
            if (module_enabled($module)) {
                $listingApprovals += $models[0]::where('is_published', false)->count();
                $liveListings += $models[0]::where('is_published', true)->count();
                $newLeads24h += $models[1]::where('created_at', '>=', $last24Hours)->count();
                if ($module === 'services') {
                    $newLeads24h += ServiceAppointment::where('created_at', '>=', $last24Hours)->count();
                }
            }
        }

        $metrics = [
            // ROW 1: North Star
            'system_kpis' => [
                'earnings' => $northStarEarnings, 
                'yoy_change' => $yoyChange, 
            ],
            
            // Urgent Actions
            'urgent_actions' => [
                'partner_applications' => User::where('is_partner', true)
                    ->whereDoesntHave('roles', fn ($query) => $query->where('name', 'partner'))
                    ->count(),
                'listing_approvals' => $listingApprovals,

                'pending_payouts' => '$' . humanAmount(
                    Withdrawal::where('status', $pendingStatus)->sum('amount') / 100
                ),
                'unresolved_tickets' => Ticket::unresolved()->count(), 
            ],
            
            // Secondary Metrics
            'secondary_metrics' => [
                'active_partners' => User::role($partnerRole)->count(), 
                'live_properties' => $liveListings,
                'new_leads_24h' => $newLeads24h,
            ],
            
            // Lists
            'recent_bookings' => ['count' => $recentBookings->count(), 'items' => $recentBookings->toArray()],
            'recent_listings' => ['count' => $recentListings->count(), 'period' => 'Across all categories', 'items' => $recentListings->toArray()],
            'notifications' => ['count' => $notificationCount, 'items' => $recentNotifications],
            'top_partners' => $topPartnersData,
            'user_metrics' => $dynamicUserMetrics,
            'top_sales' => ['period' => 'Top Properties (L30D)', 'items' => $topSalesItems],
            
            // Chart Data
            'js_data' => [
                'revenue_chart' => $dynamicRevenueChart, 
                'type_chart' => [ 
                    'labels' => $chartLabels,
                    'data' => $typeChartData, 
                ],
                'calendar_events' => $calendarEvents,
                'heatmap_data' => Property::where('is_published', true)
                    ->whereNotNull('latitude')
                    ->whereNotNull('longitude')
                    ->select('latitude', 'longitude')
                    ->get()
                    ->map(fn($p) => [$p->latitude, $p->longitude, 0.6])
                    ->toArray()
            ],
            // System Health Data
            'system_health' => [
                'php_version' => PHP_VERSION,
                'laravel_version' => app()->version(),
                'server_ip' => request()->server('SERVER_ADDR') ?? '127.0.0.1',
                'cache_status' => config('cache.default'),
                'db_status' => 'Healthy',
                'environment' => app()->environment(),
            ]
        ];

        // ====================================================================
        // SECTION 7: PASS DATA TO VIEW
        // ====================================================================
        return view('admin.dashboard.dashboard', compact('metrics'));
    }

    public function ecommerceIndex()
    {
        // ====================================================================
        // SECTION 1: CONSTANTS & DATE RANGES
        // ====================================================================
        $today = now();
        $lastMonth = $today->copy()->subMonth();
        $previousMonth = $lastMonth->copy()->subMonth();
        $currentYear = $today->year;
        $limit = 5;

        // ====================================================================
        // SECTION 2: NORTH STAR KPIs (Earnings & YoY)
        // ====================================================================
        $totalEarned = Order::where('payment_status', 'paid')->sum('total_amount');
        
        $currentYearEarnings = Order::where('payment_status', 'paid')->whereYear('created_at', $currentYear)->sum('total_amount');
        $lastYearEarnings = Order::where('payment_status', 'paid')->whereYear('created_at', $currentYear - 1)->sum('total_amount');

        $yoyChangePercent = 0;
        if ($lastYearEarnings > 0) {
            $yoyChangePercent = round((($currentYearEarnings - $lastYearEarnings) / $lastYearEarnings) * 100, 1);
        } else {
            $yoyChangePercent = $currentYearEarnings > 0 ? 100 : 0;
        }
        $yoyChange = ($yoyChangePercent >= 0 ? '+' : '-') . abs($yoyChangePercent) . '%';

        // ====================================================================
        // SECTION 3: URGENT ACTIONS
        // ====================================================================
        $pendingOrdersCount = Order::where('status', Order::STATUS_PENDING)->count();
        $lowStockCount = Product::where('manage_stock', true)
            ->whereRaw('stock_quantity <= low_stock_threshold')
            ->count();
        $pendingPayoutsAmount = Withdrawal::where('status', 'pending')->sum('amount') / 100;
        $unresolvedTicketsCount = Ticket::unresolved()->count();

        // ====================================================================
        // SECTION 4: SECONDARY METRICS
        // ====================================================================
        $totalCustomers = User::role('user')->count() ?: User::count();
        $liveProductsCount = Product::where('is_published', true)->count();
        
        // Conversion Rate: Paid Orders / Total Users (Basic Proxy)
        $conversionRate = 0;
        if ($totalCustomers > 0) {
            $paidOrdersCount = Order::where('payment_status', 'paid')->count();
            $conversionRate = round(($paidOrdersCount / $totalCustomers) * 100, 1);
        }

        // ====================================================================
        // SECTION 5: LISTS (RECENT ORDERS & TOP SELLERS)
        // ====================================================================
        $recentOrders = Order::with('user')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(function($order) {
                $statusClass = 'success';
                if ($order->payment_status === 'pending') $statusClass = 'warning';
                if ($order->payment_status === 'failed') $statusClass = 'danger';
                
                return [
                    'title' => "Order #{$order->order_number} ({$order->payment_status})",
                    'tag' => 'Order',
                    'icon_class' => "fa fa-shopping-cart text-{$statusClass}",
                    'tag_class' => "bg-{$statusClass}",
                ];
            });

        $topSellersRaw = OrderItem::select('product_id', 'product_name', DB::raw('SUM(quantity) as total_sales'))
            ->groupBy('product_id', 'product_name')
            ->orderByDesc('total_sales')
            ->limit($limit)
            ->get();

        $topSellers = $topSellersRaw->map(function($item, $index) {
            return [
                'rank' => '#' . ($index + 1),
                'title' => $item->product_name,
                'bookings' => $item->total_sales . ' Sales',
            ];
        });

        // ====================================================================
        // SECTION 6: USER METRICS (GROWTH & SUBS)
        // ====================================================================
        $totalUsers = User::count();
        $usersLastMonth = User::where('created_at', '>=', $lastMonth)->count();
        $usersPrevMonth = User::where('created_at', '>=', $previousMonth)->where('created_at', '<', $lastMonth)->count();
        
        $userGrowthPercent = 0;
        if ($usersPrevMonth > 0) {
            $userGrowthPercent = round((($usersLastMonth - $usersPrevMonth) / $usersPrevMonth) * 100);
        }

        $newNewsletterSubscribers = class_exists(NewsletterSubscriber::class) 
            ? NewsletterSubscriber::where('created_at', '>=', $lastMonth)->count() 
            : 0;
            
        $newsletterConversion = ($usersLastMonth > 0) ? round(($newNewsletterSubscribers / $usersLastMonth) * 100) : 0;

        $activeSubscriptions = class_exists(Subscription::class) ? Subscription::where('status', 'active')->count() : 0;
        $subPercent = ($totalUsers > 0) ? round(($activeSubscriptions / $totalUsers) * 100) : 0;

        // ====================================================================
        // SECTION 7: CHART DATA
        // ====================================================================
        $monthlyRevenue = Order::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(total_amount) as total')
            )
            ->where('payment_status', 'paid')
            ->whereYear('created_at', $currentYear)
            ->groupBy('month')
            ->pluck('total', 'month')
            ->toArray();

        $monthlyCosts = Withdrawal::select(
                DB::raw('MONTH(approved_at) as month'),
                DB::raw('SUM(amount) / 100 as total')
            )
            ->where('status', 'approved')
            ->whereYear('approved_at', $currentYear)
            ->groupBy('month')
            ->pluck('total', 'month')
            ->toArray();

        $revData = [];
        $costData = [];
        foreach (range(1, 12) as $m) {
            $revData[] = round($monthlyRevenue[$m] ?? 0);
            $costData[] = round($monthlyCosts[$m] ?? 0);
        }

        $categoryDist = Category::withCount('products')
            ->orderByDesc('products_count')
            ->limit(5)
            ->get();

        // Heatmap: Map paid orders to coordinates if available, else fallback to randomish distribution based on shipping cities
        // Since we don't have lat/long on orders, we'll pick up locations from existing Properties as a proxy for activity regions
        $heatmapData = Property::where('is_published', true)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->limit(50)
            ->get()
            ->map(fn($p) => [$p->latitude, $p->longitude, 0.5])
            ->toArray();

        $metrics = [
            'system_kpis' => [
                'earnings' => '$' . number_format($totalEarned, 0),
                'yoy_change' => $yoyChange,
            ],
            'urgent_actions' => [
                'pending_orders' => $pendingOrdersCount,
                'low_stock_alerts' => $lowStockCount,
                'pending_payouts' => '$' . number_format($pendingPayoutsAmount, 0),
                'unresolved_tickets' => $unresolvedTicketsCount,
            ],
            'secondary_metrics' => [
                'active_customers' => number_format($totalCustomers),
                'live_products' => number_format($liveProductsCount),
                'conversion_rate' => $conversionRate . '%',
            ],
            'recent_orders' => [
                'count' => $recentOrders->count(),
                'items' => $recentOrders->toArray()
            ],
            'top_sellers' => [
                'period' => 'Top Products (All Time)',
                'items' => $topSellers->toArray()
            ],
            'user_metrics' => [
                'total_users' => number_format($totalUsers),
                'users_growth_percent' => abs($userGrowthPercent),
                'users_growth_desc' => ($userGrowthPercent >= 0 ? '+' : '-') . abs($userGrowthPercent) . '% Growth (L30D)',
                'newsletter_subscribers' => '+' . number_format($newNewsletterSubscribers),
                'newsletter_conversion' => $newsletterConversion,
                'newsletter_desc' => $newsletterConversion . '% Subscriber Conversion (L30D)',
                'active_subscriptions' => number_format($activeSubscriptions),
                'subscriptions_percent' => $subPercent,
                'subscriptions_desc' => $subPercent . '% of Total Users are Active Subscribers',
            ],
            'js_data' => [
                'revenue_chart' => [
                    'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    'gross_earnings' => $revData,
                    'total_payouts' => $costData,
                ],
                'type_chart' => [ 
                    'labels' => $categoryDist->pluck('name')->toArray(),
                    'data' => $categoryDist->pluck('products_count')->toArray(), 
                ],
                'calendar_events' => Campaign::where('is_active', true)
                    ->get()
                    ->map(fn($c) => [
                        'title' => $c->title,
                        'start' => $c->start_date->toIso8601String(),
                        'end' => $c->end_date->toIso8601String(),
                        'color' => $c->color,
                        'allDay' => $c->start_date->format('H:i') == '00:00' && $c->end_date->format('H:i') == '00:00',
                    ])
                    ->toArray(),
                'heatmap_data' => $heatmapData ?: [[30.3753, 69.3451, 0.5]]
            ]
        ];

        return view('admin.dashboard.ecommerce', compact('metrics'));
    }

    public function pendingListings()
    {
        $listingModelsConfig = [
            'properties'   => Property::class,
            'events'       => Event::class,
            'jobs'         => JobListing::class,
            'autos'        => Auto::class,
            'services'     => Service::class,
            'classifieds'  => Classified::class,
            'products'     => Product::class,
        ];

        $listingModels = [];
        foreach ($listingModelsConfig as $module => $model) {
            if (module_enabled($module)) {
                $listingModels[] = $model;
            }
        }

        $pendingListingsQuery = null;
        
        foreach ($listingModels as $modelClass) {
            // Select necessary columns (ID, Name/Title, Created At, and User ID for context)
            $newQuery = $modelClass::where('is_published', false)
                ->select('id', 'title', 'created_at', 'user_id') 
                // Add a column to identify the model type (e.g., 'Property', 'Auto')
                ->selectRaw("'" . Str::afterLast($modelClass, '\\') . "' as listing_type");
            
            // Merge queries using unionAll to maintain all results
            $pendingListingsQuery = ($pendingListingsQuery === null) 
                ? $newQuery 
                : $pendingListingsQuery->unionAll($newQuery);
        }

        // Execute the final query, order by newest first, and paginate results
        $pendingListings = $pendingListingsQuery
            ->orderByDesc('created_at')
            ->with('user') // Assuming all listing models have a 'user' relationship
            ->paginate(20); // Use pagination for large datasets

        return view('admin.listings.index', compact('pendingListings'));
    }
}
