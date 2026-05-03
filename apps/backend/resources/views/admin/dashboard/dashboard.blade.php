@extends('adminlte::page')

@section('title', 'Command Center | Admin Operations')

@section('content_header')
    <div class="d-flex align-items-center justify-content-between mb-2">
        <div>
            <h1 class="font-weight-bold text-dark mb-0">
                <i class="fas fa-chart-line mr-2 text-primary"></i> 
                Command Center
            </h1>
            <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Welcome back, {{ auth()->user()->name }}. Performance metrics are live for <span class="text-primary font-weight-bold">{{ now()->format('F d, Y') }}</span>.</p>
        </div>
        <div class="d-none d-md-block text-right">
            <div class="bg-dark px-3 py-2 rounded-xl shadow-premium border border-white border-opacity-10 d-inline-block text-center" style="min-width: 220px;">
                <div id="dashboard-clock" class="h4 font-weight-bold text-primary mb-0" style="letter-spacing: 2px; font-family: 'Outfit', sans-serif; font-variant-numeric: tabular-nums;">00:00:00</div>
                <div class="text-white smallest font-weight-bold uppercase letter-spacing-1 opacity-50">{{ now()->format('l, d M Y') }}</div>
            </div>
        </div>

    </div>
@stop

@section('content')
    {{-- Quick Actions Row --}}
    <div class="row mb-4 mx-1">
        <!-- Add Listing Dropdown -->
        <div class="col-6 col-md-3 px-1">
            <div class="dropdown">
                <button class="btn btn-primary d-flex align-items-center justify-content-center py-3 w-100 shadow-premium font-weight-bold" type="button" data-toggle="dropdown" style="border-radius: 12px; border: none !important; min-height: 62px; font-size: 0.85rem; letter-spacing: 0.5px;">
                    <i class="fas fa-plus-circle mr-2"></i> ADD LISTING <i class="fas fa-caret-down ml-2 opacity-50"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-right shadow-lg border-0 animate__animated animate__fadeInUp" style="border-radius: 20px; min-width: 240px; padding: 12px; background: rgba(255,255,255,0.95); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.2) !important;">
                    <div class="px-3 py-2 small text-muted font-weight-bold text-uppercase letter-spacing-1 mb-1">Catalog Engines</div>
                    @if(module_enabled('products'))
                        <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600 mb-1" href="{{ route('admin.products.create') }}"><i class="fas fa-shopping-bag mr-2 text-success"></i> Create Product</a>
                    @endif
                    @if(module_enabled('properties'))
                        <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600 mb-1" href="{{ route('admin.properties.create') }}"><i class="fas fa-building mr-2 text-info"></i> Create Property</a>
                    @endif
                    @if(module_enabled('autos'))
                        <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600 mb-1" href="{{ route('admin.autos.create') }}"><i class="fas fa-car mr-2 text-primary"></i> Create Auto</a>
                    @endif
                    @if(module_enabled('events'))
                        <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600 mb-1" href="{{ route('admin.events.create') }}"><i class="fas fa-calendar-check mr-2 text-warning"></i> Create Event</a>
                    @endif
                    @if(module_enabled('jobs'))
                        <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600 mb-1" href="{{ route('admin.jobs.create') }}"><i class="fas fa-briefcase mr-2 text-purple"></i> Create Job</a>
                    @endif
                </div>
            </div>
        </div>
        
        <!-- Add Booking Dropdown -->
        <div class="col-6 col-md-3 px-1">
            <div class="dropdown">
                <button class="btn btn-default d-flex align-items-center justify-content-center py-3 w-100 shadow-premium font-weight-bold bg-white border-light" type="button" data-toggle="dropdown" style="border-radius: 12px; color: var(--dark-muted) !important; min-height: 62px; font-size: 0.85rem; letter-spacing: 0.5px;">
                    <i class="fas fa-calendar-plus mr-2 text-primary"></i> ADD BOOKING <i class="fas fa-caret-down ml-2 opacity-50"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-right shadow-lg border-0 animate__animated animate__fadeInUp" style="border-radius: 20px; min-width: 240px; padding: 12px; background: rgba(255,255,255,0.95); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.2) !important;">
                    <div class="px-3 py-2 small text-muted font-weight-bold text-uppercase letter-spacing-1 mb-1">Operational Flow</div>
                    @if(module_enabled('properties'))
                        <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600 mb-1" href="{{ route('admin.property-bookings.create') }}"><i class="fas fa-building mr-2 text-info"></i> Book Property</a>
                    @endif
                    @if(module_enabled('events'))
                        <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600 mb-1" href="{{ route('admin.event-bookings.create') }}"><i class="fas fa-calendar-check mr-2 text-warning"></i> Book Event</a>
                    @endif
                    @if(module_enabled('autos'))
                        <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600 mb-1" href="{{ route('admin.auto-inquiries.create') }}"><i class="fas fa-car mr-2 text-primary"></i> Auto Inquiry</a>
                    @endif
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item py-2 px-3 rounded-lg font-weight-600" href="{{ route('admin.bookings.index') }}"><i class="fas fa-layer-group mr-2 text-secondary"></i> All Bookings & Leads</a>
                </div>
            </div>
        </div>
    </div>

    <div class="dashboard-blueprint pb-5">
        @php
            $sections = [
                ['id' => 'kpi', 'title' => 'Overview & Vital Stats', 'dot' => 'danger', 'pulse' => true, 'partial' => '_KPIs'],
                ['id' => 'system', 'title' => 'System Health & Heartbeat', 'dot' => 'success', 'pulse' => true, 'partial' => '_system_status'],
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
                <h5 class="text-uppercase font-weight-bold text-secondary smallest" style="letter-spacing: 1.5px;">{{ $section['title'] }}</h5>
            </div>
            @include('admin.dashboard.partials.' . $section['partial'], ['metrics' => $metrics])
        @endforeach
    </div>
@stop

@section('css')
    @include('admin._partials._toggle-card-css')
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
    <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" />
    <style>
        /* Sectioning & Layout */
        .section-header { display: flex; align-items: center; margin-bottom: 1.5rem; }
        .section-header .dot { width: 10px; height: 10px; border-radius: 50%; margin-right: 12px; transition: transform 0.3s; }
        
        /* Modern Card kit */
        .dashboard-blueprint .card { border-radius: 20px; border: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: var(--premium-shadow); border: 1px solid rgba(255,255,255,0.4); background: rgba(255,255,255,0.8); backdrop-filter: blur(15px); }
        .dashboard-blueprint .card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important; border-color: rgba(70, 165, 172, 0.2); }

        .icon-circle { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; transition: all 0.3s ease; }
        .card:hover .icon-circle { transform: scale(1.1) rotate(5deg); }

        /* Global Pulse Animation */
        .pulse { animation: pulse-shadow 2s infinite; }
        @keyframes pulse-shadow {
            0% { box-shadow: 0 0 0 0 rgba(70, 165, 172, 0.6); transform: scale(0.95); }
            70% { box-shadow: 0 0 0 10px rgba(70, 165, 172, 0); transform: scale(1); }
            100% { box-shadow: 0 0 0 0 rgba(70, 165, 172, 0); transform: scale(0.95); }
        }
        
        #master-calendar { background: transparent; padding: 1.5rem; border-radius: 12px; }
        .fc { font-family: 'Outfit', sans-serif !important; }
        .fc .fc-toolbar-title { font-weight: 700; color: #1e293b; font-size: 1.25rem !important; }
        .fc .fc-button-primary { background-color: var(--primary); border-color: var(--primary); border-radius: 10px; font-weight: 600; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.5px; padding: 8px 16px; }
        
        .dropdown-item { transition: all 0.2s ease; }
        .dropdown-item:hover { background: var(--primary-soft) !important; color: var(--primary) !important; transform: translateX(5px); }
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
            
            // Dashboard Clock
            function updateClock() {
                const now = new Date();
                document.getElementById('dashboard-clock').textContent = now.toLocaleTimeString();
            }
            setInterval(updateClock, 1000);
            updateClock();

            // DRY Chart Configuration
            const baseOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: true, position: 'bottom', labels: { usePointStyle: true, padding: 20, font: { family: "'Outfit', sans-serif", size: 11 } } } }
            };

            // 1. Revenue Analytics
            new Chart(document.getElementById('revenueChart'), {
                type: 'line',
                data: {
                    labels: data.revenue_chart.labels,
                    datasets: [
                        { label: 'Gross Revenue', data: data.revenue_chart.gross_earnings, borderColor: '#46a5ac', backgroundColor: 'rgba(70, 165, 172, 0.1)', fill: true, tension: 0.4, borderWidth: 3, pointRadius: 4, pointBackgroundColor: '#fff', pointBorderColor: '#46a5ac', pointBorderWidth: 2 },
                        { label: 'Platform Outflow', data: data.revenue_chart.total_payouts, borderColor: '#1e293b', borderDash: [5, 5], fill: false, tension: 0.4, borderWidth: 2 }
                    ]
                },
                options: baseOptions
            });

            // 2. Distribution Pie
            new Chart(document.getElementById('propertyTypeChart'), {
                type: 'doughnut',
                data: {
                    labels: data.type_chart.labels,
                    datasets: [{ data: data.type_chart.data, backgroundColor: ['#46a5ac', '#1e293b', '#64748b', '#94a3b8', '#cbd5e1'], borderWidth: 0, hoverOffset: 15 }]
                },
                options: { ...baseOptions, cutout: '70%', scales: {
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
                height: 'auto',
                eventColor: '#46a5ac'
            }).render();

            // 4. Geospatial Heatmap
            const map = L.map('heatmap', { scrollWheelZoom: false }).setView([30.3753, 69.3451], 5);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
            L.heatLayer(data.heatmap_data, { radius: 25, blur: 15, gradient: {0.4: '#46a5ac', 0.65: '#1e293b', 1: '#000'} }).addTo(map);
        });
    </script>
@stop
