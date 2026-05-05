@extends('adminlte::page')

@section('plugins.Datatables', true)

@section('title', 'System Heartbeat | Activity Timeline')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-end">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-history mr-2 text-primary"></i> System Heartbeat
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Chronological audit trail of all administrative and system-level interactions.</p>
            </div>
            <div class="col-sm-6 text-right">
                <div class="dropdown d-inline-block">
                    <button type="button" class="btn btn-primary btn-sm rounded-pill px-4 font-weight-bold dropdown-toggle" data-toggle="dropdown">
                        <i class="fas fa-filter mr-1"></i> {{ strtoupper(str_replace('_', ' ', $currentFilter)) }}
                    </button>
                    <div class="dropdown-menu dropdown-menu-right shadow-premium border-0" style="border-radius: 16px; padding: 10px;">
                        <div class="dropdown-header smallest font-weight-bold text-muted text-uppercase">Filter Streams</div>
                        @foreach ($filters as $key => $filter)
                            <a class="dropdown-item rounded-lg py-2 px-3 mb-1 {{ $key == $currentFilter ? 'bg-primary-soft text-primary active' : '' }}" 
                               href="{{ route('admin.activity-log.index', ['filter' => $key]) }}">
                               <i class="fas fa-stream mr-2 opacity-50"></i> {{ is_array($filter) ? $filter['label'] : $filter }}
                            </a>
                        @endforeach
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item rounded-lg py-2 px-3 text-danger" href="{{ route('admin.activity-log.index', ['filter' => 'all']) }}">
                            <i class="fas fa-globe mr-2 opacity-50"></i> All Operational Data
                        </a>
                    </div>
                </div>
                <ol class="breadcrumb float-sm-right bg-transparent p-0 mt-3 small">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Activity Timeline</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert') 

    <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
        <div class="card-header bg-white border-0 py-4 px-4">
            <h3 class="card-title font-weight-bold text-dark mb-0">Operational Logs</h3>
            <div class="card-tools">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest">
                    LIVE STREAMING
                </span>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="activity-log-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="pl-4">Timestamp</th>
                            <th>Identity</th>
                            <th>Operation</th>
                            <th>Description</th>
                            <th>Target Model</th>
                            <th class="text-right pr-4">Metrics</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($activityLogs as $activity)
                            <tr>
                                <td class="align-middle pl-4">
                                    <span class="d-block font-weight-bold text-dark">{{ $activity->created_at->format('M d, Y') }}</span>
                                    <span class="smallest font-weight-bold text-muted uppercase letter-spacing-1">{{ $activity->created_at->format('h:i:s A') }}</span>
                                </td>
                                <td class="align-middle">
                                    @if ($activity->causer)
                                        <div class="d-flex align-items-center">
                                            <div class="bg-primary-soft rounded-circle mr-2 d-flex align-items-center justify-content-center" style="width:32px; height:32px;">
                                                <i class="fas fa-user-circle text-primary"></i>
                                            </div>
                                            <span class="font-weight-bold text-dark">{{ $activity->causer->name ?? $activity->causer->email }}</span>
                                        </div>
                                    @else
                                        <span class="badge badge-secondary-soft text-secondary px-3 py-1 rounded-pill smallest font-weight-bold">INTERNAL SYSTEM</span>
                                    @endif
                                </td>
                                <td class="align-middle">
                                    @php
                                        $event = $activity->event ?? 'manual';
                                        $style = match($event) {
                                            'created', 'login' => ['bg' => 'success-soft', 'text' => 'success', 'icon' => 'plus'],
                                            'updated' => ['bg' => 'warning-soft', 'text' => 'warning', 'icon' => 'edit'],
                                            'deleted', 'logout' => ['bg' => 'danger-soft', 'text' => 'danger', 'icon' => 'trash-alt'],
                                            default => ['bg' => 'primary-soft', 'text' => 'primary', 'icon' => 'terminal'],
                                        };
                                    @endphp
                                    <span class="badge badge-{{ $style['text'] }}-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                                        <i class="fas fa-{{ $style['icon'] }} mr-1"></i> {{ $event }}
                                    </span>
                                </td>
                                <td class="align-middle">
                                    <span class="text-muted font-weight-600" style="font-size: 0.9rem;">{{ $activity->description }}</span>
                                </td>
                                <td class="align-middle">
                                    @if ($activity->subject_type)
                                        @php $modelName = (new \ReflectionClass($activity->subject_type))->getShortName(); @endphp
                                        <div class="d-flex align-items-center">
                                            <div class="icon-box-soft bg-dark-soft mr-2 d-flex align-items-center justify-content-center shadow-none border" style="width:28px; height:28px; border-radius: 8px;">
                                                <i class="fas fa-cube text-dark smallest"></i>
                                            </div>
                                            <div>
                                                <span class="font-weight-bold text-dark d-block" style="font-size: 0.8rem;">{{ $modelName }}</span>
                                                <small class="text-muted font-weight-bold uppercase" style="font-size: 0.6rem;">ID: {{ $activity->subject_id }}</small>
                                            </div>
                                        </div>
                                    @else
                                        <span class="text-muted smallest font-weight-bold">N/A</span>
                                    @endif
                                </td>
                                <td class="text-right align-middle pr-4">
                                    @if ($activity->properties->isNotEmpty())
                                        <button type="button" class="btn btn-default btn-sm rounded-pill px-3 font-weight-bold shadow-xs border" data-toggle="modal" data-target="#detailsModal-{{ $activity->id }}">
                                            <i class="fas fa-database mr-1 text-primary"></i> DATA
                                        </button>
                                    @else
                                        <span class="text-muted smallest font-weight-bold">STATIC</span>
                                    @endif
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card-footer bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
            <div class="text-muted smallest font-weight-bold uppercase">Showing {{ $activityLogs->firstItem() }} to {{ $activityLogs->lastItem() }} of {{ $activityLogs->total() }} events</div>
            <div>{{ $activityLogs->appends(request()->except('page'))->links() }}</div>
        </div>
    </div>
</div>

{{-- MODALS FOR DETAILS --}}
@foreach ($activityLogs as $activity)
<div class="modal fade" id="detailsModal-{{ $activity->id }}" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content border-0 shadow-premium" style="border-radius: 24px;">
            <div class="modal-header border-0 bg-dark py-4 px-4" style="border-top-left-radius: 24px; border-top-right-radius: 24px;">
                <h5 class="modal-title text-white font-weight-bold" id="detailsModalLabel-{{ $activity->id }}">
                    <i class="fas fa-fingerprint mr-2 text-primary"></i> Data Signature (ID: {{ $activity->id }})
                </h5>
                <button type="button" class="close text-white opacity-50" data-dismiss="alert" data-dismiss="modal">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body p-4 bg-light">
                <div class="row">
                    <div class="col-md-12">
                        <h6 class="smallest font-weight-bold text-primary text-uppercase letter-spacing-1 mb-3">Contextual Metadata</h6>
                        <div class="bg-white p-3 rounded-xl border mb-4">
                            <pre class="mb-0 small text-dark font-weight-600" style="white-space: pre-wrap;">{{ json_encode($activity->properties->except(['old', 'attributes'])->toArray(), JSON_PRETTY_PRINT) }}</pre>
                        </div>

                        @php
                            $isDeletion = ($activity->event == 'deleted');
                            $dataToIterate = $isDeletion ? ($activity->properties['old'] ?? []) : ($activity->properties['attributes'] ?? []);
                        @endphp

                        @if (!empty($dataToIterate))
                            <h6 class="smallest font-weight-bold text-primary text-uppercase letter-spacing-1 mb-3">Data Mutation Spectrum</h6>
                            <div class="table-responsive rounded-xl border overflow-hidden">
                                <table class="table table-sm table-hover mb-0 bg-white">
                                    <thead class="bg-light">
                                        <tr>
                                            <th class="px-3 py-2 smallest font-weight-bold">Attribute</th>
                                            <th class="px-3 py-2 smallest font-weight-bold">Historical State</th>
                                            <th class="px-3 py-2 smallest font-weight-bold">Modified State</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach ($dataToIterate as $key => $value)
                                            @php
                                                $oldValue = $activity->properties['old'][$key] ?? null;
                                                $newValue = $activity->properties['attributes'][$key] ?? null;
                                                
                                                if (is_array($oldValue) || is_object($oldValue)) $oldValue = json_encode($oldValue);
                                                if (is_array($newValue) || is_object($newValue)) $newValue = json_encode($newValue);
                                            @endphp
                                            <tr>
                                                <td class="px-3 py-2 align-middle"><strong class="text-dark small uppercase">{{ $key }}</strong></td>
                                                <td class="px-3 py-2 align-middle text-muted small">{!! $oldValue ?? '<span class="opacity-50">INITIAL</span>' !!}</td>
                                                <td class="px-3 py-2 align-middle font-weight-bold text-dark small">{!! $isDeletion ? '<span class="badge badge-danger-light text-danger">PURGED</span>' : $newValue !!}</td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
            <div class="modal-footer border-0 p-4">
                <button type="button" class="btn btn-default btn-block rounded-pill font-weight-bold py-2 shadow-sm border" data-dismiss="modal">DISMISS SIGNATURE</button>
            </div>
        </div>
    </div>
</div>
@endforeach

@stop

@section('css')
<style>
    .bg-dark-soft { background: rgba(30, 41, 59, 0.05); }
    .badge-success-light { background: rgba(16, 185, 129, 0.1); color: #059669; }
    .badge-danger-light { background: rgba(239, 68, 68, 0.1); color: #dc2626; }
    .badge-warning-light { background: rgba(245, 158, 11, 0.1); color: #d97706; }
    .badge-primary-light { background: rgba(70, 165, 172, 0.1); color: #3d8f95; }
    .badge-secondary-soft { background: #f1f5f9; color: #64748b; }
</style>
@stop
