@extends('adminlte::page')

@section('title', 'Reports & Intelligence')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-chart-line mr-2 text-primary"></i> Analytical Intelligence
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    Reviewing marketplace performance, revenue streams, and operation metrics.
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                    <i class="fas fa-th-large"></i> Dashboard
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <div class="row">
        @php
            $reports = [
                [
                    'route' => 'admin.reports.bookings',
                    'icon' => 'fa-calendar-check',
                    'title' => 'Booking Velocity Analytics',
                    'desc' => 'Track reservation trends, cancellation rates, and volume growth across all marketplace modules.',
                    'color' => 'primary'
                ],
                [
                    'route' => 'admin.reports.properties',
                    'icon' => 'fa-home',
                    'title' => 'Property Utilization Analytics',
                    'desc' => 'Analyze property performance, availability trends, and regional occupancy hotspots.',
                    'color' => 'success'
                ],
                [
                    'route' => 'admin.reports.payments',
                    'icon' => 'fa-wallet',
                    'title' => 'Payments & Revenue Analytics',
                    'desc' => 'Audit revenue streams, payment gateway performance, and marketplace fee collection ledger.',
                    'color' => 'info'
                ]
            ];
        @endphp

        @foreach($reports as $report)
        <div class="col-md-4 mb-4">
            <div class="card h-100 border-0 shadow-premium stat-card rounded-24 transition-0-3">
                <div class="card-body text-center p-5">
                    <div class="icon-circle bg-{{ $report['color'] }}-soft text-{{ $report['color'] }} mx-auto mb-4 shadow-xs icon-box-80 rounded-24 d-flex align-items-center justify-content-center font-2-0">
                        <i class="fas {{ $report['icon'] }}"></i>
                    </div>
                    <h4 class="font-weight-bold text-dark mb-3 smallest text-uppercase letter-spacing-1">{{ $report['title'] }}</h4>
                    <p class="text-muted small px-2 mb-4 leading-1-6">
                        {{ $report['desc'] }}
                    </p>
                    <a href="{{ route($report['route']) }}" class="btn btn-primary-soft text-primary rounded-pill px-4 py-2 font-weight-bold smallest uppercase letter-spacing-1 stretched-link">
                        Generate Report <i class="fas fa-chevron-right ml-2 small"></i>
                    </a>
                </div>
            </div>
        </div>
        @endforeach
    </div>
</div>
@endsection

@endpush
