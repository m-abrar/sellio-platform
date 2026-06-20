{{--
    Administrative Dashboard (Main Dashboard)
    
    This is the primary intelligence hub for the Sellio platform.
    It aggregates cross-module KPIs, financial performance, system health,
    and geospatial distribution data into a unified executive overview.
    
    @extends adminlte::page
    @context Authenticated Administrator
    @variables array $metrics Pre-aggregated dashboard data including chart values and KPIs.
--}}
@extends('adminlte::page')

@section('title', __('Dashboard'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="d-flex flex-column flex-md-row align-items-center justify-content-between mb-2">
            <div class="text-center text-md-left mb-3 mb-md-0">
                <h1 class="font-weight-bold text-dark mb-0">
                    <i class="fas fa-chart-line mr-2 text-primary"></i> 
                    {{ __('Dashboard') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Welcome back') }}, {{ auth()->user()->name }}. {{ __('Performance metrics are live for') }} <span class="text-primary font-weight-bold">{{ now()->format('F d, Y') }}</span>.</p>
            </div>
            <div class="d-md-block text-right">
                <div class="dashboard-clock-wrapper px-3 py-2 shadow-premium d-inline-block text-center">
                    <div id="dashboard-clock" class="h4 font-weight-bold text-primary mb-0 dashboard-clock-text">00:00:00</div>
                    <div class="text-white smallest font-weight-bold uppercase letter-spacing-1 opacity-50">{{ now()->format('l, d M Y') }}</div>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">

    {{-- Quick Actions Row --}}
    <div class="row mb-4">
        <!-- Add Listing Dropdown -->
        <div class="col-6 col-md-3">
            <div class="dropdown">
                <button class="btn btn-submit-premium btn-premium-action d-flex align-items-center justify-content-center py-3 w-100 shadow-premium font-weight-bold rounded-pill" type="button" data-toggle="dropdown">
                    <i class="fas fa-plus-circle mr-2"></i> {{ __('ADD LISTING') }} <i class="fas fa-caret-down ml-2 opacity-50"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-right dropdown-menu-premium border-0 animate__animated animate__fadeInUp rounded-xl">
                    <div class="px-3 py-2 small text-muted font-weight-bold text-uppercase letter-spacing-1 mb-1">{{ __('Catalog Engines') }}</div>
                    @if(module_enabled('products'))
                        <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600 mb-1" href="{{ route('admin.products.create') }}"><i class="fas fa-shopping-bag mr-2 text-success"></i> {{ __('Create Product') }}</a>
                    @endif
                    @if(module_enabled('properties'))
                        <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600 mb-1" href="{{ route('admin.properties.create') }}"><i class="fas fa-building mr-2 text-info"></i> {{ __('Create Property') }}</a>
                    @endif
                    @if(module_enabled('autos'))
                        <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600 mb-1" href="{{ route('admin.autos.create') }}"><i class="fas fa-car mr-2 text-primary"></i> {{ __('Create Auto') }}</a>
                    @endif
                    @if(module_enabled('events'))
                        <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600 mb-1" href="{{ route('admin.events.create') }}"><i class="fas fa-calendar-check mr-2 text-warning"></i> {{ __('Create Event') }}</a>
                    @endif
                    @if(module_enabled('jobs'))
                        <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600 mb-1" href="{{ route('admin.jobs.create') }}"><i class="fas fa-briefcase mr-2 text-purple"></i> {{ __('Create Job') }}</a>
                    @endif
                    @if(module_enabled('services'))
                        <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600 mb-1" href="{{ route('admin.services.create') }}"><i class="fas fa-concierge-bell mr-2 text-teal"></i> {{ __('Create Service') }}</a>
                    @endif
                    @if(module_enabled('classifieds'))
                        <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600 mb-1" href="{{ route('admin.classifieds.create') }}"><i class="fas fa-tags mr-2 text-secondary"></i> {{ __('Create Classified') }}</a>
                    @endif
                </div>
            </div>
        </div>
        
        <!-- Add Booking Dropdown -->
        <div class="col-6 col-md-3">
            <div class="dropdown">
                <button class="btn btn-default btn-premium-action d-flex align-items-center justify-content-center py-3 w-100 shadow-premium font-weight-bold bg-white border-light rounded-pill text-dark-muted" type="button" data-toggle="dropdown">
                    <i class="fas fa-calendar-plus mr-2 text-primary"></i> {{ __('ADD BOOKING') }} <i class="fas fa-caret-down ml-2 opacity-50"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-right dropdown-menu-premium border-0 animate__animated animate__fadeInUp rounded-xl">
                    <div class="px-3 py-2 small text-muted font-weight-bold text-uppercase letter-spacing-1 mb-1">{{ __('Operational Flow') }}</div>
                    @if(module_enabled('properties'))
                        <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600 mb-1" href="{{ route('admin.property-bookings.create') }}"><i class="fas fa-building mr-2 text-info"></i> {{ __('Book Property') }}</a>
                    @endif
                    @if(module_enabled('events'))
                        <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600 mb-1" href="{{ route('admin.event-bookings.create') }}"><i class="fas fa-calendar-check mr-2 text-warning"></i> {{ __('Book Event') }}</a>
                    @endif
                    @if(module_enabled('autos'))
                        <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600 mb-1" href="{{ route('admin.auto-inquiries.create') }}"><i class="fas fa-car mr-2 text-primary"></i> {{ __('Auto Inquiry') }}</a>
                    @endif
                    @if(module_enabled('services'))
                        <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600 mb-1" href="{{ route('admin.service-appointments.create') }}"><i class="fas fa-clock mr-2 text-teal"></i> {{ __('Service Appt') }}</a>
                    @endif
                    @if(module_enabled('jobs'))
                        <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600 mb-1" href="{{ route('admin.job-applications.create') }}"><i class="fas fa-file-contract mr-2 text-purple"></i> {{ __('Job Application') }}</a>
                    @endif
                    @if(module_enabled('classifieds'))
                        <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600 mb-1" href="{{ route('admin.classified-inquiries.create') }}"><i class="fas fa-comment-alt mr-2 text-secondary"></i> {{ __('Item Inquiry') }}</a>
                    @endif
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600" href="{{ route('admin.bookings.index') }}"><i class="fas fa-layer-group mr-2 text-secondary"></i> {{ __('All Bookings & Leads') }}</a>
                </div>
            </div>
        </div>
    </div>

    <div class="dashboard-blueprint" data-dashboard-data="{{ json_encode($metrics['js_data']) }}">
        @php
            $sections = [
                ['id' => 'kpi', 'title' => __('Overview & Vital Stats'), 'dot' => 'danger', 'pulse' => true, 'partial' => '_KPIs'],
                ['id' => 'system', 'title' => __('System Health & Heartbeat'), 'dot' => 'success', 'pulse' => true, 'partial' => '_system_status'],
                ['id' => 'finance', 'title' => __('Finance & Market Trends'), 'dot' => 'success', 'pulse' => false, 'partial' => '_financial_performance'],
                ['id' => 'ecosystem', 'title' => __('Listings & Partner Health'), 'dot' => 'dark', 'pulse' => false, 'partial' => '_content_ecosystem'],
                ['id' => 'growth', 'title' => __('Platform Growth & Traffic'), 'dot' => 'info', 'pulse' => false, 'partial' => '_growth_metrics'],
                ['id' => 'strategy', 'title' => __('Data Analytics & Insights'), 'dot' => 'primary', 'pulse' => false, 'partial' => '_strategic_planning'],
                ['id' => 'calendar', 'title' => __('Operational Calendar'), 'dot' => 'secondary', 'pulse' => false, 'partial' => '_master_calendar'],
            ];
        @endphp

        @foreach($sections as $section)
            <div class="section-header-premium {{ !$loop->first ? 'mt-5' : '' }}">
                <span class="dot {{ $section['pulse'] ? 'pulse-glow-dot' : '' }} bg-{{ $section['dot'] }}"></span>
                <h5 class="text-uppercase font-weight-bold text-secondary smallest mb-0">{{ $section['title'] }}</h5>
            </div>
            @include('admin.dashboard.partials.' . $section['partial'], ['metrics' => $metrics])
        @endforeach
    </div>
</div>
@stop

@section('css')
    @include('admin._partials._toggle-card-css')
    <link rel="stylesheet" href="{{ asset('vendor/npm/animate.css/animate.min.css') }}"/>
    <link rel="stylesheet" href="{{ asset('vendor/npm/leaflet/leaflet.css') }}" />
@stop

@push('js')
    <script src="{{ asset('vendor/npm/chart.js/chart.umd.min.js') }}"></script>
    <script src="{{ asset('vendor/npm/fullcalendar/index.global.min.js') }}"></script>
    <script src="{{ asset('vendor/npm/leaflet/leaflet.js') }}"></script>
    <script src="{{ asset('vendor/npm/leaflet.heat/leaflet-heat.js') }}"></script>
    
    <script src="{{ asset('admin-assets/pages/dashboard.js') }}"></script>
@endpush
