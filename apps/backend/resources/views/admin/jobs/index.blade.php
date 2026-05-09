{{--
    Administrative Jobs: Global Vacancy Registry
    
    This view provides the authoritative command center for the career 
    marketplace. It aggregates role responsibilities, compensation 
    parameters, and employment engagement types (full-time/contract) 
    for all job listings. It facilitates efficient recruitment oversight 
    through a responsive data architecture and high-fidelity 
    lifecycle tracking.
    
    @extends adminlte::page
    @context Job Inventory Management
    @variables Paginator $jobs Paginated collection of JobListing model instances.
--}}
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

    @include('admin.jobs._filter')

    {{-- Main Table --}}
    <div class="card registry-table-card">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none letter-spacing-1">Job Vacancies</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                    <i class="fas fa-database mr-1"></i> {{ $jobs->total() }} ASSETS FOUND
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="jobs-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center pl-4 col-media-70">Media</th>
                            <th>Job Identity</th>
                            <th>Engagement</th>
                            <th>Financials</th>
                            <th>Lifecycle</th>
                            <th class="text-right pr-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($jobs as $job)
                            <tr>
                                <td class="text-center align-middle pl-4">
                                    <div class="table-img-preview shadow-sm mx-auto">
                                        <img src="{{ $job->thumbnail_url ?? asset('images/placeholder.png') }}" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                    </div>
                                </td>
                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0 text-0-95">{{ $job->title }}</span>
                                    <div class="d-flex align-items-center mt-1 gap-10">
                                        <span class="smallest font-weight-bold text-muted text-monospace">ID: #{{ str_pad($job->id, 5, '0', STR_PAD_LEFT) }}</span>
                                        <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                                            <i class="fas fa-building mr-1 opacity-50"></i> {{ $job->employer->name ?? 'Admin' }}
                                        </span>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="mb-1">
                                        @if($job->is_full_time)
                                            <span class="badge badge-success-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">Full-Time</span>
                                        @elseif($job->is_contract)
                                            <span class="badge badge-warning-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">Contract</span>
                                        @else
                                            <span class="badge badge-secondary-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">{{ $job->employment_type ?? 'Other' }}</span>
                                        @endif
                                    </div>
                                    <div class="smallest text-muted font-weight-bold uppercase letter-spacing-1">
                                        <i class="fas fa-map-marker-alt mr-1 text-primary opacity-50"></i>{{ $job->city ?? 'Remote' }}
                                    </div>
                                </td>

                                <td class="align-middle">
                                    @if($job->salary_min || $job->salary_max)
                                        <div class="font-weight-bold text-dark h6 mb-0">{{ $job->salary_range_formatted ?? 'N/A' }}</div>
                                        <small class="text-muted smallest font-weight-bold uppercase letter-spacing-1">{{ $job->salary_frequency ?? 'yearly' }}</small>
                                    @else
                                        <span class="badge badge-secondary-light px-2 py-1 rounded-pill font-weight-bold smallest uppercase">Confidential</span>
                                    @endif
                                </td>

                                <td class="text-center align-middle">
                                    <div class="mb-1">
                                        @php $status = $job->getStatusMeta(); @endphp
                                        <span class="badge badge-{{ $status['color'] }}-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
                                            <i class="fas fa-{{ $status['icon'] }} mr-1"></i> {{ $status['label'] }}
                                        </span>
                                    </div>
                                </td>

                                <td class="text-right align-middle pr-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.jobs.edit', $job->id) }}" class="btn text-primary" data-toggle="tooltip" title="Modify Vacancy"><i class="fas fa-pencil-alt"></i></a>
                                        <a href="{{ route('admin.jobs.duplicate', $job->id) }}" class="btn text-success" data-toggle="tooltip" title="Clone Entry"><i class="fas fa-copy"></i></a>
                                        <form action="{{ route('admin.jobs.destroy', $job->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn text-danger" data-toggle="tooltip" title="Purge Vacancy" onclick="return confirm('Permanently delete this job listing?')"><i class="fas fa-trash-alt"></i></button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            @include('admin._partials._empty-state', [
                                'colspan' => 6,
                                'icon' => 'fas fa-briefcase',
                                'title' => 'No vacancies detected in registry.',
                                'description' => 'Synchronize your recruitment board or initialize new job entries to populate this registry.',
                                'button_text' => 'POST NEW JOB',
                                'button_link' => route('admin.jobs.create')
                            ])
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if($jobs->hasPages())
            <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">Displaying {{ $jobs->firstItem() }} - {{ $jobs->lastItem() }} of {{ $jobs->total() }} records</div>
                <div>{{ $jobs->appends(request()->query())->links('pagination::bootstrap-4') }}</div>
            </div>
        @endif
    </div>
</div>
@include('admin._partials._sweetalert-delete')
@endsection

@section('css')
@include('admin._partials._toggle-card-css')
@endsection

@section('js')
<script>
    $(function () {
        if (typeof $.fn.select2 === 'function') {
            $('.select2').select2({ theme: 'bootstrap4', width: '100%' });
        }
        $('[data-toggle="tooltip"]').tooltip();

        if ($('#jobs-table tbody tr:not(.empty-state)').length > 0) {
            $('#jobs-table').DataTable({
                "paging": false,
                "lengthChange": false,
                "searching": false,
                "ordering": true,
                "info": false,
                "autoWidth": false,
                "responsive": true
            });
        }
    });
</script>
@endsection
