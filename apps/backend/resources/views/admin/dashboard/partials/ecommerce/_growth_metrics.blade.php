<div class="row">
    <!-- Customer Base Expansion -->
    <div class="col-lg-6 mb-4">
        <div class="card border-0 shadow-premium h-100 rounded-xl">
            <div class="card-header bg-white border-0 py-4 px-4">
                <h6 class="m-0 font-weight-bold text-secondary text-uppercase smallest letter-spacing-1">Customer Base Expansion</h6>
            </div>
            <div class="card-body p-4">
                <div class="row align-items-center mb-4">
                    <div class="col-auto">
                        <div class="icon-box-soft lg bg-primary-soft text-primary shadow-xs">
                            <i class="fas fa-users"></i>
                        </div>
                    </div>
                    <div class="col">
                        <h2 class="font-weight-bold mb-0 text-dark text-display-premium text-tight">{{ $metrics['user_metrics']['total_users'] }}</h2>
                        <span class="text-success small"><i class="fas fa-arrow-up"></i> {{ $metrics['user_metrics']['users_growth_desc'] }}</span>
                    </div>
                </div>

                <div class="progress-group mb-4">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="text-muted small">Newsletter Conversion</span>
                        <span class="font-weight-bold">{{ $metrics['user_metrics']['newsletter_conversion'] }}%</span>
                    </div>
                    <div class="progress progress-sm" style="height: 6px; border-radius: 6px;">
                        <div class="progress-bar bg-info" style="width: {{ $metrics['user_metrics']['newsletter_conversion'] }}%; border-radius: 6px;"></div>
                    </div>
                    <small class="text-muted smallest font-weight-bold uppercase letter-spacing-1 opacity-50">{{ $metrics['user_metrics']['newsletter_desc'] }}</small>
                </div>

                <div class="progress-group">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="text-muted small">Subscription Rate</span>
                        <span class="font-weight-bold">{{ $metrics['user_metrics']['subscriptions_percent'] }}%</span>
                    </div>
                    <div class="progress progress-sm" style="height: 6px; border-radius: 6px;">
                        <div class="progress-bar bg-success" style="width: {{ $metrics['user_metrics']['subscriptions_percent'] }}%; border-radius: 6px;"></div>
                    </div>
                    <small class="text-muted smallest font-weight-bold uppercase letter-spacing-1 opacity-50">{{ $metrics['user_metrics']['subscriptions_desc'] }}</small>
                </div>
            </div>
        </div>
    </div>

    <!-- Regional Sales (Heatmap) -->
    <div class="col-lg-6 mb-4">
        <div class="card border-0 shadow-premium h-100 rounded-xl overflow-hidden">
            <div class="card-header bg-white border-0 py-4 px-4">
                <h6 class="m-0 font-weight-bold text-secondary text-uppercase smallest letter-spacing-1">Global Sales Distribution</h6>
            </div>
            <div class="card-body p-0">
                <div id="heatmap" class="heatmap-container-premium"></div>
            </div>
        </div>
    </div>
</div>
