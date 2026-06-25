{{--
    Dashboard Partial: Strategic Planning & Geospatial Insights

    This component identifies high-performance inventory through weighted
    engagement metrics and visualizes geographic demand distribution
    via a Leaflet-driven heat map. It facilitates long-term resource
    allocation and territory architecture decisions.

    @param array $metrics Pre-aggregated data including top-selling items and coordinate clusters.
--}}
<div class="row">
    {{-- 1. PERFORMANCE INVENTORY --}}
    <div class="col-lg-5 mb-4">
        <div class="card border-0 shadow-premium h-100 overflow-hidden rounded-xl">
            <div class="card-header bg-white py-4 px-4 border-0">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                    <i class="fas fa-award mr-2 text-success opacity-50"></i> {{ __('High Performance Inventory') }}
                </h3>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0 align-middle">
                        <thead class="bg-light-soft">
                            <tr>
                                <th class="pl-4 smallest font-weight-bold uppercase letter-spacing-1">{{ __('Rank') }}</th>
                                <th class="smallest font-weight-bold uppercase letter-spacing-1">{{ __('Inventory Identity') }}</th>
                                <th class="text-center pr-4 smallest font-weight-bold uppercase letter-spacing-1">{{ __('Engagement') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($metrics['top_sales']['items'] as $item)
                            <tr>
                                <td class="pl-4" width="80">
                                    <span class="badge badge-primary-soft text-primary px-3 py-1 rounded-pill font-weight-bold smallest">#{{ $item['rank'] }}</span>
                                </td>
                                <td class="py-3">
                                    <span class="font-weight-bold text-dark d-block text-truncate" style="max-width: 200px; font-size: 0.9rem;">{{ $item['title'] }}</span>
                                </td>
                                <td class="text-center pr-4">
                                    <span class="badge badge-success-light px-3 py-2 rounded-pill font-weight-bold smallest">
                                        <i class="fas fa-chart-line mr-1"></i> {{ $item['bookings'] }}
                                    </span>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="card-footer bg-white border-0 text-center py-3">
                <a href="{{ route('admin.bookings.index')}}" class="smallest font-weight-bold text-primary uppercase letter-spacing-1">
                    {{ __('Export Comprehensive Dataset') }} <i class="fas fa-download ml-1"></i>
                </a>
            </div>
        </div>
    </div>

    {{-- 2. GEOSPATIAL HEATMAP --}}
    <div class="col-lg-7 mb-4">
        <div class="card border-0 shadow-premium h-100 overflow-hidden rounded-xl">
            <div class="card-header bg-white py-4 px-4 border-0 d-flex align-items-center justify-content-between">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                    <i class="fas fa-map-marked-alt mr-2 text-primary opacity-50"></i> {{ __('Geospatial Demand Heatmap') }}
                </h3>
                @php
                    $heatmapPointCount = $metrics['js_data']['heatmap_meta']['point_count'] ?? count($metrics['js_data']['heatmap_data'] ?? []);
                @endphp
                <span class="badge {{ $heatmapPointCount > 0 ? 'badge-primary-light animate-pulse' : 'badge-secondary-light' }} ml-auto px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                    {{ $heatmapPointCount > 0 ? __('Real Coordinates') : __('Awaiting Coordinates') }}
                </span>
            </div>
            <div class="card-body p-0">
                <div id="heatmap" style="height: 400px; filter: grayscale(0.2) contrast(1.1);"></div>
            </div>
            <div class="card-footer bg-white py-3 px-4 d-flex justify-content-between align-items-center border-0">
                <p class="mb-0 smallest text-muted font-weight-bold uppercase letter-spacing-1">
                    <i class="fas fa-crosshairs mr-1"></i> {{ __(':count live coordinate points', ['count' => $heatmapPointCount]) }}
                </p>
                <a href="{{ route('admin.locations.index')}}" class="smallest font-weight-bold text-primary uppercase letter-spacing-1">
                    {{ __('Manage Territory Architecture') }} <i class="fas fa-arrow-right ml-1"></i>
                </a>
            </div>
        </div>
    </div>
</div>

{{-- 3. SEARCH PULSE --}}
<div class="row">
    <div class="col-12 mb-4">
        <div class="card border-0 shadow-premium overflow-hidden rounded-xl">
            <div class="card-header bg-white py-4 px-4 border-0 d-flex align-items-center justify-content-between">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                    <i class="fas fa-search mr-2 text-warning opacity-75"></i> {{ __('Search Pulse') }}
                </h3>
                <div class="d-flex align-items-center" style="gap:.5rem">
                    <span class="badge badge-warning-soft text-warning px-3 py-2 rounded-pill font-weight-bold smallest">
                        {{ number_format($metrics['search_metrics']['today']) }} {{ __('today') }}
                    </span>
                    <span class="badge badge-light border text-muted px-3 py-2 rounded-pill font-weight-bold smallest">
                        {{ number_format($metrics['search_metrics']['week']) }} {{ __('/ 7 days') }}
                    </span>
                    @if($metrics['search_metrics']['top_module'])
                        <span class="badge badge-secondary-soft text-secondary px-3 py-2 rounded-pill font-weight-bold smallest text-capitalize">
                            <i class="fas fa-star mr-1"></i> {{ $metrics['search_metrics']['top_module'] }}
                        </span>
                    @endif
                </div>
            </div>
            <div class="card-body px-4 py-3">
                <div class="row">
                    {{-- Top keywords --}}
                    <div class="col-md-7 border-right">
                        <p class="smallest font-weight-bold text-uppercase text-muted letter-spacing-1 mb-3">{{ __('Top Keywords (Last 7 Days)') }}</p>
                        @forelse($metrics['search_metrics']['keywords'] as $kw)
                            @php $maxKw = $metrics['search_metrics']['keywords']->first()->total; @endphp
                            <div class="d-flex align-items-center mb-2">
                                <span class="text-dark small text-truncate" style="min-width:140px;max-width:200px" title="{{ $kw->keyword }}">{{ $kw->keyword }}</span>
                                <div class="progress flex-grow-1 mx-3" style="height:5px;border-radius:3px">
                                    <div class="progress-bar bg-warning" style="width:{{ $maxKw > 0 ? round($kw->total / $maxKw * 100) : 0 }}%"></div>
                                </div>
                                <span class="smallest text-muted font-weight-bold" style="min-width:24px;text-align:right">{{ $kw->total }}</span>
                            </div>
                        @empty
                            <p class="text-muted small mb-0">{{ __('No keyword searches recorded yet.') }}</p>
                        @endforelse
                    </div>
                    {{-- By module --}}
                    <div class="col-md-5 mt-3 mt-md-0">
                        <p class="smallest font-weight-bold text-uppercase text-muted letter-spacing-1 mb-3">{{ __('Searches By Module') }}</p>
                        @forelse($metrics['search_metrics']['by_module'] as $mod)
                            @php $maxMod = $metrics['search_metrics']['by_module']->first()->total; @endphp
                            <div class="d-flex align-items-center mb-2">
                                <span class="small text-capitalize text-dark" style="min-width:90px">{{ $mod->module }}</span>
                                <div class="progress flex-grow-1 mx-3" style="height:5px;border-radius:3px">
                                    <div class="progress-bar bg-info" style="width:{{ $maxMod > 0 ? round($mod->total / $maxMod * 100) : 0 }}%"></div>
                                </div>
                                <span class="smallest text-muted font-weight-bold" style="min-width:24px;text-align:right">{{ $mod->total }}</span>
                            </div>
                        @empty
                            <p class="text-muted small mb-0">{{ __('No module data yet.') }}</p>
                        @endforelse
                    </div>
                </div>
            </div>
            <div class="card-footer bg-white border-0 text-center py-3">
                <a href="{{ route('admin.reports.searches') }}" class="smallest font-weight-bold text-warning uppercase letter-spacing-1">
                    {{ __('View Full Search Analytics') }} <i class="fas fa-arrow-right ml-1"></i>
                </a>
            </div>
        </div>
    </div>
</div>
