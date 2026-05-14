{{--
    Administrative Intelligence: Asset Utilization Analytics
    
    This view provides real-time visibility into property inventory and 
    occupancy health. It orchestrates the monitoring of availability 
    ratios, geographic performance, and resource capacity across 
    the marketplace property portfolio.
    
    @extends adminlte::page
    @context Analytical Reporting
    @variables string $reportTitle The localized title of the analytical report.
--}}
@extends('adminlte::page')

@section('plugins.Datatables', true)

@section('title', __($reportTitle))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-building mr-2 text-primary opacity-50"></i> {{ $reportTitle ?? __('Property Utilization Analytics') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Monitor property availability, asset performance, and real-time occupancy metrics.') }}</p>
            </div>
            @include('admin.reports._header_actions', ['exportText' => __('Export Report')])
        </div>
    </div>
@stop

@section('content')
@include('admin.alert')

<div class="container-fluid pb-5">
    
    {{-- Filter Protocol --}}
    @include('admin.reports._properties_filter')

    {{-- Stats Row --}}
    <div class="row mb-5">
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card card-premium h-100 border-0 shadow-premium overflow-hidden">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-box-soft bg-warning-soft text-warning mr-3 shadow-xs" style="width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-chart-pie text-lg"></i>
                        </div>
                        <span class="text-uppercase smallest font-weight-bold text-muted letter-spacing-1">{{ __('Occupancy Rate') }}</span>
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
            <div class="card card-premium h-100 border-0 shadow-premium overflow-hidden">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-box-soft bg-danger-soft text-danger mr-3 shadow-xs" style="width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-house-user text-lg"></i>
                        </div>
                        <span class="text-uppercase smallest font-weight-bold text-muted letter-spacing-1">{{ __('Occupied Units') }}</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">{{ $occupiedUnits ?? 0 }}</h2>
                        <span class="text-muted smallest font-weight-bold uppercase ml-1">{{ __('UNITS') }}</span>
                    </div>
                    <div class="progress mt-3" style="height: 4px; border-radius: 2px; background: rgba(0,0,0,0.05);">
                        <div class="progress-bar bg-danger" role="progressbar" style="width: 100%"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card card-premium h-100 border-0 shadow-premium overflow-hidden">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-box-soft bg-success-soft text-success mr-3 shadow-xs" style="width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-door-open text-lg"></i>
                        </div>
                        <span class="text-uppercase smallest font-weight-bold text-muted letter-spacing-1">{{ __('Available Units') }}</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">{{ $availableUnits ?? 0 }}</h2>
                        <span class="text-muted smallest font-weight-bold uppercase ml-1">{{ __('FREE') }}</span>
                    </div>
                    <div class="progress mt-3" style="height: 4px; border-radius: 2px; background: rgba(0,0,0,0.05);">
                        <div class="progress-bar bg-success" role="progressbar" style="width: 100%"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card card-premium h-100 border-0 shadow-premium overflow-hidden">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-box-soft bg-info-soft text-info mr-3 shadow-xs" style="width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-list-ol text-lg"></i>
                        </div>
                        <span class="text-uppercase smallest font-weight-bold text-muted letter-spacing-1">{{ __('Total Assets') }}</span>
                    </div>
                    <div class="d-flex align-items-baseline">
                        <h2 class="font-weight-bold text-dark mb-0 mr-1">{{ $totalUnits ?? 0 }}</h2>
                        <span class="text-muted smallest font-weight-bold uppercase ml-1">{{ __('CATALOGED') }}</span>
                    </div>
                    <div class="progress mt-3" style="height: 4px; border-radius: 2px; background: rgba(0,0,0,0.05);">
                        <div class="progress-bar bg-info" role="progressbar" style="width: 100%"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- Property Table --}}
    <div class="card card-premium shadow-premium border-0 mb-4 overflow-hidden">
        <div class="card-header border-0 bg-white pt-4 px-4 d-flex align-items-center">
            <div class="icon-box-soft bg-primary-soft text-primary mr-3 shadow-xs" style="width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-building"></i>
            </div>
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">{{ __('Property Ledger') }}</h3>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover table-premium m-0 datatable-init" id="propertyTable"
                       data-datatable-config='{"paging": true, "lengthChange": true, "searching": true, "ordering": true, "info": true, "autoWidth": false, "responsive": true}'>
                    <thead>
                        <tr>
                            <th class="pl-4">{{ __('Property Identity') }}</th>
                            <th>{{ __('Geographic Context') }}</th>
                            <th>{{ __('Resource Capacity') }}</th>
                            <th>{{ __('Utilization Status') }}</th>
                            <th class="text-right pr-4">{{ __('Intelligence') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($propertyList ?? [] as $property)
                        <tr>
                            <td class="pl-4 align-middle font-weight-bold text-dark smallest uppercase letter-spacing-1">{{ $property->title }}</td>
                            <td class="align-middle text-muted smallest uppercase font-weight-bold">
                                <i class="fas fa-map-marker-alt mr-2 text-danger opacity-50"></i> {{ $property->location }}
                            </td>
                            <td class="align-middle">
                                <span class="badge badge-secondary-soft text-secondary border px-3 py-1 rounded-pill font-weight-bold smallest uppercase">{{ $property->total_units }} {{ __('UNITS') }}</span>
                            </td>
                            <td class="align-middle">
                                @php
                                    $statusParts = explode(' ', $property->status);
                                    $status = strtolower($statusParts[0]);
                                    $statusStyle = [
                                        'available' => ['bg' => 'success-light', 'text' => 'success', 'icon' => 'fa-check-circle'],
                                        'occupied' => ['bg' => 'danger-light', 'text' => 'danger', 'icon' => 'fa-door-closed'],
                                    ][strtolower($status)] ?? ['bg' => 'secondary-light', 'text' => 'secondary', 'icon' => 'fa-info-circle'];
                                @endphp
                                <span class="badge badge-{{ $statusStyle['bg'] }} text-{{ $statusStyle['text'] }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1" style="min-width: 110px;">
                                    <i class="fas {{ $statusStyle['icon'] }} mr-2"></i> {{ strtoupper(__($property->status)) }}
                                </span>
                            </td>
                            <td class="text-right pr-4 align-middle">
                                <a href="{{ $property->link ?? '#' }}" target="_blank" class="btn btn-premium-soft btn-premium-soft-primary">
                                    {{ __('INSPECT') }} <i class="fas fa-external-link-alt ml-2 small"></i>
                                </a>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="5" class="text-center py-5">
                                <i class="fas fa-city fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                <h5 class="text-muted font-weight-bold smallest uppercase letter-spacing-1">{{ __('No Assets Cataloged') }}</h5>
                                <p class="small text-secondary mb-0">{{ __('No property utilization data available for this range.') }}</p>
                            </td>
                        </tr>
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
    .stat-card { transition: all 0.3s ease; }
    .stat-card:hover { transform: translateY(-5px); box-shadow: 0 15px 45px rgba(0,0,0,0.1) !important; }
</style>
@stop

@section('js')
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@endsection
