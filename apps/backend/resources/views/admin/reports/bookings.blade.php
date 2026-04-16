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

    <div class="container-fluid">

        <div class="card card-outline card-info">
            <div class="card-header">
                <h3 class="card-title"><i class="fas fa-calendar-alt mr-1"></i> Filter by Date Range</h3>
                <div class="card-tools">
                    <span class="badge badge-primary">Current Range: {{ $startDateFormatted ?? 'N/A' }} to {{ $endDateFormatted ?? 'N/A' }}</span>
                </div>
            </div>
            <div class="card-body">
                

                <form action="{{ url()->current() }}" method="GET" class="form-row">
                    <div class="form-group col-md-4">
                        <label for="start_date">Start Date</label>
                        <input type="date" name="start_date" id="start_date"
                               value="{{ $startDateFormatted ?? '' }}"
                               class="form-control">
                    </div>
                    <div class="form-group col-md-4">
                        <label for="end_date">End Date</label>
                        <input type="date" name="end_date" id="end_date"
                               value="{{ $endDateFormatted ?? '' }}"
                               class="form-control">
                    </div>
                    <div class="form-group col-md-4 d-flex align-items-end">
                        <button type="submit" class="btn btn-primary btn-block">
                            <i class="fas fa-filter"></i> Apply Filter
                        </button>
                    </div>
                </form>
            </div>
            </div>

        <div class="row">
            {{-- Total Bookings Card (Info/Primary) --}}
            <div class="col-lg-3 col-6">
                <div class="small-box bg-info">
                    <div class="inner">
                        <h3>{{ $totalBookings }}</h3>
                        <p>Total Bookings</p>
                    </div>
                    <div class="icon">
                        <i class="fas fa-ticket-alt"></i>
                    </div>
                    <a href="#" class="small-box-footer">
                        More info <i class="fas fa-arrow-circle-right"></i>
                    </a>
                </div>
            </div>

            {{-- Total Revenue Card (Success) --}}
            <div class="col-lg-3 col-6">
                <div class="small-box bg-success">
                    <div class="inner">
                        <h3>${{ $totalRevenue }}</h3>
                        <p>Total Revenue</p>
                    </div>
                    <div class="icon">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <a href="#" class="small-box-footer">
                        More info <i class="fas fa-arrow-circle-right"></i>
                    </a>
                </div>
            </div>

            {{-- Cancellation Rate Card (Danger) --}}
            <div class="col-lg-3 col-6">
                <div class="small-box bg-danger">
                    <div class="inner">
                        <h3>{{ $cancellationRate }}<sup style="font-size: 20px">%</sup></h3>
                        <p>Cancellation Rate</p>
                    </div>
                    <div class="icon">
                        <i class="fas fa-ban"></i>
                    </div>
                    <a href="#" class="small-box-footer">
                        View details <i class="fas fa-arrow-circle-right"></i>
                    </a>
                </div>
            </div>

            {{-- Average Booking Value Card (Warning) --}}
            <div class="col-lg-3 col-6">
                <div class="small-box bg-warning">
                    <div class="inner">
                        <h3>${{ $avgBookingValue }}</h3>
                        <p>Avg. Booking Value</p>
                    </div>
                    <div class="icon">
                        <i class="fas fa-wallet"></i>
                    </div>
                    <a href="#" class="small-box-footer">
                        Analyze value <i class="fas fa-arrow-circle-right"></i>
                    </a>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card card-outline card-primary">
                    <div class="card-header border-0">
                        <h3 class="card-title">
                            <i class="fas fa-chart-line mr-1"></i>
                            Monthly Booking Count Trend (Last 12 Months)
                        </h3>
                    </div>
                    <div class="card-body">
                        <div class="chart-responsive">
                            <canvas id="bookingTrendChart" style="height: 300px;"></canvas>
                        </div>
                    </div>
                    </div>
                </div>
        </div>
        <div class="row">
            {{-- Top Booked Properties Table --}}
            <div class="col-md-6">
                <div class="card card-outline card-success">
                    <div class="card-header border-transparent">
                        <h3 class="card-title"><i class="fas fa-trophy mr-1"></i> Top 5 Booked Properties</h3>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table m-0 table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Property Name</th>
                                        <th class="text-center">Bookings</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @forelse($topItems as $item)
                                        <tr>
                                            <td>{{ $item->title }}</td>
                                            <td class="text-center"><span class="badge bg-primary">{{ $item->count }}</span></td>
                                        </tr>
                                    @empty
                                        <tr>
                                            <td colspan="2" class="text-center text-muted">No properties found in this date range.</td>
                                        </tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>
                        </div>
                    </div>
                </div>
            {{-- Recent Bookings Table --}}
            <div class="col-md-6">
                <div class="card card-outline card-primary">
                    <div class="card-header border-transparent">
                        <h3 class="card-title"><i class="fas fa-list-alt mr-1"></i> Recent Bookings</h3>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table m-0 table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Property</th>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @forelse($recentBookings as $booking)
                                        <tr>
                                            <td>{{ $booking->service }}</td>
                                            <td>{{ $booking->customer }}</td>
                                            <td><strong>${{ number_format($booking->amount, 2) }}</strong></td>
                                            <td>
                                                @php
                                                     // Map status to Bootstrap/AdminLTE badge classes
                                                     $statusClass = [
                                                         'completed' => 'badge-success',
                                                         'pending' => 'badge-warning',
                                                         'cancelled' => 'badge-danger',
                                                     ][strtolower($booking->status)] ?? 'badge-secondary';
                                                 @endphp
                                                <span class="badge {{ $statusClass }}">{{ ucfirst($booking->status) }}</span>
                                            </td>
                                        </tr>
                                    @empty
                                        <tr>
                                            <td colspan="4" class="text-center text-muted">No recent bookings found.</td>
                                        </tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12 mx-2">
                <p class="text-muted small">
                    <i class="fas fa-info-circle mr-1"></i> **Reporting Logic:** All key metrics (Total Bookings, Revenue, etc.) and tables on this page filter based on the **date the booking was CREATED (`created_at`)**, not the actual check-in or check-out date.
                </p>
            </div>
        </div>
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
