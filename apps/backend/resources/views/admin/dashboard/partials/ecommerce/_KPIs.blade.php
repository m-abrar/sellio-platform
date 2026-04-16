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
        <div class="card border-0 shadow-lg bg-primary overflow-hidden h-100" style="min-height: 240px; border-radius: 16px; background: linear-gradient(135deg, #FF3366, #ba264b) !important;">
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
                    <div class="card gradient-action-card h-100 bg-gradient-{{ $u['color'] }} shadow-sm">
                        <div class="card-body p-3 flex-grow-1 d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <small class="text-white-50 font-weight-bold uppercase" style="font-size: 9px; letter-spacing: 0.5px;">{{ $u['label'] }}</small>
                                @if ($hasAlert)
                                    <span class="action-badge-pulsing d-flex align-items-center">
                                        <span class="pulse-glow-dot bg-white mr-1"></span> !
                                    </span>
                                @endif
                            </div>

                            <div class="my-auto">
                                <h1 class="font-weight-bold mb-1 text-white" style="font-size: 2.2rem; letter-spacing: -1px;">{{ $u['val'] }}</h1>
                                <p class="text-white-50 mb-3 small">Urgent Attention</p>
                            </div>

                            <i class="fas {{ $u['icon'] }} glassmorphic-glow-icon"></i>
                            <a href="{{ route($u['route']) }}" class="stretched-link"></a>
                        </div>
                    </div>
                </div>
            @endforeach
            
            {{-- Metrics stats bottom row --}}
            <div class="col-12 mt-3">
                <div class="row">
                    <div class="col-md-4">
                        <div class="card glass-premium-card border-0 shadow-sm">
                            <div class="card-body py-2 px-3">
                                <div class="d-flex align-items-center justify-content-between mb-2">
                                    <span class="text-muted small font-weight-bold text-uppercase" style="letter-spacing: 0.8px; font-size: 10px;">Active Customers</span>
                                    <div class="icon-box-soft bg-success-soft" style="width: 34px; height: 34px; font-size: 0.9rem; border-radius: 8px;">
                                        <i class="fas fa-users text-success"></i>
                                    </div>
                                </div>
                                <h2 class="font-weight-bold mb-0 text-dark" style="font-size: 1.6rem; letter-spacing: -0.5px;">{{ $metrics['secondary_metrics']['active_customers'] }}</h2>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card glass-premium-card border-0 shadow-sm">
                            <div class="card-body py-2 px-3">
                                <div class="d-flex align-items-center justify-content-between mb-2">
                                    <span class="text-muted small font-weight-bold text-uppercase" style="letter-spacing: 0.8px; font-size: 10px;">Live Products</span>
                                    <div class="icon-box-soft bg-info-soft" style="width: 34px; height: 34px; font-size: 0.9rem; border-radius: 8px;">
                                        <i class="fas fa-shopping-bag text-info"></i>
                                    </div>
                                </div>
                                <h2 class="font-weight-bold mb-0 text-dark" style="font-size: 1.6rem; letter-spacing: -0.5px;">{{ $metrics['secondary_metrics']['live_products'] }}</h2>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card glass-premium-card border-0 shadow-sm">
                            <div class="card-body py-2 px-3">
                                <div class="d-flex align-items-center justify-content-between mb-2">
                                    <span class="text-muted small font-weight-bold text-uppercase" style="letter-spacing: 0.8px; font-size: 10px;">Conversion Rate</span>
                                    <div class="icon-box-soft bg-warning-soft" style="width: 34px; height: 34px; font-size: 0.9rem; border-radius: 8px;">
                                        <i class="fas fa-funnel-dollar text-warning"></i>
                                    </div>
                                </div>
                                <h2 class="font-weight-bold mb-0 text-dark" style="font-size: 1.6rem; letter-spacing: -0.5px;">{{ $metrics['secondary_metrics']['conversion_rate'] }}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
