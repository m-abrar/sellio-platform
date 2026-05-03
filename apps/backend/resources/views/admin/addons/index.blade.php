@extends('adminlte::page')

@section('plugins.Datatables', true)

@section('title', 'Addons')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-plug mr-2 text-primary"></i> Feature Addons
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Extend platform functionality with modular extensions and integrations.</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.addons.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium">
                    <i class="fas fa-plus-circle mr-1"></i> ADD ADDON
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">Module Registry</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-3">
                    <i class="fas fa-plug mr-1"></i> {{ count($addons) }} ADDONS INSTALLED
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="addons-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="px-4">Addon Identity</th>
                            <th>Description</th>
                            <th>Cost</th>
                            <th class="text-center">Status</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($addons as $addon)
                            <tr>
                                <td class="align-middle px-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-box-soft bg-primary-soft mr-3 d-flex align-items-center justify-content-center shadow-xs" style="width:40px; height:40px; border-radius: 10px;">
                                            <i class="fas fa-puzzle-piece text-primary"></i>
                                        </div>
                                        <span class="font-weight-bold text-dark">{{ $addon->title }}</span>
                                    </div>
                                </td>
                                <td class="align-middle text-muted small">
                                    {{ Str::limit($addon->description ?? 'No description provided.', 60) }}
                                </td>
                                <td class="align-middle font-weight-bold text-dark">
                                    {{ setting('currency_symbol') }}{{ number_format($addon->price, 2) }}
                                </td>
                                <td class="text-center align-middle">
                                    @if($addon->status === 'active')
                                        <span class="badge badge-success-light px-3 py-1 text-uppercase smallest font-weight-bold">Active</span>
                                    @else
                                        <span class="badge badge-danger-light px-3 py-1 text-uppercase smallest font-weight-bold">Inactive</span>
                                    @endif
                                </td>
                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                        <a href="{{ route('admin.addons.edit', $addon->id) }}" class="btn btn-white btn-sm text-info py-2 px-3 border-right" data-toggle="tooltip" title="Modify Settings">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <form action="{{ route('admin.addons.destroy', $addon->id) }}" method="POST" class="d-inline">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-white btn-sm text-danger py-2 px-3" data-toggle="tooltip" title="Remove Module" onclick="return confirm('Are you sure you want to delete this addon?')">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="5" class="text-center py-5">
                                    <i class="fas fa-plug fa-3x text-muted mb-3 opacity-25"></i>
                                    <h5 class="text-muted font-weight-bold">No Addons Found</h5>
                                    <p class="text-secondary small">Integrate new features into your marketplace.</p>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection

@section('css')
<style>
    .badge-success-light { background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .badge-danger-light { background-color: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .badge-primary-light { background-color: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
</style>
@endsection

@section('js')
@include('admin._partials._sweetalert-delete')
    <script>
        $(function () {
            if ($('#addons-table tbody tr:not(.empty-state)').length > 0) {
                $('#addons-table').DataTable({
                    "paging": true,
                    "lengthChange": true,
                    "searching": true,
                    "ordering": true,
                    "info": true,
                    "autoWidth": false,
                    "responsive": true,
                    "dom": '<"row pt-3"<"col-sm-12 col-md-6"f><"col-sm-12 col-md-6"l>>' +
                           '<"row"<"col-sm-12"tr>>' +
                           '<"row pb-3"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                    "language": {
                        "search": "",
                        "searchPlaceholder": "Search addons...",
                        "paginate": {
                            "previous": "<i class='fas fa-angle-left'></i>",
                            "next": "<i class='fas fa-angle-right'></i>"
                        }
                    }
                });
                $('.dataTables_filter input').addClass('form-control shadow-none border-light').css('width', '250px');
            }
            $('[data-toggle="tooltip"]').tooltip();
        });
    </script>
@endsection
