<div class="row">
    <!-- Customer Base Expansion -->
    <div class="col-lg-6 mb-4">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 12px;">
            <div class="card-header bg-white border-0 py-3">
                <h6 class="m-0 font-weight-bold text-secondary text-uppercase small" style="letter-spacing: 1px;">Customer Base Expansion</h6>
            </div>
            <div class="card-body">
                <div class="row align-items-center mb-4">
                    <div class="col-auto">
                        <div class="icon-circle bg-primary-light">
                            <i class="fas fa-users text-primary"></i>
                        </div>
                    </div>
                    <div class="col">
                        <h2 class="font-weight-bold mb-0 text-dark">{{ $metrics['user_metrics']['total_users'] }}</h2>
                        <span class="text-success small"><i class="fas fa-arrow-up"></i> {{ $metrics['user_metrics']['users_growth_desc'] }}</span>
                    </div>
                </div>

                <div class="progress-group mb-4">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="text-muted small">Newsletter Conversion</span>
                        <span class="font-weight-bold">{{ $metrics['user_metrics']['newsletter_conversion'] }}%</span>
                    </div>
                    <div class="progress progress-sm" style="height: 6px; border-radius: 3px;">
                        <div class="progress-bar bg-info" style="width: {{ $metrics['user_metrics']['newsletter_conversion'] }}%"></div>
                    </div>
                    <small class="text-muted">{{ $metrics['user_metrics']['newsletter_desc'] }}</small>
                </div>

                <div class="progress-group">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="text-muted small">Subscription Rate</span>
                        <span class="font-weight-bold">{{ $metrics['user_metrics']['subscriptions_percent'] }}%</span>
                    </div>
                    <div class="progress progress-sm" style="height: 6px; border-radius: 3px;">
                        <div class="progress-bar bg-success" style="width: {{ $metrics['user_metrics']['subscriptions_percent'] }}%"></div>
                    </div>
                    <small class="text-muted">{{ $metrics['user_metrics']['subscriptions_desc'] }}</small>
                </div>
            </div>
        </div>
    </div>

    <!-- Regional Sales (Heatmap) -->
    <div class="col-lg-6 mb-4">
        <div class="card border-0 shadow-sm h-100" style="border-radius: 12px;">
            <div class="card-header bg-white border-0 py-3">
                <h6 class="m-0 font-weight-bold text-secondary text-uppercase small" style="letter-spacing: 1px;">Global Sales Distribution</h6>
            </div>
            <div class="card-body p-0">
                <div id="heatmap" style="height: 350px; border-radius: 0 0 12px 12px;"></div>
            </div>
        </div>
    </div>
</div>
