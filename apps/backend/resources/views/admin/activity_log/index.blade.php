{{--
    Administrative Identity: Activity Stream (System Heartbeat)
    
    This view provides a chronological audit trail of all administrative and 
    system-level interactions. It integrates high-fidelity telemetry from the 
    Spatie Activity Log package, facilitating security auditing and 
    operational transparency across the platform's distributed services.
    
    @extends adminlte::page
    @context Security & Audit Logs
    @variables Paginator $activityLogs Paginated collection of Activity model instances.
    @variables Array $filters List of available telemetry streams.
    @variables String $currentFilter The active stream identifier.
--}}
@extends('adminlte::page')

@section('plugins.Datatables', true)

@section('title', __('System Heartbeat | Activity Timeline'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-end">
            <div class="col-sm-6 text-center text-sm-left mb-3 mb-sm-0">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-history mr-2 text-primary"></i> {{ __('System Heartbeat') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Chronological audit trail of all administrative and system-level interactions.') }}</p>
            </div>
            <div class="col-sm-6 d-flex flex-column align-items-center align-items-sm-end">
                <div class="dropdown d-inline-block mb-3">
                    <button type="button" class="btn btn-primary btn-sm rounded-pill px-4 font-weight-bold dropdown-toggle shadow-premium" data-toggle="dropdown">
                        <i class="fas fa-filter mr-1"></i> {{ strtoupper(str_replace('_', ' ', $currentFilter)) }}
                    </button>
                    <div class="dropdown-menu dropdown-menu-right shadow-premium border-0" style="border-radius: 16px; padding: 10px;">
                        <div class="dropdown-header smallest font-weight-bold text-muted text-uppercase">{{ __('Filter Streams') }}</div>
                        @foreach ($filters as $key => $filter)
                            <a class="dropdown-item rounded-lg py-2 px-3 mb-1 {{ $key == $currentFilter ? 'bg-primary-soft text-primary active' : '' }}" 
                               href="{{ route('admin.activity-log.index', ['filter' => $key]) }}">
                               <i class="fas fa-stream mr-2 opacity-50"></i> {{ is_array($filter) ? $filter['label'] : $filter }}
                            </a>
                        @endforeach
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item rounded-lg py-2 px-3 text-danger" href="{{ route('admin.activity-log.index', ['filter' => 'all']) }}">
                            <i class="fas fa-globe mr-2 opacity-50"></i> {{ __('All Operational Data') }}
                        </a>
                    </div>
                </div>
                <ol class="breadcrumb bg-transparent p-0 m-0 small d-none d-sm-flex">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">{{ __('Dashboard') }}</a></li>
                    <li class="breadcrumb-item active">{{ __('Activity Timeline') }}</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert') 

    <div class="card border-0 shadow-premium overflow-hidden rounded-24">
        <div class="card-header bg-white border-0 py-4 px-4 d-flex align-items-center justify-content-between">
            <h3 class="card-title font-weight-bold text-dark mb-0">{{ __('Operational Logs') }}</h3>
            <div class="card-tools">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest">
                    {{ __('LIVE STREAMING') }}
                </span>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="activity-log-table" class="table table-hover table-premium mb-0 datatable-init"
                       data-datatable-config='{"paging": false, "info": false, "searching": false, "ordering": true, "columnDefs": [{"orderable": false, "targets": [5]}]}'>
                    <thead class="thead-light">
                        <tr>
                            <th class="pl-4">{{ __('Timestamp') }}</th>
                            <th>{{ __('Identity') }}</th>
                            <th>{{ __('Operation') }}</th>
                            <th>{{ __('Description') }}</th>
                            <th>{{ __('Target Model') }}</th>
                            <th class="text-right pr-4">{{ __('Metrics') }}</th>
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
                                        <span class="badge badge-secondary-soft text-secondary px-3 py-1 rounded-pill smallest font-weight-bold">{{ __('INTERNAL SYSTEM') }}</span>
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
                                        <i class="fas fa-{{ $style['icon'] }} mr-1"></i> {{ __($event) }}
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
                                                <small class="text-muted font-weight-bold uppercase" style="font-size: 0.6rem;">{{ __('ID:') }} {{ $activity->subject_id }}</small>
                                            </div>
                                        </div>
                                    @else
                                        <span class="text-muted smallest font-weight-bold">{{ __('N/A') }}</span>
                                    @endif
                                </td>
                                <td class="text-right align-middle pr-4">
                                    @if ($activity->properties->isNotEmpty())
                                        <button type="button" class="btn btn-default btn-sm rounded-pill px-3 font-weight-bold shadow-xs border" data-toggle="modal" data-target="#detailsModal-{{ $activity->id }}">
                                            <i class="fas fa-database mr-1 text-primary"></i> {{ __('DATA') }}
                                        </button>
                                    @else
                                        <span class="text-muted smallest font-weight-bold">{{ __('STATIC') }}</span>
                                    @endif
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card-footer bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
            <div class="text-muted smallest font-weight-bold uppercase">{{ __('Showing :first to :last of :total events', ['first' => $activityLogs->firstItem(), 'last' => $activityLogs->lastItem(), 'total' => $activityLogs->total()]) }}</div>
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
                    <i class="fas fa-fingerprint mr-2 text-primary"></i> {{ __('Data Signature (ID: :id)', ['id' => $activity->id]) }}
                </h5>
                <button type="button" class="close text-white opacity-50" data-dismiss="modal">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body p-4 bg-light">
                <div class="row">
                    <div class="col-md-12">
                        <h6 class="smallest font-weight-bold text-primary text-uppercase letter-spacing-1 mb-3">{{ __('Contextual Metadata') }}</h6>
                        <div class="bg-white p-3 rounded-xl border mb-4">
                            <pre class="mb-0 small text-dark font-weight-600" style="white-space: pre-wrap;">{{ json_encode($activity->properties->except(['old', 'attributes'])->toArray(), JSON_PRETTY_PRINT) }}</pre>
                        </div>

                        @php
                            $isDeletion = ($activity->event == 'deleted');
                            $dataToIterate = $isDeletion ? ($activity->properties['old'] ?? []) : ($activity->properties['attributes'] ?? []);
                        @endphp

                        @if (!empty($dataToIterate))
                            <h6 class="smallest font-weight-bold text-primary text-uppercase letter-spacing-1 mb-3">{{ __('Data Mutation Spectrum') }}</h6>
                            <div class="table-responsive rounded-xl border overflow-hidden">
                                <table class="table table-sm table-hover mb-0 bg-white">
                                    <thead class="bg-light">
                                        <tr>
                                            <th class="px-3 py-2 smallest font-weight-bold">{{ __('Attribute') }}</th>
                                            <th class="px-3 py-2 smallest font-weight-bold">{{ __('Historical State') }}</th>
                                            <th class="px-3 py-2 smallest font-weight-bold">{{ __('Modified State') }}</th>
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
                                                <td class="px-3 py-2 align-middle text-muted small">
                                                    @if(is_null($oldValue))
                                                        <span class="opacity-50">{{ __('INITIAL') }}</span>
                                                    @else
                                                        {{ $oldValue }}
                                                    @endif
                                                </td>
                                                <td class="px-3 py-2 align-middle font-weight-bold text-dark small">
                                                    @if($isDeletion)
                                                        <span class="badge badge-danger-light text-danger">{{ __('PURGED') }}</span>
                                                    @else
                                                        {{ $newValue }}
                                                    @endif
                                                </td>
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
                <button type="button" class="btn btn-default btn-block rounded-pill font-weight-bold py-2 shadow-sm border" data-dismiss="modal">{{ __('DISMISS SIGNATURE') }}</button>
            </div>
        </div>
    </div>
</div>
@endforeach

@section('js')
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@stop
