@extends('adminlte::page')

@section('title', 'Jobs')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-briefcase mr-2 text-primary"></i> Job Listings
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage job postings, company profiles, and application statuses.</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.jobs.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium">
                    <i class="fas fa-plus-circle mr-1"></i> ADD JOB
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Premium Filter Card --}}
    <div class="card border-0 shadow-premium mb-4" style="border-radius: 20px;">
        <div class="card-body py-4 px-4">
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
    <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">Job Vacancies</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <button type="button" class="btn btn-tool" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="jobs-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center" style="width: 70px">Media</th>
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
                                <td class="text-center align-middle">
                                    <div class="table-img-preview shadow-xs">
                                        <img src="{{ $job->thumbnail_url ?? asset('images/placeholder.png') }}">
                                    </div>
                                </td>
                                <td class="align-middle">
                                    <div class="d-flex align-items-center">
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0">{{ $job->title }}</span>
                                            <div class="d-flex align-items-center mt-1">
                                                <small class="badge badge-light border text-muted mr-2">ID: {{ $job->id }}</small>
                                                <small class="text-muted">
                                                    <i class="fas fa-building mr-1"></i> {{ $job->employer->name ?? 'Admin' }}
                                                </small>
                                            </div>
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
                                        <span class="badge badge-success-light px-2 py-1">Full-Time</span>
                                    @elseif($job->is_contract)
                                        <span class="badge badge-warning-light px-2 py-1">Contract</span>
                                    @else
                                        <span class="badge badge-secondary-light px-2 py-1">{{ $job->employment_type ?? 'Other' }}</span>
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
                            <tr><td colspan="6" class="text-center py-5"><h5 class="text-muted">No Jobs Found</h5></td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if($jobs->hasPages())
            <div class="card-footer bg-white border-0 py-3">
                <div class="float-right">
                    {{ $jobs->appends(request()->query())->links('pagination::bootstrap-4') }}
                </div>
            </div>
        @endif
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
