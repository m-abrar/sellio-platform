@extends('adminlte::page')

@section('plugins.Chartjs', true)

@section('title', __('Search Analytics | Admin'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-search mr-2 text-warning opacity-50"></i> {{ __('Search Query Analytics') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ __('Popular keywords, vertical trends, and zero-result analysis.') }}
                </p>
            </div>
            <div class="col-sm-5 d-flex align-items-center justify-content-end gap-2">
                @foreach([7 => __('7D'), 30 => __('30D'), 90 => __('90D'), 365 => __('1Y')] as $d => $label)
                    <a href="{{ route('admin.reports.searches', ['days' => $d]) }}"
                       class="btn btn-sm {{ $days == $d ? 'btn-warning' : 'btn-outline-secondary' }} rounded-pill px-3">
                        {{ $label }}
                    </a>
                @endforeach
                <a href="{{ route('admin.reports.index') }}" class="btn-back shadow-sm ml-2">
                    <i class="fas fa-th-large"></i> {{ __('Reports') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    {{-- Filter Form --}}
    <div class="card registry-card-premium registry-filter-card mb-5">
        <div class="card-body">
            <form action="{{ route('admin.reports.searches') }}" method="GET" class="row align-items-end g-3">
                <input type="hidden" name="days" value="{{ $days }}">

                <div class="col-lg-5 mb-3 mb-lg-0">
                    <label class="form-label-premium">{{ __('Search Keyword') }}</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-search text-xs"></i></span>
                        </div>
                        <input type="text" name="keyword" class="form-control"
                               value="{{ $filterKeyword }}"
                               placeholder="{{ __('Filter by keyword…') }}">
                    </div>
                </div>

                <div class="col-lg-3 mb-3 mb-lg-0">
                    <label class="form-label-premium">{{ __('Module') }}</label>
                    <select name="module" class="form-control">
                        <option value="">{{ __('All Modules') }}</option>
                        @foreach($allModules as $mod)
                            <option value="{{ $mod }}" @selected($filterModule === $mod)>
                                {{ ucfirst($mod) }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="col-lg-4">
                    <label class="form-label-premium d-block">&nbsp;</label>
                    <div class="d-flex align-items-center gap-12">
                        <button type="submit" class="btn-filter-premium flex-grow-1">
                            <i class="fas fa-sync-alt mr-2"></i> {{ __('FILTER') }}
                        </button>
                        <a href="{{ route('admin.reports.searches', ['days' => $days]) }}"
                           class="btn-reset-premium" data-toggle="tooltip" title="{{ __('Clear filters') }}">
                            <i class="fas fa-undo"></i>
                        </a>
                    </div>
                </div>
            </form>

            @if($filterKeyword || $filterModule)
                <div class="mt-3 d-flex flex-wrap gap-2">
                    @if($filterKeyword)
                        <span class="badge badge-pill badge-warning-soft text-warning px-3 py-2 font-weight-bold smallest uppercase letter-spacing-1">
                            <i class="fas fa-search mr-1"></i> {{ __('keyword:') }} "{{ $filterKeyword }}"
                        </span>
                    @endif
                    @if($filterModule)
                        <span class="badge badge-pill badge-primary-soft text-primary px-3 py-2 font-weight-bold smallest uppercase letter-spacing-1">
                            <i class="fas fa-layer-group mr-1"></i> {{ __('module:') }} {{ $filterModule }}
                        </span>
                    @endif
                </div>
            @endif
        </div>
    </div>

    {{-- Stats Row --}}
    <div class="row mb-4">
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card stat-card-interactive h-100 border-0 shadow-premium overflow-hidden rounded-24">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-box-soft bg-warning-soft text-warning mr-3 shadow-xs icon-box-48 rounded-14 d-flex align-items-center justify-content-center">
                            <i class="fas fa-search text-lg"></i>
                        </div>
                        <span class="text-uppercase smallest font-weight-bold text-muted letter-spacing-1">{{ __('Total Searches') }}</span>
                    </div>
                    <h2 class="font-weight-bold text-dark mb-0">{{ number_format($totalSearches) }}</h2>
                    <small class="text-muted">{{ __('last :days days', ['days' => $days]) }}</small>
                </div>
            </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card stat-card-interactive h-100 border-0 shadow-premium overflow-hidden rounded-24">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-box-soft bg-primary-soft text-primary mr-3 shadow-xs icon-box-48 rounded-14 d-flex align-items-center justify-content-center">
                            <i class="fas fa-layer-group text-lg"></i>
                        </div>
                        <span class="text-uppercase smallest font-weight-bold text-muted letter-spacing-1">{{ __('Active Modules') }}</span>
                    </div>
                    <h2 class="font-weight-bold text-dark mb-0">{{ $byModule->count() }}</h2>
                    <small class="text-muted">{{ __('with search activity') }}</small>
                </div>
            </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card stat-card-interactive h-100 border-0 shadow-premium overflow-hidden rounded-24">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-box-soft bg-success-soft text-success mr-3 shadow-xs icon-box-48 rounded-14 d-flex align-items-center justify-content-center">
                            <i class="fas fa-key text-lg"></i>
                        </div>
                        <span class="text-uppercase smallest font-weight-bold text-muted letter-spacing-1">{{ __('Unique Keywords') }}</span>
                    </div>
                    <h2 class="font-weight-bold text-dark mb-0">{{ number_format($topKeywords->count()) }}</h2>
                    <small class="text-muted">{{ __('top 20 shown') }}</small>
                </div>
            </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card stat-card-interactive h-100 border-0 shadow-premium overflow-hidden rounded-24">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-box-soft bg-info-soft text-info mr-3 shadow-xs icon-box-48 rounded-14 d-flex align-items-center justify-content-center">
                            <i class="fas fa-chart-line text-lg"></i>
                        </div>
                        <span class="text-uppercase smallest font-weight-bold text-muted letter-spacing-1">{{ __('Daily Average') }}</span>
                    </div>
                    <h2 class="font-weight-bold text-dark mb-0">
                        {{ $days > 0 ? number_format($totalSearches / $days, 1) : 0 }}
                    </h2>
                    <small class="text-muted">{{ __('searches / day') }}</small>
                </div>
            </div>
        </div>
    </div>

    {{-- Trend Chart + Module Breakdown --}}
    <div class="row mb-5">
        <div class="col-lg-8 mb-4">
            <div class="card card-premium shadow-premium border-0 overflow-hidden h-100">
                <div class="card-header border-0 bg-white pt-4 px-4 d-flex align-items-center">
                    <div class="icon-box-soft bg-warning-soft text-warning mr-3 d-flex align-items-center justify-content-center shadow-xs icon-box-40 rounded-10">
                        <i class="fas fa-chart-area"></i>
                    </div>
                    <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                        {{ __('Search Volume Trend') }}
                    </h3>
                </div>
                <div class="card-body p-4">
                    <div class="chart-responsive h-280-p">
                        <canvas id="searchTrendChart"
                                data-chart-config='{"labels": @json($trendLabels), "data": @json($trendData)}'></canvas>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-4 mb-4">
            <div class="card card-premium shadow-premium border-0 overflow-hidden h-100">
                <div class="card-header border-0 bg-white pt-4 px-4 d-flex align-items-center">
                    <div class="icon-box-soft bg-primary-soft text-primary mr-3 d-flex align-items-center justify-content-center shadow-xs icon-box-40 rounded-10">
                        <i class="fas fa-layer-group"></i>
                    </div>
                    <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                        {{ __('By Module') }}
                    </h3>
                </div>
                <div class="card-body p-3">
                    @forelse($byModule as $row)
                        @php $pct = $totalSearches > 0 ? round($row->total / $totalSearches * 100) : 0; @endphp
                        <div class="mb-3">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <span class="font-weight-bold text-dark small text-capitalize">{{ $row->module }}</span>
                                <span class="text-muted small">{{ number_format($row->total) }} ({{ $pct }}%)</span>
                            </div>
                            <div class="progress" style="height:6px; border-radius:3px;">
                                <div class="progress-bar bg-primary" style="width:{{ $pct }}%"></div>
                            </div>
                        </div>
                    @empty
                        <p class="text-muted small text-center py-4">{{ __('No data yet.') }}</p>
                    @endforelse
                </div>
            </div>
        </div>
    </div>

    {{-- Top Keywords --}}
    <div class="row mb-5">
        <div class="col-12">
            <div class="card card-premium shadow-premium border-0 overflow-hidden">
                <div class="card-header border-0 bg-white pt-4 px-4 d-flex align-items-center">
                    <div class="icon-box-soft bg-success-soft text-success mr-3 d-flex align-items-center justify-content-center shadow-xs icon-box-40 rounded-10">
                        <i class="fas fa-fire-alt"></i>
                    </div>
                    <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                        {{ __('Top Keywords') }}
                    </h3>
                </div>
                <div class="card-body p-4">
                    @if($topKeywords->isEmpty())
                        <p class="text-muted text-center py-3">{{ __('No keyword data yet.') }}</p>
                    @else
                        <div class="d-flex flex-wrap gap-2">
                            @foreach($topKeywords as $kw)
                                @php
                                    $maxCount = $topKeywords->first()->total;
                                    $size = max(0.75, min(1.5, 0.75 + ($kw->total / $maxCount) * 0.75));
                                @endphp
                                <span class="badge badge-light border px-3 py-2 rounded-pill text-dark"
                                      style="font-size:{{ $size }}rem; font-weight:{{ $kw->total === $maxCount ? '700' : '500' }}">
                                    {{ $kw->keyword }}
                                    <span class="text-muted ml-1" style="font-size:0.7rem">{{ $kw->total }}</span>
                                </span>
                            @endforeach
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>

    {{-- Recent Searches Table --}}
    <div class="card card-premium shadow-premium border-0 overflow-hidden">
        <div class="card-header border-0 bg-white pt-4 px-4 d-flex align-items-center">
            <div class="icon-box-soft bg-info-soft text-info mr-3 d-flex align-items-center justify-content-center shadow-xs icon-box-40 rounded-10">
                <i class="fas fa-history"></i>
            </div>
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                {{ __('Recent Searches') }}
            </h3>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover table-premium m-0">
                    @php
                        $sortParams = request()->except(['sort', 'direction']);
                        $sortLink = function(string $col) use ($sortCol, $sortDir, $sortParams): string {
                            $dir = ($sortCol === $col && $sortDir === 'asc') ? 'desc' : 'asc';
                            return route('admin.reports.searches', array_merge($sortParams, ['sort' => $col, 'direction' => $dir]));
                        };
                        $sortIcon = function(string $col) use ($sortCol, $sortDir): string {
                            if ($sortCol !== $col) return '<i class="fas fa-sort text-muted ml-1" style="opacity:.35"></i>';
                            return $sortDir === 'asc'
                                ? '<i class="fas fa-sort-up text-primary ml-1"></i>'
                                : '<i class="fas fa-sort-down text-primary ml-1"></i>';
                        };
                    @endphp
                    <thead class="thead-light">
                        <tr>
                            <th class="px-4">
                                <a href="{{ $sortLink('module') }}" class="text-dark text-decoration-none">
                                    {{ __('Module') }} {!! $sortIcon('module') !!}
                                </a>
                            </th>
                            <th>
                                <a href="{{ $sortLink('keyword') }}" class="text-dark text-decoration-none">
                                    {{ __('Keyword') }} {!! $sortIcon('keyword') !!}
                                </a>
                            </th>
                            <th>{{ __('Filters') }}</th>
                            <th>{{ __('User') }}</th>
                            <th>{{ __('IP') }}</th>
                            <th>
                                <a href="{{ $sortLink('created_at') }}" class="text-dark text-decoration-none">
                                    {{ __('When') }} {!! $sortIcon('created_at') !!}
                                </a>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($recentSearches as $sq)
                            <tr>
                                <td class="px-4">
                                    <span class="badge badge-light border text-dark text-capitalize">{{ $sq->module }}</span>
                                </td>
                                <td>
                                    @if($sq->keyword)
                                        <span class="font-weight-bold text-dark">{{ $sq->keyword }}</span>
                                    @else
                                        <span class="text-muted">—</span>
                                    @endif
                                </td>
                                <td>
                                    @if($sq->filters)
                                        <code class="small text-muted">{{ collect($sq->filters)->map(fn($v,$k) => "$k=$v")->implode(', ') }}</code>
                                    @else
                                        <span class="text-muted">—</span>
                                    @endif
                                </td>
                                <td>
                                    @if($sq->user)
                                        <span class="small">{{ $sq->user->name }}</span>
                                    @else
                                        <span class="text-muted small">{{ __('Guest') }}</span>
                                    @endif
                                </td>
                                <td class="text-muted small">{{ $sq->ip_address ?? '—' }}</td>
                                <td class="text-muted small" title="{{ $sq->created_at }}">
                                    {{ $sq->created_at?->diffForHumans() }}
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="text-center text-muted py-5">
                                    <i class="fas fa-search fa-2x mb-3 d-block opacity-50"></i>
                                    {{ __('No search queries recorded yet.') }}
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</div>
@endsection

@push('js')
<script>
(function () {
    var canvas = document.getElementById('searchTrendChart');
    if (!canvas) return;
    var cfg = JSON.parse(canvas.dataset.chartConfig || '{}');
    new Chart(canvas, {
        type: 'line',
        data: {
            labels: cfg.labels || [],
            datasets: [{
                label: '{{ __("Searches") }}',
                data: cfg.data || [],
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243,156,18,0.08)',
                borderWidth: 2,
                pointRadius: cfg.labels && cfg.labels.length > 30 ? 0 : 3,
                fill: true,
                tension: 0.4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, ticks: { precision: 0 } }
            }
        }
    });
})();
</script>
@endpush
