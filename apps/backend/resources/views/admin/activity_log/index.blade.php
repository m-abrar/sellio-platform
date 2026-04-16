@extends('adminlte::page')

@section('plugins.Datatables', true)

@section('title', 'Activity Log')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                     Activity Logs
                </h1>
            </div>
        </div>
    </div>
@stop

@section('content')

{{-- Include your standard admin alerts --}}
@include('admin.alert') 

<div class="card card-primary card-outline shadow-sm border-0">
    <div class="card-header border-0 bg-white py-3">
        <h3 class="card-title">System Activity Timeline</h3>
        
        {{-- START FILTER DROPDOWN --}}
        <div class="btn-group float-right">
            <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-filter"></i> Filter: {{ ucwords(str_replace('_', ' ', $currentFilter)) }}
            </button>
            <div class="dropdown-menu dropdown-menu-right">
                @foreach ($filters as $key => $filter)
                    @if (is_array($filter))
                        <a class="dropdown-item" href="{{ route('admin.activity-log.index', ['filter' => $key]) }}">
                            <i class="fas fa-list-alt"></i> {{ $filter['label'] }}
                        </a>
                    @else
                        <a class="dropdown-item @if ($key == $currentFilter) active @endif" 
                           href="{{ route('admin.activity-log.index', ['filter' => $key]) }}">
                           {{ $filter }}
                        </a>
                    @endif
                @endforeach
                <div class="dropdown-divider"></div>
                 <a class="dropdown-item" href="{{ route('admin.activity-log.index', ['filter' => 'all']) }}">
                    <i class="fas fa-globe"></i> All Activities
                </a>
            </div>
        </div>
        {{-- END FILTER DROPDOWN --}}
        
    </div>
    <div class="card-body">
        <table id="activity-log-table" class="table table-hover table-premium mb-0">
            <thead class="thead-light">
                <tr>
                    <th>Time</th>
                    <th>User (Causer)</th>
                    <th>Event</th>
                    <th>Description</th>
                    <th>Subject</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($activityLogs as $activity)
                    <tr>
                        {{-- 1. Time --}}
                        <td>
                            {{ $activity->created_at->format('M d, Y') }}<br>
                            <small class="text-muted">{{ $activity->created_at->format('h:i:s A') }}</small>
                        </td>
                        
                        {{-- 2. Causer (User who performed the action) --}}
                        <td>
                            @if ($activity->causer)
                                <span class="badge bg-info" title="User ID: {{ $activity->causer->id }}">
                                    <i class="fas fa-user"></i> {{ $activity->causer->name ?? $activity->causer->email }}
                                </span>
                            @else
                                <span class="badge bg-secondary">System/Guest</span>
                            @endif
                        </td>

                        {{-- 3. Event Type --}}
                        <td>
                            @php
                                $event = $activity->event ?? 'manual';
                                $badgeClass = match($event) {
                                    'created', 'login' => 'bg-success',
                                    'updated' => 'bg-warning',
                                    'deleted', 'logout' => 'bg-danger',
                                    default => 'bg-primary',
                                };
                            @endphp
                            <span class="badge {{ $badgeClass }}">{{ ucwords($event) }}</span>
                        </td>
                        
                        {{-- 4. Description --}}
                        <td>
                            {{ $activity->description }}
                        </td>

                        {{-- 5. Subject (The model that was acted upon) --}}
                        <td>
                            {{-- Check if subject_type is set (applies to all model-related logs, even if the subject is deleted) --}}
                            @if ($activity->subject_type)
                                @php
                                    // Get the class name without the namespace (e.g., 'App\Models\Property' -> 'Property')
                                    $modelName = (new \ReflectionClass($activity->subject_type))->getShortName();
                                @endphp

                                <span class="badge bg-dark" title="{{ $activity->subject_type }}">
                                    <i class="fas fa-cube"></i> {{ $modelName }}
                                </span> 
                                <br>

                                {{-- If the subject relationship exists (model is NOT deleted), display its identifying attribute (e.g., name/title) --}}
                                @if ($activity->subject)
                                    <small class="text-info">
                                        @if (isset($activity->subject->name))
                                            {{ Str::limit($activity->subject->name, 30) }}
                                        @elseif (isset($activity->subject->title))
                                            {{ Str::limit($activity->subject->title, 30) }}
                                        @else
                                            Model ID: {{ $activity->subject_id }}
                                        @endif
                                    </small>
                                @else
                                    {{-- If the subject relationship is NULL (because the item was deleted) --}}
                                    <small class="text-danger">
                                        <i class="fas fa-trash-alt"></i> Deleted (ID: {{ $activity->subject_id }})
                                    </small>
                                @endif
                                
                            @else
                                {{-- For manual logs (like login/logout) where subject_type is NULL --}}
                                <span class="text-muted">N/A</span>
                            @endif
                        </td>
                        
                        {{-- 6. Details (Custom properties and changes) --}}
                        <td>
                            @if ($activity->properties->isNotEmpty())
                                <button type="button" class="btn btn-sm btn-secondary" data-toggle="modal" data-target="#detailsModal-{{ $activity->id }}">
                                    <i class="fas fa-search-plus"></i> View Details
                                </button>
                            @else
                                <span class="text-muted">None</span>
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="card-footer clearfix">
        {{ $activityLogs->appends(request()->except('page'))->links() }}
    </div>
</div>

{{-- MODALS FOR DETAILS --}}
@foreach ($activityLogs as $activity)
<div class="modal fade" id="detailsModal-{{ $activity->id }}" tabindex="-1" role="dialog" aria-labelledby="detailsModalLabel-{{ $activity->id }}" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="detailsModalLabel-{{ $activity->id }}">Activity Details (ID: {{ $activity->id }})</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <h6>Custom Properties (IP, Email, etc.)</h6>
                <pre class="bg-light p-2">{{ json_encode($activity->properties->except(['old', 'attributes'])->toArray(), JSON_PRETTY_PRINT) }}</pre>

                {{-- ** START: LOGIC FOR DELETED/UPDATED/CREATED CHANGES ** --}}
                @php
                    // Determine which array holds the data we need to iterate over
                    $dataToIterate = [];
                    $isDeletion = ($activity->event == 'deleted');

                    if ($isDeletion) {
                        // For a deleted event, iterate over the 'old' properties
                        $dataToIterate = $activity->properties['old'] ?? [];
                    } else {
                        // For created/updated events, iterate over the 'attributes' (new) properties
                        $dataToIterate = $activity->properties['attributes'] ?? [];
                    }
                @endphp

                @if (!empty($dataToIterate))
                    <h6>Changes</h6>
                    <table class="table table-sm table-bordered">
                        <thead>
                            <tr>
                                <th>Attribute</th>
                                <th>Old Value</th>
                                <th>New Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($dataToIterate as $key => $value)
                                @php
                                    $oldValue = $activity->properties['old'][$key] ?? null;
                                    $newValue = $activity->properties['attributes'][$key] ?? null;

                                    if ($isDeletion) {
                                        // If deleted, Old Value is the current value, New Value is 'DELETED'
                                        $displayOldValue = $oldValue;
                                        $displayNewValue = '<span class="badge bg-danger">DELETED</span>';
                                        $rowClass = 'table-danger';
                                    } else {
                                        // For updated/created
                                        $displayOldValue = $oldValue ?? '<span class="text-success">N/A (Created)</span>';
                                        $displayNewValue = $newValue;
                                        $rowClass = ($oldValue !== $newValue) ? 'table-warning' : '';
                                    }

                                    // Handle array/object values for display
                                    if (is_array($displayOldValue) || is_object($displayOldValue)) $displayOldValue = json_encode($displayOldValue);
                                    if (is_array($displayNewValue) || is_object($displayNewValue)) $displayNewValue = json_encode($displayNewValue);
                                @endphp
                                
                                <tr class="{{ $rowClass }}">
                                    <td><strong>{{ $key }}</strong></td>
                                    <td>{!! $displayOldValue !!}</td>
                                    <td>{!! $displayNewValue !!}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                @endif
                {{-- ** END: LOGIC FOR DELETED/UPDATED/CREATED CHANGES ** --}}

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
@endforeach

@endsection

@section('css')
    {{-- Include your standard CSS, the table styling should be handled by adminlte and datatables --}}
    
@endsection

@section('js')
    
    
    <script>
        $(document).ready(function () {
            // Initialize DataTable, but DISABLE ordering/searching/paging since we are using server-side pagination ($activityLogs->links())
            $('#activity-log-table').DataTable({
                paging: false,      // Disabled: using Laravel pagination
                searching: false,   // Disabled: using filter buttons
                ordering: false,    // Disabled
                info: false,        // Disabled
                responsive: true
            });
        });
    </script>
@endsection
