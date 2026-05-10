{{--
    Administrative E-Commerce: Product Configuration
    
    This view serves as the authoritative interface for managing the 
    product inventory catalog. It orchestrates complex data structures 
    including general information, technical variations (attributes), 
    optional extra services (add-ons), logistics parameters (weight, 
    dimensions), and multi-media gallery collections.
    
    @extends adminlte::page
    @context E-Commerce Module Management
    @variables Product $product The product model instance.
    @variables Collection $categories Product sector categories.
    @variables Collection $brands Available product brands.
    @variables Collection $tags Search keywords for registry indexing.
--}}
@extends('adminlte::page')

@section('title', ($product->exists ? 'Edit' : 'Create') . ' Product')

@section('plugins.Select2', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-boxes mr-2 text-primary opacity-50"></i> {{ $product->exists ? __('Modify Product') : __('Initialize Product') }}
                </h1>
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
                    {{ $product->exists ? __('Update inventory specifications, retail pricing, and logistical parameters.') : __('Define technical specifications, commercial attributes, and inventory intelligence.') }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.products.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> {{ __('Back to Catalog') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
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
                {{-- Section 1: General Information --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">General Information</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="form-group mb-4">
                            <label for="title" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Product Title <span class="text-danger">*</span></label>
                            <input type="text" name="title" id="title" class="form-control form-control-hero" placeholder="Enter product name" value="{{ old('title', $product->title ?? '') }}" required list="product-title-suggestions">
                            <datalist id="product-title-suggestions">
                                @foreach($titleSuggestions ?? [] as $title)
                                    <option value="{{ $title }}">
                                @endforeach
                            </datalist>
                            @error('title') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label for="slug" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">URL Slug</label>
                                    <input type="text" name="slug" id="slug" class="form-control form-control-premium text-monospace small" value="{{ old('slug', $product->slug ?? '') }}">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label for="sku" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Base SKU</label>
                                    <input type="text" name="sku" id="sku" class="form-control form-control-premium" placeholder="e.g. PROD-001" value="{{ old('sku', $product->sku ?? '') }}">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Base Price ({{ setting('currency_symbol', '$') }})</label>
                                    <input type="number" step="0.01" name="base_price" class="form-control form-control-premium font-weight-bold" value="{{ old('base_price', $product->base_price ?? '') }}" required placeholder="0.00">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Sale Price</label>
                                    <input type="number" step="0.01" name="sale_price" class="form-control form-control-premium text-success font-weight-bold" value="{{ old('sale_price', $product->sale_price ?? '') }}" placeholder="0.00">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Initial Stock</label>
                                    <input type="number" name="stock_quantity" class="form-control form-control-premium" value="{{ old('stock_quantity', $product->stock_quantity ?? 0) }}" placeholder="0">
                                </div>
                            </div>
                        </div>

                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Brief Summary</label>
                            <textarea name="short_description" rows="2" class="form-control form-control-premium h-auto py-3" placeholder="Catchy summary...">{{ old('short_description', $product->short_description ?? '') }}</textarea>
                        </div>

                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Full Description <span class="text-danger">*</span></label>
                            <textarea name="description" id="description" rows="8" class="form-control textarea-premium" placeholder="Detailed technical specs and features...">{{ old('description', $product->description ?? '') }}</textarea>
                        </div>
                    </div>
                </div>

                {{-- Section 2: Variations --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex justify-content-between align-items-center">
                        <h3 class="card-title-main">Attributes & Variations</h3>
                        <button type="button" class="btn btn-primary rounded-pill px-3 font-weight-bold shadow-premium smallest uppercase letter-spacing-1" onclick="addVariationRow()">
                            <i class="fas fa-plus-circle mr-1"></i> ADD ATTRIBUTE
                        </button>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="table-responsive rounded-xl border border-light-soft">
                            <table class="table table-premium mb-0" id="variationsTable">
                                <thead class="bg-light">
                                    <tr>
                                        <th class="px-4 py-3 small uppercase letter-spacing-1">Name</th>
                                        <th class="px-4 py-3 small uppercase letter-spacing-1">Value</th>
                                        <th class="px-4 py-3 small uppercase letter-spacing-1">Price (+/-)</th>
                                        <th class="px-4 py-3 small uppercase letter-spacing-1">SKU Ext</th>
                                        <th class="px-4 py-3 small uppercase letter-spacing-1">Stock</th>
                                        <th class="px-4 py-3 text-center small uppercase letter-spacing-1">Selectable?</th>
                                        <th class="px-4 py-3 text-center small uppercase letter-spacing-1">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @php $vIndex = 0; @endphp
                                    @if($product->exists && $product->attributes->count() > 0)
                                        @foreach($product->attributes as $attr)
                                            <tr data-index="{{ $vIndex }}">
                                                <td class="px-4 py-3"><input type="text" name="attributes[{{ $vIndex }}][name]" value="{{ $attr->name }}" class="form-control form-control-premium py-1 px-3 h-auto" required></td>
                                                <td class="px-4 py-3"><input type="text" name="attributes[{{ $vIndex }}][value]" value="{{ $attr->value }}" class="form-control form-control-premium py-1 px-3 h-auto" required></td>
                                                <td class="px-4 py-3"><input type="number" step="0.01" name="attributes[{{ $vIndex }}][additional_price]" value="{{ $attr->additional_price }}" class="form-control form-control-premium py-1 px-3 h-auto"></td>
                                                <td class="px-4 py-3"><input type="text" name="attributes[{{ $vIndex }}][sku_extension]" value="{{ $attr->sku_extension }}" class="form-control form-control-premium py-1 px-3 h-auto"></td>
                                                <td class="px-4 py-3"><input type="number" name="attributes[{{ $vIndex }}][stock_quantity]" value="{{ $attr->stock_quantity }}" class="form-control form-control-premium py-1 px-3 h-auto"></td>
                                                <td class="px-4 py-3 text-center">
                                                    <div class="custom-control custom-switch custom-switch-premium d-inline-block">
                                                        <input type="hidden" name="attributes[{{ $vIndex }}][is_variation]" value="0">
                                                        <input type="checkbox" name="attributes[{{ $vIndex }}][is_variation]" value="1" class="custom-control-input" id="attr_v_{{ $vIndex }}" {{ $attr->is_variation ? 'checked' : '' }}>
                                                        <label class="custom-control-label" for="attr_v_{{ $vIndex }}"></label>
                                                    </div>
                                                </td>
                                                <td class="px-4 py-3 text-center"><button type="button" class="btn btn-danger btn-xs rounded-circle" onclick="removeRow(this)"><i class="fas fa-trash"></i></button></td>
                                            </tr>
                                            @php $vIndex++; @endphp
                                        @endforeach
                                    @endif
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {{-- Section 3: Add-ons --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex justify-content-between align-items-center">
                        <h3 class="card-title-main">{{ __('Optional Extra Services') }}</h3>
                        <button type="button" class="btn btn-primary rounded-pill px-3 font-weight-bold shadow-premium smallest uppercase letter-spacing-1" onclick="addAddonRow()">
                            <i class="fas fa-plus-circle mr-1"></i> {{ __('ADD EXTRA SERVICE') }}
                        </button>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="table-responsive rounded-xl border border-light-soft">
                            <table class="table table-premium mb-0" id="addonsTable">
                                <thead class="bg-light">
                                    <tr>
                                        <th class="px-4 py-3 small uppercase letter-spacing-1">Title</th>
                                        <th class="px-4 py-3 small uppercase letter-spacing-1">Price</th>
                                        <th class="px-4 py-3 small uppercase letter-spacing-1">Type</th>
                                        <th class="px-4 py-3 small uppercase letter-spacing-1">Description</th>
                                        <th class="px-4 py-3 text-center small uppercase letter-spacing-1">Req?</th>
                                        <th class="px-4 py-3 text-center small uppercase letter-spacing-1">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @php $aIndex = 0; @endphp
                                    @if($product->exists && $product->addons->count() > 0)
                                        @foreach($product->addons as $addon)
                                            <tr data-index="{{ $aIndex }}">
                                                <td class="px-4 py-3"><input type="text" name="addons[{{ $aIndex }}][title]" value="{{ $addon->title }}" class="form-control form-control-premium py-1 px-3 h-auto" required></td>
                                                <td class="px-4 py-3"><input type="number" step="0.01" name="addons[{{ $aIndex }}][price]" value="{{ $addon->price }}" class="form-control form-control-premium py-1 px-3 h-auto" required></td>
                                                <td class="px-4 py-3">
                                                    <select name="addons[{{ $aIndex }}][pricing_type]" class="form-control form-control-premium py-1 px-3 h-auto">
                                                        <option value="one_time" {{ $addon->pricing_type == 'one_time' ? 'selected' : '' }}>One-Time</option>
                                                        <option value="per_unit" {{ $addon->pricing_type == 'per_unit' ? 'selected' : '' }}>Per Unit</option>
                                                    </select>
                                                </td>
                                                <td class="px-4 py-3"><input type="text" name="addons[{{ $aIndex }}][description]" value="{{ $addon->description }}" class="form-control form-control-premium py-1 px-3 h-auto"></td>
                                                <td class="px-4 py-3 text-center">
                                                    <div class="custom-control custom-switch custom-switch-premium d-inline-block">
                                                        <input type="hidden" name="addons[{{ $aIndex }}][is_required]" value="0">
                                                        <input type="checkbox" name="addons[{{ $aIndex }}][is_required]" value="1" class="custom-control-input" id="addon_r_{{ $aIndex }}" {{ $addon->is_required ? 'checked' : '' }}>
                                                        <label class="custom-control-label" for="addon_r_{{ $aIndex }}"></label>
                                                    </div>
                                                </td>
                                                <td class="px-4 py-3 text-center"><button type="button" class="btn btn-danger btn-xs rounded-circle" onclick="removeRow(this)"><i class="fas fa-trash"></i></button></td>
                                            </tr>
                                            @php $aIndex++; @endphp
                                        @endforeach
                                    @endif
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {{-- Section 4: Logistics --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Logistics & Dimensions</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Weight (kg)</label>
                                    <input type="number" step="0.01" name="weight" class="form-control form-control-premium" value="{{ old('weight', $product->weight ?? '') }}">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Dimensions (LxWxH cm)</label>
                                    <div class="input-group-premium d-flex dimensions-input-group">
                                        <input type="number" step="0.01" name="length" placeholder="L" class="form-control form-control-premium rounded-0" value="{{ old('length', $product->length ?? '') }}">
                                        <input type="number" step="0.01" name="width" placeholder="W" class="form-control form-control-premium rounded-0 border-left-0 border-right-0" value="{{ old('width', $product->width ?? '') }}">
                                        <input type="number" step="0.01" name="height" placeholder="H" class="form-control form-control-premium rounded-0" value="{{ old('height', $product->height ?? '') }}">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Gallery Collection --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Product Gallery</h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Product::GALLERY_MEDIA,
                            'label' => 'Product Gallery',
                            'multiple' => true,
                            'model' => 'product',
                            'id' => $product->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>
            </div>

            {{-- Sidebar Column --}}
            <div class="col-md-3">
                @include('admin._partials._form-actions', [
                    'model' => $product,
                    'title' => 'PRODUCT',
                    'back' => 'admin.products.index',
                    'duplicate' => 'admin.products.duplicate'
                ])

                {{-- Primary Media --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">
                            <i class="fas fa-camera mr-2 text-primary opacity-50"></i> Visual Identity
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Product::PRIMARY_MEDIA,
                            'label' => 'Main Listing Image',
                            'multiple' => false,
                            'model' => 'product',
                            'id' => $product->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>

                {{-- Settings --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">Configuration</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        @php
                            $toggles = [
                                ['name' => 'is_featured', 'id' => 'isFeatured', 'label' => 'Featured Product', 'checked' => old('is_featured', $product->is_featured ?? false)],
                                ['name' => 'on_sale', 'id' => 'onSale', 'label' => 'On Sale Status', 'checked' => old('on_sale', $product->on_sale ?? false)],
                                ['name' => 'manage_stock', 'id' => 'manageStock', 'label' => 'Inventory Tracking', 'checked' => old('manage_stock', $product->manage_stock ?? true)],
                                ['name' => 'is_digital', 'id' => 'isDigital', 'label' => 'Digital Content', 'checked' => old('is_digital', $product->is_digital ?? false)],
                            ];
                        @endphp
                        @foreach($toggles as $t)
                            <div class="custom-control custom-switch custom-switch-premium mb-3">
                                <input type="hidden" name="{{ $t['name'] }}" value="0">
                                <input type="checkbox" name="{{ $t['name'] }}" value="1" class="custom-control-input" id="{{ $t['id'] }}" {{ $t['checked'] ? 'checked' : '' }}>
                                <label class="custom-control-label small font-weight-bold text-dark uppercase letter-spacing-1" for="{{ $t['id'] }}">{{ $t['label'] }}</label>
                            </div>
                        @endforeach
                    </div>
                </div>

                {{-- Classification --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">Taxonomy & Registry</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Collection / Category</label>
                            <select name="category_id" class="form-control select2">
                                <option value="">Select Category</option>
                                @foreach($categories as $cat)
                                    <option value="{{ $cat->id }}" {{ (old('category_id', optional($product ?? null)->category_id) == $cat->id) ? 'selected' : '' }}>{{ $cat->title }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Brand Authority</label>
                            <select name="brand_id" class="form-control select2">
                                <option value="">Select Brand</option>
                                @foreach($brands ?? [] as $brand)
                                    <option value="{{ $brand->id }}" {{ (old('brand_id', optional($product ?? null)->brand_id) == $brand->id) ? 'selected' : '' }}>{{ $brand->title }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Search Keywords</label>
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

    @php
        $vIndex = ($product->exists && $product->attributes->isNotEmpty()) ? $product->attributes->count() : 0;
        $aIndex = ($product->exists && $product->addons->isNotEmpty()) ? $product->addons->count() : 0;
    @endphp

    @push('js')
    <script>
        let variationIndex = {{ $vIndex }};
        let addonIndex = {{ $aIndex }};

        function addVariationRow() {
            let row = `
                <tr data-index="${variationIndex}">
                    <td class="px-4 py-3"><input type="text" name="attributes[${variationIndex}][name]" class="form-control form-control-premium py-1 px-3 h-auto" placeholder="Color" required></td>
                    <td class="px-4 py-3"><input type="text" name="attributes[${variationIndex}][value]" class="form-control form-control-premium py-1 px-3 h-auto" placeholder="Red" required></td>
                    <td class="px-4 py-3"><input type="number" step="0.01" name="attributes[${variationIndex}][additional_price]" class="form-control form-control-premium py-1 px-3 h-auto" value="0.00"></td>
                    <td class="px-4 py-3"><input type="text" name="attributes[${variationIndex}][sku_extension]" class="form-control form-control-premium py-1 px-3 h-auto" placeholder="-RED"></td>
                    <td class="px-4 py-3"><input type="number" name="attributes[${variationIndex}][stock_quantity]" class="form-control form-control-premium py-1 px-3 h-auto" value="0"></td>
                    <td class="px-4 py-3 text-center">
                        <div class="custom-control custom-switch custom-switch-premium d-inline-block">
                            <input type="hidden" name="attributes[${variationIndex}][is_variation]" value="0">
                            <input type="checkbox" name="attributes[${variationIndex}][is_variation]" value="1" class="custom-control-input" id="attr_v_${variationIndex}" checked>
                            <label class="custom-control-label" for="attr_v_${variationIndex}"></label>
                        </div>
                    </td>
                    <td class="px-4 py-3 text-center"><button type="button" class="btn btn-danger btn-xs rounded-circle" onclick="removeRow(this)"><i class="fas fa-trash"></i></button></td>
                </tr>
            `;
            $('#variationsTable tbody').append(row);
            variationIndex++;
        }

        function addAddonRow() {
            let row = `
                <tr data-index="${addonIndex}">
                    <td class="px-4 py-3"><input type="text" name="addons[${addonIndex}][title]" class="form-control form-control-premium py-1 px-3 h-auto" placeholder="Gift Wrap" required></td>
                    <td class="px-4 py-3"><input type="number" step="0.01" name="addons[${addonIndex}][price]" class="form-control form-control-premium py-1 px-3 h-auto" value="0.00" required></td>
                    <td class="px-4 py-3">
                        <select name="addons[${addonIndex}][pricing_type]" class="form-control form-control-premium py-1 px-3 h-auto">
                            <option value="one_time">One-Time</option>
                            <option value="per_unit">Per Unit</option>
                        </select>
                    </td>
                    <td class="px-4 py-3"><input type="text" name="addons[${addonIndex}][description]" class="form-control form-control-premium py-1 px-3 h-auto" placeholder="Add beautiful gift box"></td>
                    <td class="px-4 py-3 text-center">
                        <div class="custom-control custom-switch custom-switch-premium d-inline-block">
                            <input type="hidden" name="addons[${addonIndex}][is_required]" value="0">
                            <input type="checkbox" name="addons[${addonIndex}][is_required]" value="1" class="custom-control-input" id="addon_r_${addonIndex}">
                            <label class="custom-control-label" for="addon_r_${addonIndex}"></label>
                        </div>
                    </td>
                    <td class="px-4 py-3 text-center"><button type="button" class="btn btn-danger btn-xs rounded-circle" onclick="removeRow(this)"><i class="fas fa-trash"></i></button></td>
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

        function triggerDelete() {
            Swal.fire({
                title: 'Are you sure?',
                text: "Permanently delete this product listing?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#64748b',
                confirmButtonText: 'Yes, delete it!',
                customClass: {
                    popup: 'rounded-xl',
                    confirmButton: 'rounded-pill px-4',
                    cancelButton: 'rounded-pill px-4'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    document.getElementById('delete-form').submit();
                }
            })
        }
    </script>
    @endpush

    @if($product->exists)
        <form id="delete-form" action="{{ route('admin.products.destroy', $product->id) }}" method="POST" class="d-none">
            @csrf @method('DELETE')
        </form>
    @endif

    @push('css')
        @include('admin._partials._toggle-card-css')
    @endpush
