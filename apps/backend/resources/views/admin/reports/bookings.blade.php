{{--
    Administrative Intelligence: Booking Velocity Analysis
    
    This view provides high-fidelity insights into marketplace reservation 
    patterns. It orchestrates the visualization of booking volume, 
    revenue attribution, and cancellation metrics while facilitating 
    granular performance auditing across resource categories.
    
    @extends adminlte::page
    @context Analytical Reporting
    @variables string $reportTitle The localized title of the analytical report.
--}}
@extends('adminlte::page')

@section('plugins.Chartjs', true) 

@section('title', $reportTitle)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-calendar-check mr-2 text-primary opacity-50"></i> {{ $reportTitle ?? __('Booking Velocity Analytics') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Track booking performance, velocity trends, and resource utilization.') }}</p>
            </div>
            @include('admin.reports._header_actions', ['exportText' => __('Export to PDF')])
        </div>
    </div>
@stop

@section('content')
@include('admin.alert')

<div class="container-fluid pb-5">
    
    {{--
    Administrative Intelligence Component: Booking Filter Protocol
    
    This partial facilitates the temporal filtering of booking analytics. 
    It orchestrates date-range selection and range-badge feedback, 
    ensuring precise analytical scoping for reservation velocity reports.
    
    @context Analytical Reporting
    @variables string $startDateFormatted The localized start date of the analysis period.
    @variables string $endDateFormatted The localized end date of the analysis period.
--}}
{{-- Filter Protocol --}}
    @include('admin.reports._bookings_filter')

    {{-- Stats Row --}}
    <div class="row mb-5">
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card card-premium stat-card-interactive h-100 border-0 shadow-premium overflow-hidden">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-box-soft bg-info-soft text-info mr-3 shadow-xs icon-box-48 rounded-14 d-flex align-items-center justify-content-center">
                            <i class="fas fa-ticket-alt text-lg"></i>
                        </div>
                        <span class="text-uppercase smallest font-weight-bold text-muted letter-spacing-1">{{ __('Total Bookings') }}</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-2">{{ $totalBookings }}</h2>
                        <span class="text-success smallest font-weight-bold"><i class="fas fa-caret-up mr-1"></i>{{ __('LIVE') }}</span>
                    </div>
                    <div class="progress mt-3 h-4 rounded-2 bg-black-0-05">
                        <div class="progress-bar bg-info" role="progressbar" style="width: 100%"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card card-premium stat-card-interactive h-100 border-0 shadow-premium overflow-hidden">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-box-soft bg-success-soft text-success mr-3 shadow-xs icon-box-48 rounded-14 d-flex align-items-center justify-content-center">
                            <i class="fas fa-dollar-sign text-lg"></i>
                        </div>
                        <span class="text-uppercase smallest font-weight-bold text-muted letter-spacing-1">{{ __('Revenue') }}</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">{{ setting('currency_symbol', '$') }}{{ $totalRevenue }}</h2>
                        <span class="text-muted smallest font-weight-bold uppercase">{{ setting('currency_code', 'USD') }}</span>
                    </div>
                    <div class="progress mt-3 h-4 rounded-2 bg-black-0-05">
                        <div class="progress-bar bg-success" role="progressbar" style="width: 100%"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card card-premium stat-card-interactive h-100 border-0 shadow-premium overflow-hidden">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-box-soft bg-danger-soft text-danger mr-3 shadow-xs icon-box-48 rounded-14 d-flex align-items-center justify-content-center">
                            <i class="fas fa-ban text-lg"></i>
                        </div>
                        <span class="text-uppercase smallest font-weight-bold text-muted letter-spacing-1">{{ __('Cancellation') }}</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">{{ $cancellationRate }}%</h2>
                        <span class="text-muted smallest font-weight-bold uppercase">{{ __('RATIO') }}</span>
                    </div>
                    <div class="progress mt-3 h-4 rounded-2 bg-black-0-05">
                        <div class="progress-bar bg-danger" role="progressbar" style="width: {{ $cancellationRate }}%"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card card-premium h-100 border-0 shadow-premium overflow-hidden">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-box-soft bg-primary-soft text-primary mr-3 shadow-xs icon-box-48 rounded-14 d-flex align-items-center justify-content-center">
                            <i class="fas fa-wallet text-lg"></i>
                        </div>
                        <span class="text-uppercase smallest font-weight-bold text-muted letter-spacing-1">{{ __('Avg Value') }}</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">{{ setting('currency_symbol', '$') }}{{ $avgBookingValue }}</h2>
                        <span class="text-muted smallest font-weight-bold uppercase">{{ __('/ORDER') }}</span>
                    </div>
                    <div class="progress mt-3 h-4 rounded-2 bg-black-0-05">
                        <div class="progress-bar bg-primary" role="progressbar" style="width: 100%"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- Trend Analysis --}}
    <div class="card card-premium shadow-premium mb-5 border-0 overflow-hidden">
        <div class="card-header border-0 bg-white pt-4 px-4 d-flex align-items-center">
            <div class="icon-box-soft bg-primary-soft text-primary mr-3 shadow-xs icon-box-40 rounded-10 d-flex align-items-center justify-content-center">
                <i class="fas fa-chart-area"></i>
            </div>
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">{{ __('Monthly Booking Trend') }}</h3>
        </div>
        <div class="card-body p-4">
            <div class="chart-responsive h-380-p">
                <canvas id="bookingTrendChart" 
                        data-chart-config='{"labels": @json($chartLabels), "data": @json($chartData)}'></canvas>
            </div>
        </div>
    </div>

    {{-- Detail Grid --}}
    <div class="row">
        <div class="col-md-6 mb-4">
            <div class="card card-premium shadow-premium border-0 h-100 overflow-hidden">
                <div class="card-header border-0 bg-white pt-4 px-4 d-flex align-items-center">
                    <div class="icon-box-soft bg-warning-soft text-warning mr-3 shadow-xs icon-box-40 rounded-10 d-flex align-items-center justify-content-center">
                        <i class="fas fa-star"></i>
                    </div>
                    <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">{{ __('High-Performers') }}</h3>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover table-premium m-0">
                            <thead>
                                <tr>
                                    <th class="pl-4">{{ __('Property Identity') }}</th>
                                    <th class="text-center">{{ __('Volume') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($topItems as $item)
                                    <tr>
                                        <td class="pl-4 align-middle">
                                            <span class="font-weight-bold text-dark smallest text-uppercase letter-spacing-1">{{ $item->title }}</span>
                                        </td>
                                        <td class="text-center align-middle">
                                            <span class="badge badge-primary-light text-primary px-3 py-1 rounded-pill font-weight-bold smallest uppercase">{{ $item->count }}</span>
                                        </td>
                                    </tr>
                                @empty
                                    <tr><td colspan="2" class="text-center py-5 text-muted smallest uppercase font-weight-bold">{{ __('No metrics available') }}</td></tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-6 mb-4">
            <div class="card card-premium shadow-premium border-0 h-100 overflow-hidden">
                <div class="card-header border-0 bg-white pt-4 px-4 d-flex align-items-center">
                    <div class="icon-box-soft bg-info-soft text-info mr-3 shadow-xs icon-box-40 rounded-10 d-flex align-items-center justify-content-center">
                        <i class="fas fa-clock"></i>
                    </div>
                    <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">{{ __('Recent Activity') }}</h3>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover table-premium m-0">
                            <thead>
                                <tr>
                                    <th class="pl-4">{{ __('Entity') }}</th>
                                    <th>{{ __('Settlement') }}</th>
                                    <th class="text-right pr-4">{{ __('Lifecycle') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($recentBookings as $booking)
                                    <tr>
                                        <td class="pl-4 align-middle">
                                            <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $booking->service }}</span>
                                            <small class="text-muted smallest">{{ $booking->customer }}</small>
                                        </td>
                                        <td class="align-middle font-weight-bold text-primary smallest uppercase">{{ setting('currency_symbol', '$') }}{{ number_format($booking->amount, 2) }}</td>
                                        <td class="text-right pr-4 align-middle">
                                            @php
                                                $statusStyle = [
                                                    'completed' => 'badge-success-light text-success',
                                                    'pending'   => 'badge-warning-light text-warning',
                                                    'cancelled' => 'badge-danger-light text-danger',
                                                ][strtolower($booking->status)] ?? 'badge-secondary-light text-secondary';
                                            @endphp
                                            <span class="badge {{ $statusStyle }} px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">{{ strtoupper(__($booking->status)) }}</span>
                                        </td>
                                    </tr>
                                @empty
                                    <tr><td colspan="3" class="text-center py-5 text-muted smallest uppercase font-weight-bold">{{ __('Empty activity log') }}</td></tr>
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
            <div class="card-premium d-inline-block border px-4 py-2 shadow-xs rounded-50 bg-white">
                <small class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                    <i class="fas fa-info-circle mr-2 text-primary"></i> 
                    {!! __('Reporting logic is synchronized with :context.', ['context' => '<span class="text-dark">' . __('Creation Timestamps') . '</span>']) !!}
                </small>
            </div>
        </div>
    </div>
</div>
@stop

@section('js')
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
<script src="{{ asset('admin-assets/pages/reports-bookings.js') }}"></script>
@stop
