@extends('adminlte::page')

@section('plugins.Chartjs', true) 

@section('title', $reportTitle)

@section('content_header')
<div class="container-fluid">
    <div class="row mb-2">
        <div class="col-sm-6">
            <h1 class="m-0"><i class="fas fa-calendar-check mr-2"></i> {{ $reportTitle }}</h1>
        </div>
        <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Admin Dashboard</a></li>
                <li class="breadcrumb-item active">{{ $reportTitle }}</li>
            </ol>
        </div>
    </div>
</div>
@stop

@section('content')
@include('admin.alert')

<div class="container-fluid dashboard-blueprint pb-5">
    
    {{-- Filter Section --}}
    <div class="section-header">
        <span class="dot bg-info"></span>
        <h5 class="text-uppercase font-weight-bold text-secondary">Report Configuration</h5>
    </div>
    
    <div class="card shadow-sm mb-5 border-0" style="border-radius: 16px;">
        <div class="card-body p-4">
            <form action="{{ url()->current() }}" method="GET" class="row align-items-end">
                <div class="col-md-4 mb-3 mb-md-0">
                    <label class="small font-weight-bold text-muted text-uppercase mb-2 d-block">Start Date</label>
                    <div class="input-group shadow-xs rounded" style="overflow: hidden; border: 1px solid #e2e8f0;">
                        <div class="input-group-prepend">
                            <span class="input-group-text bg-white border-0"><i class="fas fa-calendar-alt text-primary"></i></span>
                        </div>
                        <input type="date" name="start_date" class="form-control border-0 py-4" value="{{ $startDateFormatted ?? '' }}">
                    </div>
                </div>
                <div class="col-md-4 mb-3 mb-md-0">
                    <label class="small font-weight-bold text-muted text-uppercase mb-2 d-block">End Date</label>
                    <div class="input-group shadow-xs rounded" style="overflow: hidden; border: 1px solid #e2e8f0;">
                        <div class="input-group-prepend">
                            <span class="input-group-text bg-white border-0"><i class="fas fa-calendar-check text-primary"></i></span>
                        </div>
                        <input type="date" name="end_date" class="form-control border-0 py-4" value="{{ $endDateFormatted ?? '' }}">
                    </div>
                </div>
                <div class="col-md-4">
                    <button type="submit" class="btn btn-primary btn-block py-2 font-weight-bold shadow" style="border-radius: 10px; height: 48px; background: linear-gradient(135deg, #007bff, #0056b3);">
                        <i class="fas fa-sync-alt mr-2"></i> REGENERATE REPORT
                    </button>
                </div>
            </form>
            @if(isset($startDateFormatted) && isset($endDateFormatted))
                <div class="mt-3 text-center">
                    <span class="badge badge-pill bg-primary-light text-primary px-3 py-2 border">
                        <i class="fas fa-history mr-1"></i> Data range: {{ $startDateFormatted }} — {{ $endDateFormatted }}
                    </span>
                </div>
            @endif
        </div>
    </div>

    {{-- Stats Row --}}
    <div class="section-header">
        <span class="dot pulse bg-danger"></span>
        <h5 class="text-uppercase font-weight-bold text-secondary">Key Performance Indicators</h5>
    </div>
    
    <div class="row mb-5">
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm overflow-hidden" style="border-radius: 16px;">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-circle bg-info-light text-info mr-3 shadow-xs">
                            <i class="fas fa-ticket-alt"></i>
                        </div>
                        <span class="text-uppercase small font-weight-bold text-muted letter-spacing-1">Total Bookings</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-2">{{ $totalBookings }}</h2>
                        <span class="text-success small font-weight-600"><i class="fas fa-caret-up mr-1"></i>Live</span>
                    </div>
                </div>
                <div class="bg-info" style="height: 4px; opacity: 0.6;"></div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm overflow-hidden" style="border-radius: 16px;">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-circle bg-success-light text-success mr-3 shadow-xs">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <span class="text-uppercase small font-weight-bold text-muted letter-spacing-1">Revenue</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">${{ $totalRevenue }}</h2>
                        <span class="text-muted small">USD</span>
                    </div>
                </div>
                <div class="bg-success" style="height: 4px; opacity: 0.6;"></div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm overflow-hidden" style="border-radius: 16px;">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-circle bg-danger-light text-danger mr-3 shadow-xs">
                            <i class="fas fa-ban"></i>
                        </div>
                        <span class="text-uppercase small font-weight-bold text-muted letter-spacing-1">Cancellation</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">{{ $cancellationRate }}%</h2>
                        <span class="text-muted small">Ratio</span>
                    </div>
                </div>
                <div class="bg-danger" style="height: 4px; opacity: 0.6;"></div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm overflow-hidden" style="border-radius: 16px;">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-circle bg-primary-light text-primary mr-3 shadow-xs">
                            <i class="fas fa-wallet"></i>
                        </div>
                        <span class="text-uppercase small font-weight-bold text-muted letter-spacing-1">Avg Value</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">${{ $avgBookingValue }}</h2>
                        <span class="text-muted small">/Order</span>
                    </div>
                </div>
                <div class="bg-primary" style="height: 4px; opacity: 0.6;"></div>
            </div>
        </div>
    </div>

    {{-- Trend Analysis --}}
    <div class="section-header">
        <span class="dot bg-primary"></span>
        <h5 class="text-uppercase font-weight-bold text-secondary">Historical Trends</h5>
    </div>
    
    <div class="card shadow-sm mb-5 border-0" style="border-radius: 20px; background: #fff;">
        <div class="card-header border-0 bg-transparent pt-4 px-4">
            <h3 class="card-title font-weight-bold text-muted"><i class="fas fa-chart-area mr-2 text-primary"></i> Monthly Booking Trend</h3>
        </div>
        <div class="card-body p-4">
            <div class="chart-responsive" style="height: 350px;">
                <canvas id="bookingTrendChart"></canvas>
            </div>
        </div>
    </div>

    {{-- Detail Grid --}}
    <div class="row">
        <div class="col-md-6 mb-4">
            <div class="section-header">
                <span class="dot bg-success"></span>
                <h5 class="text-uppercase font-weight-bold text-secondary">High-Performers</h5>
            </div>
            <div class="card shadow-sm border-0 h-100" style="border-radius: 16px;">
                <div class="card-header border-0 bg-transparent pt-4 px-4">
                    <h3 class="card-title font-weight-bold text-muted"><i class="fas fa-star mr-2 text-warning"></i> Top 5 Properties</h3>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover m-0">
                            <thead class="bg-light">
                                <tr>
                                    <th class="border-0 px-4">Property</th>
                                    <th class="border-0 text-center">Volume</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($topItems as $item)
                                    <tr>
                                        <td class="px-4 font-weight-600 text-dark">{{ $item->title }}</td>
                                        <td class="text-center">
                                            <span class="badge badge-pill bg-primary px-3 py-1 shadow-xs">{{ $item->count }}</span>
                                        </td>
                                    </tr>
                                @empty
                                    <tr><td colspan="2" class="text-center py-4 text-muted small">No metrics available</td></tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-6 mb-4">
            <div class="section-header">
                <span class="dot bg-secondary"></span>
                <h5 class="text-uppercase font-weight-bold text-secondary">Recent Activity</h5>
            </div>
            <div class="card shadow-sm border-0 h-100" style="border-radius: 16px;">
                <div class="card-header border-0 bg-transparent pt-4 px-4">
                    <h3 class="card-title font-weight-bold text-muted"><i class="fas fa-clock mr-2 text-info"></i> Latest Bookings</h3>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover m-0">
                            <thead class="bg-light">
                                <tr>
                                    <th class="border-0 px-4">Entity</th>
                                    <th class="border-0">Amount</th>
                                    <th class="border-0 text-right px-4">Status</th>
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
                                                $statusClass = [
                                                    'completed' => 'badge-success',
                                                    'pending' => 'badge-warning',
                                                    'cancelled' => 'badge-danger',
                                                ][strtolower($booking->status)] ?? 'badge-secondary';
                                            @endphp
                                            <span class="badge badge-pill {{ $statusClass }} px-2 py-1">{{ ucfirst($booking->status) }}</span>
                                        </td>
                                    </tr>
                                @empty
                                    <tr><td colspan="3" class="text-center py-4 text-muted small">Empty activity log</td></tr>
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
            <div class="bg-light p-3 rounded-pill d-inline-block border shadow-xs px-4">
                <small class="text-muted">
                    <i class="fas fa-info-circle mr-1 text-primary"></i> 
                    Reporting logic is based on <strong>Creation Date</strong> (`created_at`) across all modules.
                </small>
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
        0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.4); transform: scale(0.95); }
        70% { box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); transform: scale(1); }
        100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); transform: scale(0.95); }
    }

    .shadow-xs { box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important; }
    .letter-spacing-1 { letter-spacing: 1px; }
    .font-weight-600 { font-weight: 600; }
</style>
@stop
@section('js')
    <script>
        window.addEventListener('load', function() {
            try {
                const ctx = document.getElementById('bookingTrendChart').getContext('2d');

                // Data passed from the Laravel Controller (Ensure these variables are correctly available via Blade)
                const labels = @json($chartLabels);
                const data = @json($chartData);

                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Bookings Count',
                            data: data,
                            // Using standard AdminLTE primary color for the line chart
                            backgroundColor: 'rgba(0, 123, 255, 0.4)',
                            borderColor: 'rgba(0, 123, 255, 1)',
                            borderWidth: 3,
                            tension: 0.3,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false, // Allows the style height to take effect
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    // Ensure y-axis labels are integers
                                    callback: function(value) {
                                        if (Number.isInteger(value)) {
                                            return value;
                                        }
                                    }
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                mode: 'index',
                                intersect: false,
                            }
                        }
                    }
                });
            } catch (e) {
                console.error("Error loading chart:", e);
            }
        });
    </script>
@stop
