{{-- Auto Filter Protocol --}}
<div class="card registry-card-premium registry-filter-card mb-4">
    <div class="card-body">
        <form action="{{ route('admin.autos.index') }}" method="GET">
            <div class="row align-items-end">
                <div class="col-md-3">
                    <label class="form-label-premium">Vehicle Focus</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-search text-xs"></i></span>
                        </div>
                        <input type="text" name="title" class="form-control" placeholder="Search by Title..." value="{{ request('title') }}">
                    </div>
                </div>
                <div class="col-md-3">
                    <label class="form-label-premium">Brand Selection</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-car-side text-xs"></i></span>
                        </div>
                        <select name="brand_id" class="form-control select2">
                            <option value="">All Brands</option>
                            @foreach($brands ?? [] as $b)
                                <option value="{{ $b->id }}" {{ request('brand_id') == $b->id ? 'selected' : '' }}>{{ $b->title }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="col-md-3">
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
                <div class="col-md-3">
                    <div class="d-flex align-items-center justify-content-end" style="gap: 12px;">
                        <button type="submit" class="btn-filter-premium flex-grow-1">
                            <i class="fas fa-sync-alt mr-2"></i> UPDATE
                        </button>
                        <a href="{{ route('admin.autos.index') }}" class="btn-reset-premium" data-toggle="tooltip" title="Reset Filters">
                            <i class="fas fa-undo"></i>
                        </a>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
