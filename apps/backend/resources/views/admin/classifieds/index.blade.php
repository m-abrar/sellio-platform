@extends('adminlte::page')

@section('title', 'Classified Ads')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-tags mr-2 text-primary"></i> Classified Ads
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage general classified advertisements and community listings.</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.classifieds.create') }}" class="btn btn-primary btn-registry-add">
                    <i class="fas fa-plus-circle mr-1"></i> ADD AD
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    {{-- Filter Protocol --}}
    <div class="card registry-card-premium registry-filter-card mb-4">
        <div class="card-body">
            <form action="{{ route('admin.classifieds.index') }}" method="GET">
                <div class="row align-items-end">
                    <div class="col-md-4">
                        <label class="form-label-premium">Ads Search</label>
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
                    <div class="col-md-4">
                        <div class="d-flex align-items-center justify-content-end" style="gap: 12px;">
                            <button type="submit" class="btn-filter-premium flex-grow-1">
                                <i class="fas fa-sync-alt mr-2"></i> UPDATE
                            </button>
                            <a href="{{ route('admin.classifieds.index') }}" class="btn-reset-premium" data-toggle="tooltip" title="Reset Filters">
                                <i class="fas fa-undo"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>

    {{-- Main Table --}}
    <div class="card registry-table-card">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none" style="letter-spacing: 1px;">Classified Inventory</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                    <i class="fas fa-database mr-1"></i> {{ $classifieds->total() }} ASSETS FOUND
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="classifieds-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center pl-4" style="width: 70px">Media</th>
                            <th>Item Identity</th>
                            <th>Engagement</th>
                            <th>Financials</th>
                            <th>Lifecycle</th>
                            <th class="text-right pr-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($classifieds as $ad)
                            <tr>
                                <td class="text-center align-middle pl-4">
                                    <div class="table-img-preview shadow-sm mx-auto">
                                        <img src="{{ $ad->thumbnail_url ?? asset('images/placeholder.png') }}" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                    </div>
                                </td>
                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0" style="font-size: 0.95rem;">{{ $ad->title }}</span>
                                    <div class="d-flex align-items-center mt-1" style="gap: 10px;">
                                        <span class="smallest font-weight-bold text-muted text-monospace">ID: #{{ str_pad($ad->id, 5, '0', STR_PAD_LEFT) }}</span>
                                        <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                                            <i class="fas fa-folder mr-1 opacity-50"></i> {{ $ad->category->title ?? 'General' }}
                                        </span>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="mb-1">
                                        <span class="badge badge-secondary-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">{{ $ad->condition_label ?? 'Used' }}</span>
                                    </div>
                                    <div class="smallest text-muted font-weight-bold uppercase letter-spacing-1">
                                        <i class="fas fa-map-marker-alt mr-1 text-primary opacity-50"></i>{{ $ad->city ?? 'Remote' }}
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="font-weight-bold text-success h6 mb-0">{{ $ad->price_formatted ?? '$0.00' }}</div>
                                    @if($ad->is_sale && $ad->is_for_rent) <small class="text-muted smallest font-weight-bold uppercase letter-spacing-1">Sale & Rent</small> @endif
                                </td>

                                <td class="text-center align-middle">
                                    <div class="mb-1">
                                        @if ($ad->is_published && $ad->approved_at)
                                            <span class="badge badge-success-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">Active</span>
                                        @elseif ($ad->is_published && !$ad->approved_at)
                                            <span class="badge badge-warning-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">Pending</span>
                                        @else
                                            <span class="badge badge-secondary-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">Draft</span>
                                        @endif
                                    </div>
                                </td>

                                <td class="text-right align-middle pr-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.classifieds.edit', $ad->id) }}" class="btn text-primary" data-toggle="tooltip" title="Modify Ad"><i class="fas fa-pencil-alt"></i></a>
                                        <a href="{{ route('admin.classifieds.duplicate', $ad->id) }}" class="btn text-success" data-toggle="tooltip" title="Clone Entry"><i class="fas fa-copy"></i></a>
                                        <form action="{{ route('admin.classifieds.destroy', $ad->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn text-danger" data-toggle="tooltip" title="Purge Ad" onclick="return confirm('Permanently delete this classified ad?')"><i class="fas fa-trash-alt"></i></button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="6" class="py-5 text-center">
                                    <div class="py-4">
                                        <i class="fas fa-tags fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold">No ads detected in registry.</h5>
                                        <p class="text-secondary small">Synchronize your marketplace board or initialize new ad entries.</p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if($classifieds->hasPages())
            <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">Displaying {{ $classifieds->firstItem() }} - {{ $classifieds->lastItem() }} of {{ $classifieds->total() }} records</div>
                <div>{{ $classifieds->appends(request()->query())->links('pagination::bootstrap-4') }}</div>
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

        if ($('#classifieds-table tbody tr:not(.empty-state)').length > 0) {
            $('#classifieds-table').DataTable({
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
                    "searchPlaceholder": "Search marketplace registry..."
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
