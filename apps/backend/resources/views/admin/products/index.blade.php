{{--
    Administrative E-Commerce: Global Inventory Registry
    
    This view provides the authoritative command center for the 
    product marketplace. It aggregates inventory status, retail 
    pricing structures, and lifecycle tracking for all product assets. 
    It facilitates efficient catalog oversight through a responsive 
    data architecture and multi-dimensional filtering.
    
    @extends adminlte::page
    @context E-Commerce Module Management
    @variables Paginator $products Paginated collection of Product model instances.
--}}
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
                <a href="{{ route('admin.products.create') }}" class="btn btn-primary btn-registry-add">
                    <i class="fas fa-plus-circle mr-2"></i> Add Product
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    @include('admin.products._filter')

    <div class="card registry-table-card">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none letter-spacing-1">Product Catalog</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                    <i class="fas fa-database mr-1"></i> {{ $products->total() }} PRODUCTS FOUND
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="products-table" class="table table-hover table-premium mb-0 datatable-init" 
                       data-datatable-config='{"paging": false, "info": false, "searching": false, "columnDefs": [{"orderable": false, "targets": [0, 5]}]}'>
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center pl-4 col-media-70">Media</th>
                            <th>Product Info</th>
                            <th>Retail Details</th>
                            <th>Inventory</th>
                            <th class="text-center">Lifecycle</th>
                            <th class="text-right pr-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($products as $product)
                            <tr>
                                <td class="text-center align-middle pl-4">
                                    <div class="table-img-preview shadow-sm mx-auto">
                                        <img src="{{ $product->getFirstMediaUrl('main_image', 'product_thumbnail') ?: asset('assets/defaults/placeholder.png') }}" 
                                             alt="{{ $product->title }}" data-fallback="{{ asset('images/fallbacks/default.jpg') }}">
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0 text-0-95">
                                        {{ $product->title }}
                                        @if($product->is_featured)
                                            <i class="fas fa-star text-warning ml-1" data-toggle="tooltip" title="Featured Product"></i>
                                        @endif
                                    </span>
                                    <div class="d-flex align-items-center mt-1 gap-10">
                                        <span class="smallest font-weight-bold text-muted text-monospace">ID: #{{ $product->sku ?? 'NO-SKU' }}</span>
                                        <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                                            <i class="fas fa-folder-open mr-1 text-primary opacity-50"></i> {{ $product->category->title ?? 'Uncategorized' }}
                                        </span>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="font-weight-bold text-success h6 mb-0">
                                        {{ $product->price_formatted }}
                                        @if($product->on_sale && $product->sale_price > 0)
                                            <del class="text-muted smallest ml-1 font-weight-normal">{{ setting('currency_symbol', '$') . number_format($product->base_price, 2) }}</del>
                                        @endif
                                    </div>
                                    <div class="smallest text-muted uppercase letter-spacing-1">
                                        {{ $product->weight ?? 0 }}kg | {{ $product->dimensions_formatted }}
                                    </div>
                                </td>

                                <td class="align-middle">
                                    @php
                                        $stockStatus = $product->stock_quantity > ($product->low_stock_threshold ?? 5) ? 'text-success' : 'text-danger';
                                    @endphp
                                    <div class="{{ $stockStatus }} font-weight-bold smallest uppercase letter-spacing-1">
                                        {{ $product->stock_quantity }} UNITS IN STOCK
                                    </div>
                                    <small class="text-muted smallest uppercase letter-spacing-1">
                                        {{ $product->manage_stock ? 'Auto-managed' : 'Manual Entry' }}
                                        @if($product->is_digital)
                                            <span class="ml-1 text-primary"><i class="fas fa-cloud-download-alt"></i> Digital</span>
                                        @endif
                                    </small>
                                </td>

                                <td class="text-center align-middle">
                                    <div class="mb-1">
                                        @php $status = $product->getStatusMeta(); @endphp
                                        <span class="badge badge-{{ $status['color'] }}-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
                                            <i class="fas fa-{{ $status['icon'] }} mr-1"></i> {{ $status['label'] }}
                                        </span>
                                    </div>
                                    @if($product->approved_at)
                                        <div class="smallest text-muted font-weight-bold uppercase letter-spacing-1">
                                            <i class="far fa-calendar-alt mr-1"></i>{{ $product->approved_at->format('M d, Y') }}
                                        </div>
                                    @endif
                                </td>

                                <td class="text-right align-middle pr-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.products.edit', $product->id) }}" 
                                           class="btn text-primary" 
                                           data-toggle="tooltip" title="Modify Product">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <a href="{{ route('admin.products.duplicate', $product->id) }}" 
                                           class="btn text-success" 
                                           data-toggle="tooltip" title="Clone Entry">
                                            <i class="fas fa-copy"></i>
                                        </a>
                                        <form action="{{ route('admin.products.destroy', $product->id) }}" 
                                              method="POST" 
                                              class="d-inline">
                                            @csrf
                                            @method('DELETE')
                                            <button type="button" class="btn text-danger" 
                                                    data-toggle="tooltip" title="Purge Product" data-action="delete-trigger">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            @include('admin._partials._empty-state', [
                                'colspan' => 6,
                                'icon' => 'fas fa-boxes',
                                'title' => 'No retail records detected in catalog.',
                                'description' => 'Synchronize your inventory or initialize new product entries to populate this registry.',
                                'button_text' => 'INITIALIZE PRODUCT',
                                'button_link' => route('admin.products.create')
                            ])
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if(method_exists($products, 'hasPages') && $products->hasPages())
            <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">Displaying {{ $products->firstItem() }} - {{ $products->lastItem() }} of {{ $products->total() }} records</div>
                <div>{{ $products->withQueryString()->links('pagination::bootstrap-4') }}</div>
            </div>
        @endif
    </div>
</div>
@endsection

@push('js')
    <script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@endpush
