@extends('adminlte::page')

@section('title', 'Ecommerce Intelligence | Sales Ops')

@section('content_header')
    <div class="d-flex align-items-center justify-content-between mb-2">
        <div>
            <h1 class="font-weight-bold text-dark mb-0">
                <i class="fas fa-shopping-cart mr-2 text-primary"></i> 
                Ecommerce Command Center
            </h1>
            <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Real-time revenue metrics and inventory intelligence for <span class="text-primary font-weight-bold">{{ now()->format('F d, Y') }}</span>.</p>
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
    {{-- Quick Actions Row (Ecommerce Focus) --}}
    <div class="row mb-4 mx-1">
        <div class="col-6 col-md-3 px-1">
            <a href="{{ route('admin.products.create') }}" class="btn btn-primary d-flex align-items-center justify-content-center py-3 w-100 shadow-sm font-weight-bold" style="border-radius: 12px; min-height: 62px;">
                <i class="fas fa-plus-circle mr-2"></i> NEW PRODUCT
            </a>
        </div>
        <div class="col-6 col-md-3 px-1">
             <a href="{{ route('admin.product-orders.index') }}" class="btn btn-default d-flex align-items-center justify-content-center py-3 w-100 shadow-sm font-weight-bold border-light bg-white" style="border-radius: 12px; color: var(--dark-muted) !important; min-height: 62px;">
                <i class="fas fa-truck mr-2 text-primary"></i> MANAGE ORDERS
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
        .dashboard-blueprint .card { border-radius: 20px; border: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: var(--premium-shadow); border: 1px solid rgba(255,255,255,0.4); background: rgba(255,255,255,0.8); backdrop-filter: blur(15px); }
        .dashboard-blueprint .card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important; border-color: rgba(70, 165, 172, 0.2); }

        /* Color Utility Factory */
        .bg-primary-light { background: rgba(70, 165, 172, 0.1) !important; }
        .bg-success-light { background: rgba(40, 167, 69, 0.1) !important; }
        .bg-danger-light  { background: rgba(220,53,69,0.1) !important; }
        .bg-info-light    { background: rgba(23, 162, 184, 0.1) !important; }
        
        .icon-circle { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; }

        /* Global Pulse Animation */
        .pulse { animation: pulse-shadow 2s infinite; }
        @keyframes pulse-shadow {
            0% { box-shadow: 0 0 0 0 rgba(70, 165, 172, 0.6); transform: scale(0.95); }
            70% { box-shadow: 0 0 0 10px rgba(70, 165, 172, 0); transform: scale(1); }
            100% { box-shadow: 0 0 0 0 rgba(70, 165, 172, 0); transform: scale(0.95); }
        }
        
        .fc { font-family: 'Outfit', sans-serif !important; }
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
                        { label: 'Gross Sales', data: data.revenue_chart.gross_earnings, borderColor: '#46a5ac', backgroundColor: 'rgba(70, 165, 172, 0.1)', fill: true, tension: 0.4, borderWidth: 3, pointRadius: 4, pointBackgroundColor: '#fff' },
                        { label: 'Operating Costs', data: data.revenue_chart.total_payouts, borderColor: '#1e293b', borderDash: [5, 5], fill: false, tension: 0.4 }
                    ]
                },
                options: baseOptions
            });

            // 2. Distribution Pie
            new Chart(document.getElementById('propertyTypeChart'), {
                type: 'doughnut',
                data: {
                    labels: data.type_chart.labels,
                    datasets: [{ data: data.type_chart.data, backgroundColor: ['#46a5ac', '#1e293b', '#64748b', '#94a3b8', '#cbd5e1'], borderWidth: 0 }]
                },
                options: { ...baseOptions, cutout: '70%', scales: { x: { display: false }, y: { display: false } } }
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
