@extends('adminlte::page')

@section('plugins.Chartjs', true) 

@section('title', 'Payments | Admin')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-chart-line mr-2 text-primary opacity-50"></i> {{ $reportTitle ?? 'Payments & Revenue Analytics' }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">High-fidelity analysis of marketplace inflow, revenue trends, and settled transactions.</p>
            </div>
            <div class="col-sm-5 d-flex align-items-center justify-content-end">
                <div class="btn-group btn-group-premium shadow-sm rounded-pill overflow-hidden border">
                    <button class="btn btn-white btn-sm px-4 py-2 font-weight-bold smallest" onclick="window.print()">
                        <i class="fas fa-print mr-1"></i> EXPORT TO PDF
                    </button>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
@include('admin.alert')

<div class="container-fluid pb-5">
    
    {{-- Filter Section --}}
    <div class="card border-0 shadow-premium mb-5 overflow-hidden" style="border-radius: 24px;">
        <div class="card-body p-4">
            <form action="{{ route('admin.reports.payments') }}" method="GET" class="row align-items-end">
                <div class="col-md-5 mb-3 mb-md-0">
                    <label class="smallest font-weight-bold text-muted text-uppercase mb-2 d-block letter-spacing-1">Analytics Period (Start)</label>
                    <div class="input-group premium-input shadow-xs">
                        <div class="input-group-prepend">
                            <span class="input-group-text bg-transparent border-0"><i class="fas fa-calendar-alt text-primary opacity-50"></i></span>
                        </div>
                        <input type="date" name="start_date" class="form-control border-0 bg-transparent" value="{{ $startDateFormatted ?? '' }}" style="height: 48px;">
                    </div>
                </div>
                <div class="col-md-5 mb-3 mb-md-0">
                    <label class="smallest font-weight-bold text-muted text-uppercase mb-2 d-block letter-spacing-1">Analytics Period (End)</label>
                    <div class="input-group premium-input shadow-xs">
                        <div class="input-group-prepend">
                            <span class="input-group-text bg-transparent border-0"><i class="fas fa-calendar-check text-primary opacity-50"></i></span>
                        </div>
                        <input type="date" name="end_date" class="form-control border-0 bg-transparent" value="{{ $endDateFormatted ?? '' }}" style="height: 48px;">
                    </div>
                </div>
                <div class="col-md-2">
                    <button type="submit" class="btn btn-primary btn-block font-weight-bold" style="height: 48px; border-radius: 12px;">
                        <i class="fas fa-sync-alt mr-2"></i> REFRESH
                    </button>
                </div>
            </form>
            @if(isset($startDateFormatted) && isset($endDateFormatted))
                <div class="mt-3 text-center">
                    <span class="badge badge-pill badge-primary-soft px-3 py-2">
                        <i class="fas fa-coins mr-1"></i> Analyzing period: {{ $startDateFormatted }} — {{ $endDateFormatted }}
                    </span>
                </div>
            @endif
        </div>
    </div>

    {{-- Stats Row --}}
    <div class="row mb-5">
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-box-soft bg-success-soft text-success mr-3 shadow-xs" style="width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-money-bill-wave text-lg"></i>
                        </div>
                        <span class="text-uppercase smallest font-weight-bold text-muted letter-spacing-1">Total Revenue</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">${{ $totalRevenue ?? '0.00' }}</h2>
                        <span class="text-muted smallest font-weight-bold">GROSS</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-box-soft bg-info-soft text-info mr-3 shadow-xs" style="width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-chart-pie text-lg"></i>
                        </div>
                        <span class="text-uppercase smallest font-weight-bold text-muted letter-spacing-1">Avg Transaction</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">${{ number_format($avgTransactionValue ?? 0, 2) }}</h2>
                        <span class="text-muted smallest font-weight-bold">MEAN</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-box-soft bg-primary-soft text-primary mr-3 shadow-xs" style="width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-check-double text-lg"></i>
                        </div>
                        <span class="text-uppercase smallest font-weight-bold text-muted letter-spacing-1">Transactions</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">{{ number_format($successfulTransactions ?? 0) }}</h2>
                        <span class="text-success smallest font-weight-bold uppercase ml-1">SETTLED</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- Trend Analysis --}}
    <div class="card glass-card shadow-sm mb-5 border-0 overflow-hidden">
        <div class="card-header border-0 bg-transparent pt-4 px-4 d-flex align-items-center">
            <div class="icon-square bg-success-soft text-success mr-3">
                <i class="fas fa-chart-line"></i>
            </div>
            <h3 class="card-title font-weight-bold text-dark mb-0">Monthly Inflow Trend</h3>
        </div>
        <div class="card-body p-4">
            <div class="chart-responsive" style="height: 380px;">
                <canvas id="revenueChart"></canvas>
            </div>
        </div>
    </div>

    {{-- Transaction History --}}
    <div class="card glass-card shadow-sm border-0 mb-4 overflow-hidden">
        <div class="card-header border-0 bg-transparent pt-4 px-4 d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <div class="icon-square bg-info-soft text-info mr-3">
                    <i class="fas fa-file-invoice-dollar"></i>
                </div>
                <h3 class="card-title font-weight-bold text-dark mb-0">Recent Transactions</h3>
            </div>
            <a href="{{ route('admin.payments.index') }}" class="btn btn-sm btn-primary-soft rounded-pill px-4 font-weight-bold">
                VIEW FULL LEDGER <i class="fas fa-arrow-right ml-1 small"></i>
            </a>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover table-premium m-0">
                    <thead>
                        <tr>
                            <th class="px-4">ID</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Payable Item</th>
                            <th class="text-right px-4">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($recentTransactions ?? [] as $transaction)
                        <tr>
                            <td class="px-4 text-muted small align-middle">#{{ $transaction->id }}</td>
                            <td class="align-middle font-weight-bold text-dark">${{ number_format($transaction->amount, 2) }}</td>
                            <td class="align-middle"><span class="text-muted small text-uppercase font-weight-bold">{{ $transaction->method }}</span></td> 
                            <td class="align-middle">
                                @php
                                    $statusStyle = [
                                        'completed' => ['bg' => 'success-soft', 'text' => 'success', 'icon' => 'fa-check-circle'],
                                        'pending'   => ['bg' => 'warning-soft', 'text' => 'warning', 'icon' => 'fa-clock'],
                                        'failed'    => ['bg' => 'danger-soft', 'text' => 'danger', 'icon' => 'fa-exclamation-circle'],
                                    ][strtolower($transaction->status)] ?? ['bg' => 'secondary-soft', 'text' => 'secondary', 'icon' => 'fa-info-circle'];
                                @endphp
                                <span class="badge badge-pill badge-{{ $statusStyle['bg'] }} text-{{ $statusStyle['text'] }} border border-{{ $statusStyle['text'] }} px-3 py-1 text-uppercase" style="font-size: 0.65rem; letter-spacing: 0.5px;">
                                    <i class="fas {{ $statusStyle['icon'] }} mr-1"></i> {{ $transaction->status }}
                                </span>
                            </td>
                            <td class="align-middle">
                                @include('admin.reports.partials._payable_link', ['payable' => $transaction->payable])
                            </td>
                            <td class="text-right px-4 align-middle text-muted small">{{ $transaction->paid_at?->format('M d, Y H:i') }}</td>
                        </tr>
                        @empty
                        <tr><td colspan="6" class="text-center py-5">
                            <i class="fas fa-box-open fa-3x text-muted opacity-25 mb-3"></i>
                            <p class="text-muted">No financial data in this range</p>
                        </td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@stop

@push('css')
@include('admin._partials._toggle-card-css')
<style>
    .premium-input { border-radius: 12px; background: #fff; transition: all 0.3s ease; border: 1.5px solid #edf2f7 !important; }
    .premium-input:focus-within { border-color: var(--primary) !important; box-shadow: 0 10px 20px rgba(var(--primary-rgb), 0.05) !important; }
</style>
@endpush


@section('js')
<script>
    window.addEventListener('load', function() {
        try {
            var ctx = document.getElementById("revenueChart").getContext('2d');
            
            // Create Gradient
            var gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(70, 165, 172, 0.4)'); // Primary Teal
            gradient.addColorStop(1, 'rgba(70, 165, 172, 0.0)');

            var chartLabels = @json($chartLabels ?? []);
            var chartData = @json($chartData ?? []);

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        label: "Revenue ($)",
                        lineTension: 0.4, // Smoother curves
                        backgroundColor: gradient, 
                        borderColor: '#46a5ac',
                        borderWidth: 3,
                        pointRadius: 4,
                        pointBackgroundColor: "#fff",
                        pointBorderColor: "#46a5ac",
                        pointBorderWidth: 2,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: "#46a5ac",
                        pointHoverBorderColor: "#fff",
                        pointHoverBorderWidth: 2,
                        data: chartData,
                        fill: true
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: { display: false },
                    scales: {
                        xAxes: [{
                            gridLines: { display: false, drawBorder: false },
                            ticks: { fontColor: '#94a3b8', fontStyle: '600' }
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                fontColor: '#94a3b8',
                                fontStyle: '600',
                                padding: 10,
                                callback: function(value) {
                                    if (value >= 1000) return '$' + (value/1000) + 'k';
                                    return '$' + value;
                                }
                            },
                            gridLines: {
                                color: "rgba(0, 0, 0, 0.03)",
                                zeroLineColor: "rgba(0, 0, 0, 0.03)",
                                drawBorder: false
                            }
                        }],
                    },
                    tooltips: {
                        backgroundColor: "#1e293b",
                        titleFontColor: "#fff",
                        bodyFontColor: "#fff",
                        cornerRadius: 8,
                        xPadding: 12,
                        yPadding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(tooltipItem, chart) {
                                return 'Revenue: $' + tooltipItem.yLabel.toLocaleString();
                            }
                        }
                    }
                }
            });
        } catch (e) {
            console.error("Error loading revenue chart:", e);
        }
    });
</script>
@stopt>