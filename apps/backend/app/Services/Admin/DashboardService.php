<?php

namespace App\Services\Admin;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Property;
use App\Models\Auto;
use App\Models\Event;
use App\Models\JobListing;
use App\Models\Service;
use App\Models\Classified;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\PropertyBooking;
use App\Models\AutoInquiry;
use App\Models\EventBooking;
use App\Models\JobApplication;
use App\Models\ServiceQuote;
use App\Models\ServiceAppointment;
use App\Models\ClassifiedInquiry;
use App\Models\Ticket;
use App\Models\NewsletterSubscriber;
use App\Models\Subscription;
use App\Models\Withdrawal;
use App\Models\Campaign;
use App\Models\OrderItem;
use Bavix\Wallet\Models\Transaction as WalletTransaction;

class DashboardService
{
    public function getGlobalMetrics(): array
    {
        return \Illuminate\Support\Facades\Cache::remember('admin_dashboard_metrics_v2', 300, function() {
            $today = now();
            $limit = 5;
            $last24Hours = $today->copy()->subHours(24);
            $last30Days = $today->copy()->subDays(30);
            $previous30Days = $last30Days->copy()->subDays(30);
            $currentYear = $today->year;
            $last180Days = $today->copy()->subDays(180);
            $next180Days = $today->copy()->addDays(180);

            // 1. Revenue & KPIs
            $totalEarned = $this->calculateTotalRevenue();
            $yoyChange = $this->calculateYoyGrowth();

            // 2. User Growth
            $userMetrics = $this->getUserGrowthMetrics($today, $last30Days, $previous30Days);

            // 3. Charts
            $revenueChart = $this->getMonthlyRevenueChart($currentYear);
            $typeChart = $this->getModuleDistributionChart();

            // 4. Activity & Lists
            $recentListings = $this->getRecentListings($limit);
            $recentBookings = $this->getRecentBookings($limit);
            $notifications = $this->getRecentNotifications($limit);
            $topPartners = $this->getTopPartnersData($last30Days);

            // 5. Calendar
            $calendarEvents = $this->getCalendarEvents($last180Days, $next180Days);

            // 6. Aggregate Metrics
            $moduleStats = $this->getEnabledModuleStats($last24Hours);

            return [
                'system_kpis' => [
                    'earnings' => '$' . number_format($totalEarned, 0),
                    'yoy_change' => $yoyChange,
                ],
                'urgent_actions' => [
                    'partner_applications' => User::where('is_partner', true)
                        ->whereDoesntHave('roles', fn ($query) => $query->where('name', 'partner'))
                        ->count(),
                    'listing_approvals' => $moduleStats['listing_approvals'],
                    'pending_payouts' => '$' . number_format(Withdrawal::where('status', 'pending')->sum('amount') / 100, 2),
                    'unresolved_tickets' => Ticket::unresolved()->count(),
                ],
                'secondary_metrics' => [
                    'active_partners' => User::role('partner')->count(),
                    'live_properties' => $moduleStats['live_listings'],
                    'new_leads_24h' => $moduleStats['new_leads_24h'],
                ],
                'recent_bookings' => ['count' => count($recentBookings), 'items' => $recentBookings],
                'recent_listings' => ['count' => count($recentListings), 'period' => 'Across all categories', 'items' => $recentListings],
                'notifications' => ['count' => count($notifications), 'items' => $notifications],
                'top_partners' => $topPartners,
                'user_metrics' => $userMetrics,
                'top_sales' => $this->getTopSalesData($last30Days, $limit),
                'js_data' => [
                    'revenue_chart' => $revenueChart,
                    'type_chart' => $typeChart,
                    'calendar_events' => $calendarEvents,
                    'heatmap_data' => $this->getHeatmapData()
                ],
                'system_health' => [
                    'php_version' => PHP_VERSION,
                    'laravel_version' => app()->version(),
                    'server_ip' => request()->server('SERVER_ADDR') ?? '127.0.0.1',
                    'cache_status' => config('cache.default'),
                    'db_status' => 'Healthy',
                    'environment' => app()->environment(),
                ]
            ];
        });
    }

    private function calculateTotalRevenue(): float
    {
        $revenue = 0;
        if (module_enabled('properties')) $revenue += PropertyBooking::where('status', 'confirmed')->sum('total_price');
        if (module_enabled('events')) $revenue += EventBooking::where('status', 'confirmed')->sum('total_price');
        if (module_enabled('services')) {
            $revenue += ServiceAppointment::where('status', 'confirmed')->sum('price');
            $revenue += ServiceQuote::where('status', 'accepted')->sum('quoted_price');
        }
        if (module_enabled('classifieds')) {
            $revenue += ClassifiedInquiry::where('classified_inquiries.status', 'confirmed')
                ->join('classified_ads', 'classified_inquiries.classified_id', '=', 'classified_ads.id')
                ->sum('classified_ads.base_price');
        }
        if (module_enabled('products')) $revenue += Order::where('payment_status', 'paid')->sum('total_amount');

        return $revenue;
    }

    private function calculateYoyGrowth(): string
    {
        $currentYear = now()->year;
        $lastYear = now()->subYear()->year;

        $currentYearEarnings = $this->getEarningsByYear($currentYear);
        $lastYearEarnings = $this->getEarningsByYear($lastYear);

        if ($lastYearEarnings > 0) {
            $percent = round((($currentYearEarnings - $lastYearEarnings) / $lastYearEarnings) * 100);
        } else {
            $percent = $currentYearEarnings > 0 ? 100 : 0;
        }

        return ($percent >= 0 ? '+' : '-') . abs($percent) . '%';
    }

    private function getEarningsByYear(int $year): float
    {
        $total = 0;
        if (module_enabled('properties')) $total += PropertyBooking::where('status', 'confirmed')->whereYear('created_at', $year)->sum('total_price');
        if (module_enabled('events')) $total += EventBooking::where('status', 'confirmed')->whereYear('created_at', $year)->sum('total_price');
        if (module_enabled('services')) {
            $total += ServiceAppointment::where('status', 'confirmed')->whereYear('created_at', $year)->sum('price');
            $total += ServiceQuote::where('status', 'accepted')->whereYear('created_at', $year)->sum('quoted_price');
        }
        if (module_enabled('classifieds')) {
            $total += ClassifiedInquiry::where('classified_inquiries.status', 'confirmed')
                ->join('classified_ads', 'classified_inquiries.classified_id', '=', 'classified_ads.id')
                ->whereYear('classified_inquiries.created_at', $year)
                ->sum('classified_ads.base_price');
        }
        if (module_enabled('products')) $total += Order::where('payment_status', 'paid')->whereYear('created_at', $year)->sum('total_amount');

        return $total;
    }

    private function getUserGrowthMetrics($today, $last30Days, $previous30Days): array
    {
        $totalUsers = User::count();
        $usersLast30Days = User::where('created_at', '>=', $last30Days)->count();
        $usersPrev30Days = User::where('created_at', '>=', $previous30Days)->where('created_at', '<', $last30Days)->count();
        
        $growth = ($usersPrev30Days > 0) ? round((($usersLast30Days - $usersPrev30Days) / $usersPrev30Days) * 100) : 0;
        $subscribers = NewsletterSubscriber::where('created_at', '>=', $last30Days)->count();
        $activeSubs = Subscription::where('status', 'active')->count();

        $convRate = ($usersLast30Days > 0) ? round(($subscribers / $usersLast30Days) * 100) : 0;
        $subPercent = ($totalUsers > 0) ? round(($activeSubs / $totalUsers) * 100) : 0;

        return [
            'total_users' => number_format($totalUsers),
            'users_growth_percent' => abs($growth),
            'users_growth_desc' => ($growth >= 0 ? '+' : '-') . abs($growth) . '% Growth (L30D)',
            'newsletter_subscribers' => '+' . number_format($subscribers),
            'newsletter_conversion' => $convRate,
            'newsletter_desc' => $convRate . '% Subscriber Conversion (L30D)',
            'active_subscriptions' => number_format($activeSubs),
            'subscriptions_percent' => $subPercent,
            'subscriptions_desc' => $subPercent . '% of Total Users are Active Subscribers',
        ];
    }

    private function getMonthlyRevenueChart(int $year): array
    {
        $monthlyGross = WalletTransaction::select(DB::raw('MONTH(created_at) as month'), DB::raw('SUM(amount) / 100 as total'))
            ->where('type', 'deposit')->whereYear('created_at', $year)->groupBy('month')->pluck('total', 'month')->toArray();

        $monthlyPayouts = Withdrawal::select(DB::raw('MONTH(approved_at) as month'), DB::raw('SUM(amount) / 100 as total'))
            ->where('status', 'approved')->whereYear('approved_at', $year)->groupBy('month')->pluck('total', 'month')->toArray();

        $gross = []; $payouts = [];
        foreach (range(1, 12) as $m) {
            $gross[] = round($monthlyGross[$m] ?? 0);
            $payouts[] = round($monthlyPayouts[$m] ?? 0);
        }

        return [
            'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            'gross_earnings' => $gross,
            'total_payouts' => $payouts,
        ];
    }

    private function getModuleDistributionChart(): array
    {
        $labels = []; $data = [];
        $modules = [
            'properties' => [PropertyBooking::class, 'Property Bookings', 'confirmed'],
            'events' => [EventBooking::class, 'Event Bookings', 'confirmed'],
            'products' => [Order::class, 'Product Orders', 'paid'],
            'services' => [ServiceAppointment::class, 'Service Sales', 'confirmed'],
            'classifieds' => [ClassifiedInquiry::class, 'Classified Sales', 'closed_sale'],
            'autos' => [AutoInquiry::class, 'Auto Inquiries', null],
            'jobs' => [JobApplication::class, 'Job Apps', null],
        ];

        foreach ($modules as $mod => $cfg) {
            if (module_enabled($mod)) {
                $labels[] = $cfg[1];
                $query = $cfg[0]::query();
                if ($cfg[2]) {
                    if ($mod === 'classifieds') {
                        $query->whereIn('status', ['closed_sale', 'resolved']);
                    } elseif ($mod === 'products') {
                        $query->where('payment_status', 'paid');
                    } else {
                        $query->where('status', $cfg[2]);
                    }
                }
                $data[] = $query->count();
            }
        }

        return ['labels' => $labels, 'data' => $data];
    }

    private function getRecentListings(int $limit): array
    {
        $config = [
            'properties'   => [Property::class, 'fa-home', 'primary'],
            'events'       => [Event::class, 'fa-calendar-alt', 'success'],
            'jobs'         => [JobListing::class, 'fa-briefcase', 'warning'],
            'autos'        => [Auto::class, 'fa-car', 'info'],
            'services'     => [Service::class, 'fa-tools', 'secondary'],
            'classifieds'  => [Classified::class, 'fa-tag', 'dark'],
            'products'     => [Product::class, 'fa-shopping-bag', 'danger'],
        ];

        $query = null;
        foreach ($config as $mod => $cfg) {
            if (module_enabled($mod)) {
                $q = $cfg[0]::select('id', 'title', 'created_at')
                    ->selectRaw("'{$cfg[1]}' as icon_class")
                    ->selectRaw("'{$cfg[2]}' as tag_class")
                    ->selectRaw("'" . Str::afterLast($cfg[0], '\\') . "' as tag");
                $query = ($query === null) ? $q : $query->unionAll($q);
            }
        }

        return $query ? $query->orderByDesc('created_at')->limit($limit)->get()->map(fn($i) => [
            'id' => $i->id,
            'title' => Str::limit($i->title, 40) . ' (' . $i->created_at->diffForHumans() . ')',
            'tag' => $i->tag,
            'icon_class' => 'fa ' . $i->icon_class . ' text-' . $i->tag_class,
            'tag_class' => 'bg-' . $i->tag_class,
        ])->toArray() : [];
    }

    private function getRecentBookings(int $limit): array
    {
        $config = [
            'properties'  => [PropertyBooking::class, 'Booking', 'fa-calendar-check', 'success'],
            'autos'       => [AutoInquiry::class, 'Inquiry', 'fa-question-circle', 'info'],
            'events'      => [EventBooking::class, 'Booking', 'fa-ticket-alt', 'success'],
            'jobs'        => [JobApplication::class, 'Application', 'fa-file-alt', 'primary'],
            'services'    => [ServiceQuote::class, 'Quote', 'fa-money-bill-wave', 'warning'],
            'services2'   => [ServiceAppointment::class, 'Appointment', 'fa-clock', 'primary'],
            'classifieds' => [ClassifiedInquiry::class, 'Lead', 'fa-envelope', 'info'],
            'products'    => [Order::class, 'Order', 'fa-shopping-cart', 'success'],
        ];

        $query = null;
        foreach ($config as $key => $cfg) {
            $mod = rtrim($key, '2');
            if (module_enabled($mod)) {
                $q = $cfg[0]::select('id', 'created_at')
                    ->selectRaw("'{$cfg[2]}' as icon_class")
                    ->selectRaw("'{$cfg[3]}' as tag_class")
                    ->selectRaw("'{$cfg[1]}' as tag")
                    ->selectRaw("'" . Str::afterLast($cfg[0], '\\') . "' as model_type");
                $query = ($query === null) ? $q : $query->unionAll($q);
            }
        }

        return $query ? $query->orderByDesc('created_at')->limit($limit)->get()->map(fn($i) => [
            'title' => "New {$i->tag}: #{$i->id} ({$i->model_type})",
            'value' => '',
            'tag' => $i->tag,
            'icon_class' => 'fa ' . $i->icon_class . ' text-' . $i->tag_class,
            'tag_class' => 'bg-' . $i->tag_class,
        ])->toArray() : [];
    }

    private function getRecentNotifications(int $limit): array
    {
        if (!Auth::check() || !Auth::user()->hasRole('admin')) return [];

        return Auth::user()->unreadNotifications()->take($limit)->get()->map(function ($n) {
            $data = $n->data;
            $type = $data['type'] ?? 'default';
            $meta = [
                'urgent' => ['Urgent', 'fa-exclamation-circle text-danger', 'bg-danger'],
                'flag'   => ['Flagged', 'fa-flag text-warning', 'bg-warning'],
                'review' => ['Review', 'fa-user-check text-success', 'bg-success'],
                'report' => ['Report', 'fa-user-slash text-warning', 'bg-warning'],
                'new'    => ['Support', 'fa-headset text-info', 'bg-info'],
                'default'=> ['New', 'fa-bell text-primary', 'bg-primary'],
            ];
            $cfg = $meta[$type] ?? $meta['default'];

            return [
                'title' => Str::limit($data['message'] ?? 'New Admin Alert', 35) . ' (' . $n->created_at->diffForHumans() . ')',
                'tag' => $cfg[0],
                'icon_class' => 'fa ' . $cfg[1],
                'tag_class' => $cfg[2],
            ];
        })->toArray();
    }

    private function getTopPartnersData($last30Days): array
    {
        $topPartner = User::role('partner')->withCount('properties')->orderByDesc('properties_count')->first();
        $bestRated = Property::where('is_published', true)->withAvg('reviews', 'rating')->orderByDesc('reviews_avg_rating')->first();
        $mostBooked = Property::where('is_published', true)->withCount('bookings')->orderByDesc('bookings_count')->first();

        return [
            'partner_name' => $topPartner?->name ?? 'N/A',
            'partner_rating' => $topPartner ? (number_format($topPartner->rating_average ?? 0, 1) . ' star average') : 'N/A',
            'listing_title' => $bestRated?->title ?? 'N/A',
            'listing_rating' => $bestRated ? (number_format($bestRated->reviews_avg_rating ?? 0, 1) . ' star average') : 'N/A',
            'booked_listing' => $mostBooked?->title ?? 'N/A',
            'booked_count' => $mostBooked ? ("{$mostBooked->bookings_count} Bookings") : 'N/A',
        ];
    }

    private function getTopSalesData($last30Days, $limit): array
    {
        $items = PropertyBooking::join('properties', 'property_bookings.property_id', '=', 'properties.id')
            ->where('property_bookings.created_at', '>=', $last30Days)
            ->select('properties.title', DB::raw('count(*) as total'))
            ->groupBy('properties.title')->orderByDesc('total')->limit($limit)->get();

        return [
            'period' => 'Top Properties (L30D)',
            'items' => $items->map(fn($i, $idx) => [
                'rank' => '#' . ($idx + 1),
                'title' => Str::limit($i->title, 30),
                'bookings' => number_format($i->total) . ' Bookings',
            ])->toArray()
        ];
    }

    private function getCalendarEvents($last180Days, $next180Days): array
    {
        $events = collect();

        if (module_enabled('properties')) {
            $events = $events->merge(PropertyBooking::with('property')->where('status', 'confirmed')
                ->where(fn($q) => $q->whereBetween('check_in_date', [$last180Days, $next180Days])->orWhereBetween('check_out_date', [$last180Days, $next180Days]))
                ->get()->map(fn($b) => [
                    'title' => Str::limit($b->property->title ?? 'Property', 25) . ' (Booking)',
                    'start' => $b->check_in_date, 'end' => $b->check_out_date, 'color' => '#17a2b8', 'allDay' => true
                ]));
        }

        if (module_enabled('events')) {
            $events = $events->merge(EventBooking::with(['event', 'occurrence'])->where('status', 'confirmed')
                ->whereHas('occurrence', fn($q) => $q->whereBetween('start_date_time', [$last180Days, $next180Days]))
                ->get()->map(fn($b) => [
                    'title' => Str::limit($b->event->title ?? 'Event', 25) . ' (Event)',
                    'start' => $b->occurrence->start_date_time, 'end' => $b->occurrence->end_date_time ?? $b->occurrence->start_date_time, 'color' => '#28a745'
                ]));
        }

        if (module_enabled('services')) {
            $events = $events->merge(ServiceAppointment::with('service:id,title')->where('status', 'confirmed')
                ->whereBetween('scheduled_at', [$last180Days, $next180Days])
                ->get(['id', 'service_id', 'scheduled_at'])->map(fn($a) => [
                    'title' => Str::limit($a->service->title ?? 'Service', 25) . ' (Appt.)',
                    'start' => $a->scheduled_at, 'end' => $a->scheduled_at?->copy()->addHour(), 'color' => '#ffc107'
                ]));
        }

        $events = $events->merge(Campaign::where('status', 'active')
            ->where(fn($q) => $q->whereBetween('start_date', [$last180Days, $next180Days])->orWhereBetween('end_date', [$last180Days, $next180Days]))
            ->get(['id', 'title', 'start_date', 'end_date', 'color'])->map(fn($c) => [
                'title' => $c->title . ' (Campaign)', 'start' => $c->start_date->toIso8601String(), 'end' => $c->end_date->toIso8601String(), 'color' => $c->color,
                'allDay' => $c->start_date->format('H:i') == '00:00' && $c->end_date->format('H:i') == '00:00'
            ]));

        return $events->sortBy('start')->values()->toArray();
    }

    private function getEnabledModuleStats($last24Hours): array
    {
        $approvals = 0; $live = 0; $leads = 0;
        $config = [
            'properties'   => [Property::class, PropertyBooking::class],
            'events'       => [Event::class, EventBooking::class],
            'jobs'         => [JobListing::class, JobApplication::class],
            'autos'        => [Auto::class, AutoInquiry::class],
            'services'     => [Service::class, ServiceQuote::class],
            'classifieds'  => [Classified::class, ClassifiedInquiry::class],
            'products'     => [Product::class, Order::class],
        ];

        foreach ($config as $mod => $models) {
            if (module_enabled($mod)) {
                $approvals += $models[0]::where('is_published', false)->count();
                $live += $models[0]::where('is_published', true)->count();
                $leads += $models[1]::where('created_at', '>=', $last24Hours)->count();
                if ($mod === 'services') $leads += ServiceAppointment::where('created_at', '>=', $last24Hours)->count();
            }
        }

        return ['listing_approvals' => $approvals, 'live_listings' => $live, 'new_leads_24h' => $leads];
    }

    private function getHeatmapData(): array
    {
        $points = [];
        $modules = [
            'properties'   => Property::class,
            'autos'        => Auto::class,
            'events'       => Event::class,
            'jobs'         => JobListing::class,
            'services'     => Service::class,
            'classifieds'  => Classified::class,
        ];

        foreach ($modules as $mod => $modelClass) {
            if (module_enabled($mod)) {
                try {
                    $records = $modelClass::where('is_published', true)
                        ->whereNotNull('latitude')
                        ->whereNotNull('longitude')
                        ->select('latitude', 'longitude')
                        ->get();

                    foreach ($records as $r) {
                        $points[] = [(float) $r->latitude, (float) $r->longitude, 0.6];
                    }
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::warning("Failed to fetch heatmap data for module {$mod}: " . $e->getMessage());
                }
            }
        }

        return $points;
    }

    public function getEcommerceMetrics(): array
    {
        $today = now();
        $lastMonth = $today->copy()->subMonth();
        $prevMonth = $lastMonth->copy()->subMonth();
        $currentYear = $today->year;
        $last180Days = $today->copy()->subDays(180);
        $next180Days = $today->copy()->addDays(180);

        $totalEarned = Order::where('payment_status', 'paid')->sum('total_amount');
        $currentYearEarnings = Order::where('payment_status', 'paid')->whereYear('created_at', $currentYear)->sum('total_amount');
        $lastYearEarnings = Order::where('payment_status', 'paid')->whereYear('created_at', $currentYear - 1)->sum('total_amount');

        if ($lastYearEarnings > 0) {
            $yoy = round((($currentYearEarnings - $lastYearEarnings) / $lastYearEarnings) * 100, 1);
        } else {
            $yoy = $currentYearEarnings > 0 ? 100 : 0;
        }

        $totalUsers = User::count();
        $usersLastMonth = User::where('created_at', '>=', $lastMonth)->count();
        $usersPrevMonth = User::where('created_at', '>=', $prevMonth)->where('created_at', '<', $lastMonth)->count();
        $growth = ($usersPrevMonth > 0) ? round((($usersLastMonth - $usersPrevMonth) / $usersPrevMonth) * 100) : 0;

        $recentOrders = Order::with('user')->orderByDesc('created_at')->limit(5)->get()->map(function($o) {
            $map = ['pending' => 'warning', 'failed' => 'danger', 'paid' => 'success'];
            $cls = $map[$o->payment_status] ?? 'info';
            return [
                'title' => "Order #{$o->order_number} (" . ucfirst($o->payment_status) . ")",
                'tag' => 'Order', 'icon_class' => "fa fa-shopping-cart text-{$cls}", 'tag_class' => "bg-{$cls}",
            ];
        });

        $topSellersData = OrderItem::select('product_id', 'product_name', DB::raw('SUM(quantity) as total'))
            ->groupBy('product_id', 'product_name')->orderByDesc('total')->limit(5)->get()
            ->map(fn($i, $idx) => ['rank' => '#' . ($idx + 1), 'title' => $i->product_name, 'bookings' => $i->total . ' Sales']);

        $subscribers = NewsletterSubscriber::where('created_at', '>=', $lastMonth)->count();
        $activeSubs = Subscription::where('status', 'active')->count();
        $convRate = ($usersLastMonth > 0) ? round(($subscribers / $usersLastMonth) * 100) : 0;
        $subPercent = ($totalUsers > 0) ? round(($activeSubs / $totalUsers) * 100) : 0;

        return [
            'system_kpis' => ['earnings' => '$' . number_format($totalEarned, 0), 'yoy_change' => ($yoy >= 0 ? '+' : '-') . abs($yoy) . '%'],
            'urgent_actions' => [
                'pending_orders' => Order::where('status', Order::STATUS_PENDING)->count(),
                'low_stock_alerts' => Product::where('manage_stock', true)->whereRaw('stock_quantity <= low_stock_threshold')->count(),
                'pending_payouts' => '$' . number_format(Withdrawal::where('status', 'pending')->sum('amount') / 100, 0),
                'unresolved_tickets' => Ticket::unresolved()->count(),
            ],
            'secondary_metrics' => [
                'active_customers' => number_format(User::role('user')->count() ?: User::count()),
                'live_products' => number_format(Product::where('is_published', true)->count()),
                'conversion_rate' => (User::count() > 0 ? round((Order::where('payment_status', 'paid')->count() / User::count()) * 100, 1) : 0) . '%',
            ],
            'recent_orders' => ['items' => $recentOrders],
            'top_sellers' => ['items' => $topSellersData],
            'user_metrics' => [
                'total_users' => number_format($totalUsers),
                'users_growth_desc' => ($growth >= 0 ? '+' : '-') . abs($growth) . '% Growth (L30D)',
                'newsletter_conversion' => $convRate,
                'newsletter_desc' => $convRate . '% Subscriber Conversion (L30D)',
                'subscriptions_percent' => $subPercent,
                'subscriptions_desc' => $subPercent . '% of Total Users are Active Subscribers',
            ],
            'js_data' => [
                'revenue_chart' => $this->getMonthlyRevenueChart($currentYear),
                'type_chart' => $this->getModuleDistributionChart(),
                'calendar_events' => $this->getCalendarEvents($last180Days, $next180Days),
                'heatmap_data' => $this->getHeatmapData()
            ]
        ];
    }

    public function getPendingListings()
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
            $newQuery = $modelClass::where('is_published', false)
                ->select('id', 'title', 'created_at', 'user_id')
                ->selectRaw("'" . Str::afterLast($modelClass, '\\') . "' as listing_type");
            $pendingListingsQuery = ($pendingListingsQuery === null) ? $newQuery : $pendingListingsQuery->unionAll($newQuery);
        }

        return $pendingListingsQuery ? $pendingListingsQuery->orderByDesc('created_at')->with('user')->paginate(20) : collect();
    }
}
