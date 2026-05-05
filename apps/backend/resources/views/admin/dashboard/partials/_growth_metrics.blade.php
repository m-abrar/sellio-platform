<div class="row">
    @php
        $growthItems = [
            ['val' => $metrics['user_metrics']['total_users'] ?? 0, 'label' => 'Global User Base', 'pct' => $metrics['user_metrics']['users_growth_percent'] ?? 0, 'desc' => 'Total registered ecosystem accounts', 'color' => 'success', 'icon' => 'fa-users'],
            ['val' => $metrics['user_metrics']['newsletter_subscribers'] ?? 0, 'label' => 'Network Reach', 'pct' => $metrics['user_metrics']['newsletter_conversion'] ?? 0, 'desc' => 'Newsletter & communication reach', 'color' => 'primary', 'icon' => 'fa-paper-plane'],
            ['val' => $metrics['user_metrics']['active_subscriptions'] ?? 0, 'label' => 'Elite Membership', 'pct' => $metrics['user_metrics']['subscriptions_percent'] ?? 0, 'desc' => 'Active recurring premium accounts', 'color' => 'info', 'icon' => 'fa-crown'],
        ];
    @endphp
    
    @foreach($growthItems as $g)
    <div class="col-lg-4 mb-4">
        <div class="card border-0 shadow-premium overflow-hidden rounded-xl">
            <div class="card-body p-4">
                <div class="d-flex align-items-center justify-content-between mb-4">
                    <div class="icon-box-soft bg-{{ $g['color'] }}-soft text-{{ $g['color'] }} shadow-xs rounded-lg" style="width: 52px; height: 52px; font-size: 1.4rem; display: flex; align-items: center; justify-content: center;">
                        <i class="fas {{ $g['icon'] }}"></i>
                    </div>
                    <span class="badge badge-{{ $g['color'] }}-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                        <i class="fas fa-arrow-up mr-1"></i> {{ $g['pct'] }}% GROWTH
                    </span>
                </div>

                <div class="mb-3">
                    <span class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1 d-block mb-1">{{ $g['label'] }}</span>
                    <h2 class="font-weight-bold mb-0 text-dark" style="font-size: 2.2rem; letter-spacing: -1.5px; font-family: 'Outfit', sans-serif;">{{ $g['val'] }}</h2>
                </div>

                <div class="progress mb-3" style="height: 6px; background: rgba(0,0,0,0.03); border-radius: 6px; overflow: hidden;">
                    <div class="progress-bar bg-{{ $g['color'] }}" style="width: {{ min($g['pct'], 100) }}%; border-radius: 6px;"></div>
                </div>

                <p class="smallest text-muted mb-0 font-weight-bold uppercase letter-spacing-1 opacity-50">{{ $g['desc'] }}</p>
            </div>
        </div>
    </div>
    @endforeach
</div>
