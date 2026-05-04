@extends('adminlte::page')

@section('title', __('Auto Inquiries'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-car mr-2 text-primary"></i>
                    {{ __('Auto Inquiries') }}
                </h1>
            </div>
            <div class="col-sm-6 text-right">
                <a href="{{ route('admin.auto-inquiries.create') }}" class="btn btn-primary shadow-sm px-4 font-weight-bold">
                    <i class="fas fa-plus mr-1"></i> {{ __('Log New Lead') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid">
        @include('admin.alert')

        {{-- Premium Filter Card --}}
        <div class="card card-premium shadow-sm mb-4 border-0">
            <div class="card-body py-4 px-4">
                <form method="GET" action="{{ route('admin.auto-inquiries.index') }}">
                    <div class="row align-items-end">
                        <div class="col-md-5">
                            <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Vehicle Asset</label>
                            <div class="input-group shadow-xs">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-white border-right-0"><i class="fas fa-car text-primary"></i></span>
                                </div>
                                <input type="text" name="search" class="form-control border-left-0 smallest font-weight-bold" placeholder="Select or type vehicle..." list="auto-suggestions" value="{{ request('search') }}">
                                <datalist id="auto-suggestions">
                                    @foreach($autos as $a)
                                        <option value="{{ $a->title }}">
                                    @endforeach
                                </datalist>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Inquiry Status</label>
                            <div class="input-group shadow-xs">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-white border-right-0"><i class="fas fa-filter text-primary"></i></span>
                                </div>
                                <select name="status" class="form-control border-left-0">
                                    <option value="">All Lifecycle States</option>
                                    <option value="pending" {{ $status == 'pending' ? 'selected' : '' }}>Pending</option>
                                    <option value="viewed" {{ $status == 'viewed' ? 'selected' : '' }}>Viewed</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="d-flex" style="gap: 10px;">
                                <button type="submit" class="btn btn-primary flex-grow-1 font-weight-bold smallest uppercase">
                                    <i class="fas fa-sync-alt mr-2"></i> FILTER
                                </button>
                                <a href="{{ route('admin.auto-inquiries.index') }}" class="btn btn-back px-3 border shadow-sm d-flex align-items-center justify-content-center" data-toggle="tooltip" title="Reset Filters">
                                    <i class="fas fa-undo text-danger m-0"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        {{-- Main Table --}}
        <div class="card card-primary card-outline shadow-sm">
            <div class="card-header border-0 bg-white py-3">
                <h3 class="card-title font-weight-600 text-muted"><i class="fas fa-exchange-alt mr-1 text-primary"></i> {{ __('All Inquiries') }}</h3>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="inquiries-table" class="table table-hover table-premium mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th class="text-center" style="width: 70px">Media</th>
                                <th>Vehicle</th>
                                <th>Inquirer</th>
                                <th>Date</th>
                                <th class="text-center">Status</th>
                                <th class="text-right px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($inquiries as $inquiry)
                                <tr>
                                    <td class="text-center align-middle">
                                        <div class="table-img-preview shadow-xs">
                                            <img src="{{ $inquiry->auto->thumbnail_url ?? asset('images/fallbacks/default.jpg') }}" alt="Vehicle" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0">
                                            {{ $inquiry->auto->title ?? 'N/A' }}
                                        </span>
                                        <small class="text-muted">ID: #{{ $inquiry->auto_id }}</small>
                                    </td>
                                    <td class="align-middle">
                                        @if($inquiry->user)
                                            <div class="d-flex align-items-center">
                                                <div class="mr-2 bg-light rounded-circle text-center border shadow-sm" style="width:32px; height:32px; line-height:30px; flex-shrink:0;">
                                                    <i class="fas fa-user text-muted text-xs"></i>
                                                </div>
                                                <div>
                                                    <span class="d-block font-weight-bold text-dark mb-0">{{ $inquiry->user->name }}</span>
                                                    <small class="text-muted" style="font-size: 0.7rem;">{{ $inquiry->user->email }}</small>
                                                </div>
                                            </div>
                                        @else
                                            <span class="badge badge-secondary px-2">{{ __('Guest') }}</span>
                                        @endif
                                    </td>
                                    <td class="align-middle">
                                        <div class="font-weight-600 mb-0">{{ $inquiry->created_at->format('M d, Y') }}</div>
                                        <small class="text-muted"><i class="far fa-clock mr-1 text-xs"></i>{{ $inquiry->created_at->format('H:i') }}</small>
                                    </td>
                                    @php
                                        $statusClass = 'secondary';
                                        if($inquiry->status == 'pending') $statusClass = 'warning';
                                        elseif($inquiry->status == 'reviewed') $statusClass = 'info';
                                        elseif($inquiry->status == 'contacted') $statusClass = 'success';
                                    @endphp
                                    <td class="text-center align-middle">
                                        <span class="badge badge-{{ $statusClass }}-light px-3 py-1 text-uppercase shadow-xs" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                                            {{ $inquiry->status ?? 'Received' }}
                                        </span>
                                    </td>
                                    <td class="text-right px-4">
                                        <div class="btn-group">
                                            <a href="{{ route('admin.auto-inquiries.show', $inquiry->id) }}" class="btn btn-default btn-sm text-info mr-1 shadow-xs" title="View Inquiry">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                            <a href="{{ route('admin.auto-inquiries.edit', $inquiry->id) }}" class="btn btn-default btn-sm text-primary shadow-xs" title="Edit Inquiry">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr><td colspan="6" class="text-center py-5"><i class="fas fa-inbox fa-3x text-muted mb-3 d-block"></i><h5 class="text-muted font-weight-bold">No Inquiries Found</h5></td></tr>
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
        if ($('#inquiries-table tbody tr:not(.empty-state)').length > 0) {
            $('#inquiries-table').DataTable({
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
                    "searchPlaceholder": "Search inquiries...",
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
