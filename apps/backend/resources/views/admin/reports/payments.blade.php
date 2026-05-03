@extends('adminlte::page')

@section('plugins.Chartjs', true) 

@section('title', 'Payments | Admin')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-dollar-sign mr-2 text-primary"></i> {{ $reportTitle ?? 'Payments Report' }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1">Analyze revenue trends, payment methods, and transaction history.</p>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right bg-transparent p-0">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Payments Report</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
@include('admin.alert')

<div class="container-fluid pb-5">
    
    {{-- Filter Section --}}
    <div class="card glass-card shadow-sm mb-5 border-0 overflow-hidden">
        <div class="card-body p-4">
            <form action="{{ route('admin.reports.payments') }}" method="GET" class="row align-items-end">
                <div class="col-md-4 mb-3 mb-md-0">
                    <label class="small font-weight-bold text-muted text-uppercase mb-2 d-block">Start Date</label>
                    <div class="input-group premium-input">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-calendar-alt text-primary"></i></span>
                        </div>
                        <input type="date" name="start_date" class="form-control" value="{{ $startDateFormatted ?? '' }}">
                    </div>
                </div>
                <div class="col-md-4 mb-3 mb-md-0">
                    <label class="small font-weight-bold text-muted text-uppercase mb-2 d-block">End Date</label>
                    <div class="input-group premium-input">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-calendar-check text-primary"></i></span>
                        </div>
                        <input type="date" name="end_date" class="form-control" value="{{ $endDateFormatted ?? '' }}">
                    </div>
                </div>
                <div class="col-md-4">
                    <button type="submit" class="btn btn-primary btn-block py-2 font-weight-bold shadow-lg premium-btn">
                        <i class="fas fa-chart-pie mr-2"></i> ANALYZE REVENUE
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
            <div class="card h-100 border-0 shadow-sm glass-card overflow-hidden stat-card">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-circle bg-success-soft text-success mr-3 shadow-sm">
                            <i class="fas fa-sack-dollar"></i>
                        </div>
                        <span class="text-uppercase small font-weight-bold text-muted letter-spacing-1">Total Revenue</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">${{ $totalRevenue ?? '0.00' }}</h2>
                        <span class="text-muted small">Gross</span>
                    </div>
                    <div class="progress mt-3" style="height: 4px; border-radius: 2px; background: rgba(0,0,0,0.05);">
                        <div class="progress-bar bg-success" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm glass-card overflow-hidden stat-card">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-circle bg-info-soft text-info mr-3 shadow-sm">
                            <i class="fas fa-hand-holding-dollar"></i>
                        </div>
                        <span class="text-uppercase small font-weight-bold text-muted letter-spacing-1">Avg Transaction</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">${{ number_format($avgTransactionValue ?? 0, 2) }}</h2>
                        <span class="text-muted small">Mean</span>
                    </div>
                    <div class="progress mt-3" style="height: 4px; border-radius: 2px; background: rgba(0,0,0,0.05);">
                        <div class="progress-bar bg-info" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm glass-card overflow-hidden stat-card">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-circle bg-primary-soft text-primary mr-3 shadow-sm">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <span class="text-uppercase small font-weight-bold text-muted letter-spacing-1">Transactions</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">{{ number_format($successfulTransactions ?? 0) }}</h2>
                        <span class="text-success small font-weight-600"><i class="fas fa-shield-alt ml-1"></i></span>
                    </div>
                    <div class="progress mt-3" style="height: 4px; border-radius: 2px; background: rgba(0,0,0,0.05);">
                        <div class="progress-bar bg-primary" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
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

@section('css')
<style>
    :root {
        --primary: #46a5ac; /* Sellio Teal */
        --primary-soft: rgba(70, 165, 172, 0.1);
        --success: #28a745;
        --success-soft: rgba(40, 167, 69, 0.1);
        --info: #17a2b8;
        --info-soft: rgba(23, 162, 184, 0.1);
        --warning: #ffc107;
        --warning-soft: rgba(255, 193, 7, 0.1);
        --danger: #dc3545;
        --danger-soft: rgba(220, 53, 69, 0.1);
        --secondary-soft: rgba(108, 117, 125, 0.1);
    }

    /* Glassmorphism Effect */
    .glass-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
    }

    .stat-card { transition: all 0.3s ease; }
    .stat-card:hover { transform: translateY(-5px); box-shadow: 0 15px 45px rgba(0,0,0,0.1) !important; }

    /* Premium Input Styles */
    .premium-input { border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; background: #fff; transition: all 0.3s ease; }
    .premium-input:focus-within { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-soft); }
    .premium-input .input-group-text { background: transparent; border: none; padding-right: 0; }
    .premium-input .form-control { border: none; height: 48px; font-weight: 500; }
    .premium-input .form-control:focus { box-shadow: none; }

    /* Buttons */
    .premium-btn { border-radius: 12px; height: 48px; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s ease; background: var(--primary); border: none; }
    .premium-btn:hover { background: var(--primary); filter: brightness(90%); transform: translateY(-1px); }

    /* Soft Badges & Icons */
    .badge-primary-soft { background: var(--primary-soft); color: var(--primary); }
    .badge-success-soft { background: var(--success-soft); color: var(--success); }
    .badge-info-soft { background: var(--info-soft); color: var(--info); }
    .badge-warning-soft { background: var(--warning-soft); color: var(--warning); }
    .badge-danger-soft { background: var(--danger-soft); color: var(--danger); }
    .badge-secondary-soft { background: var(--secondary-soft); color: #6c757d; }
    
    .btn-primary-soft { background: var(--primary-soft); color: var(--primary); border: none; transition: all 0.3s ease; }
    .btn-primary-soft:hover { background: var(--primary); color: #fff; }

    .icon-circle { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
    .icon-square { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }

    /* Table Styling */
    .table-premium thead th { 
        background: #f8fafc; 
        text-transform: uppercase; 
        font-size: 0.75rem; 
        letter-spacing: 1px; 
        font-weight: 700; 
        color: #64748b; 
        border-bottom: 1px solid #e2e8f0; 
        padding: 1.25rem 1rem;
    }
    .table-premium tbody td { padding: 1.25rem 1rem; border-bottom: 1px solid #f1f5f9; }

    .letter-spacing-1 { letter-spacing: 1px; }
    .opacity-25 { opacity: 0.25; }
</style>
@stop

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