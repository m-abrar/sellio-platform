@extends('adminlte::page')

@section('title', 'Ecommerce Overview | Sales Operations')

@section('content_header')
    <div class="d-flex align-items-center justify-content-between mb-2">
        <h1 class="font-weight-bold text-dark">
            <i class="fas fa-shopping-cart mr-2 text-danger"></i> 
            Ecommerce Command Center
            <small class="d-block d-md-inline-block ml-md-3 text-muted lead">Real-time sales & inventory insights</small>
        </h1>
        <div class="d-flex align-items-center">
            <span class="badge badge-success px-3 py-2 rounded-pill shadow-sm">
                <i class="fas fa-sync-alt fa-spin mr-1"></i> Live Demo Mode
            </span>
        </div>
    </div>
@stop

@section('content')
    {{-- Quick Actions Row (Ecommerce Focus) --}}
    <div class="row mb-4 mx-1">
        <div class="col-6 col-md-3 px-1">
            <a href="{{ route('admin.products.create') }}" class="btn btn-primary d-flex align-items-center justify-content-center py-3 w-100 shadow-sm font-weight-bold" style="border-radius: 12px; background: linear-gradient(135deg, #FF3366, #ff6a00) !important; border: none !important; color: #fff !important;">
                <i class="fas fa-plus-circle mr-2"></i> Add New Product
            </a>
        </div>
        <div class="col-6 col-md-3 px-1">
             <a href="{{ route('admin.product-orders.index') }}" class="btn btn-default d-flex align-items-center justify-content-center py-3 w-100 shadow-sm font-weight-bold" style="border-radius: 12px; border: 1px solid #dee2e6; background: #fff; color: #495057 !important;">
                <i class="fas fa-truck mr-2 text-danger"></i> Manage All Orders
            </a>
        </div>
    </div>

    <div class="dashboard-blueprint pb-5">
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
            <div class="section-header {{ !$loop->first ? 'mt-5' : '' }}">
                <span class="dot {{ $section['pulse'] ? 'pulse' : '' }} bg-{{ $section['dot'] }}"></span>
                <h5 class="text-uppercase font-weight-bold text-secondary">{{ $section['title'] }}</h5>
            </div>
            @include('admin.dashboard.partials.ecommerce.' . $section['partial'], ['metrics' => $metrics])
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
        .bg-warning-light { background: rgba(255,193,7,0.1) !important; }
        .bg-secondary-light { background: rgba(108,117,125,0.1) !important; }
        
        .icon-circle { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }

        .gradient-action-card { border: none !important; color: #fff !important; }
        .bg-gradient-danger { background: linear-gradient(135deg, #FF3366, #ba264b) !important; }
        .bg-gradient-warning { background: linear-gradient(135deg, #ff6a00, #ee0979) !important; }
        .bg-gradient-info { background: linear-gradient(135deg, #00d2ff, #3a7bd5) !important; }
        .bg-gradient-secondary { background: linear-gradient(135deg, #8e9eab, #eef2f3) !important; color: #444 !important; }

        .glassmorphic-glow-icon { position: absolute; bottom: 10px; right: 10px; font-size: 3.5rem; opacity: 0.15; color: #fff; pointer-events: none; }

        /* Global Pulse Animation */
        .pulse { animation: pulse-shadow 2s infinite; }
        @keyframes pulse-shadow {
            0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.6); transform: scale(0.95); }
            70% { box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); transform: scale(1); }
            100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); transform: scale(0.95); }
        }
        
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
                        { label: 'Gross Sales', data: data.revenue_chart.gross_earnings, borderColor: '#FF3366', backgroundColor: 'rgba(255,51,102,0.05)', fill: true, tension: 0.4 },
                        { label: 'Operating Costs', data: data.revenue_chart.total_payouts, borderColor: '#007bff', borderDash: [5, 5], fill: false }
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
                options: { ...baseOptions, 
                    cutout: '70%',
                    scales: { x: { display: false }, y: { display: false } } 
                }
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
            const map = L.map('heatmap', { scrollWheelZoom: false }).setView([37.0902, -95.7129], 4);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
            L.heatLayer(data.heatmap_data, { radius: 25, blur: 15 }).addTo(map);
        });
    </script>
@stop
