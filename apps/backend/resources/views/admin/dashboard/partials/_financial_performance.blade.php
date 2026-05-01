<div class="row">
    {{-- 1. LIVE TRANSACTIONS --}}
    <div class="col-lg-4 mb-4">
        <div class="card border-0 shadow-premium h-100 overflow-hidden" style="border-radius: 24px;">
            <div class="card-header bg-white border-0 py-4 px-4">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                    <i class="fas fa-history mr-2 text-primary opacity-50"></i> Live Transactions
                </h3>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <tbody>
                            @foreach ($metrics['recent_bookings']['items'] as $item)
                            <tr>
                                <td class="pl-4" width="60">
                                    <div class="icon-box-soft bg-primary-soft text-primary shadow-xs" style="width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas {{ $item['icon_class'] }}"></i>
                                    </div>
                                </td>
                                <td class="py-3">
                                    <span class="d-block font-weight-bold text-dark mb-1" style="font-size: 0.9rem;">{{ Str::limit($item['title'], 25) }}</span>
                                    <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">{{ $item['value'] ?? 'OPERATIONAL' }}</span>
                                </td>
                                <td class="text-right pr-4">
                                    <span class="badge {{ str_replace('bg-', 'badge-', $item['tag_class']) }}-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                                        {{ $item['tag'] }}
                                    </span>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="card-footer bg-light-soft border-0 text-center py-3">
                <a href="{{ route('admin.activity-log.index') }}" class="smallest font-weight-bold text-primary uppercase letter-spacing-1">
                    Full Operational Audit <i class="fas fa-chevron-right ml-1"></i>
                </a>
            </div>
        </div>
    </div>
    
    {{-- 2. REVENUE ANALYTICS --}}
    <div class="col-lg-4 mb-4">
        <div class="card border-0 shadow-premium h-100 overflow-hidden" style="border-radius: 24px;">
            <div class="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">Revenue Analytics</h3>
                <span class="badge badge-success-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase">MoM TREND</span>
            </div>
            <div class="card-body py-2 px-4 d-flex flex-column justify-content-center">
                <div style="height: 280px;"><canvas id="revenueChart"></canvas></div>
            </div>
            <div class="card-footer bg-white border-0 py-3 text-center">
                <p class="mb-0 smallest text-muted font-weight-bold uppercase letter-spacing-1">Real-time financial data stream</p>
            </div>
        </div>
    </div>

    {{-- 3. MARKET DISTRIBUTION --}}
    <div class="col-lg-4 mb-4">
        <div class="card border-0 shadow-premium h-100 overflow-hidden" style="border-radius: 24px;">
            <div class="card-header bg-white border-0 py-4 px-4">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">Market Segment Mix</h3>
            </div>
            <div class="card-body py-2 px-4 d-flex flex-column justify-content-center">
                <div style="height: 280px;"><canvas id="propertyTypeChart"></canvas></div>
            </div>
            <div class="card-footer bg-white border-0 py-3 text-center">
                <p class="mb-0 smallest text-muted font-weight-bold uppercase letter-spacing-1">Inventory distribution across verticals</p>
            </div>
        </div>
    </div>
</div>
