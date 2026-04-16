<div class="row">
    <div class="col-lg-4">
        <div class="card border-0 shadow-sm h-100 overflow-hidden">
            <div class="card-header bg-white border-0 py-3">
                <h6 class="m-0 font-weight-bold"><i class="fas fa-history mr-2 text-success"></i>Live Transactions</h6>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <tbody>
                            @foreach ($metrics['recent_bookings']['items'] as $item)
                            <tr>
                                <td class="pl-3" width="50">
                                    <div class="avatar-sm bg-light rounded-circle text-center py-1">
                                        <i class="fas {{ $item['icon_class'] }} text-muted"></i>
                                    </div>
                                </td>
                                <td>
                                    <span class="d-block font-weight-bold small text-dark">{{ Str::limit($item['title'], 25) }}</span>
                                    <span class="text-muted" style="font-size: 0.7rem;">{{ $item['value'] ?? 'Processing' }}</span>
                                </td>
                                <td class="text-right pr-3">
                                    <span class="badge {{ $item['tag_class'] }} px-2 py-1">{{ $item['tag'] }}</span>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="card-footer bg-light-gray border-0 text-center py-2">
                <a href="{{ route('admin.activity-log.index') }}" class="small font-weight-bold text-success">Full Audit Log</a>
            </div>
        </div>
    </div>
    
    <div class="col-lg-4">
        <div class="card border-0 shadow-sm h-100 overflow-hidden">
            <div class="card-header bg-white border-0 py-3 d-flex justify-content-between">
                <h6 class="m-0 font-weight-bold">Revenue Flow</h6>
                <span class="badge badge-success-light text-success">MoM Trend</span>
            </div>
            <div class="card-body py-0">
                <div style="height: 300px;"><canvas id="revenueChart"></canvas></div>
            </div>
        </div>
    </div>

    <div class="col-lg-4">
        <div class="card border-0 shadow-sm h-100 overflow-hidden">
            <div class="card-header bg-white border-0 py-3">
                <h6 class="m-0 font-weight-bold">Deals by Types</h6>
            </div>
            <div class="card-body py-0">
                <div style="height: 300px;"><canvas id="propertyTypeChart"></canvas></div>
            </div>
        </div>
    </div>
</div>
