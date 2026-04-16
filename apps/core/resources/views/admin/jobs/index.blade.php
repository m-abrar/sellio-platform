@extends('adminlte::page')

@section('title', 'Jobs')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-briefcase mr-2 text-primary"></i> Job Listings
                </h1>
            </div>
            <div class="col-sm-6 text-right">
                <a href="{{ route('admin.jobs.create') }}" class="btn btn-primary btn-flat shadow-sm">
                    <i class="fas fa-plus mr-1"></i> Add Job
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Premium Filter Card --}}
    <div class="card card-outline card-secondary shadow-sm mb-4">
        <div class="card-body py-4">
            <form action="{{ route('admin.jobs.index') }}" method="GET">
                <div class="row align-items-end">
                    <div class="col-md-4">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Job Title</label>
                        <div class="input-group shadow-xs">
                            <div class="input-group-prepend">
                                <span class="input-group-text bg-white border-right-0"><i class="fas fa-search text-muted text-xs"></i></span>
                            </div>
                            <input type="text" name="title" class="form-control border-left-0" placeholder="Filter by Title..." value="{{ request('title') }}">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Category</label>
                        <select name="category_id" class="form-control select2 shadow-xs">
                            <option value="">All Categories</option>
                            @foreach($categories ?? [] as $cat)
                                <option value="{{ $cat->id }}" {{ request('category_id') == $cat->id ? 'selected' : '' }}>{{ $cat->title }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-4 d-flex align-items-end" style="gap: 10px;">
                        <button type="submit" class="btn btn-primary flex-fill font-weight-bold shadow-xs">
                            <i class="fas fa-filter mr-1"></i> APPLY FILTERS
                        </button>
                        <a href="{{ route('admin.jobs.index') }}" class="btn btn-default font-weight-bold shadow-xs">
                            <i class="fas fa-undo mr-1"></i> RESET
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>

    {{-- Table Card --}}
    <div class="card card-primary card-outline shadow-sm">
        <div class="card-header border-0 bg-white py-3">
            <h3 class="card-title font-weight-600 font-weight-bold text-muted">Job Vacancies</h3>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="jobs-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center" style="width: 70px">ID</th>
                            <th>Job Details</th>
                            <th>Location</th>
                            <th>Salary Range</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($jobs as $job)
                            <tr>
                                <td class="text-center align-middle font-weight-bold text-muted small">#{{ $job->id }}</td>
                                
                                <td class="align-middle">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-shape mr-3 bg-light border rounded overflow-hidden shadow-xs" style="width:40px; height:40px;">
                                            <img src="{{ $job->thumbnail_url ?? asset('images/placeholder.png') }}" class="w-100 h-100" style="object-fit: contain; padding: 4px;">
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0">{{ $job->title }}</span>
                                            <small class="text-muted">By: {{ $job->employer->name ?? 'Admin' }}</small>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle small">
                                    {{ $job->city ?? 'Remote' }}{{ isset($job->country) ? ', ' . $job->country : '' }}
                                </td>

                                <td class="align-middle">
                                    @if($job->salary_min || $job->salary_max)
                                        <div class="font-weight-bold text-sm">{{ $job->salary_range_formatted ?? 'N/A' }}</div>
                                        <small class="text-muted text-capitalize">{{ $job->salary_frequency ?? 'yearly' }}</small>
                                    @else
                                        <span class="text-muted small">Not Disclosed</span>
                                    @endif
                                </td>

                                <td class="align-middle small">
                                    @if($job->is_full_time)
                                        <span class="badge badge-success px-2 py-1">Full-Time</span>
                                    @elseif($job->is_contract)
                                        <span class="badge badge-warning text-dark px-2 py-1">Contract</span>
                                    @else
                                        <span class="badge badge-secondary px-2 py-1">{{ $job->employment_type ?? 'Other' }}</span>
                                    @endif
                                </td>

                                <td class="align-middle">
                                    <div class="mb-1">
                                        @if ($job->is_published && $job->approved_at)
                                            <span class="badge badge-success-light px-2 py-1 text-uppercase" style="font-size: 0.65rem;">Active</span>
                                        @elseif ($job->is_published && !$job->approved_at)
                                            <span class="badge badge-warning-light px-2 py-1 text-uppercase" style="font-size: 0.65rem;">Pending</span>
                                        @else
                                            <span class="badge badge-secondary-light px-2 py-1 text-uppercase" style="font-size: 0.65rem;">Draft</span>
                                        @endif
                                    </div>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-sm">
                                        <a href="{{ route('admin.jobs.edit', $job->id) }}" class="btn btn-default btn-sm text-info"><i class="fas fa-pencil-alt"></i></a>
                                        <a href="{{ route('admin.jobs.duplicate', $job->id) }}" class="btn btn-default btn-sm text-success"><i class="fas fa-copy"></i></a>
                                        <form action="{{ route('admin.jobs.destroy', $job->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn btn-default btn-sm text-danger" onclick="return confirm('Permanently delete this job listing?')"><i class="fas fa-trash-alt"></i></button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr><td colspan="7" class="text-center py-5"><h5 class="text-muted">No Jobs Found</h5></td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@include('admin._partials._sweetalert-delete')
@endsection

@section('css')
<style>
    .badge-success-light { background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .badge-warning-light { background-color: #fef9c3; color: #854d0e; border: 1px solid #fef08a; }
    .badge-secondary-light { background-color: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; }
</style>
@endsection
