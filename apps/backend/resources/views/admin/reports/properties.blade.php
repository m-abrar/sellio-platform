@extends('adminlte::page')

@section('plugins.Datatables', true)

@section('title', $reportTitle)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0"><i class="fas fa-building mr-2"></i> {{ $reportTitle }}</h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">{{ $reportTitle }}</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
@include('admin.alert')

<div class="container-fluid dashboard-blueprint pb-5">
    
    {{-- Filter Section --}}
    <div class="section-header">
        <span class="dot bg-info"></span>
        <h5 class="text-uppercase font-weight-bold text-secondary">Occupancy Analysis Period</h5>
    </div>
    
    <div class="card shadow-sm mb-5 border-0" style="border-radius: 16px;">
        <div class="card-body p-4">
            <form action="{{ route('admin.reports.properties') }}" method="GET" class="row align-items-end">
                <div class="col-md-4 mb-3 mb-md-0">
                    <label class="small font-weight-bold text-muted text-uppercase mb-2 d-block">Start Date</label>
                    <div class="input-group shadow-xs rounded" style="overflow: hidden; border: 1px solid #e2e8f0;">
                        <div class="input-group-prepend">
                            <span class="input-group-text bg-white border-0"><i class="fas fa-calendar-alt text-primary"></i></span>
                        </div>
                        <input type="date" name="start_date" class="form-control border-0 py-4" value="{{ $startDateFormatted ?? '' }}">
                    </div>
                </div>
                <div class="col-md-4 mb-3 mb-md-0">
                    <label class="small font-weight-bold text-muted text-uppercase mb-2 d-block">End Date</label>
                    <div class="input-group shadow-xs rounded" style="overflow: hidden; border: 1px solid #e2e8f0;">
                        <div class="input-group-prepend">
                            <span class="input-group-text bg-white border-0"><i class="fas fa-calendar-check text-primary"></i></span>
                        </div>
                        <input type="date" name="end_date" class="form-control border-0 py-4" value="{{ $endDateFormatted ?? '' }}">
                    </div>
                </div>
                <div class="col-md-4">
                    <button type="submit" class="btn btn-primary btn-block py-2 font-weight-bold shadow" style="border-radius: 10px; height: 48px; background: linear-gradient(135deg, #007bff, #0056b3);">
                        <i class="fas fa-search-location mr-2"></i> SCAN AVAILABILITY
                    </button>
                </div>
            </form>
            @if(isset($startDateFormatted) && isset($endDateFormatted))
                <div class="mt-3 text-center">
                    <span class="badge badge-pill bg-info-light text-info px-3 py-2 border">
                        <i class="fas fa-history mr-1"></i> Scan Period: {{ $startDateFormatted }} — {{ $endDateFormatted }}
                    </span>
                </div>
            @endif
        </div>
    </div>

    {{-- Stats Row --}}
    <div class="section-header">
        <span class="dot pulse bg-warning"></span>
        <h5 class="text-uppercase font-weight-bold text-secondary">Utilization KPIs</h5>
    </div>
    
    <div class="row mb-5">
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm overflow-hidden" style="border-radius: 16px;">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-circle bg-warning-light text-warning mr-3 shadow-xs">
                            <i class="fas fa-chart-pie"></i>
                        </div>
                        <span class="text-uppercase small font-weight-bold text-muted letter-spacing-1">Occupancy Rate</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">{{ $occupancyRate ?? '0%' }}</h2>
                    </div>
                </div>
                <div class="bg-warning" style="height: 4px; opacity: 0.6;"></div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm overflow-hidden" style="border-radius: 16px;">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-circle bg-danger-light text-danger mr-3 shadow-xs">
                            <i class="fas fa-house-user"></i>
                        </div>
                        <span class="text-uppercase small font-weight-bold text-muted letter-spacing-1">Occupied Units</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">{{ $occupiedUnits ?? 0 }}</h2>
                        <span class="text-muted small">Units</span>
                    </div>
                </div>
                <div class="bg-danger" style="height: 4px; opacity: 0.6;"></div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm overflow-hidden" style="border-radius: 16px;">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-circle bg-success-light text-success mr-3 shadow-xs">
                            <i class="fas fa-door-open"></i>
                        </div>
                        <span class="text-uppercase small font-weight-bold text-muted letter-spacing-1">Available Units</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">{{ $availableUnits ?? 0 }}</h2>
                        <span class="text-muted small">Free</span>
                    </div>
                </div>
                <div class="bg-success" style="height: 4px; opacity: 0.6;"></div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm overflow-hidden" style="border-radius: 16px;">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-circle bg-info-light text-info mr-3 shadow-xs">
                            <i class="fas fa-list-ol"></i>
                        </div>
                        <span class="text-uppercase small font-weight-bold text-muted letter-spacing-1">Total Assets</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">{{ $totalUnits ?? 0 }}</h2>
                        <span class="text-muted small">Cataloged</span>
                    </div>
                </div>
                <div class="bg-info" style="height: 4px; opacity: 0.6;"></div>
            </div>
        </div>
    </div>

    {{-- Property Table --}}
    <div class="section-header">
        <span class="dot bg-secondary"></span>
        <h5 class="text-uppercase font-weight-bold text-secondary">Asset Availability Status</h5>
    </div>
    <div class="card shadow-sm border-0 mb-4" style="border-radius: 16px;">
        <div class="card-header border-0 bg-transparent pt-4 px-4">
            <h3 class="card-title font-weight-bold text-muted mb-0"><i class="fas fa-building mr-2 text-primary"></i> Property Ledger</h3>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover m-0" id="propertyTable">
                    <thead class="bg-light">
                        <tr>
                            <th class="border-0 px-4">Property/Listing</th>
                            <th class="border-0">Location</th>
                            <th class="border-0">Capacity</th>
                            <th class="border-0">Status</th>
                            <th class="border-0 text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($propertyList ?? [] as $property)
                        <tr>
                            <td class="px-4 align-middle font-weight-bold text-dark">{{ $property->title }}</td>
                            <td class="align-middle text-muted small"><i class="fas fa-map-marker-alt mr-1 text-danger"></i> {{ $property->location }}</td>
                            <td class="align-middle"><span class="badge badge-light border">{{ $property->total_units }} Units</span></td>
                            <td class="align-middle">
                                @php
                                    $statusParts = explode(' ', $property->status);
                                    $status = strtolower($statusParts[0]);
                                    $badgeClass = ($status == 'available') ? 'badge-success' : (($status == 'occupied') ? 'badge-danger' : 'badge-secondary');
                                @endphp
                                <span class="badge badge-pill {{ $badgeClass }} px-3 py-1 shadow-xs">
                                    {{ $property->status }}
                                </span>
                            </td>
                            <td class="text-right px-4 align-middle">
                                <a href="{{ $property->link ?? '#' }}" target="_blank" class="btn btn-xs btn-outline-primary rounded-pill px-3" title="View Property">
                                    <i class="fas fa-external-link-alt mr-1"></i> VIEW
                                </a>
                            </td>
                        </tr>
                        @empty
                        <tr><td colspan="5" class="text-center py-4 text-muted small">No property data available for this range</td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

@stop

@section('css')
<style>
    /* Sectioning & Layout */
    .section-header { display: flex; align-items: center; margin-bottom: 1.5rem; }
    .section-header .dot { width: 12px; height: 12px; border-radius: 50%; margin-right: 12px; transition: transform 0.3s; }
    .section-header h5 { margin: 0; letter-spacing: 1.2px; font-size: 0.85rem; opacity: 0.8; }
    
    /* Modern Card kit */
    .dashboard-blueprint .card { transition: all 0.25s ease; box-shadow: 0 4px 6px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; }
    .dashboard-blueprint .card:hover { transform: translateY(-3px); box-shadow: 0 12px 24px rgba(0,0,0,0.08) !important; }

    /* Color Utility Factory */
    .bg-primary-light { background: rgba(0,123,255,0.08) !important; }
    .bg-success-light { background: rgba(40,167,69,0.08) !important; }
    .bg-danger-light  { background: rgba(220,53,69,0.08) !important; }
    .bg-info-light    { background: rgba(23,162,184,0.08) !important; }
    .bg-warning-light { background: rgba(255,193,7,0.08) !important; }
    
    .icon-circle { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }

    /* Global Pulse Animation */
    .pulse { animation: pulse-shadow 2s infinite; }
    @keyframes pulse-shadow {
        0% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.4); transform: scale(0.95); }
        70% { box-shadow: 0 0 0 10px rgba(255, 193, 7, 0); transform: scale(1); }
        100% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0); transform: scale(0.95); }
    }

    .shadow-xs { box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important; }
    .letter-spacing-1 { letter-spacing: 1px; }
</style>
@stop

@section('js')
    <script>
        // DataTables initialization script
        $(function () {
            $('#propertyTable').DataTable({
                "paging": true,
                "lengthChange": true,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "responsive": true,
            });
        });
    </script>
@endsection
