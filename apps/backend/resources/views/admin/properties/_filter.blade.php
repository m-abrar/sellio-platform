{{--
    Administrative Real Estate: Property Filter Protocol
    
    This component provides a high-fidelity filtering interface for the 
    property registry. It enables multi-dimensional searching across 
    titles, geographic locations, and categorical taxonomies.
    
    @context Property Registry Administration
    @variables Collection|array $locations List of available locations.
    @variables Collection|array $categories List of available property categories.
--}}
<div class="card registry-card-premium registry-filter-card mb-4">
    <div class="card-body">
        <form action="{{ route('admin.properties.index') }}" method="GET">
            <div class="row align-items-end">
                <div class="col-md-3">
                    <label class="form-label-premium">Property Focus</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-search text-xs"></i></span>
                        </div>
                        <input type="text" name="name" class="form-control" placeholder="Search by Title..." value="{{ request('name') }}">
                    </div>
                </div>
                <div class="col-md-3">
                    <label class="form-label-premium">Location Intelligence</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-map-marker-alt text-xs"></i></span>
                        </div>
                        <select name="location_id" class="form-control select2">
                            <option value="">All Locations</option>
                            @foreach($locations ?? [] as $loc)
                                <option value="{{ $loc->id }}" {{ request('location_id') == $loc->id ? 'selected' : '' }}>{{ $loc->title }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="col-md-3">
                    <label class="form-label-premium">Category Protocol</label>
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
                        <a href="{{ route('admin.properties.index') }}" class="btn-reset-premium" data-toggle="tooltip" title="Reset Filters">
                            <i class="fas fa-undo"></i>
                        </a>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
