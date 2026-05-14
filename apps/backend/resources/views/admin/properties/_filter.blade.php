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
                    <label class="form-label-premium">{{ __('Property Focus') }}</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-search text-xs"></i></span>
                        </div>
                        <input type="text" name="name" class="form-control" placeholder="{{ __('Search by Title...') }}" value="{{ request('name') }}">
                    </div>
                </div>
                <div class="col-md-3">
                    <label class="form-label-premium">{{ __('Location Intelligence') }}</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-map-marker-alt text-xs"></i></span>
                        </div>
                        <select name="location_id" class="form-control select2">
                            <option value="">{{ __('All Locations') }}</option>
                            @foreach($locations ?? [] as $loc)
                                <option value="{{ $loc->id }}" {{ request('location_id') == $loc->id ? 'selected' : '' }}>{{ $loc->title }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="col-md-3">
                    <label class="form-label-premium">{{ __('Category Protocol') }}</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-folder-open text-xs"></i></span>
                        </div>
                        <select name="category_id" class="form-control select2">
                            <option value="">{{ __('All Categories') }}</option>
                            @foreach($categories ?? [] as $cat)
                                <option value="{{ $cat->id }}" {{ request('category_id') == $cat->id ? 'selected' : '' }}>{{ $cat->title }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="d-flex align-items-center justify-content-end gap-12">
                        <button type="submit" class="btn-filter-premium flex-grow-1">
                            <i class="fas fa-sync-alt mr-2"></i> {{ __('UPDATE') }}
                        </button>
                        <a href="{{ route('admin.properties.index') }}" class="btn-reset-premium" data-toggle="tooltip" title="{{ __('Reset Filters') }}">
                            <i class="fas fa-undo"></i>
                        </a>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
