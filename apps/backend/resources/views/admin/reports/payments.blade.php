@extends('adminlte::page')

@section('plugins.Chartjs', true) 

@section('title', 'Payments | Admin')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0">
                    <i class="fas fa-dollar-sign mr-2"></i> {{ $reportTitle ?? 'Payments Report' }}
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Payments Report</li>
                </ol>
            </div>
        </div>
        <p class="text-muted mt-2">Analyze your revenue trends, payment methods, and transaction history.</p>
    </div>
@stop

@section('content')
@include('admin.alert')

<div class="container-fluid dashboard-blueprint pb-5">
    
    {{-- Filter Section --}}
    <div class="section-header">
        <span class="dot bg-info"></span>
        <h5 class="text-uppercase font-weight-bold text-secondary">Revenue Configuration</h5>
    </div>
    
    <div class="card shadow-sm mb-5 border-0" style="border-radius: 16px;">
        <div class="card-body p-4">
            <form action="{{ route('admin.reports.payments') }}" method="GET" class="row align-items-end">
                <div class="col-md-4 mb-3 mb-md-0">
                    <label class="small font-weight-bold text-muted text-uppercase mb-2 d-block">Start Date</label>
                    <div class="input-group shadow-xs rounded" style="overflow: hidden; border: 1px solid #e2e8f0;">
                        <div class="input-group-prepend">
                            <span class="input-group-text bg-white border-0"><i class="fas fa-calendar-alt text-success"></i></span>
                        </div>
                        <input type="date" name="start_date" class="form-control border-0 py-4" value="{{ $startDateFormatted ?? '' }}">
                    </div>
                </div>
                <div class="col-md-4 mb-3 mb-md-0">
                    <label class="small font-weight-bold text-muted text-uppercase mb-2 d-block">End Date</label>
                    <div class="input-group shadow-xs rounded" style="overflow: hidden; border: 1px solid #e2e8f0;">
                        <div class="input-group-prepend">
                            <span class="input-group-text bg-white border-0"><i class="fas fa-calendar-check text-success"></i></span>
                        </div>
                        <input type="date" name="end_date" class="form-control border-0 py-4" value="{{ $endDateFormatted ?? '' }}">
                    </div>
                </div>
                <div class="col-md-4">
                    <button type="submit" class="btn btn-success btn-block py-2 font-weight-bold shadow" style="border-radius: 10px; height: 48px; background: linear-gradient(135deg, #28a745, #218838);">
                        <i class="fas fa-chart-pie mr-2"></i> ANALYZE REVENUE
                    </button>
                </div>
            </form>
            @if(isset($startDateFormatted) && isset($endDateFormatted))
                <div class="mt-3 text-center">
                    <span class="badge badge-pill bg-success-light text-success px-3 py-2 border">
                        <i class="fas fa-coins mr-1"></i> Analyzing period: {{ $startDateFormatted }} — {{ $endDateFormatted }}
                    </span>
                </div>
            @endif
        </div>
    </div>

    {{-- Stats Row --}}
    <div class="section-header">
        <span class="dot pulse bg-success"></span>
        <h5 class="text-uppercase font-weight-bold text-secondary">Financial Overview</h5>
    </div>
    
    <div class="row mb-5">
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm overflow-hidden" style="border-radius: 16px;">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-circle bg-success-light text-success mr-3 shadow-xs">
                            <i class="fas fa-sack-dollar"></i>
                        </div>
                        <span class="text-uppercase small font-weight-bold text-muted letter-spacing-1">Total Revenue</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">${{ $totalRevenue ?? '0.00' }}</h2>
                        <span class="text-muted small">Gross</span>
                    </div>
                </div>
                <div class="bg-success" style="height: 4px; opacity: 0.6;"></div>
            </div>
        </div>

        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm overflow-hidden" style="border-radius: 16px;">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-circle bg-info-light text-info mr-3 shadow-xs">
                            <i class="fas fa-hand-holding-dollar"></i>
                        </div>
                        <span class="text-uppercase small font-weight-bold text-muted letter-spacing-1">Avg Transaction</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">${{ number_format($avgTransactionValue ?? 0, 2) }}</h2>
                        <span class="text-muted small">Mean</span>
                    </div>
                </div>
                <div class="bg-info" style="height: 4px; opacity: 0.6;"></div>
            </div>
        </div>

        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm overflow-hidden" style="border-radius: 16px;">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-circle bg-primary-light text-primary mr-3 shadow-xs">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <span class="text-uppercase small font-weight-bold text-muted letter-spacing-1">Transactions</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">{{ number_format($successfulTransactions ?? 0) }}</h2>
                        <span class="text-success small font-weight-600"><i class="fas fa-shield-alt ml-1"></i></span>
                    </div>
                </div>
                <div class="bg-primary" style="height: 4px; opacity: 0.6;"></div>
            </div>
        </div>
    </div>

    {{-- Trend Analysis --}}
    <div class="section-header">
        <span class="dot bg-primary"></span>
        <h5 class="text-uppercase font-weight-bold text-secondary">Revenue Streams</h5>
    </div>
    
    <div class="card shadow-sm mb-5 border-0" style="border-radius: 20px; background: #fff;">
        <div class="card-header border-0 bg-transparent pt-4 px-4">
            <h3 class="card-title font-weight-bold text-muted"><i class="fas fa-chart-line mr-2 text-success"></i> Monthly Inflow Trend</h3>
        </div>
        <div class="card-body p-4">
            <div class="chart-responsive" style="height: 350px;">
                <canvas id="revenueChart"></canvas>
            </div>
        </div>
    </div>

    {{-- Transaction History --}}
    <div class="section-header">
        <span class="dot bg-secondary"></span>
        <h5 class="text-uppercase font-weight-bold text-secondary">Transaction Audit</h5>
    </div>
    <div class="card shadow-sm border-0 mb-4" style="border-radius: 16px;">
        <div class="card-header border-0 bg-transparent pt-4 px-4 d-flex justify-content-between align-items-center">
            <h3 class="card-title font-weight-bold text-muted mb-0"><i class="fas fa-file-invoice-dollar mr-2 text-info"></i> Recent Transactions</h3>
            <a href="http://127.0.0.1:8000/admin/payments" class="btn btn-xs btn-outline-info rounded-pill px-3">View Full Ledger</a>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover m-0" id="transactionsTable">
                    <thead class="bg-light">
                        <tr>
                            <th class="border-0 px-4">ID</th>
                            <th class="border-0">Amount</th>
                            <th class="border-0">Method</th>
                            <th class="border-0">Status</th>
                            <th class="border-0">Payable Item</th>
                            <th class="border-0 text-right px-4">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($recentTransactions ?? [] as $transaction)
                        <tr>
                            <td class="px-4 text-muted small align-middle">#{{ $transaction->id }}</td>
                            <td class="align-middle font-weight-bold text-dark">${{ number_format($transaction->amount, 2) }}</td>
                            <td class="align-middle text-muted">{{ $transaction->method }}</td> 
                            <td class="align-middle">
                                @php
                                    $badgeClass = [
                                        'completed' => 'badge-success',
                                        'pending'   => 'badge-warning',
                                        'failed'    => 'badge-danger',
                                    ][strtolower($transaction->status)] ?? 'badge-secondary';
                                @endphp
                                <span class="badge badge-pill {{ $badgeClass }} px-2 py-1">
                                    {{ ucfirst($transaction->status) }}
                                </span>
                            </td>
                            <td class="align-middle">
                                @include('admin.reports.partials._payable_link', ['payable' => $transaction->payable])
                            </td>
                            <td class="text-right px-4 align-middle text-muted small">{{ $transaction->paid_at?->format('M d, Y H:i') }}</td>
                        </tr>
                        @empty
                        <tr><td colspan="6" class="text-center py-4 text-muted small">No financial data in this range</td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@stop

@section('css')
<style>
    /* Sectioning & Layout */
    .section-header { display: flex; align-items: center; margin-bottom: 1.5rem; }
    .section-header .dot { width: 12px; height: 12px; border-radius: 50%; margin-right: 12px; transition: transform 0.3s; }
    .section-header h5 { margin: 0; letter-spacing: 1.2px; font-size: 0.85rem; opacity: 0.8; }
    
    /* Modern Card kit */
    .dashboard-blueprint .card { transition: all 0.25s ease; box-shadow: 0 4px 6px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; }
    .dashboard-blueprint .card:hover { transform: translateY(-3px); box-shadow: 0 12px 24px rgba(0,0,0,0.08) !important; }

    /* Color Utility Factory */
    .bg-primary-light { background: rgba(0,123,255,0.08) !important; }
    .bg-success-light { background: rgba(40,167,69,0.08) !important; }
    .bg-danger-light  { background: rgba(220,53,69,0.08) !important; }
    .bg-info-light    { background: rgba(23,162,184,0.08) !important; }
    
    .icon-circle { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }

    /* Global Pulse Animation */
    .pulse { animation: pulse-shadow 2s infinite; }
    @keyframes pulse-shadow {
        0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.4); transform: scale(0.95); }
        70% { box-shadow: 0 0 0 10px rgba(40, 167, 69, 0); transform: scale(1); }
        100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); transform: scale(0.95); }
    }

    .shadow-xs { box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important; }
    .letter-spacing-1 { letter-spacing: 1px; }
</style>
@stop

{{-- 
    JS Section: Kept your Chart.js configuration largely intact, but ensured 
    standard AdminLTE/Bootstrap colors are used for better integration.
    You will need to ensure the Chart.js library is loaded. 
--}}
@section('js')
<script>
    // Load Chart.js from the AdminLTE plugin section (using @section('plugins.Chartjs', true))
    
    // Function to convert AdminLTE color (Primary) to RGBA for the chart
    function getPrimaryColor() {
        // Default Bootstrap/AdminLTE Primary color (#007bff)
        const color = '#007bff';
        return {
            border: color,
            fill: 'rgba(0, 123, 255, 0.4)' // Lighter fill for area chart
        };
    }

    window.addEventListener('load', function() {
        try {
            var ctx = document.getElementById("revenueChart").getContext('2d');
            var colors = getPrimaryColor();

            var chartLabels = @json($chartLabels ?? []);
            var chartData = @json($chartData ?? []);

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        label: "Revenue ($)",
                        lineTension: 0.3,
                        // Use AdminLTE primary color scheme
                        backgroundColor: colors.fill, 
                        borderColor: colors.border,
                        pointRadius: 3,
                        pointBackgroundColor: colors.border,
                        pointBorderColor: "#fff", // White border for points
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: colors.border,
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHitRadius: 10,
                        pointBorderWidth: 2,
                        data: chartData,
                        fill: true // Important for area chart look
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: { left: 0, right: 10, top: 10, bottom: 0 }
                    },
                    scales: {
                        xAxes: [{
                            gridLines: { display: false, drawBorder: false },
                            ticks: { maxTicksLimit: 12 } // Adjusted for monthly view
                        }],
                        yAxes: [{
                            ticks: {
                                maxTicksLimit: 5,
                                padding: 10,
                                callback: function(value) {
                                    return '$' + value.toLocaleString();
                                }
                            },
                            gridLines: {
                                color: "rgba(0, 0, 0, .125)", // Light AdminLTE grid lines
                                zeroLineColor: "rgba(0, 0, 0, .125)",
                                drawBorder: false,
                                borderDash: [2],
                                zeroLineBorderDash: [2]
                            }
                        }],
                    },
                    legend: { display: false },
                    tooltips: {
                        backgroundColor: "rgba(255,255,255,0.9)",
                        bodyFontColor: "#495057",
                        titleFontColor: '#495057',
                        borderColor: 'rgba(0, 123, 255, 0.5)',
                        borderWidth: 1,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        intersect: false,
                        mode: 'index',
                        callbacks: {
                            label: function(tooltipItem, chart) {
                                var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                                return datasetLabel + ': $' + tooltipItem.yLabel.toLocaleString();
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