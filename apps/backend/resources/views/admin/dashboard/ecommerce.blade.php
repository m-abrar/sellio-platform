{{--
    Ecommerce Intelligence Hub
    
    This dashboard specialized overview focuses on the e-commerce vertical,
    aggregating sales performance, inventory logistics, and customer 
    geographic distribution. It provides specialized KPIs for order 
    management and transactional growth.
    
    @extends adminlte::page
    @context Authenticated Administrator
    @variables array $metrics Pre-aggregated ecommerce data including sales charts and KPIs.
--}}
@extends('adminlte::page')

@section('title', 'Ecommerce Intelligence | Sales Ops')

@section('css')
    @include('admin._partials._toggle-card-css')
    <link rel="stylesheet" href="{{ asset('vendor/npm/animate.css/animate.min.css') }}"/>
    <link rel="stylesheet" href="{{ asset('vendor/npm/leaflet/leaflet.css') }}" />
@stop

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="d-flex align-items-center justify-content-between mb-2">
            <div>
                <h1 class="font-weight-bold text-dark mb-0">
                    <i class="fas fa-shopping-cart mr-2 text-primary"></i> 
                    Ecommerce Intelligence
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Real-time revenue metrics and inventory intelligence for <span class="text-primary font-weight-bold">{{ now()->format('F d, Y') }}</span>.</p>
            </div>
            <div class="d-none d-md-block text-right">
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
    {{-- Quick Actions Row (Ecommerce Focus) --}}
    <div class="row mb-4">
        <div class="col-6 col-md-3">
            <a href="{{ route('admin.products.create') }}" class="btn btn-submit-premium btn-premium-action d-flex align-items-center justify-content-center py-3 w-100 shadow-premium font-weight-bold rounded-md">
                <i class="fas fa-plus-circle mr-2"></i> NEW PRODUCT
            </a>
        </div>
        <div class="col-6 col-md-3">
             <a href="{{ route('admin.product-orders.index') }}" class="btn btn-default btn-premium-action d-flex align-items-center justify-content-center py-3 w-100 shadow-premium font-weight-bold border-light bg-white rounded-md text-dark-muted">
                <i class="fas fa-truck mr-2 text-primary"></i> MANAGE ORDERS
            </a>
        </div>
    </div>

    <div class="dashboard-blueprint" data-dashboard-data="{{ json_encode($metrics['js_data']) }}">
        @php
            $sections = [
                ['id' => 'kpi', 'title' => 'Sales & Vital Stats', 'dot' => 'danger', 'pulse' => true, 'partial' => '_KPIs'],
                ['id' => 'finance', 'title' => 'Revenue & Growth Trends', 'dot' => 'success', 'pulse' => false, 'partial' => '_financial_performance'],
                ['id' => 'ecosystem', 'title' => 'Inventory & Product Distribution', 'dot' => 'dark', 'pulse' => false, 'partial' => '_content_ecosystem'],
                ['id' => 'growth', 'title' => 'Customer Reach & Geography', 'dot' => 'info', 'pulse' => false, 'partial' => '_growth_metrics'],
                ['id' => 'strategy', 'title' => 'Order Feed & Logistics', 'dot' => 'primary', 'pulse' => false, 'partial' => '_strategic_planning'],
                ['id' => 'calendar', 'title' => 'Marketing & Ops Calendar', 'dot' => 'secondary', 'pulse' => false, 'partial' => '_master_calendar'],
            ];
        @endphp

        @foreach($sections as $section)
            <div class="section-header-premium {{ !$loop->first ? 'mt-5' : '' }}">
                <span class="dot {{ $section['pulse'] ? 'pulse-glow-dot' : '' }} bg-{{ $section['dot'] }}"></span>
                <h5 class="text-uppercase font-weight-bold text-secondary smallest mb-0">{{ $section['title'] }}</h5>
            </div>
            @include('admin.dashboard.partials.ecommerce.' . $section['partial'], ['metrics' => $metrics])
        @endforeach
    </div>
</div>
@stop

@push('js')
    <script src="{{ asset('vendor/npm/chart.js/chart.umd.min.js') }}"></script>
    <script src="{{ asset('vendor/npm/fullcalendar/index.global.min.js') }}"></script>
    <script src="{{ asset('vendor/npm/leaflet/leaflet.js') }}"></script>
    <script src="{{ asset('vendor/npm/leaflet.heat/leaflet-heat.js') }}"></script>

    <script src="{{ asset('admin-assets/pages/dashboard.js') }}"></script>
@endpush
