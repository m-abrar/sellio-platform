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

    <div class="container-fluid">
        
        <div class="card card-outline card-info">
            <div class="card-header">
                <h3 class="card-title"><i class="fas fa-calendar-alt mr-1"></i> Filter Report</h3>
                <div class="card-tools">
                    <span class="badge badge-secondary">Current Range: {{ $startDateFormatted ?? 'N/A' }} to {{ $endDateFormatted ?? 'N/A' }}</span>
                </div>
            </div>
            <div class="card-body">
                {{-- NOTE: This filter is based on the transaction's creation date/paid_at date, not a booking date. --}}
                <form action="{{ route('admin.reports.payments') }}" method="GET" class="form-row">
                    <div class="form-group col-md-5">
                        <label for="start_date">Start Date</label>
                        <input type="date" name="start_date" id="start_date"
                                value="{{ $startDateFormatted ?? '' }}"
                                class="form-control">
                    </div>

                    <div class="form-group col-md-5">
                        <label for="end_date">End Date</label>
                        <input type="date" name="end_date" id="end_date"
                                value="{{ $endDateFormatted ?? '' }}"
                                class="form-control">
                    </div>

                    <div class="form-group col-md-2 d-flex align-items-end">
                        <button type="submit" class="btn btn-primary btn-block">
                            <i class="fas fa-filter mr-1"></i> Apply Filter
                        </button>
                    </div>
                    
                    @if(request()->has(['start_date', 'end_date']))
                        <div class="form-group col-md-3 d-flex align-items-end">
                            <a href="{{ route('admin.reports.payments') }}" class="btn btn-default btn-block">
                                <i class="fas fa-sync-alt mr-1"></i> Reset
                            </a>
                        </div>
                    @endif
                </form>
            </div>
        </div>

        {{--- KPI Small Boxes (Replacing the Bootstrap Card design) ---}}
        <div class="row">
            
            {{-- Total Revenue Card (Success) --}}
            <div class="col-lg-4 col-6">
                <div class="small-box bg-success">
                    <div class="inner">
                        <h3>${{ $totalRevenue ?? '0.00' }}</h3>
                        <p>Total Revenue</p>
                    </div>
                    <div class="icon">
                        <i class="fas fa-sack-dollar"></i>
                    </div>
                    <a href="#" class="small-box-footer">
                        View details <i class="fas fa-arrow-circle-right"></i>
                    </a>
                </div>
            </div>

            {{-- Avg. Transaction Value Card (Info/Primary) --}}
            <div class="col-lg-4 col-6">
                <div class="small-box bg-info">
                    <div class="inner">
                        <h3>${{ number_format($avgTransactionValue ?? 0, 2) }}</h3>
                        <p>Avg. Transaction Value</p>
                    </div>
                    <div class="icon">
                        <i class="fas fa-hand-holding-dollar"></i>
                    </div>
                    <a href="#" class="small-box-footer">
                        Analyze value <i class="fas fa-arrow-circle-right"></i>
                    </a>
                </div>
            </div>

            {{-- Successful Transactions Card (Primary) --}}
            <div class="col-lg-4 col-6">
                <div class="small-box bg-primary">
                    <div class="inner">
                        <h3>{{ number_format($successfulTransactions ?? 0) }}</h3>
                        <p>Successful Transactions</p>
                    </div>
                    <div class="icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <a href="#" class="small-box-footer">
                        See volume <i class="fas fa-arrow-circle-right"></i>
                    </a>
                </div>
            </div>
        </div>

        {{-- Monthly Revenue Trend Chart --}}
        <div class="row">
            <div class="col-12">
                <div class="card card-outline card-primary">
                    <div class="card-header border-0">
                        <h3 class="card-title">
                            <i class="fas fa-chart-line mr-1"></i>
                            Monthly Revenue Trend (Last {{ count($chartLabels ?? []) }} Months)
                        </h3>
                    </div>
                    <div class="card-body">
                        {{-- Added style height for better Chart.js rendering in AdminLTE --}}
                        <div class="chart-responsive" style="height: 300px;">
                            <canvas id="revenueChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {{-- Recent Transactions List Section --}}
        <div class="row">
            <div class="col-12">
                <div class="card card-outline card-secondary">
                    <div class="card-header border-transparent">
                        <h3 class="card-title"><i class="fas fa-list-alt mr-1"></i> Recent Transactions</h3>
                        <div class="card-tools">
                            <a href="http://127.0.0.1:8000/admin/payments" class="btn btn-sm btn-outline-secondary">
                                <i class="fas fa-search-dollar mr-1"></i> View All Transactions
                            </a>
                        </div>
                    </div>

                    <div class="card-body p-0">
                        <div class="table-responsive">
                            {{-- Use table-hover for better interactivity --}}
                            <table class="table m-0 table-striped table-hover" id="transactionsTable">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Amount</th>
                                        <th>Payment Method</th>
                                        <th>Status</th>
                                        <th>Payable Item</th>
                                        <th>Paid Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @forelse ($recentTransactions ?? [] as $transaction)
                                    <tr>
                                        <td>{{ $transaction->id }}</td>
                                        <td><span class="text-success font-weight-bold">${{ number_format($transaction->amount, 2) }}</span></td>
                                        {{-- Updated column header to match display data --}}
                                        <td>{{ $transaction->method }}</td> 
                                        <td>
                                            @php
                                                // Map status to AdminLTE badge classes
                                                $badgeClass = [
                                                    'completed' => 'badge-success',
                                                    'pending'   => 'badge-warning',
                                                    'failed'    => 'badge-danger',
                                                ][strtolower($transaction->status)] ?? 'badge-secondary';
                                            @endphp
                                            <span class="badge {{ $badgeClass }}">
                                                {{ ucfirst($transaction->status) }}
                                            </span>
                                        </td>
                                        <td>
                                            @include('admin.reports.partials._payable_link', ['payable' => $transaction->payable])
                                        </td>
                                        {{-- Assuming Carbon instance for formatting --}}
                                        <td>{{ $transaction->paid_at?->format('M d, Y H:i') }}</td>
                                    </tr>
                                    @empty
                                    <tr>
                                        <td colspan="6" class="text-center text-muted py-4">No recent transactions found in the selected range.</td>
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