@extends('adminlte::page')

@section('plugins.Datatables', true)

@section('title', $reportTitle)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-building mr-2 text-primary opacity-50"></i> {{ $reportTitle ?? 'Property Utilization Analytics' }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Monitor property availability, asset performance, and real-time occupancy metrics.</p>
            </div>
            <div class="col-sm-5 d-flex align-items-center justify-content-end">
                <div class="btn-group btn-group-premium shadow-sm rounded-pill overflow-hidden border">
                    <button class="btn btn-white btn-sm px-4 py-2 font-weight-bold smallest" onclick="window.print()">
                        <i class="fas fa-print mr-1"></i> EXPORT TO PDF
                    </button>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
@include('admin.alert')

<div class="container-fluid pb-5">
    
    {{-- Filter Section --}}
    <div class="card glass-card shadow-sm mb-5 border-0 overflow-hidden">
        <div class="card-body p-4">
            <form action="{{ route('admin.reports.properties') }}" method="GET" class="row align-items-end">
                <div class="col-md-5 mb-3 mb-md-0">
                    <label class="smallest font-weight-bold text-muted text-uppercase mb-2 d-block letter-spacing-1">Audit Period (Start)</label>
                    <div class="input-group premium-input shadow-xs">
                        <div class="input-group-prepend">
                            <span class="input-group-text bg-transparent border-0"><i class="fas fa-calendar-alt text-primary opacity-50"></i></span>
                        </div>
                        <input type="date" name="start_date" class="form-control border-0 bg-transparent" value="{{ $startDateFormatted ?? '' }}" style="height: 48px;">
                    </div>
                </div>
                <div class="col-md-5 mb-3 mb-md-0">
                    <label class="smallest font-weight-bold text-muted text-uppercase mb-2 d-block letter-spacing-1">Audit Period (End)</label>
                    <div class="input-group premium-input shadow-xs">
                        <div class="input-group-prepend">
                            <span class="input-group-text bg-transparent border-0"><i class="fas fa-calendar-check text-primary opacity-50"></i></span>
                        </div>
                        <input type="date" name="end_date" class="form-control border-0 bg-transparent" value="{{ $endDateFormatted ?? '' }}" style="height: 48px;">
                    </div>
                </div>
                <div class="col-md-2">
                    <button type="submit" class="btn btn-primary btn-block font-weight-bold" style="height: 48px; border-radius: 12px;">
                        <i class="fas fa-sync-alt mr-2"></i> SCAN
                    </button>
                </div>
            </form>
            @if(isset($startDateFormatted) && isset($endDateFormatted))
                <div class="mt-3 text-center">
                    <span class="badge badge-pill badge-primary-soft px-3 py-2">
                        <i class="fas fa-history mr-1"></i> Scan Period: {{ $startDateFormatted }} — {{ $endDateFormatted }}
                    </span>
                </div>
            @endif
        </div>
    </div>

    {{-- Stats Row --}}
    <div class="row mb-5">
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm glass-card overflow-hidden stat-card">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-circle bg-warning-soft text-warning mr-3 shadow-sm">
                            <i class="fas fa-chart-pie"></i>
                        </div>
                        <span class="text-uppercase small font-weight-bold text-muted letter-spacing-1">Occupancy Rate</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">{{ $occupancyRate ?? '0%' }}</h2>
                    </div>
                    <div class="progress mt-3" style="height: 4px; border-radius: 2px; background: rgba(0,0,0,0.05);">
                        <div class="progress-bar bg-warning" role="progressbar" style="width: {{ $occupancyRate ?? 0 }}%"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm glass-card overflow-hidden stat-card">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-circle bg-danger-soft text-danger mr-3 shadow-sm">
                            <i class="fas fa-house-user"></i>
                        </div>
                        <span class="text-uppercase small font-weight-bold text-muted letter-spacing-1">Occupied Units</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">{{ $occupiedUnits ?? 0 }}</h2>
                        <span class="text-muted small">Units</span>
                    </div>
                    <div class="progress mt-3" style="height: 4px; border-radius: 2px; background: rgba(0,0,0,0.05);">
                        <div class="progress-bar bg-danger" role="progressbar" style="width: 100%"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm glass-card overflow-hidden stat-card">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-circle bg-success-soft text-success mr-3 shadow-sm">
                            <i class="fas fa-door-open"></i>
                        </div>
                        <span class="text-uppercase small font-weight-bold text-muted letter-spacing-1">Available Units</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">{{ $availableUnits ?? 0 }}</h2>
                        <span class="text-muted small">Free</span>
                    </div>
                    <div class="progress mt-3" style="height: 4px; border-radius: 2px; background: rgba(0,0,0,0.05);">
                        <div class="progress-bar bg-success" role="progressbar" style="width: 100%"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card h-100 border-0 shadow-sm glass-card overflow-hidden stat-card">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-circle bg-info-soft text-info mr-3 shadow-sm">
                            <i class="fas fa-list-ol"></i>
                        </div>
                        <span class="text-uppercase small font-weight-bold text-muted letter-spacing-1">Total Assets</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">{{ $totalUnits ?? 0 }}</h2>
                        <span class="text-muted small">Cataloged</span>
                    </div>
                    <div class="progress mt-3" style="height: 4px; border-radius: 2px; background: rgba(0,0,0,0.05);">
                        <div class="progress-bar bg-info" role="progressbar" style="width: 100%"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- Property Table --}}
    <div class="card glass-card shadow-sm border-0 mb-4 overflow-hidden">
        <div class="card-header border-0 bg-transparent pt-4 px-4 d-flex align-items-center">
            <div class="icon-square bg-primary-soft text-primary mr-3">
                <i class="fas fa-building"></i>
            </div>
            <h3 class="card-title font-weight-bold text-dark mb-0">Property Ledger</h3>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover table-premium m-0" id="propertyTable">
                    <thead>
                        <tr>
                            <th class="px-4">Property/Listing</th>
                            <th>Location</th>
                            <th>Capacity</th>
                            <th>Status</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($propertyList ?? [] as $property)
                        <tr>
                            <td class="px-4 align-middle font-weight-bold text-dark">{{ $property->title }}</td>
                            <td class="align-middle text-muted small"><i class="fas fa-map-marker-alt mr-1 text-danger opacity-75"></i> {{ $property->location }}</td>
                            <td class="align-middle"><span class="badge badge-pill badge-secondary-soft text-secondary border px-3 py-1">{{ $property->total_units }} Units</span></td>
                            <td class="align-middle">
                                @php
                                    $statusParts = explode(' ', $property->status);
                                    $status = strtolower($statusParts[0]);
                                    $statusStyle = [
                                        'available' => ['bg' => 'success-soft', 'text' => 'success', 'icon' => 'fa-check-circle'],
                                        'occupied' => ['bg' => 'danger-soft', 'text' => 'danger', 'icon' => 'fa-door-closed'],
                                    ][strtolower($status)] ?? ['bg' => 'secondary-soft', 'text' => 'secondary', 'icon' => 'fa-info-circle'];
                                @endphp
                                <span class="badge badge-pill badge-{{ $statusStyle['bg'] }} text-{{ $statusStyle['text'] }} border border-{{ $statusStyle['text'] }} px-3 py-1 text-uppercase" style="font-size: 0.65rem; letter-spacing: 0.5px;">
                                    <i class="fas {{ $statusStyle['icon'] }} mr-1"></i> {{ $property->status }}
                                </span>
                            </td>
                            <td class="text-right px-4 align-middle">
                                <a href="{{ $property->link ?? '#' }}" target="_blank" class="btn btn-sm btn-primary-soft rounded-pill px-3 font-weight-bold">
                                    VIEW <i class="fas fa-external-link-alt ml-1 small"></i>
                                </a>
                            </td>
                        </tr>
                        @empty
                        <tr><td colspan="5" class="text-center py-5">
                            <i class="fas fa-city fa-3x text-muted opacity-25 mb-3"></i>
                            <p class="text-muted">No property data available for this range</p>
                        </td></tr>
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
    :root {
        --primary: #46a5ac; /* Sellio Teal */
        --primary-soft: rgba(70, 165, 172, 0.1);
        --success: #28a745;
        --success-soft: rgba(40, 167, 69, 0.1);
        --info: #17a2b8;
        --info-soft: rgba(23, 162, 184, 0.1);
        --warning: #ffc107;
        --warning-soft: rgba(255, 193, 7, 0.1);
        --danger: #dc3545;
        --danger-soft: rgba(220, 53, 69, 0.1);
        --secondary-soft: rgba(108, 117, 125, 0.1);
    }

    /* Glassmorphism Effect */
    .glass-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
        border-radius: 16px;
    }

    .stat-card { transition: all 0.3s ease; }
    .stat-card:hover { transform: translateY(-5px); box-shadow: 0 15px 45px rgba(0,0,0,0.1) !important; }

    /* Premium Input Styles */
    .premium-input { border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; background: #fff; transition: all 0.3s ease; }
    .premium-input:focus-within { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-soft); }
    .premium-input .input-group-text { background: transparent; border: none; padding-right: 0; }
    .premium-input .form-control { border: none; height: 48px; font-weight: 500; }
    .premium-input .form-control:focus { box-shadow: none; }

    /* Buttons */
    .premium-btn { border-radius: 12px; height: 48px; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s ease; background: var(--primary); border: none; }
    .premium-btn:hover { background: var(--primary); filter: brightness(90%); transform: translateY(-1px); }

    /* Soft Badges & Icons */
    .badge-primary-soft { background: var(--primary-soft); color: var(--primary); }
    .badge-success-soft { background: var(--success-soft); color: var(--success); }
    .badge-info-soft { background: var(--info-soft); color: var(--info); }
    .badge-warning-soft { background: var(--warning-soft); color: var(--warning); }
    .badge-danger-soft { background: var(--danger-soft); color: var(--danger); }
    .badge-secondary-soft { background: var(--secondary-soft); color: #6c757d; }
    
    .btn-primary-soft { background: var(--primary-soft); color: var(--primary); border: none; transition: all 0.3s ease; }
    .btn-primary-soft:hover { background: var(--primary); color: #fff; }

    .icon-circle { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
    .icon-square { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }

    /* Table Styling */
    .table-premium thead th { 
        background: #f8fafc !important; 
        text-transform: uppercase; 
        font-size: 0.75rem; 
        letter-spacing: 1px; 
        font-weight: 700; 
        color: #64748b; 
        border-bottom: 1px solid #e2e8f0 !important; 
        padding: 1.25rem 1rem !important;
    }
    .table-premium tbody td { padding: 1.25rem 1rem !important; border-bottom: 1px solid #f1f5f9; }

    .letter-spacing-1 { letter-spacing: 1px; }
    .opacity-25 { opacity: 0.25; }
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
                "language": {
                    "search": "_INPUT_",
                    "searchPlaceholder": "Search properties...",
                    "paginate": {
                        "previous": '<i class="fas fa-chevron-left"></i>',
                        "next": '<i class="fas fa-chevron-right"></i>'
                    }
                }
            });
        });
    </script>
@endsection
