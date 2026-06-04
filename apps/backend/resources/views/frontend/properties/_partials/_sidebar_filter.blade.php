<div class="filter-sidebar-wrapper w-100">
    <div class="glass-surface p-3 p-lg-4 rounded-4 shadow-sm sticky-sidebar"
        x-data="{
            maxPrice: {{ request('max_price', $maxAllowedPrice ?? 1000000) }}, 
            propertyType: '{{ request('property_type') ?: '' }}', 
            showAmenities: {{ request('amenities') ? 'true' : 'false' }}, 
            showFeatures: {{ request('features') ? 'true' : 'false' }},
            showTags: {{ request('tags') ? 'true' : 'false' }},

            init() {
                this.propertyType = (this.propertyType || '').trim().toLowerCase();
            }
        }"
    >
        <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
            <h6 class="filter-heading m-0">
                <i class="bi bi-funnel-fill me-2"></i>{{ __('Refine Search') }}
            </h6>
            <a href="{{ route('properties.index') }}" class="text-muted small text-decoration-none hover-link">{{ __('Reset') }}</a>
        </div>
        
        <form method="GET" action="{{ route('properties.index') }}" id="filter-form">
            {{-- State preservation --}}
            <input type="hidden" name="themeVariant" value="{{ request('themeVariant', 'default') }}">
            @if(request()->filled('q')) <input type="hidden" name="q" value="{{ request('q') }}"> @endif
            <input type="hidden" name="sort" value="{{ request('sort') }}">

            {{-- 1. LISTING TYPE TABS --}}
            <div class="mb-4">
                <label class="filter-label mb-2">{{ __('Listing Type') }}</label>
                <div class="btn-group w-100 bg-light p-1 rounded-3" role="group">
                    <input type="radio" class="btn-check" name="property_type" value="" id="t_any" x-model="propertyType">
                    <label class="btn btn-filter-tab" :class="propertyType === '' ? 'btn-primary text-white' : 'text-muted'" for="t_any">{{ __('Any') }}</label>

                    <input type="radio" class="btn-check" name="property_type" value="sale" id="t_sale" x-model="propertyType">
                    <label class="btn btn-filter-tab" :class="propertyType === 'sale' ? 'btn-primary text-white' : 'text-muted'" for="t_sale">{{ __('Sale') }}</label>

                    <input type="radio" class="btn-check" name="property_type" value="rental" id="t_rental" x-model="propertyType">
                    <label class="btn btn-filter-tab" :class="propertyType === 'rental' ? 'btn-primary text-white' : 'text-muted'" for="t_rental">{{ __('Rent') }}</label>
                </div>
            </div>

            {{-- 2. PRICE SLIDER --}}
            <div x-show="propertyType !== 'rental'" x-collapse class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <label class="form-label small fw-bold mb-0 text-muted">{{ __('Max Price') }}</label>
                    <span class="badge bg-primary rounded-pill">
                        {{ setting_string('currency_symbol', '$') }}<span x-text="Number(maxPrice).toLocaleString()"></span>
                    </span>
                </div>
                <input type="range" name="max_price" class="form-range custom-range" 
                       min="100000" max="{{ $maxAllowedPrice ?? 5000000 }}" step="50000" x-model="maxPrice">
            </div>

            {{-- 3. DATES (Using Unified Input) --}}
            <div x-show="propertyType === 'rental' || propertyType === ''" x-collapse class="mb-4">
                <div class="row g-2">
                    <div class="col-6">
                        <label class="filter-label" for="check_in">{{ __('Check-In') }}</label>
                        <input type="text" id="check_in" name="check_in" value="{{ request('check_in') }}" 
                               class="form-control filter-input" placeholder="mm/dd/yyyy">
                    </div>
                    <div class="col-6">
                        <label class="filter-label" for="check_out">{{ __('Check-Out') }}</label>
                        <input type="text" id="check_out" name="check_out" value="{{ request('check_out') }}" 
                               class="form-control filter-input" placeholder="mm/dd/yyyy">
                    </div>
                </div>
            </div>

            {{-- 4. CORE FILTERS (Using Unified Selects) --}}
            <div class="mb-3 pt-2 border-top">
                <label class="filter-label">{{ __('Location') }}</label>
                <select name="location" class="form-select filter-input shadow-none">
                    <option value="">{{ __('All Locations') }}</option>
                    @isset($locations)
                        @foreach($locations as $loc)
                            <option value="{{ $loc->id }}" {{ request('location') == $loc->id ? 'selected' : '' }}>{{ $loc->title }}</option>
                        @endforeach
                    @endisset
                </select>
            </div>

            <div class="mb-4">
                <label class="filter-label">{{ __('Home Type') }}</label>
                <select name="category" class="form-select filter-input shadow-none">
                    <option value="">{{ __('All Categories') }}</option>
                    @isset($categories)
                        @foreach($categories as $cat)
                            <option value="{{ $cat->id }}" {{ request('category') == $cat->id ? 'selected' : '' }}>{{ $cat->title }}</option>
                        @endforeach
                    @endisset
                </select>
            </div>

            {{-- 5. SPACE DETAILS --}}
            <div class="row g-2 mb-4">
                <div class="col-6">
                    <label class="filter-label">{{ __('Beds') }}</label>
                    <select name="bedrooms" class="form-select filter-input" aria-label="{{ __('Number of Bedrooms') }}">
                        <option value="">Any</option>
                        @for($i=1; $i<=5; $i++)
                            <option value="{{ $i }}" {{ request('bedrooms') == $i ? 'selected' : '' }}>{{ $i }}+</option>
                        @endfor
                    </select>
                </div>
                <div class="col-6">
                    <label class="filter-label">{{ __('Baths') }}</label>
                    <select name="bathrooms" class="form-select filter-input">
                        <option value="">Any</option>
                        @for($i=1; $i<=5; $i++)
                            <option value="{{ $i }}" {{ request('bathrooms') == $i ? 'selected' : '' }}>{{ $i }}+</option>
                        @endfor
                    </select>
                </div>
            </div>

            {{-- 6. FEATURES (Collapsible) --}}
            @isset($features)
            <div class="mb-2 border-top pt-3">
                <div class="d-flex justify-content-between align-items-center mb-2 cursor-pointer" @click="showFeatures = !showFeatures">
                    <label class="filter-label mb-0">{{ __('Features') }}</label>
                    <i class="bi small" :class="showFeatures ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </div>
                <div x-show="showFeatures" x-collapse>
                    <div class="pt-1">
                        @foreach($features as $id => $title)
                            <div class="form-check mb-1">
                                <input class="form-check-input" type="checkbox" name="features[]" value="{{ $id }}" id="feat_{{ $id }}" {{ is_array(request('features')) && in_array($id, request('features')) ? 'checked' : '' }}>
                                <label class="form-check-label small" for="feat_{{ $id }}">{{ $title }}</label>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
            @endisset

            {{-- 7. AMENITIES (Collapsible) --}}
            @isset($amenities)
            <div class="mb-2 border-top pt-3">
                <div class="d-flex justify-content-between align-items-center mb-2 cursor-pointer" @click="showAmenities = !showAmenities">
                    <label class="filter-label mb-0">{{ __('Amenities') }}</label>
                    <i class="bi small" :class="showAmenities ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </div>
                <div x-show="showAmenities" x-collapse>
                    <div class="pt-1">
                        @foreach($amenities as $id => $label)
                            <div class="form-check mb-1">
                                <input class="form-check-input" type="checkbox" name="amenities[]" value="{{ $id }}" id="amen_{{ $id }}" {{ is_array(request('amenities')) && in_array($id, request('amenities')) ? 'checked' : '' }}>
                                <label class="form-check-label small" for="amen_{{ $id }}">{{ $label }}</label>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
            @endisset

            <button type="submit" class="btn btn-primary w-100 py-3 rounded-4 shadow-sm fw-bold mt-4 border-0">
                <i class="bi bi-search me-2"></i>{{ __('Update Search') }}
            </button>

        </form>
    </div>
</div>
