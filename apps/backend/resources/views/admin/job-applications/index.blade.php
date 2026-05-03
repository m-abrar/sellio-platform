@extends('adminlte::page')

@section('title', __('Job Applications'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-end">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-file-signature mr-2 text-primary"></i>
                    {{ __('Talent Acquisition') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Review candidate submissions, resume profiles, and hiring pipeline progress.</p>
            </div>
            <div class="col-sm-6 text-right">
                <ol class="breadcrumb float-sm-right bg-transparent p-0 mt-3 small">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">{{ __('Dashboard') }}</a></li>
                    <li class="breadcrumb-item active">{{ __('Job Applications') }}</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid">
        @include('admin.alert')

        {{-- Premium Filter Card --}}
        <div class="card card-outline card-secondary shadow-sm mb-4">
            <div class="card-body py-3">
                <form method="GET" action="{{ route('admin.job-applications.index') }}" class="row align-items-end justify-content-center">
                    <div class="col-md-3">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Job Search</label>
                        <select name="job_id" class="form-control select2 shadow-xs">
                            <option value="">All Jobs</option>
                            @foreach($jobs as $j)
                                <option value="{{ $j->id }}" {{ request('job_id') == $j->id ? 'selected' : '' }}>{{ $j->title }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-2">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Category</label>
                        <select name="category" class="form-control shadow-xs">
                            <option value="">All Categories</option>
                            @foreach ($categories as $c)
                                <option value="{{ $c->id }}" {{ request('category') == $c->id ? 'selected' : '' }}>{{ $c->title }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-2">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Status</label>
                        <select name="status" class="form-control shadow-xs">
                            <option value="">All Statuses</option>
                            <option value="submitted" {{ $status == 'submitted' ? 'selected' : '' }}>Submitted</option>
                            <option value="reviewed" {{ $status == 'reviewed' ? 'selected' : '' }}>Reviewed</option>
                        </select>
                    </div>
                    <div class="col-auto d-flex align-items-end" style="gap: 8px;">
                        <button type="submit" class="btn btn-primary font-weight-bold shadow-xs" style="height: 38px;">
                            <i class="fas fa-filter mr-1"></i> FILTER
                        </button>
                        <a href="{{ route('admin.job-applications.index') }}" class="btn btn-default font-weight-bold shadow-xs" style="height: 38px;">
                            <i class="fas fa-undo"></i>
                        </a>
                    </div>
                </form>
            </div>
        </div>

        {{-- Main Table --}}
        <div class="card card-primary card-outline shadow-sm">
            <div class="card-header border-0 bg-white py-3">
                <h3 class="card-title font-weight-600 text-muted"><i class="fas fa-copy mr-1 text-primary"></i> {{ __('All Applications') }}</h3>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="applications-table" class="table table-hover table-premium mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th class="text-center" style="width: 70px">Media</th>
                                <th>Job Details</th>
                                <th>Applicant Profile</th>
                                <th>Applied At</th>
                                <th class="text-center">Status</th>
                                <th class="text-right px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($applications as $app)
                                <tr>
                                    <td class="text-center align-middle">
                                        <div class="table-img-preview shadow-xs">
                                            <img src="{{ $app->job->thumbnail_url ?? asset('images/fallbacks/default.jpg') }}" alt="Job" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0">
                                            {{ $app->job->title ?? 'N/A' }}
                                        </span>
                                        <div class="text-xs mt-1">
                                            @if($app->job && $app->job->category)
                                                <span class="badge badge-primary-light text-primary px-2 py-1 mr-1" style="font-size: 0.6rem; border-radius: 4px;">
                                                    <i class="fas fa-tag mr-1"></i>{{ strtoupper($app->job->category->title) }}
                                                </span>
                                            @endif
                                            <span class="badge badge-light border text-muted smallest px-2" style="font-weight: 500;">ID: #{{ $app->id }}</span>
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        @if($app->user)
                                            <div class="d-flex align-items-center">
                                                <div class="mr-2 bg-light rounded-circle text-center border shadow-sm" style="width:32px; height:32px; line-height:30px; flex-shrink:0;">
                                                    <i class="fas fa-user text-muted text-xs"></i>
                                                </div>
                                                <div>
                                                    <span class="d-block font-weight-bold text-dark mb-0">{{ $app->user->name }}</span>
                                                    <small class="text-muted" style="font-size: 0.7rem;">{{ $app->user->email }}</small>
                                                </div>
                                            </div>
                                        @else
                                            <span class="badge badge-secondary px-2">{{ __('Guest') }}</span>
                                        @endif
                                    </td>
                                    <td class="align-middle">
                                        <div class="font-weight-600 mb-0">{{ $app->created_at->format('M d, Y') }}</div>
                                        <small class="text-muted"><i class="far fa-clock mr-1 text-xs"></i>{{ $app->created_at->format('H:i') }}</small>
                                    </td>
                                    @php
                                        $statusClass = 'secondary';
                                        if($app->status == 'pending' || $app->status == 'submitted') $statusClass = 'warning';
                                        elseif($app->status == 'reviewed') $statusClass = 'info';
                                        elseif($app->status == 'accepted' || $app->status == 'hired') $statusClass = 'success';
                                        elseif($app->status == 'rejected') $statusClass = 'danger';
                                    @endphp
                                    <td class="text-center align-middle">
                                        <span class="badge badge-{{ $statusClass }}-light px-3 py-1 text-uppercase shadow-xs" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                                            {{ $app->status ?? 'Submitted' }}
                                        </span>
                                    </td>
                                    <td class="text-right px-4">
                                        <a href="{{ route('admin.job-applications.show', $app->id) }}" class="btn btn-default btn-sm text-info"><i class="fas fa-eye"></i></a>
                                    </td>
                                </tr>
                            @empty
                                <tr><td colspan="6" class="text-center">No applications found</td></tr>
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
    .dataTables_filter { float: left !important; text-align: left !important; }
    .dataTables_filter input { margin-left: 0 !important; }
    .dataTables_length { float: right !important; text-align: right !important; }
</style>
@endsection

@section('js')
<script>
    $(document).ready(function() {
        if ($('#applications-table tbody tr:not(.empty-state)').length > 0) {
            $('#applications-table').DataTable({
                "paging": true,
                "lengthChange": true,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "responsive": true,
                "dom": '<"row px-0 pt-3"<"col-sm-12 col-md-6"f><"col-sm-12 col-md-6"l>>' +
                       '<"row"<"col-sm-12"tr>>' +
                       '<"row px-0 pb-3"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                "language": {
                    "search": "",
                    "searchPlaceholder": "Search applications...",
                    "paginate": {
                        "previous": "<i class='fas fa-angle-left'></i>",
                        "next": "<i class='fas fa-angle-right'></i>"
                    }
                }
            });
            $('.dataTables_filter input').addClass('form-control shadow-none border-light').css('width', '250px');
        }
        $('.select2').select2({
            theme: 'bootstrap4',
            placeholder: 'Select an option'
        });
    });
</script>
@stop
