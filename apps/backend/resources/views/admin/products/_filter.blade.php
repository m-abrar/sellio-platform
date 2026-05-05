{{-- Product Filter Protocol --}}
<div class="card registry-card-premium registry-filter-card select2-premium mb-4">
    <div class="card-body">
        <form action="{{ route('admin.products.index') }}" method="GET">
            <div class="row align-items-end">
                <div class="col-md-3">
                    <label class="form-label-premium">Product Title</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-search text-xs"></i></span>
                        </div>
                        <input type="text" name="title" class="form-control" placeholder="Search product title..." value="{{ request('title') }}">
                    </div>
                </div>
                <div class="col-md-3">
                    <label class="form-label-premium">Sector Category</label>
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
                <div class="col-md-2">
                    <label class="form-label-premium">SKU Identity</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-barcode text-xs"></i></span>
                        </div>
                        <input type="text" name="sku" class="form-control" placeholder="SKU ID..." value="{{ request('sku') }}">
                    </div>
                </div>
                <div class="col-md-2">
                    <label class="form-label-premium">Lifecycle</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-traffic-light text-xs"></i></span>
                        </div>
                        <select name="status" class="form-control select2">
                            <option value="">All States</option>
                            <option value="1" {{ request('status') === '1' ? 'selected' : '' }}>Published</option>
                            <option value="0" {{ request('status') === '0' ? 'selected' : '' }}>Draft</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="d-flex align-items-center justify-content-end" style="gap: 12px;">
                        <button type="submit" class="btn-filter-premium flex-grow-1">
                            <i class="fas fa-sync-alt mr-2"></i> UPDATE
                        </button>
                        <a href="{{ route('admin.products.index') }}" class="btn-reset-premium" data-toggle="tooltip" title="Reset Filters">
                            <i class="fas fa-undo"></i>
                        </a>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
