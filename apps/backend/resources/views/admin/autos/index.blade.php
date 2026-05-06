@extends('adminlte::page')

@section('title', 'Autos')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-car mr-2 text-primary"></i> Auto Listings
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage vehicle listings, specifications, and dealer information.</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.autos.create') }}" class="btn btn-primary btn-registry-add">
                    <i class="fas fa-plus-circle mr-2"></i> Add Auto
                </a>
            </div>
        </div>
    </div>
@stop

@section('css')
@include('admin._partials._toggle-card-css')
@endsection

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    @include('admin.autos._filter')

    {{-- Main Table --}}
    <div class="card registry-table-card">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none letter-spacing-1">Auto Inventory</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                    <i class="fas fa-database mr-1"></i> {{ $autos->total() }} ASSETS FOUND
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="autos-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center pl-4 col-media-70">Media</th>
                            <th>Vehicle Identity</th>
                            <th>Specifications</th>
                            <th>Financials</th>
                            <th>Lifecycle</th>
                            <th class="text-right pr-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($autos as $auto)
                            <tr>
                                <td class="text-center align-middle pl-4">
                                    <div class="table-img-preview shadow-sm mx-auto">
                                        <img src="{{ $auto->thumbnail_url ?? asset('images/placeholder.png') }}" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                    </div>
                                </td>
                                
                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0 text-0-95">{{ $auto->title }}</span>
                                    <div class="d-flex align-items-center mt-1 gap-10">
                                        <span class="smallest font-weight-bold text-muted text-monospace">ID: #{{ str_pad($auto->id, 5, '0', STR_PAD_LEFT) }}</span>
                                        <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                                            <i class="fas fa-user-tie mr-1 opacity-50"></i> {{ $auto->user->name ?? 'Admin' }}
                                        </span>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="font-weight-bold text-dark smallest uppercase letter-spacing-1">{{ $auto->brand->name ?? 'Unknown' }}</div>
                                    <small class="text-muted smallest uppercase letter-spacing-1">
                                        Model: {{ $auto->model ?? 'N/A' }} | Year: {{ $auto->year ?? 'N/A' }}
                                    </small>
                                </td>

                                <td class="align-middle">
                                    @if($auto->is_lease)
                                        <div class="font-weight-bold text-warning smallest uppercase letter-spacing-1">Lease / Rental</div>
                                        <div class="font-weight-bold text-dark h6 mb-0">{{ setting('currency_symbol', '$') }}{{ number_format($auto->base_price, 2) }} <small class="text-muted">/ mo</small></div>
                                    @else
                                        <div class="font-weight-bold text-success smallest uppercase letter-spacing-1">Direct Sale</div>
                                        <div class="font-weight-bold text-dark h6 mb-0">{{ setting('currency_symbol', '$') }}{{ number_format($auto->base_price, 2) }}</div>
                                    @endif
                                </td>

                                <td class="align-middle">
                                    <div class="mb-1">
                                        @if ($auto->is_published && $auto->approved_at)
                                            <span class="badge badge-success-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">Active</span>
                                        @elseif ($auto->is_published && !$auto->approved_at)
                                            <span class="badge badge-warning-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">Pending</span>
                                        @else
                                            <span class="badge badge-secondary-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">Draft</span>
                                        @endif
                                    </div>
                                    <div class="smallest text-muted font-weight-bold uppercase letter-spacing-1">
                                        <i class="fas fa-tachometer-alt mr-1 text-primary opacity-50"></i>{{ $auto->mileage_value ?? 0 }} {{ $auto->mileage_units ?? 'km' }}
                                    </div>
                                </td>

                                <td class="text-right align-middle pr-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.autos.edit', $auto->id) }}" class="btn text-primary" data-toggle="tooltip" title="Modify Asset">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <form action="{{ route('admin.autos.destroy', $auto->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn text-danger" data-toggle="tooltip" title="Purge Asset" onclick="return confirm('Permanently delete this auto listing?')">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="6" class="py-5 text-center">
                                    <div class="py-4">
                                        <i class="fas fa-car fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold">No automotive assets detected.</h5>
                                        <p class="text-secondary small">Synchronize your inventory or initialize new vehicle entries.</p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if($autos->hasPages())
            <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">Displaying {{ $autos->firstItem() }} - {{ $autos->lastItem() }} of {{ $autos->total() }} records</div>
                <div>{{ $autos->appends(request()->query())->links('pagination::bootstrap-4') }}</div>
            </div>
        @endif
    </div>
</div>
@endsection

@section('js')
@include('admin._partials._sweetalert-delete')
<script>
    $(function () {
        if (typeof $.fn.select2 === 'function') {
            $('.select2').select2({ theme: 'bootstrap4', width: '100%' });
        }
        $('[data-toggle="tooltip"]').tooltip();

        if ($('#autos-table tbody tr:not(.empty-state)').length > 0) {
            $('#autos-table').DataTable({
                "paging": false,
                "lengthChange": false,
                "searching": true,
                "ordering": true,
                "info": false,
                "autoWidth": false,
                "responsive": true,
                "dom": '<"row pt-3"<"col-sm-12"f>>t',
                "language": {
                    "search": "",
                    "searchPlaceholder": "Search automotive catalog..."
                }
            });
            $('.dataTables_filter input').addClass('form-control form-control-premium shadow-none border-light mb-3');
        }
    });
</script>
@endsection
