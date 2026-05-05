@php
    $urgent = [
        ['val' => $metrics['urgent_actions']['partner_applications'] ?? 0, 'label' => 'Partners Applications', 'route' => 'admin.users.partners', 'color' => 'danger', 'icon' => 'fa-user-shield'],
        ['val' => $metrics['urgent_actions']['listing_approvals'] ?? 0, 'label' => 'Moderation Approvals', 'route' => 'admin.listings.index', 'color' => 'warning', 'icon' => 'fa-edit'],
        ['val' => $metrics['urgent_actions']['pending_payouts'] ?? 0, 'label' => 'Pending Payouts', 'route' => 'admin.withdrawals.pending', 'color' => 'info', 'icon' => 'fa-wallet'],
        ['val' => $metrics['urgent_actions']['unresolved_tickets'] ?? 0, 'label' => 'Unresolved Tickets', 'route' => 'admin.tickets.index', 'color' => 'secondary', 'icon' => 'fa-headset'],
    ];
@endphp

<div class="row">
    {{-- Main Financial Dashboard card --}}
    <div class="col-lg-4 mb-4">
        <div class="card card-premium-dark h-100">
            <div class="card-body position-relative z-index-1 d-flex flex-column justify-content-center px-4">
                <p class="text-white-50 text-uppercase smallest font-weight-bold mb-2 letter-spacing-1">Platform Net Revenue (YTD)</p>
                <h1 class="text-white display-4 font-weight-bold mb-3" style="letter-spacing: -2px;">{{ $metrics['system_kpis']['earnings'] }}</h1>
                @if(isset($metrics['system_kpis']['yoy_change']))
                <div class="d-flex align-items-center">
                    <span class="badge badge-success-light border-0 mr-2 font-weight-bold px-3 py-2 rounded-pill smallest">
                        <i class="fas fa-arrow-up mr-1"></i> {{ $metrics['system_kpis']['yoy_change'] }} YoY
                    </span>
                    <span class="text-white-50 smallest font-weight-bold uppercase letter-spacing-1">Analytics Stream</span>
                </div>
                @endif
                <div class="mt-4">
                    <a href="{{ route('admin.payments.index')}}" class="btn btn-primary rounded-pill px-4 font-weight-bold smallest letter-spacing-1">
                        FINANCIAL REPORT <i class="fas fa-chevron-right ml-1"></i>
                    </a>
                </div>
            </div>
            <i class="fas fa-chart-pie glassmorphic-glow-icon" style="font-size: 9rem; opacity: 0.05;"></i>
        </div>
    </div>
    
    {{-- Urgent Actions mesh cards --}}
    <div class="col-lg-8 mb-4">
        <div class="row h-100">
            @foreach($urgent as $u)
                @php
                    $valNumeric = is_numeric($u['val']) ? $u['val'] : (float) filter_var($u['val'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                    $hasAlert = $valNumeric > 0;
                @endphp
                <div class="col-md-3 mb-4 mb-md-0">
                    <div class="card gradient-action-card h-100 bg-gradient-{{ $u['color'] }}">
                        <div class="card-body p-4 flex-grow-1 d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <small class="text-white-50 font-weight-bold uppercase smallest letter-spacing-1">{{ $u['label'] }}</small>
                                @if ($hasAlert)
                                    <span class="action-badge-pulsing d-flex align-items-center">
                                        <span class="pulse-glow-dot bg-white mr-1"></span> ACTION
                                    </span>
                                @endif
                            </div>

                            <div class="my-auto">
                                <h1 class="font-weight-bold mb-0 text-white" style="font-size: 2.4rem; letter-spacing: -1.5px;">{{ $u['val'] }}</h1>
                                <p class="text-white-50 mb-0 smallest font-weight-bold uppercase letter-spacing-1">Pending Audit</p>
                            </div>

                            <i class="fas {{ $u['icon'] }} glassmorphic-glow-icon"></i>
                            <a href="{{ route($u['route']) }}" class="stretched-link"></a>
                        </div>
                        <div class="card-footer d-flex align-items-center justify-content-between border-0 py-3" style="background: rgba(0,0,0,0.15); font-size: var(--text-smallest); font-weight: 700; letter-spacing: 1px;">
                            <span>MANAGE RECORDS</span>
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                </div>
            @endforeach
            
            {{-- Metrics stats bottom row --}}
            <div class="col-12 mt-4">
                <div class="row">
                    @php
                        $secondary = [
                            ['label' => 'Active Partners', 'val' => $metrics['secondary_metrics']['active_partners'], 'icon' => 'fa-user-shield', 'bg' => 'success'],
                            ['label' => 'Live Listings', 'val' => $metrics['secondary_metrics']['live_properties'], 'icon' => 'fa-globe', 'bg' => 'info'],
                            ['label' => 'New Leads (24H)', 'val' => $metrics['secondary_metrics']['new_leads_24h'], 'icon' => 'fa-bolt', 'bg' => 'warning'],
                        ];
                    @endphp
                    @foreach($secondary as $s)
                    <div class="col-md-4 mb-3 mb-md-0">
                        <div class="card card-premium border-0">
                            <div class="card-body py-3 px-4 d-flex align-items-center justify-content-between">
                                <div>
                                    <span class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1 mb-1 d-block">{{ $s['label'] }}</span>
                                    <h3 class="font-weight-bold mb-0 text-dark" style="font-size: 1.6rem; letter-spacing: -1px;">{{ $s['val'] }}</h3>
                                </div>
                                <div class="icon-box-soft ml-auto bg-{{ $s['bg'] }}-soft">
                                    <i class="fas {{ $s['icon'] }}"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</div>
