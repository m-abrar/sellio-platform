@extends('adminlte::page')

@section('title', ($product->exists ? 'Edit' : 'Create') . ' Product')

@section('plugins.Select2', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                    {{ $product->exists ? 'Modify Product' : 'New Product Listing' }}
            </div>
            <div class="col-sm-6 text-right">
                <a href="{{ route('admin.products.index') }}" class="btn btn-default btn-flat btn-sm shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to Catalog
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form action="{{ $product->exists ? route('admin.products.update', $product->id) : route('admin.products.store') }}" 
          method="POST" 
          enctype="multipart/form-data"
          id="productMainForm">
        @csrf
        @if($product->exists) @method('PATCH') @endif

        <div class="row">
            {{-- Main Content Column --}}
            <div class="col-md-9">
                <div class="card card-primary card-outline card-outline-tabs shadow-sm border-0">
                    <div class="card-header p-0 border-bottom-0">
                        <ul class="nav nav-tabs" id="productTab" role="tablist">
                            <li class="nav-item">
                                <a class="nav-link active py-3 px-4 font-weight-bold" id="general-tab" data-toggle="pill" href="#general" role="tab"><i class="fas fa-info-circle mr-2"></i> General Information</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link py-3 px-4 font-weight-bold" id="variations-tab" data-toggle="pill" href="#variations" role="tab"><i class="fas fa-layer-group mr-2"></i> Variations & Sizing</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link py-3 px-4 font-weight-bold" id="addons-tab" data-toggle="pill" href="#addons" role="tab"><i class="fas fa-plus-circle mr-2"></i> Add-on Options</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link py-3 px-4 font-weight-bold" id="logistics-tab" data-toggle="pill" href="#logistics" role="tab"><i class="fas fa-truck mr-2"></i> Shipping & Logistics</a>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body">
                        <div class="tab-content" id="productTabContent">
                            
                            {{-- Tab 1: General Information --}}
                            <div class="tab-pane fade show active" id="general" role="tabpanel">
                                <div class="form-group mb-4">
                                    <label for="title" class="font-weight-600"><i class="fas fa-heading mr-1 text-primary"></i> Product Title <span class="text-danger">*</span></label>
                                    <input type="text" name="title" id="title" class="form-control form-control-lg form-control-border @error('title') is-invalid @enderror" placeholder="Enter product name" value="{{ old('title', $product->title ?? '') }}" required list="product-title-suggestions">
                                    <datalist id="product-title-suggestions">
                                        @foreach(\App\Models\Product::select('title')->distinct()->limit(20)->pluck('title') as $title)
                                            <option value="{{ $title }}">
                                        @endforeach
                                    </datalist>
                                    @error('title') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group mb-4">
                                            <label for="slug" class="font-weight-600 text-muted small">URL Slug</label>
                                            <input type="text" name="slug" id="slug" class="form-control form-control-sm form-control-monospace" value="{{ old('slug', $product->slug ?? '') }}">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group mb-4">
                                            <label for="sku" class="font-weight-600 text-muted small">Base SKU</label>
                                            <input type="text" name="sku" id="sku" class="form-control form-control-sm" placeholder="e.g. PROD-001" value="{{ old('sku', $product->sku ?? '') }}">
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="font-weight-600 text-primary">Base Price ({{ setting('currency_symbol', '$') }})</label>
                                            <input type="number" step="0.01" name="base_price" class="form-control form-control-lg bg-light-blue" value="{{ old('base_price', $product->base_price ?? '') }}" required>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="font-weight-600 text-success">Sale Price</label>
                                            <input type="number" step="0.01" name="sale_price" class="form-control form-control-lg border-success" value="{{ old('sale_price', $product->sale_price ?? '') }}">
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="font-weight-600">Initial Stock</label>
                                            <input type="number" name="stock_quantity" class="form-control form-control-lg" value="{{ old('stock_quantity', $product->stock_quantity ?? 0) }}">
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group mb-4 mt-3">
                                    <label class="font-weight-600">Brief Summary</label>
                                    <textarea name="short_description" rows="2" class="form-control" placeholder="Catchy summary...">{{ old('short_description', $product->short_description ?? '') }}</textarea>
                                </div>

                                <div class="form-group mb-0">
                                    <label class="font-weight-600">Full Description <span class="text-danger">*</span></label>
                                    <textarea name="description" id="description" rows="8" class="form-control">{{ old('description', $product->description ?? '') }}</textarea>
                                </div>
                            </div>

                            {{-- Tab 2: Variations --}}
                            <div class="tab-pane fade" id="variations" role="tabpanel">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h5 class="mb-0 font-weight-bold text-dark">Product Attributes & Variations</h5>
                                    <button type="button" class="btn btn-primary btn-sm btn-flat shadow-sm" onclick="addVariationRow()">
                                        <i class="fas fa-plus mr-1"></i> Add Attribute
                                    </button>
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-bordered table-striped" id="variationsTable">
                                        <thead class="bg-light">
                                            <tr>
                                                <th style="width: 15%">Name (e.g. Size)</th>
                                                <th style="width: 15%">Value (e.g. XL)</th>
                                                <th style="width: 15%">Price Modifier (+/-)</th>
                                                <th style="width: 15%">SKU Extension</th>
                                                <th style="width: 15%">Attribute Stock</th>
                                                <th style="width: 15%" class="text-center">Selection?</th>
                                                <th style="width: 10%" class="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            @php $vIndex = 0; @endphp
                                            @if($product->exists && $product->attributes->count() > 0)
                                                @foreach($product->attributes as $attr)
                                                    <tr data-index="{{ $vIndex }}">
                                                        <td><input type="text" name="attributes[{{ $vIndex }}][name]" value="{{ $attr->name }}" class="form-control form-control-sm" required></td>
                                                        <td><input type="text" name="attributes[{{ $vIndex }}][value]" value="{{ $attr->value }}" class="form-control form-control-sm" required></td>
                                                        <td><input type="number" step="0.01" name="attributes[{{ $vIndex }}][additional_price]" value="{{ $attr->additional_price }}" class="form-control form-control-sm"></td>
                                                        <td><input type="text" name="attributes[{{ $vIndex }}][sku_extension]" value="{{ $attr->sku_extension }}" class="form-control form-control-sm"></td>
                                                        <td><input type="number" name="attributes[{{ $vIndex }}][stock_quantity]" value="{{ $attr->stock_quantity }}" class="form-control form-control-sm"></td>
                                                        <td class="text-center">
                                                            <input type="hidden" name="attributes[{{ $vIndex }}][is_variation]" value="0">
                                                            <input type="checkbox" name="attributes[{{ $vIndex }}][is_variation]" value="1" {{ $attr->is_variation ? 'checked' : '' }}>
                                                        </td>
                                                        <td class="text-center"><button type="button" class="btn btn-danger btn-xs" onclick="removeRow(this)"><i class="fas fa-trash"></i></button></td>
                                                    </tr>
                                                    @php $vIndex++; @endphp
                                                @endforeach
                                            @endif
                                        </tbody>
                                    </table>
                                </div>
                                <div class="alert alert-info mt-3 small shadow-sm">
                                    <i class="fas fa-lightbulb mr-2"></i> Use the <strong>Selection?</strong> checkbox if you want this attribute to be selectable by the customer (e.g. choosing a size from a dropdown).
                                </div>
                            </div>

                            {{-- Tab 3: Add-ons --}}
                            <div class="tab-pane fade" id="addons" role="tabpanel">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h5 class="mb-0 font-weight-bold text-dark">Optional Extra Services</h5>
                                    <button type="button" class="btn btn-success btn-sm btn-flat shadow-sm" onclick="addAddonRow()">
                                        <i class="fas fa-plus mr-1"></i> Add New Add-on
                                    </button>
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-bordered" id="addonsTable">
                                        <thead class="bg-light">
                                            <tr>
                                                <th style="width: 20%">Title</th>
                                                <th style="width: 15%">Price</th>
                                                <th style="width: 15%">Type</th>
                                                <th style="width: 30%">Description</th>
                                                <th style="width: 10%" class="text-center">Required?</th>
                                                <th style="width: 10%" class="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            @php $aIndex = 0; @endphp
                                            @if($product->exists && $product->addons->count() > 0)
                                                @foreach($product->addons as $addon)
                                                    <tr data-index="{{ $aIndex }}">
                                                        <td><input type="text" name="addons[{{ $aIndex }}][title]" value="{{ $addon->title }}" class="form-control form-control-sm" required></td>
                                                        <td><input type="number" step="0.01" name="addons[{{ $aIndex }}][price]" value="{{ $addon->price }}" class="form-control form-control-sm" required></td>
                                                        <td>
                                                            <select name="addons[{{ $aIndex }}][pricing_type]" class="form-control form-control-sm">
                                                                <option value="one_time" {{ $addon->pricing_type == 'one_time' ? 'selected' : '' }}>One-Time</option>
                                                                <option value="per_unit" {{ $addon->pricing_type == 'per_unit' ? 'selected' : '' }}>Per Unit</option>
                                                            </select>
                                                        </td>
                                                        <td><input type="text" name="addons[{{ $aIndex }}][description]" value="{{ $addon->description }}" class="form-control form-control-sm"></td>
                                                        <td class="text-center">
                                                            <input type="hidden" name="addons[{{ $aIndex }}][is_required]" value="0">
                                                            <input type="checkbox" name="addons[{{ $aIndex }}][is_required]" value="1" {{ $addon->is_required ? 'checked' : '' }}>
                                                        </td>
                                                        <td class="text-center"><button type="button" class="btn btn-danger btn-xs" onclick="removeRow(this)"><i class="fas fa-trash"></i></button></td>
                                                    </tr>
                                                    @php $aIndex++; @endphp
                                                @endforeach
                                            @endif
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {{-- Tab 4: Logistics --}}
                            <div class="tab-pane fade" id="logistics" role="tabpanel">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group"><label>Weight (kg)</label><input type="number" step="0.01" name="weight" class="form-control" value="{{ old('weight', $product->weight ?? '') }}"></div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group"><label>Dimensions (LxWxH cm)</label>
                                            <div class="input-group">
                                                <input type="number" step="0.01" name="length" placeholder="L" class="form-control" value="{{ old('length', $product->length ?? '') }}">
                                                <input type="number" step="0.01" name="width" placeholder="W" class="form-control" value="{{ old('width', $product->width ?? '') }}">
                                                <input type="number" step="0.01" name="height" placeholder="H" class="form-control" value="{{ old('height', $product->height ?? '') }}">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {{-- Gallery Collection --}}
                <div class="card shadow-sm border-0 mt-4">
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Product::GALLERY_MEDIA,
                            'label' => 'Product Gallery',
                            'multiple' => true,
                            'model' => \App\Models\Product::class,
                            'id' => $product->id ?? null,
                        ])
                    </div>
                </div>
            </div>

            {{-- Sidebar Column --}}
            <div class="col-md-3">
                {{-- Action Card --}}
                @include('admin.products.partials.action-buttons')

                {{-- Primary Media --}}
                <div class="card shadow-sm border-0 mt-0">
                    <div class="card-header bg-white"><h3 class="card-title font-weight-600 small text-uppercase">Primary Listing Image</h3></div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Product::PRIMARY_MEDIA,
                            'label' => 'Main Listing Image',
                            'multiple' => false,
                            'model' => \App\Models\Product::class,
                            'id' => $product->id ?? null,
                        ])
                    </div>
                </div>

                {{-- Settings --}}
                <div class="card shadow-sm border-0">
                    <div class="card-header bg-white"><h3 class="card-title font-weight-bold text-muted small text-uppercase">Toggles & Status</h3></div>
                    <div class="card-body">
                        @php
                            $toggles = [
                                ['name' => 'is_published', 'id' => 'isPublished', 'label' => 'Published', 'checked' => old('is_published', $product->is_published ?? true)],
                                ['name' => 'is_featured', 'id' => 'isFeatured', 'label' => 'Featured', 'checked' => old('is_featured', $product->is_featured ?? false)],
                                ['name' => 'on_sale', 'id' => 'onSale', 'label' => 'On Sale', 'checked' => old('on_sale', $product->on_sale ?? false)],
                                ['name' => 'manage_stock', 'id' => 'manageStock', 'label' => 'Manage Stock', 'checked' => old('manage_stock', $product->manage_stock ?? true)],
                                ['name' => 'is_digital', 'id' => 'isDigital', 'label' => 'Digital Goods', 'checked' => old('is_digital', $product->is_digital ?? false)],
                            ];
                        @endphp
                        @foreach($toggles as $t)
                            <div class="custom-control custom-switch mb-2">
                                <input type="hidden" name="{{ $t['name'] }}" value="0">
                                <input type="checkbox" name="{{ $t['name'] }}" value="1" class="custom-control-input" id="{{ $t['id'] }}" {{ $t['checked'] ? 'checked' : '' }}>
                                <label class="custom-control-label font-weight-normal" for="{{ $t['id'] }}">{{ $t['label'] }}</label>
                            </div>
                        @endforeach
                    </div>
                </div>

                {{-- Classification --}}
                <div class="card shadow-sm border-0">
                    <div class="card-header bg-white"><h3 class="card-title font-weight-600 small text-uppercase">Categories & Brand</h3></div>
                    <div class="card-body">
                        <div class="form-group">
                            <label class="small font-weight-bold">Category</label>
                            <select name="category_id" class="form-control select2">
                                <option value="">Select Category</option>
                                @foreach($categories as $cat)
                                    <option value="{{ $cat->id }}" {{ (old('category_id', optional($product ?? null)->category_id) == $cat->id) ? 'selected' : '' }}>{{ $cat->title }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="small font-weight-bold">Brand</label>
                            <select name="brand_id" class="form-control select2">
                                <option value="">Select Brand</option>
                                @foreach($brands ?? [] as $brand)
                                    <option value="{{ $brand->id }}" {{ (old('brand_id', optional($product ?? null)->brand_id) == $brand->id) ? 'selected' : '' }}>{{ $brand->title }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="small font-weight-bold">Tags</label>
                            <select name="tags[]" class="form-control select2" multiple="multiple">
                                @foreach($tags ?? [] as $tag)
                                    <option value="{{ $tag->id }}" {{ (collect(old('tags', optional($product ?? null)->tags ? $product->tags->pluck('id')->toArray() : []))->contains($tag->id)) ? 'selected' : '' }}>{{ $tag->name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection

@push('js')
<script>
    let variationIndex = {{ $vIndex }};
    let addonIndex = {{ $aIndex }};

    function addVariationRow() {
        let row = `
            <tr data-index="${variationIndex}">
                <td><input type="text" name="attributes[${variationIndex}][name]" class="form-control form-control-sm" placeholder="Color" required></td>
                <td><input type="text" name="attributes[${variationIndex}][value]" class="form-control form-control-sm" placeholder="Red" required></td>
                <td><input type="number" step="0.01" name="attributes[${variationIndex}][additional_price]" class="form-control form-control-sm" value="0.00"></td>
                <td><input type="text" name="attributes[${variationIndex}][sku_extension]" class="form-control form-control-sm" placeholder="-RED"></td>
                <td><input type="number" name="attributes[${variationIndex}][stock_quantity]" class="form-control form-control-sm" value="0"></td>
                <td class="text-center">
                    <input type="hidden" name="attributes[${variationIndex}][is_variation]" value="0">
                    <input type="checkbox" name="attributes[${variationIndex}][is_variation]" value="1" checked>
                </td>
                <td class="text-center"><button type="button" class="btn btn-danger btn-xs" onclick="removeRow(this)"><i class="fas fa-trash"></i></button></td>
            </tr>
        `;
        $('#variationsTable tbody').append(row);
        variationIndex++;
    }

    function addAddonRow() {
        let row = `
            <tr data-index="${addonIndex}">
                <td><input type="text" name="addons[${addonIndex}][title]" class="form-control form-control-sm" placeholder="Gift Wrap" required></td>
                <td><input type="number" step="0.01" name="addons[${addonIndex}][price]" class="form-control form-control-sm" value="0.00" required></td>
                <td>
                    <select name="addons[${addonIndex}][pricing_type]" class="form-control form-control-sm">
                        <option value="one_time">One-Time</option>
                        <option value="per_unit">Per Unit</option>
                    </select>
                </td>
                <td><input type="text" name="addons[${addonIndex}][description]" class="form-control form-control-sm" placeholder="Add beautiful gift box"></td>
                <td class="text-center">
                    <input type="hidden" name="addons[${addonIndex}][is_required]" value="0">
                    <input type="checkbox" name="addons[${addonIndex}][is_required]" value="1">
                </td>
                <td class="text-center"><button type="button" class="btn btn-danger btn-xs" onclick="removeRow(this)"><i class="fas fa-trash"></i></button></td>
            </tr>
        `;
        $('#addonsTable tbody').append(row);
        addonIndex++;
    }

    function removeRow(btn) {
        $(btn).closest('tr').remove();
    }

    $(document).ready(function () {
        const titleInput = $('#title');
        const slugInput = $('#slug');
        titleInput.on('input', function () {
            if(!slugInput.data('edited')){
                let slug = $(this).val().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                slugInput.val(slug);
            }
        });
        slugInput.on('change', function() { $(this).data('edited', true); });
        $('.select2').select2({ theme: 'bootstrap4', width: '100%' });
    });
</script>
@include('admin._partials._toggle-card-css')
@endpush

@if($product->exists)
    <form id="delete-form" action="{{ route('admin.products.destroy', $product->id) }}" method="POST" class="d-none">
        @csrf @method('DELETE')
    </form>
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        function triggerDelete() {
            Swal.fire({
                title: 'Are you sure?',
                text: "Permanently delete this product listing?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    document.getElementById('delete-form').submit();
                }
            })
        }
    </script>
@endif
