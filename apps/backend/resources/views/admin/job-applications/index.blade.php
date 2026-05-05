@extends('adminlte::page')

@section('title', __('Job Applications | Talent Acquisition'))

@section('plugins.Select2', true)
@section('plugins.Sweetalert2', true)
@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-file-signature mr-2 text-primary opacity-50"></i>
                    {{ __('Talent Acquisition') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Review candidate submissions, resume profiles, and hiring pipeline progress.</p>
            </div>
            <div class="col-sm-4 text-right">
                <div class="d-flex justify-content-end align-items-center" style="gap: 12px;">
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                        <i class="fas fa-th-large"></i> Dashboard
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid">
        @include('admin.alert')

        {{-- Glass Filter Card --}}
        <div class="card card-premium shadow-premium mb-4 border-0" style="border-radius: 20px;">
            <div class="card-body py-4 px-4">
                <form method="GET" action="{{ route('admin.job-applications.index') }}">
                    <div class="row align-items-end">
                        <div class="col-md-3">
                            <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Target Position</label>
                            <div class="input-group shadow-xs">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-white border-right-0"><i class="fas fa-briefcase text-primary text-xs"></i></span>
                                </div>
                                <select name="job" class="form-control border-left-0 select2">
                                    <option value="">All Active Listings</option>
                                    @foreach($jobs as $j)
                                        <option value="{{ $j->id }}" {{ request('job') == $j->id ? 'selected' : '' }}>{{ $j->title }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Sector Category</label>
                            <div class="input-group shadow-xs">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-white border-right-0"><i class="fas fa-tags text-primary text-xs"></i></span>
                                </div>
                                <select name="category" class="form-control border-left-0 select2">
                                    <option value="">All Sectors</option>
                                    @foreach ($categories as $c)
                                        <option value="{{ $c->id }}" {{ request('category') == $c->id ? 'selected' : '' }}>{{ $c->title }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Pipeline Status</label>
                            <div class="input-group shadow-xs">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-white border-right-0"><i class="fas fa-filter text-primary text-xs"></i></span>
                                </div>
                                <select name="status" class="form-control border-left-0 select2">
                                    <option value="">All States</option>
                                    <option value="submitted" {{ $status == 'submitted' ? 'selected' : '' }}>Submitted</option>
                                    <option value="reviewed" {{ $status == 'reviewed' ? 'selected' : '' }}>Reviewed</option>
                                    <option value="accepted" {{ $status == 'accepted' ? 'selected' : '' }}>Accepted</option>
                                    <option value="rejected" {{ $status == 'rejected' ? 'selected' : '' }}>Rejected</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="d-flex" style="gap: 10px;">
                                <button type="submit" class="btn btn-primary flex-grow-1 font-weight-bold shadow-xs rounded-pill smallest uppercase">
                                    <i class="fas fa-sync-alt mr-2"></i> UPDATE
                                </button>
                                <a href="{{ route('admin.job-applications.index') }}" class="btn btn-default shadow-xs rounded-pill px-3 d-flex align-items-center justify-content-center" data-toggle="tooltip" title="Reset Filters">
                                    <i class="fas fa-undo text-danger m-0"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        {{-- Main Table --}}
        <div class="card card-premium shadow-premium border-0 overflow-hidden">
            <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                    <i class="fas fa-copy mr-2 text-primary opacity-50"></i> {{ __('Talent Registry') }}
                </h3>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="applications-table" class="table table-hover table-premium mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th class="text-center pl-4" style="width: 80px">Asset</th>
                                <th>Listing Intelligence</th>
                                <th>Candidate Profile</th>
                                <th>Applied At</th>
                                <th class="text-center">Pipeline</th>
                                <th class="text-right pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($applications as $app)
                                <tr>
                                    <td class="text-center align-middle pl-4">
                                        <div class="table-img-preview shadow-sm">
                                            <img src="{{ $app->job->thumbnail_url ?? asset('images/fallbacks/default.jpg') }}" alt="Job" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0" style="font-size: 0.95rem;">
                                            {{ $app->job->title ?? 'N/A' }}
                                        </span>
                                        <div class="d-flex align-items-center mt-1" style="gap: 6px;">
                                            @if($app->job && $app->job->category)
                                                <span class="badge badge-primary-soft text-primary px-2 py-1 font-weight-bold smallest uppercase" style="border-radius: 6px;">
                                                    <i class="fas fa-tag mr-1 opacity-50"></i>{{ $app->job->category->title }}
                                                </span>
                                            @endif
                                            <span class="badge badge-light border text-muted smallest uppercase font-weight-bold px-2">ID: #{{ $app->id }}</span>
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        @if($app->user)
                                            <div class="d-flex align-items-center">
                                                <div class="icon-box-soft bg-light mr-3 d-flex align-items-center justify-content-center shadow-xs" style="width:36px; height:36px; border-radius: 10px;">
                                                    <span class="smallest font-weight-bold text-primary">{{ strtoupper(substr($app->user->name ?? 'C', 0, 1)) }}</span>
                                                </div>
                                                <div>
                                                    <span class="d-block font-weight-bold text-dark mb-0">{{ $app->user->name }}</span>
                                                    <small class="text-muted text-monospace smallest">{{ $app->user->email }}</small>
                                                </div>
                                            </div>
                                        @else
                                            <span class="badge badge-secondary-soft text-secondary px-3 py-1 rounded-pill font-weight-bold smallest uppercase">{{ __('External Applicant') }}</span>
                                        @endif
                                    </td>
                                    <td class="align-middle">
                                        <div class="smallest text-dark font-weight-bold uppercase letter-spacing-1 mb-1">
                                            <i class="far fa-calendar-alt mr-2 text-primary opacity-50"></i>{{ $app->created_at->format('M d, Y') }}
                                        </div>
                                        <div class="smallest text-muted font-weight-bold uppercase letter-spacing-1">
                                            <i class="far fa-clock mr-2 opacity-50"></i>{{ $app->created_at->format('H:i') }}
                                        </div>
                                    </td>
                                    @php
                                        $statusMap = [
                                            'submitted' => 'badge-warning-light text-warning',
                                            'reviewed'  => 'badge-info-light text-info',
                                            'accepted'  => 'badge-success-light text-success',
                                            'hired'     => 'badge-success-light text-success',
                                            'rejected'  => 'badge-danger-light text-danger',
                                        ];
                                        $statusClass = $statusMap[$app->status] ?? 'badge-secondary-light text-secondary';
                                    @endphp
                                    <td class="text-center align-middle">
                                        <span class="badge {{ $statusClass }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs" style="min-width: 100px;">
                                            {{ $app->status ?? 'Submitted' }}
                                        </span>
                                    </td>
                                    <td class="text-right align-middle pr-4">
                                        <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                            <a href="{{ route('admin.job-applications.show', $app->id) }}" 
                                               class="btn btn-white text-info py-2 px-3 d-inline-flex align-items-center" 
                                               data-toggle="tooltip" title="View Application">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                            <form id="delete-form-{{ $app->id }}" action="{{ route('admin.job-applications.destroy', $app->id) }}" method="POST" class="d-inline">
                                                @csrf @method('DELETE')
                                                <button type="button" class="btn btn-white text-danger py-2 px-3 border-left d-inline-flex align-items-center" 
                                                        data-toggle="tooltip" title="Purge Record"
                                                        onclick="confirmDelete('delete-form-{{ $app->id }}', 'Purge Application?', 'This action will permanently remove the candidate record from the talent registry.', 'Confirm')">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr class="empty-state">
                                    <td colspan="6" class="text-center py-5">
                                        <div class="py-4">
                                            <i class="fas fa-file-signature fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                            <h5 class="text-muted font-weight-bold">No Applications Detected</h5>
                                            <p class="text-secondary small mb-0">Candidate submissions for your job listings will materialize here.</p>
                                        </div>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            @if(method_exists($applications, 'hasPages') && $applications->hasPages())
                <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                    <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">Displaying {{ $applications->firstItem() }} - {{ $applications->lastItem() }} of {{ $applications->total() }} records</div>
                    <div>{{ $applications->appends(request()->except('page'))->links('pagination::bootstrap-4') }}</div>
                </div>
            @endif
        </div>
    </div>
@stop

@section('css')
<style>
    .text-monospace { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important; }
    .select2-container--bootstrap4 .select2-selection--single { height: 100% !important; border: 0 !important; background: transparent !important; }
    .select2-container--bootstrap4 .select2-selection--single .select2-selection__rendered { line-height: 40px !important; padding-left: 0 !important; font-weight: 600 !important; font-size: 0.85rem !important; }
    .select2-container--bootstrap4 .select2-selection--single .select2-selection__arrow { top: 50% !important; transform: translateY(-50%) !important; }
</style>
@endsection

@section('js')
@include('admin._partials._sweetalert')
<script>
    $(document).ready(function() {
        $('[data-toggle="tooltip"]').tooltip();
        $('.select2').select2({
            theme: 'bootstrap4',
            width: '100%',
            placeholder: 'All Active Listings'
        });
    });
</script>
@stop
