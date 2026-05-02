@php
    $urgent = [
        ['val' => $metrics['urgent_actions']['pending_orders'] ?? 0, 'label' => 'Pending Orders', 'route' => 'admin.product-orders.index', 'color' => 'danger', 'icon' => 'fa-shopping-cart'],
        ['val' => $metrics['urgent_actions']['low_stock_alerts'] ?? 0, 'label' => 'Low Stock Alerts', 'route' => 'admin.products.index', 'color' => 'warning', 'icon' => 'fa-exclamation-triangle'],
        ['val' => $metrics['urgent_actions']['pending_payouts'] ?? 0, 'label' => 'Pending Payouts', 'route' => 'admin.withdrawals.pending', 'color' => 'info', 'icon' => 'fa-wallet'],
        ['val' => $metrics['urgent_actions']['unresolved_tickets'] ?? 0, 'label' => 'Support Tickets', 'route' => 'admin.tickets.index', 'color' => 'secondary', 'icon' => 'fa-headset'],
    ];
@endphp

<div class="row">
    {{-- Main Financial Dashboard card --}}
    <div class="col-lg-4">
        <div class="card border-0 shadow-lg bg-primary overflow-hidden h-100" style="min-height: 240px; border-radius: 16px; background: linear-gradient(135deg, #46a5ac, #2d7d83) !important;">
            <div class="card-body position-relative z-index-1 d-flex flex-column justify-content-center px-4">
                <p class="text-white-50 text-uppercase small font-weight-bold mb-1" style="letter-spacing: 0.8px;">Ecommerce Gross Sales (YTD)</p>
                <h1 class="text-white display-4 font-weight-bold mb-2">{{ $metrics['system_kpis']['earnings'] }}</h1>
                @if(isset($metrics['system_kpis']['yoy_change']))
                <p class="text-white small italic mb-0">
                    <i class="fas fa-chart-line mr-1 text-warning"></i> <strong>{{ $metrics['system_kpis']['yoy_change'] }}</strong> vs last year
                </p>
                @endif
                <div class="mt-4">
                    <a href="{{ route('admin.product-orders.index')}}" class="btn btn-sm btn-light rounded-pill px-4 font-weight-bold shadow-sm" style="background: rgba(255,255,255,0.9);">
                        Orders Center <i class="fas fa-angle-right ml-1"></i>
                    </a>
                </div>
            </div>
            <i class="fas fa-shopping-bag position-absolute" style="bottom: -20px; right: -10px; font-size: 8rem; opacity: 0.08; color: #fff;"></i>
        </div>
    </div>
    
    {{-- Urgent Actions mesh cards --}}
    <div class="col-lg-8">
        <div class="row h-100">
            @foreach($urgent as $u)
                @php
                    $valNumeric = is_numeric($u['val']) ? $u['val'] : (float) filter_var($u['val'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                    $hasAlert = $valNumeric > 0;
                @endphp
                <div class="col-md-3">
                    <div class="card gradient-action-card h-100 shadow-sm" style="background: linear-gradient(45deg, #1e293b, #334155); border: none;">
                        <div class="card-body p-3 flex-grow-1 d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <small class="text-white-50 font-weight-bold uppercase" style="font-size: 9px; letter-spacing: 0.5px;">{{ $u['label'] }}</small>
                                @if ($hasAlert)
                                    <span class="action-badge-pulsing d-flex align-items-center" style="background: #46a5ac;">
                                        <span class="pulse-glow-dot bg-white mr-1"></span> !
                                    </span>
                                @endif
                            </div>

                            <div class="my-auto">
                                <h1 class="font-weight-bold mb-1 text-white" style="font-size: 2.2rem; letter-spacing: -1px;">{{ $u['val'] }}</h1>
                                <p class="text-white-50 mb-3 small">Urgent Attention</p>
                            </div>

                            <i class="fas {{ $u['icon'] }} glassmorphic-glow-icon" style="color: #46a5ac; opacity: 0.3;"></i>
                            <a href="{{ route($u['route']) }}" class="stretched-link"></a>
                        </div>
                    </div>
                </div>
            @endforeach
            
            {{-- Metrics stats bottom row --}}
            <div class="col-12 mt-3">
                <div class="row">
                    <div class="col-md-4 mb-3 mb-md-0">
                        <div class="card border-0 shadow-premium" style="border-radius: 20px;">
                            <div class="card-body py-3 px-4 d-flex align-items-center justify-content-between">
                                <div>
                                    <span class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1 mb-1 d-block">Active Customers</span>
                                    <h3 class="font-weight-bold mb-0 text-dark" style="font-size: 1.6rem; letter-spacing: -1px; font-family: 'Outfit', sans-serif;">{{ $metrics['secondary_metrics']['active_customers'] }}</h3>
                                </div>
                                <div class="icon-box-soft ml-auto bg-success-soft text-success shadow-xs" style="width: 48px; height: 48px; font-size: 1.2rem; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-users"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 mb-3 mb-md-0">
                        <div class="card border-0 shadow-premium" style="border-radius: 20px;">
                            <div class="card-body py-3 px-4 d-flex align-items-center justify-content-between">
                                <div>
                                    <span class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1 mb-1 d-block">Live Products</span>
                                    <h3 class="font-weight-bold mb-0 text-dark" style="font-size: 1.6rem; letter-spacing: -1px; font-family: 'Outfit', sans-serif;">{{ $metrics['secondary_metrics']['live_products'] }}</h3>
                                </div>
                                <div class="icon-box-soft ml-auto bg-info-soft text-info shadow-xs" style="width: 48px; height: 48px; font-size: 1.2rem; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-shopping-bag"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 mb-3 mb-md-0">
                        <div class="card border-0 shadow-premium" style="border-radius: 20px;">
                            <div class="card-body py-3 px-4 d-flex align-items-center justify-content-between">
                                <div>
                                    <span class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1 mb-1 d-block">Conversion Rate</span>
                                    <h3 class="font-weight-bold mb-0 text-dark" style="font-size: 1.6rem; letter-spacing: -1px; font-family: 'Outfit', sans-serif;">{{ $metrics['secondary_metrics']['conversion_rate'] }}</h3>
                                </div>
                                <div class="icon-box-soft ml-auto bg-warning-soft text-warning shadow-xs" style="width: 48px; height: 48px; font-size: 1.2rem; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-funnel-dollar"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
