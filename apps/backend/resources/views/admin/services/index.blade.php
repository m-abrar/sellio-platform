@extends('adminlte::page')

@section('title', 'Services')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-concierge-bell mr-2 text-primary"></i> Service Listings
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage professional service offerings and appointment configurations.</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.services.create') }}" class="btn btn-primary btn-registry-add">
                    <i class="fas fa-plus-circle mr-2"></i> Add Service
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    @include('admin.services._filter')

    {{-- Main Table --}}
    <div class="card registry-table-card">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none" style="letter-spacing: 1px;">Service Catalog</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                    <i class="fas fa-database mr-1"></i> {{ $services->total() }} ASSETS FOUND
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="services-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center pl-4" style="width: 70px">Media</th>
                            <th>Service Identity</th>
                            <th>Classification</th>
                            <th>Financials</th>
                            <th>Lifecycle</th>
                            <th class="text-right pr-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($services as $service)
                            <tr>
                                <td class="text-center align-middle pl-4">
                                    <div class="table-img-preview shadow-sm mx-auto">
                                        <img src="{{ $service->thumbnail_url ?? asset('images/placeholder.png') }}" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                    </div>
                                </td>
                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0" style="font-size: 0.95rem;">{{ $service->title }}</span>
                                    <div class="d-flex align-items-center mt-1" style="gap: 10px;">
                                        <span class="smallest font-weight-bold text-muted text-monospace">ID: #{{ str_pad($service->id, 5, '0', STR_PAD_LEFT) }}</span>
                                        <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                                            <i class="fas fa-folder mr-1 opacity-50"></i> {{ $service->category->title ?? 'General' }}
                                        </span>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="mb-1">
                                        @if($service->is_subscription)
                                            <span class="badge badge-info-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">Subscription</span>
                                        @elseif($service->is_project_based)
                                            <span class="badge badge-secondary-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">Project-Based</span>
                                        @else
                                            <span class="badge badge-secondary-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">Fixed Rate</span>
                                        @endif
                                    </div>
                                    <div class="smallest text-muted font-weight-bold uppercase letter-spacing-1">
                                        <i class="fas fa-map-marker-alt mr-1 text-primary opacity-50"></i>{{ $service->city ?? 'Remote' }}
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="font-weight-bold text-success h6 mb-0">{{ $service->price_formatted ?? '$0.00' }}</div>
                                    <small class="text-muted smallest font-weight-bold uppercase letter-spacing-1">Base Quotation</small>
                                </td>

                                <td class="text-center align-middle">
                                    <div class="mb-1">
                                        @if ($service->is_published && $service->approved_at)
                                            <span class="badge badge-success-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">Active</span>
                                        @elseif ($service->is_published && !$service->approved_at)
                                            <span class="badge badge-warning-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">Pending</span>
                                        @else
                                            <span class="badge badge-secondary-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">Draft</span>
                                        @endif
                                    </div>
                                </td>

                                <td class="text-right align-middle pr-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.services.edit', $service->id) }}" class="btn text-primary" data-toggle="tooltip" title="Modify Service"><i class="fas fa-pencil-alt"></i></a>
                                        <a href="{{ route('admin.services.duplicate', $service->id) }}" class="btn text-success" data-toggle="tooltip" title="Clone Entry"><i class="fas fa-copy"></i></a>
                                        <form action="{{ route('admin.services.destroy', $service->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn text-danger" data-toggle="tooltip" title="Purge Service" onclick="return confirm('Permanently delete this service listing?')"><i class="fas fa-trash-alt"></i></button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="6" class="py-5 text-center">
                                    <div class="py-4">
                                        <i class="fas fa-concierge-bell fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold">No professional services detected.</h5>
                                        <p class="text-secondary small">Synchronize your service board or initialize new service entries.</p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if($services->hasPages())
            <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">Displaying {{ $services->firstItem() }} - {{ $services->lastItem() }} of {{ $services->total() }} records</div>
                <div>{{ $services->appends(request()->query())->links('pagination::bootstrap-4') }}</div>
            </div>
        @endif
    </div>
</div>
@include('admin._partials._sweetalert-delete')
@endsection

@section('js')
<script>
    $(function () {
        if (typeof $.fn.select2 === 'function') {
            $('.select2').select2({ theme: 'bootstrap4', width: '100%' });
        }
        $('[data-toggle="tooltip"]').tooltip();

        if ($('#services-table tbody tr:not(.empty-state)').length > 0) {
            $('#services-table').DataTable({
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
                    "searchPlaceholder": "Search service catalog..."
                }
            });
            $('.dataTables_filter input').addClass('form-control form-control-premium shadow-none border-light mb-3').css('width', '250px');
        }
    });
</script>
@endsection

@section('css')
@include('admin._partials._toggle-card-css')
@endsection
