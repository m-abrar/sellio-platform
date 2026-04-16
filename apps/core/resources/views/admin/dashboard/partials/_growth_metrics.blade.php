<div class="row">
    @php
        $growthItems = [
            ['val' => $metrics['user_metrics']['total_users'] ?? 0, 'label' => 'Registered Users', 'pct' => $metrics['user_metrics']['users_growth_percent'] ?? 0, 'desc' => $metrics['user_metrics']['users_growth_desc'] ?? '', 'color' => 'success', 'icon' => 'fa-users'],
            ['val' => $metrics['user_metrics']['newsletter_subscribers'] ?? 0, 'label' => 'Subscribers (Wk)', 'pct' => $metrics['user_metrics']['newsletter_conversion'] ?? 0, 'desc' => $metrics['user_metrics']['newsletter_desc'] ?? '', 'color' => 'purple', 'icon' => 'fa-mail-bulk'],

            ['val' => $metrics['user_metrics']['active_subscriptions'] ?? 0, 'label' => 'Active Members', 'pct' => $metrics['user_metrics']['subscriptions_percent'] ?? 0, 'desc' => $metrics['user_metrics']['subscriptions_desc'] ?? '', 'color' => 'info', 'icon' => 'fa-id-card'],
        ];
    @endphp
    
    @foreach($growthItems as $g)
    <div class="col-lg-4">
        <div class="card glass-premium-card border-0 shadow-sm">
            <div class="card-body py-2 px-3">
                <div class="d-flex align-items-center justify-content-between mb-1">
                    <span class="text-muted small font-weight-bold text-uppercase" style="letter-spacing: 0.8px; font-size: 10px;">{{ $g['label'] }}</span>
                    <div class="icon-box-soft bg-{{ $g['color'] }}-soft" style="width: 34px; height: 34px; font-size: 0.9rem; border-radius: 8px;">
                        <i class="fas {{ $g['icon'] }}"></i>
                    </div>
                </div>

                <div class="d-flex align-items-baseline mb-2">
                    <h2 class="font-weight-bold mb-0 text-dark mr-2" style="font-size: 1.8rem; letter-spacing: -0.5px;">{{ $g['val'] }}</h2>
                    <span class="badge badge-{{ $g['color'] }}-light text-{{ $g['color'] }} px-2 py-0" style="font-size: 0.65rem; font-weight: 700; border-radius: 4px;">
                        {{ $g['pct'] }}%
                    </span>
                </div>

                <div class="progress mb-1" style="height: 4px; background: rgba(0,0,0,0.03); border-radius: 4px;">
                    <div class="progress-bar bg-{{ $g['color'] }}" style="width: {{ $g['pct'] }}%; border-radius: 4px;"></div>
                </div>

                <p class="small text-muted mb-0 font-italic" style="font-size: 10.5px; opacity: 0.8;">{{ $g['desc'] }}</p>


            </div>
        </div>
    </div>
    @endforeach
</div>
