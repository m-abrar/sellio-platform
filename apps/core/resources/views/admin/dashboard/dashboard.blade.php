@extends('adminlte::page')

@section('title', 'Command Center | Admin Operations')

@section('content_header')
    <div class="d-flex align-items-center justify-content-between mb-2">
        <h1 class="font-weight-bold text-dark">
            <i class="fas fa-chart-line mr-2 text-primary"></i> 
            Dashboard Overview
            <small class="d-block d-md-inline-block ml-md-3 text-muted lead">Manage your platform and activity</small>
        </h1>
        <!-- Live Sync Removed -->
    </div>
@stop

@section('content')
    {{-- Quick Actions Row --}}
    <div class="row mb-4 mx-1">
        <!-- Add Listing Dropdown -->
        <div class="col-6 col-md-3 px-1">
            <div class="dropdown">
                <button class="btn btn-primary d-flex align-items-center justify-content-center py-3 w-100 shadow-sm font-weight-bold" type="button" data-toggle="dropdown" style="border-radius: 12px; background: linear-gradient(135deg, #FF3366, #ff6a00) !important; border: none !important; color: #fff !important;">
                    <i class="fas fa-plus-circle mr-2"></i> Add Listing <i class="fas fa-caret-down ml-2"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-right shadow-lg border-0" style="border-radius: 12px; min-width: 220px;">
                    @if(module_enabled('products'))
                        <a class="dropdown-item py-2" href="{{ route('admin.products.create') }}"><i class="fas fa-shopping-bag mr-2 text-success"></i> Create Product</a>
                    @endif
                    @if(module_enabled('properties'))
                        <a class="dropdown-item py-2" href="{{ route('admin.properties.create') }}"><i class="fas fa-building mr-2 text-info"></i> Create Property</a>
                    @endif
                    @if(module_enabled('autos'))
                        <a class="dropdown-item py-2" href="{{ route('admin.autos.create') }}"><i class="fas fa-car mr-2 text-primary"></i> Create Auto</a>
                    @endif
                    @if(module_enabled('events'))
                        <a class="dropdown-item py-2" href="{{ route('admin.events.create') }}"><i class="fas fa-calendar-check mr-2 text-warning"></i> Create Event</a>
                    @endif
                    @if(module_enabled('jobs'))
                        <a class="dropdown-item py-2" href="{{ route('admin.jobs.create') }}"><i class="fas fa-briefcase mr-2 text-purple"></i> Create Job</a>
                    @endif
                    @if(module_enabled('services'))
                        <a class="dropdown-item py-2" href="{{ route('admin.services.create') }}"><i class="fas fa-hand-holding-heart mr-2 text-maroon"></i> Create Service</a>
                    @endif
                    @if(module_enabled('classifieds'))
                        <a class="dropdown-item py-2" href="{{ route('admin.classifieds.create') }}"><i class="fas fa-bullhorn mr-2 text-orange"></i> Create Classified</a>
                    @endif
                </div>
            </div>
        </div>
        
        <!-- Add Booking Dropdown -->
        <div class="col-6 col-md-3 px-1">
            <div class="dropdown">
                <button class="btn btn-default d-flex align-items-center justify-content-center py-3 w-100 shadow-sm font-weight-bold" type="button" data-toggle="dropdown" style="border-radius: 12px; border: 1px solid #dee2e6; background: #fff; color: #495057 !important;">
                    <i class="fas fa-calendar-plus mr-2 text-primary"></i> Add Booking <i class="fas fa-caret-down ml-2"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-right shadow-lg border-0" style="border-radius: 12px; min-width: 220px;">
                    @if(module_enabled('properties'))
                        <a class="dropdown-item py-2" href="{{ route('admin.property-bookings.create') }}"><i class="fas fa-building mr-2 text-info"></i> Book Property</a>
                    @endif
                    @if(module_enabled('events'))
                        <a class="dropdown-item py-2" href="{{ route('admin.event-bookings.create') }}"><i class="fas fa-calendar-check mr-2 text-warning"></i> Book Event</a>
                    @endif
                    @if(module_enabled('autos'))
                        <a class="dropdown-item py-2" href="{{ route('admin.auto-inquiries.create') }}"><i class="fas fa-car mr-2 text-primary"></i> Auto Inquiry</a>
                    @endif
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item py-2" href="{{ route('admin.bookings.index') }}"><i class="fas fa-layer-group mr-2 text-secondary"></i> All Bookings & Leads</a>
                </div>
            </div>
        </div>
    </div>

    <div class="dashboard-blueprint pb-5">
        @php
            $sections = [
                ['id' => 'kpi', 'title' => 'Overview & Vital Stats', 'dot' => 'danger', 'pulse' => true, 'partial' => '_KPIs'],
                ['id' => 'finance', 'title' => 'Finance & Market Trends', 'dot' => 'success', 'pulse' => false, 'partial' => '_financial_performance'],
                ['id' => 'ecosystem', 'title' => 'Listings & Partner Health', 'dot' => 'dark', 'pulse' => false, 'partial' => '_content_ecosystem'],
                ['id' => 'growth', 'title' => 'Platform Growth & Traffic', 'dot' => 'info', 'pulse' => false, 'partial' => '_growth_metrics'],
                ['id' => 'strategy', 'title' => 'Data Analytics & Insights', 'dot' => 'primary', 'pulse' => false, 'partial' => '_strategic_planning'],
                ['id' => 'calendar', 'title' => 'Operational Calendar', 'dot' => 'secondary', 'pulse' => false, 'partial' => '_master_calendar'],
            ];
        @endphp

        @foreach($sections as $section)
            <div class="section-header {{ !$loop->first ? 'mt-5' : '' }}">
                <span class="dot {{ $section['pulse'] ? 'pulse' : '' }} bg-{{ $section['dot'] }}"></span>
                <h5 class="text-uppercase font-weight-bold text-secondary">{{ $section['title'] }}</h5>
            </div>
            @include('admin.dashboard.partials.' . $section['partial'], ['metrics' => $metrics])
        @endforeach
    </div>
@stop


@section('css')
    <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" />
    <style>
        /* Sectioning & Layout */
        .section-header { display: flex; align-items: center; margin-bottom: 1.5rem; }
        .section-header .dot { width: 12px; height: 12px; border-radius: 50%; margin-right: 12px; transition: transform 0.3s; }
        .section-header h5 { margin: 0; letter-spacing: 1.2px; font-size: 0.85rem; opacity: 0.8; }
        
        /* Modern Card kit */
        .dashboard-blueprint .card { border-radius: 12px; border: none; transition: all 0.25s ease; box-shadow: 0 4px 6px rgba(0,0,0,0.03); }
        .dashboard-blueprint .card:hover { transform: translateY(-3px); box-shadow: 0 12px 20px rgba(0,0,0,0.08) !important; }

        /* Color Utility Factory */
        .bg-primary-light { background: rgba(0,123,255,0.1) !important; }
        .bg-success-light { background: rgba(40,167,69,0.1) !important; }
        .bg-danger-light  { background: rgba(220,53,69,0.1) !important; }
        .bg-info-light    { background: rgba(23,162,184,0.1) !important; }
        
        .icon-circle { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }

        /* Global Pulse Animation */
        .pulse { animation: pulse-shadow 2s infinite; }
        @keyframes pulse-shadow {
            0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.6); transform: scale(0.95); }
            70% { box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); transform: scale(1); }
            100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); transform: scale(0.95); }
        }
        
        #master-calendar { background: #fff; padding: 1.5rem; border-radius: 12px; border: 1px solid #edf2f7; }
    </style>
@stop


@section('js')
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>
    <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet.heat/dist/leaflet-heat.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const data = @json($metrics['js_data']);
            
            // DRY Chart Configuration
            const baseOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: true, position: 'bottom', labels: { usePointStyle: true, padding: 20 } } }
            };

            // 1. Revenue Analytics
            new Chart(document.getElementById('revenueChart'), {
                type: 'line',
                data: {
                    labels: data.revenue_chart.labels,
                    datasets: [
                        { label: 'Gross', data: data.revenue_chart.gross_earnings, borderColor: '#28a745', backgroundColor: 'rgba(40,167,69,0.05)', fill: true, tension: 0.4 },
                        { label: 'Outflow', data: data.revenue_chart.total_payouts, borderColor: '#007bff', borderDash: [5, 5], fill: false }
                    ]
                },
                options: baseOptions
            });

            // 2. Distribution Pie
            new Chart(document.getElementById('propertyTypeChart'), {
                type: 'doughnut',
                data: {
                    labels: data.type_chart.labels,
                    datasets: [{ data: data.type_chart.data, backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#858796'] }]
                },
                options: { ...baseOptions, scales: {
                    // This explicitly hides any background grid/axes
                    x: { display: false },
                    y: { display: false }
                } }
            });

            // 3. Operational Calendar
            new FullCalendar.Calendar(document.getElementById('master-calendar'), {
                initialView: 'dayGridMonth',
                themeSystem: 'bootstrap',
                headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' },
                events: data.calendar_events,
                height: 'auto'
            }).render();

            // 4. Geospatial Heatmap
            const map = L.map('heatmap', { scrollWheelZoom: false }).setView([30.3753, 69.3451], 5);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
            L.heatLayer(data.heatmap_data, { radius: 20, blur: 15 }).addTo(map);
        });
    </script>
@stop
