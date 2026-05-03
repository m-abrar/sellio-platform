@extends('adminlte::page')

@section('title', 'Products')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-boxes mr-2 text-primary"></i> Inventory & Products
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage retail inventory, product pricing, and stock levels.</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.products.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium">
                    <i class="fas fa-plus-circle mr-1"></i> ADD PRODUCT
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
            <form action="{{ route('admin.products.index') }}" method="GET">
                <div class="row align-items-end">
                    <div class="col-md-3">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Product Title</label>
                        <div class="input-group shadow-xs">
                            <div class="input-group-prepend">
                                <span class="input-group-text bg-white border-right-0"><i class="fas fa-search text-muted text-xs"></i></span>
                            </div>
                            <input type="text" name="title" class="form-control border-left-0" placeholder="Filter by Title..." value="{{ request('title') }}">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Category</label>
                        <select name="category_id" class="form-control select2 shadow-xs">
                            <option value="">All Categories</option>
                            @foreach($categories ?? [] as $cat)
                                <option value="{{ $cat->id }}" {{ request('category_id') == $cat->id ? 'selected' : '' }}>{{ $cat->title }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-2">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">SKU</label>
                        <input type="text" name="sku" class="form-control shadow-xs" placeholder="SKU" value="{{ request('sku') }}">
                    </div>
                    <div class="col-md-2">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Status</label>
                        <select name="status" class="form-control shadow-xs">
                            <option value="">All</option>
                            <option value="1" {{ request('status') === '1' ? 'selected' : '' }}>Published</option>
                            <option value="0" {{ request('status') === '0' ? 'selected' : '' }}>Draft</option>
                        </select>
                    </div>
                    <div class="col-md-2 d-flex align-items-end" style="gap: 10px;">
                        <button type="submit" class="btn btn-primary flex-fill font-weight-bold shadow-xs">
                            <i class="fas fa-filter mr-1"></i> APPLY
                        </button>
                        <a href="{{ route('admin.products.index') }}" class="btn btn-default font-weight-bold shadow-xs">
                            <i class="fas fa-undo"></i>
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">Product Catalog</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <button type="button" class="btn btn-tool" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="products-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center" style="width: 70px;">Media</th>
                            <th>Product Info</th>
                            <th>Retail Details</th>
                            <th>Inventory</th>
                            <th class="text-right">Status</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($products as $product)
                            <tr>
                                <td class="text-center align-middle">
                                    <div class="table-img-preview shadow-xs">
                                        <img src="{{ $product->getFirstMediaUrl('main_image', 'product_thumbnail') ?: asset('assets/defaults/placeholder.png') }}" 
                                             alt="{{ $product->title }}"
                                             style="object-fit: cover;">
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0">
                                        {{ $product->title }}
                                        @if($product->is_featured)
                                            <i class="fas fa-star text-warning ml-1" data-toggle="tooltip" title="Featured Product"></i>
                                        @endif
                                    </span>
                                    <div class="d-flex align-items-center mt-1">
                                        <small class="badge badge-light border text-muted mr-2">{{ $product->sku ?? 'NO-SKU' }}</small>
                                        <small class="text-muted">
                                            <i class="fas fa-folder-open mr-1"></i> {{ $product->category->title ?? 'Uncategorized' }}
                                        </small>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="price-container">
                                        @if($product->on_sale && $product->sale_price > 0)
                                            <span class="text-dark font-weight-bold">{{ $product->price_formatted }}</span>
                                            <del class="text-muted small ml-1">{{ setting('currency_symbol', '$') . number_format($product->base_price, 2) }}</del>
                                        @else
                                            <span class="text-dark font-weight-bold">{{ $product->price_formatted }}</span>
                                        @endif
                                    </div>
                                    <small class="text-muted d-block">
                                        <i class="fas fa-weight-hanging mr-1 fa-xs"></i> {{ $product->weight ?? 0 }}kg | 
                                        <i class="fas fa-ruler-combined mr-1 fa-xs"></i> {{ $product->dimensions_formatted }}
                                    </small>
                                </td>

                                <td class="align-middle">
                                    @php
                                        $stockStatus = $product->stock_quantity > ($product->low_stock_threshold ?? 5) ? 'text-success' : 'text-danger';
                                    @endphp
                                    <div class="{{ $stockStatus }} font-weight-bold">
                                        {{ $product->stock_quantity }} in stock
                                    </div>
                                    <small class="text-muted">
                                        {{ $product->manage_stock ? 'Auto-managed' : 'Manual Entry' }}
                                        @if($product->is_digital)
                                            <span class="ml-1 text-indigo"><i class="fas fa-cloud-download-alt"></i> Digital</span>
                                        @endif
                                    </small>
                                </td>

                                <td class="text-right align-middle">
                                    <div class="mb-1">
                                        <span class="badge {{ $product->is_published ? 'badge-success-light' : 'badge-danger-light' }} px-2 py-1">
                                            {{ $product->is_published ? 'Published' : 'Draft' }}
                                        </span>
                                    </div>
                                    @if($product->approved_at)
                                        <small class="text-muted" style="font-size: 0.65rem;">
                                            Approved: {{ $product->approved_at->format('M d, Y') }}
                                        </small>
                                    @else
                                        <span class="badge badge-warning text-xs">Pending Review</span>
                                    @endif
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-sm">
                                        <a href="{{ route('admin.products.edit', $product->id) }}" 
                                           class="btn btn-default btn-sm text-info" 
                                           data-toggle="tooltip" title="Edit Product">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <a href="{{ route('admin.products.duplicate', $product->id) }}" 
                                           class="btn btn-default btn-sm text-success" 
                                           data-toggle="tooltip" title="Clone Product">
                                            <i class="fas fa-copy"></i>
                                        </a>
                                        <form action="{{ route('admin.products.destroy', $product->id) }}" 
                                              method="POST" 
                                              class="d-inline"
                                              onsubmit="return confirm('Archive this product and remove from catalog?')">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-default btn-sm text-danger" 
                                                    data-toggle="tooltip" title="Delete Product">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            {{-- Handled by DataTables --}}
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        </div>
</div>
@endsection

@section('js')
    <script>
        $(function () {
            $('.select2').select2({ theme: 'bootstrap4', width: '100%' });
            $('[data-toggle="tooltip"]').tooltip();

            if ($('#products-table tbody tr:not(.empty-state)').length > 0) {
                $('#products-table').DataTable({
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
                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                    "language": {
                        "search": "",
                        "searchPlaceholder": "Search products...",
                        "paginate": {
                            "previous": "<i class='fas fa-angle-left'></i>",
                            "next": "<i class='fas fa-angle-right'></i>"
                        },
                        "lengthMenu": "_MENU_ per page"
                    }
                });
                $('.dataTables_filter input').addClass('form-control shadow-none border-light').css('width', '250px');
                $('.dataTables_length select').addClass('form-control form-control-sm shadow-none border-light').css('width', '70px');
            }
        });
    </script>
@endsection
