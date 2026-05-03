@extends('adminlte::page')

@section('title', 'Subscriptions Management')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-sync-alt mr-2 text-primary opacity-50"></i> {{ __('Enrollment Registry') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Track platform memberships, trial states, and recurring revenue pipelines.</p>
            </div>
            <div class="col-sm-5 d-flex align-items-center justify-content-end">
                <a href="{{ route('admin.subscriptions.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium">
                    <i class="fas fa-plus-circle mr-1"></i> MANUAL ENROLLMENT
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Filter Card --}}
    <div class="card border-0 shadow-premium mb-4" style="border-radius: 20px;">
        <div class="card-body py-4 px-4">
            <form method="GET" action="{{ route('admin.subscriptions.index') }}">
                <div class="row align-items-end">
                    <div class="col-md-4">
                        <label class="small text-muted font-weight-bold text-uppercase">Subscriber Search</label>
                        <div class="input-group shadow-xs">
                            <div class="input-group-prepend">
                                <span class="input-group-text bg-white border-right-0"><i class="fas fa-search text-xs text-muted"></i></span>
                            </div>
                            <input type="text" name="user" class="form-control border-left-0 shadow-none" 
                                   placeholder="Name or email address..." value="{{ request('user') }}">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="small text-muted font-weight-bold text-uppercase">Subscription Status</label>
                        <select name="status" class="form-control select2 shadow-none">
                            <option value="">All Statuses</option>
                            @foreach(['active' => 'Active', 'on_trial' => 'On Trial', 'past_due' => 'Past Due', 'cancelled' => 'Cancelled', 'expired' => 'Expired'] as $val => $label)
                                <option value="{{ $val }}" {{ request('status') == $val ? 'selected' : '' }}>{{ $label }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-4">
                        <button type="submit" class="btn btn-primary btn-block font-weight-bold shadow-sm">
                            <i class="fas fa-sync-alt mr-1"></i> UPDATE RESULTS
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    {{-- Main Table --}}
    <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-id-badge mr-1 text-primary opacity-50"></i> Global Enrollment Ledger
            </h3>
            <div class="card-tools ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                    <i class="fas fa-users mr-1"></i> {{ $subscriptions->total() }} ACTIVE SEATS
                </span>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="subscriptions-table" class="table table-hover table-premium mb-0">
                    <thead class="bg-light text-uppercase smallest font-weight-bold">
                        <tr>
                            <th class="py-3 border-0 pl-4">Subscriber Identity</th>
                            <th class="py-3 border-0">Service Tier</th>
                            <th class="py-3 border-0">Access Timeline</th>
                            <th class="py-3 border-0 text-center">Lifecycle</th>
                            <th class="py-3 border-0 text-right px-4">Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($subscriptions as $subscription)
                            @php
                                $statusMap = [
                                    'active'    => 'badge-success-light',
                                    'on_trial'  => 'badge-info-light',
                                    'past_due'  => 'badge-warning-light',
                                    'expired'   => 'badge-secondary-light',
                                    'cancelled' => 'badge-danger-light',
                                ];
                                $badgeClass = $statusMap[$subscription->status] ?? 'badge-dark-light';
                            @endphp
                            <tr>
                                <td class="align-middle">
                                    <div class="d-flex align-items-center">
                                        <div class="avatar-circle mr-3 bg-light border d-flex align-items-center justify-content-center shadow-xs" style="width:40px; height:40px; border-radius: 10px;">
                                            <span class="text-xs font-weight-bold text-primary">{{ strtoupper(substr($subscription->user->name ?? 'N', 0, 1)) }}</span>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark">{{ $subscription->user->name ?? 'Unknown User' }}</span>
                                            <small class="text-muted text-monospace">{{ $subscription->user->email ?? 'N/A' }}</small>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="text-dark font-weight-bold">{{ $subscription->plan->title ?? 'Custom Plan' }}</div>
                                    <span class="badge badge-light border text-muted small font-weight-normal">
                                        <i class="fas fa-tag mr-1 text-xs"></i> Recurring Billing
                                    </span>
                                </td>

                                <td class="align-middle small">
                                    <div class="d-flex flex-column">
                                        <span><i class="far fa-calendar-check mr-1 text-success"></i> <strong>From:</strong> {{ $subscription->starts_at->format('M d, Y') }}</span>
                                        <span class="mt-1">
                                            @if(!$subscription->ends_at)
                                                <i class="fas fa-infinity mr-1 text-primary"></i> <span class="text-primary font-weight-bold">Lifetime Access</span>
                                            @else
                                                <i class="far fa-calendar-times mr-1 text-danger"></i> <strong>Until:</strong> {{ $subscription->ends_at->format('M d, Y') }}
                                            @endif
                                        </span>
                                    </div>
                                </td>

                                <td class="text-center align-middle">
                                    <span class="badge {{ $badgeClass }} px-3 py-1 text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px; min-width: 90px;">
                                        {{ str_replace('_', ' ', $subscription->status) }}
                                    </span>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-sm">
                                        <a href="{{ route('admin.subscriptions.edit', $subscription->id) }}" 
                                           class="btn btn-default btn-sm text-info" 
                                           data-toggle="tooltip" title="Modify Subscription">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <form action="{{ route('admin.subscriptions.destroy', $subscription->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn btn-default btn-sm text-danger" 
                                                    data-toggle="tooltip" title="Terminate"
                                                    onclick="return confirm('Are you sure you want to remove this subscription log?')">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="6" class="text-center py-5">
                                    <i class="fas fa-sync-alt fa-3x text-muted opacity-3 mb-3 d-block"></i>
                                    <h5 class="text-muted font-weight-bold">No Subscriptions Found</h5>
                                    <p class="small text-secondary">New user enrollments will be listed here.</p>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if(method_exists($subscriptions, 'hasPages') && $subscriptions->hasPages())
            <div class="card-footer bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                <div class="text-muted smallest font-weight-bold uppercase">Displaying {{ $subscriptions->firstItem() }} - {{ $subscriptions->lastItem() }} of {{ $subscriptions->total() }} records</div>
                <div>{{ $subscriptions->appends(request()->except('page'))->links('pagination::bootstrap-4') }}</div>
            </div>
        @endif
    </div>
</div>
@endsection

@section('css')
@include('admin._partials._toggle-card-css')
<style>
    .table-premium thead th { border-top: none; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px; color: #6c757d; }
    .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .text-monospace { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important; }
    
    /* Blueprint Light Badge Classes */
    .badge-success-light { background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .badge-danger-light { background-color: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .badge-info-light { background-color: #e0f2fe; color: #075985; border: 1px solid #bae6fd; }
    .badge-warning-light { background-color: #fef9c3; color: #854d0e; border: 1px solid #fef08a; }
    .badge-secondary-light { background-color: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; }
    .badge-dark-light { background-color: #e5e7eb; color: #111827; border: 1px solid #d1d5db; }

    .btn-group-premium .btn { border: 1px solid #e9ecef; background: #fff; }
    .btn-group-premium .btn:hover { background: #f8f9fa; }
</style>
@endsection

@section('js')
<script>
    $(function () {
         if ($('#subscriptions-table tbody tr:not(.empty-state)').length > 0) {
             $('#subscriptions-table').DataTable({
                 "paging": true,
                 "searching": true,
                 "ordering": true,
                 "info": true,
                 "autoWidth": false,
                 "responsive": true,
                 dom: '<"row pt-3"<"col-sm-12 col-md-6"f><"col-sm-12 col-md-6"l>>' +
                        '<"row"<"col-sm-12"tr>>' +
                        '<"row pb-3"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                "language": {
                    "search": "",
                    "searchPlaceholder": "Search enrollments..."
                },
                "columnDefs": [
                    { "orderable": false, "targets": [5] }
                ]
             });
             $('.dataTables_filter input').addClass('form-control shadow-none border-light').css('width', '220px');
         }

        $('[data-toggle="tooltip"]').tooltip();
        if($('.select2').length) {
            $('.select2').select2({ theme: 'bootstrap4', width: '100%' });
        }
    });
</script>
@endsection
