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
                <a href="{{ route('admin.jobs.create') }}" class="btn btn-primary btn-registry-add">
                    <i class="fas fa-plus-circle mr-2"></i> Add Job
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    {{-- Premium Filter Card --}}
    <div class="card registry-card-premium registry-filter-card mb-4">
        <div class="card-body">
            <form action="{{ route('admin.jobs.index') }}" method="GET">
                <div class="row align-items-end">
                    <div class="col-md-4">
                        <label class="form-label-premium">Vacancy Search</label>
                        <div class="input-group input-group-premium">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-search text-xs"></i></span>
                            </div>
                            <input type="text" name="title" class="form-control" placeholder="Search by Title..." value="{{ request('title') }}">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label-premium">Vertical Category</label>
                        <div class="input-group input-group-premium">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-folder-open text-xs"></i></span>
                            </div>
                            <select name="category_id" class="form-control select2">
                                <option value="">All Categories</option>
                                @foreach($categories ?? [] as $cat)
                                    <option value="{{ $cat->id }}" {{ request('category_id') == $cat->id ? 'selected' : '' }}>{{ $cat->title }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4 d-flex align-items-end" style="gap: 10px;">
                        <button type="submit" class="btn btn-primary btn-filter-premium flex-fill">
                            <i class="fas fa-filter mr-2"></i> UPDATE
                        </button>
                        <a href="{{ route('admin.jobs.index') }}" class="btn btn-reset-premium" data-toggle="tooltip" title="Reset Filters">
                            <i class="fas fa-undo"></i>
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>

    {{-- Table Card --}}
    <div class="card registry-table-card">
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
                                    <div class="table-img-preview shadow-xs rounded-lg overflow-hidden border" style="width: 50px; height: 50px; margin: 0 auto;">
                                        <img src="{{ $job->thumbnail_url ?? asset('images/placeholder.png') }}" style="width: 100%; height: 100%; object-fit: cover;">
                                    </div>
                                </td>
                                <td class="align-middle">
                                    <div class="d-flex align-items-center">
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0">{{ $job->title }}</span>
                                            <div class="d-flex align-items-center mt-1">
                                                <small class="badge badge-secondary-light mr-2" style="font-size: 0.65rem;">ID: {{ $job->id }}</small>
                                                <small class="text-muted">
                                                    <i class="fas fa-building mr-1"></i> {{ $job->employer->name ?? 'Admin' }}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle small text-muted">
                                    <i class="fas fa-map-marker-alt mr-1 text-primary opacity-50"></i>
                                    {{ $job->city ?? 'Remote' }}{{ isset($job->country) ? ', ' . $job->country : '' }}
                                </td>

                                <td class="align-middle">
                                    @if($job->salary_min || $job->salary_max)
                                        <div class="font-weight-bold text-dark">{{ $job->salary_range_formatted ?? 'N/A' }}</div>
                                        <small class="text-muted text-capitalize">{{ $job->salary_frequency ?? 'yearly' }}</small>
                                    @else
                                        <span class="text-muted small">Not Disclosed</span>
                                    @endif
                                </td>

                                <td class="align-middle">
                                    @if($job->is_full_time)
                                        <span class="badge badge-premium badge-success-light">Full-Time</span>
                                    @elseif($job->is_contract)
                                        <span class="badge badge-premium badge-warning-light">Contract</span>
                                    @else
                                        <span class="badge badge-premium badge-secondary-light">{{ $job->employment_type ?? 'Other' }}</span>
                                    @endif
                                </td>

                                <td class="align-middle">
                                    <div class="mb-1">
                                        @if ($job->is_published && $job->approved_at)
                                            <span class="badge badge-premium badge-success-light">Active</span>
                                        @elseif ($job->is_published && !$job->approved_at)
                                            <span class="badge badge-premium badge-warning-light">Pending</span>
                                        @else
                                            <span class="badge badge-premium badge-secondary-light">Draft</span>
                                        @endif
                                    </div>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-sm rounded-pill border overflow-hidden bg-white">
                                        <a href="{{ route('admin.jobs.edit', $job->id) }}" class="btn btn-white btn-sm text-info py-2 px-3 border-right" data-toggle="tooltip" title="Edit"><i class="fas fa-pencil-alt"></i></a>
                                        <a href="{{ route('admin.jobs.duplicate', $job->id) }}" class="btn btn-white btn-sm text-success py-2 px-3 border-right" data-toggle="tooltip" title="Duplicate"><i class="fas fa-copy"></i></a>
                                        <form action="{{ route('admin.jobs.destroy', $job->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn btn-white btn-sm text-danger py-2 px-3" data-toggle="tooltip" title="Delete" onclick="return confirm('Permanently delete this job listing?')"><i class="fas fa-trash-alt"></i></button>
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
@include('admin._partials._toggle-card-css')
@endsection
