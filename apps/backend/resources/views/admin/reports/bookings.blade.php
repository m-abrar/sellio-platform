@extends('adminlte::page')

@section('plugins.Chartjs', true) 

@section('title', $reportTitle)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-calendar-check mr-2 text-primary opacity-50"></i> {{ $reportTitle ?? 'Booking Velocity Analytics' }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Track booking performance, velocity trends, and resource utilization.</p>
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
    <div class="card glass-card shadow-sm mb-5 border-0 overflow-hidden">
        <div class="card-body p-4">
            <form action="{{ url()->current() }}" method="GET" class="row align-items-end">
                <div class="col-md-5 mb-3 mb-md-0">
                    <label class="smallest font-weight-bold text-muted text-uppercase mb-2 d-block letter-spacing-1">Analysis Period (Start)</label>
                    <div class="input-group premium-input shadow-xs">
                        <div class="input-group-prepend">
                            <span class="input-group-text bg-transparent border-0"><i class="fas fa-calendar-alt text-primary opacity-50"></i></span>
                        </div>
                        <input type="date" name="start_date" class="form-control border-0 bg-transparent" value="{{ $startDateFormatted ?? '' }}" style="height: 48px;">
                    </div>
                </div>
                <div class="col-md-5 mb-3 mb-md-0">
                    <label class="smallest font-weight-bold text-muted text-uppercase mb-2 d-block letter-spacing-1">Analysis Period (End)</label>
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
                        <i class="fas fa-history mr-1"></i> Data range: {{ $startDateFormatted }} — {{ $endDateFormatted }}
                    </span>
                </div>
            @endif
        </div>
    </div>

    {{-- Stats Row --}}
    <div class="row mb-5">
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm glass-card overflow-hidden stat-card">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-circle bg-info-soft text-info mr-3 shadow-sm">
                            <i class="fas fa-ticket-alt"></i>
                        </div>
                        <span class="text-uppercase small font-weight-bold text-muted letter-spacing-1">Total Bookings</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-2">{{ $totalBookings }}</h2>
                        <span class="text-success small font-weight-600"><i class="fas fa-caret-up mr-1"></i>Live</span>
                    </div>
                    <div class="progress mt-3" style="height: 4px; border-radius: 2px; background: rgba(0,0,0,0.05);">
                        <div class="progress-bar bg-info" role="progressbar" style="width: 100%"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm glass-card overflow-hidden stat-card">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-circle bg-success-soft text-success mr-3 shadow-sm">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <span class="text-uppercase small font-weight-bold text-muted letter-spacing-1">Revenue</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">${{ $totalRevenue }}</h2>
                        <span class="text-muted small">USD</span>
                    </div>
                    <div class="progress mt-3" style="height: 4px; border-radius: 2px; background: rgba(0,0,0,0.05);">
                        <div class="progress-bar bg-success" role="progressbar" style="width: 100%"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm glass-card overflow-hidden stat-card">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-circle bg-danger-soft text-danger mr-3 shadow-sm">
                            <i class="fas fa-ban"></i>
                        </div>
                        <span class="text-uppercase small font-weight-bold text-muted letter-spacing-1">Cancellation</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">{{ $cancellationRate }}%</h2>
                        <span class="text-muted small">Ratio</span>
                    </div>
                    <div class="progress mt-3" style="height: 4px; border-radius: 2px; background: rgba(0,0,0,0.05);">
                        <div class="progress-bar bg-danger" role="progressbar" style="width: {{ $cancellationRate }}%"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm glass-card overflow-hidden stat-card">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-circle bg-primary-soft text-primary mr-3 shadow-sm">
                            <i class="fas fa-wallet"></i>
                        </div>
                        <span class="text-uppercase small font-weight-bold text-muted letter-spacing-1">Avg Value</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">${{ $avgBookingValue }}</h2>
                        <span class="text-muted small">/Order</span>
                    </div>
                    <div class="progress mt-3" style="height: 4px; border-radius: 2px; background: rgba(0,0,0,0.05);">
                        <div class="progress-bar bg-primary" role="progressbar" style="width: 100%"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- Trend Analysis --}}
    <div class="card glass-card shadow-sm mb-5 border-0 overflow-hidden">
        <div class="card-header border-0 bg-transparent pt-4 px-4 d-flex align-items-center">
            <div class="icon-square bg-primary-soft text-primary mr-3">
                <i class="fas fa-chart-area"></i>
            </div>
            <h3 class="card-title font-weight-bold text-dark mb-0">Monthly Booking Trend</h3>
        </div>
        <div class="card-body p-4">
            <div class="chart-responsive" style="height: 380px;">
                <canvas id="bookingTrendChart"></canvas>
            </div>
        </div>
    </div>

    {{-- Detail Grid --}}
    <div class="row">
        <div class="col-md-6 mb-4">
            <div class="card glass-card shadow-sm border-0 h-100 overflow-hidden">
                <div class="card-header border-0 bg-transparent pt-4 px-4 d-flex align-items-center">
                    <div class="icon-square bg-warning-soft text-warning mr-3">
                        <i class="fas fa-star"></i>
                    </div>
                    <h3 class="card-title font-weight-bold text-dark mb-0">High-Performers</h3>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover table-premium m-0">
                            <thead>
                                <tr>
                                    <th class="px-4">Property</th>
                                    <th class="text-center">Volume</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($topItems as $item)
                                    <tr>
                                        <td class="px-4 font-weight-600 text-dark">{{ $item->title }}</td>
                                        <td class="text-center">
                                            <span class="badge badge-pill badge-primary-soft text-primary px-3 py-1 shadow-sm font-weight-bold">{{ $item->count }}</span>
                                        </td>
                                    </tr>
                                @empty
                                    <tr><td colspan="2" class="text-center py-5 text-muted small">No metrics available</td></tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-6 mb-4">
            <div class="card glass-card shadow-sm border-0 h-100 overflow-hidden">
                <div class="card-header border-0 bg-transparent pt-4 px-4 d-flex align-items-center">
                    <div class="icon-square bg-info-soft text-info mr-3">
                        <i class="fas fa-clock"></i>
                    </div>
                    <h3 class="card-title font-weight-bold text-dark mb-0">Recent Activity</h3>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover table-premium m-0">
                            <thead>
                                <tr>
                                    <th class="px-4">Entity</th>
                                    <th>Amount</th>
                                    <th class="text-right px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($recentBookings as $booking)
                                    <tr>
                                        <td class="px-4">
                                            <div class="font-weight-600 text-dark">{{ $booking->service }}</div>
                                            <div class="small text-muted">{{ $booking->customer }}</div>
                                        </td>
                                        <td class="align-middle font-weight-bold text-primary">${{ number_format($booking->amount, 2) }}</td>
                                        <td class="text-right px-4 align-middle">
                                            @php
                                                $statusStyle = [
                                                    'completed' => ['bg' => 'success-soft', 'text' => 'success'],
                                                    'pending' => ['bg' => 'warning-soft', 'text' => 'warning'],
                                                    'cancelled' => ['bg' => 'danger-soft', 'text' => 'danger'],
                                                ][strtolower($booking->status)] ?? ['bg' => 'secondary-soft', 'text' => 'secondary'];
                                            @endphp
                                            <span class="badge badge-pill badge-{{ $statusStyle['bg'] }} text-{{ $statusStyle['text'] }} border border-{{ $statusStyle['text'] }} px-2 py-1 text-uppercase" style="font-size: 0.6rem;">{{ $booking->status }}</span>
                                        </td>
                                    </tr>
                                @empty
                                    <tr><td colspan="3" class="text-center py-5 text-muted small">Empty activity log</td></tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row mt-4">
        <div class="col-12 text-center">
            <div class="glass-card d-inline-block border px-4 py-2" style="border-radius: 30px;">
                <small class="text-muted font-weight-bold">
                    <i class="fas fa-info-circle mr-1 text-primary"></i> 
                    Reporting logic is based on <span class="text-dark">Creation Date</span> across all modules.
                </small>
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
        border-radius: 16px;
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
    .font-weight-600 { font-weight: 600; }
</style>
@stop

@section('js')
    <script>
        window.addEventListener('load', function() {
            try {
                const ctx = document.getElementById('bookingTrendChart').getContext('2d');

                // Create Gradient
                var gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, 'rgba(70, 165, 172, 0.4)'); // Primary Teal
                gradient.addColorStop(1, 'rgba(70, 165, 172, 0.0)');

                const labels = @json($chartLabels);
                const data = @json($chartData);

                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Bookings Count',
                            data: data,
                            backgroundColor: gradient,
                            borderColor: '#46a5ac',
                            borderWidth: 3,
                            tension: 0.4,
                            fill: true,
                            pointRadius: 4,
                            pointBackgroundColor: "#fff",
                            pointBorderColor: "#46a5ac",
                            pointBorderWidth: 2,
                        }]
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
                                        if (Number.isInteger(value)) return value;
                                    }
                                },
                                gridLines: {
                                    color: "rgba(0, 0, 0, 0.03)",
                                    zeroLineColor: "rgba(0, 0, 0, 0.03)",
                                    drawBorder: false
                                }
                            }]
                        },
                        tooltips: {
                            backgroundColor: "#1e293b",
                            titleFontColor: "#fff",
                            bodyFontColor: "#fff",
                            cornerRadius: 8,
                            xPadding: 12,
                            yPadding: 12,
                            displayColors: false,
                        }
                    }
                });
            } catch (e) {
                console.error("Error loading chart:", e);
            }
        });
    </script>
@stop
