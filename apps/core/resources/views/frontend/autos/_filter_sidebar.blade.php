@php
    // Get the current request parameters to retain selected filter values
    $currentCategory = request('category');
    $currentLocation = request('location');
    $currentTransactionType = request('transaction');
    $currentBrand = request('make');
    $currentModel = request('model');
    $currentTransmission = request('transmission');
    $maxAllowedPrice = $maxAllowedPrice ?? 200000; // Fallback
@endphp

<div class="filter-sidebar-wrapper w-100">
    <div class="glass-surface p-3 p-lg-4 rounded-4 shadow-sm sticky-sidebar"
        x-data="{
            priceMax: {{ request('price_max', $maxAllowedPrice) }}, 
            transmission: '{{ $currentTransmission ?: '' }}', 
            transaction: '{{ $currentTransactionType ?: '' }}',
            showAdvanced: {{ request('year_min') || request('price_min') ? 'true' : 'false' }},
            showTags: {{ request('tags') ? 'true' : 'false' }},

            init() {
                this.transmission = (this.transmission || '').trim();
                this.transaction = (this.transaction || '').trim();
            }
        }"
    >
        <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
            <h6 class="filter-heading m-0 fw-800">
                <i class="bi bi-funnel-fill me-2 text-primary"></i>{{ __('Refine Search') }}
            </h6>
            <a href="{{ route(Route::currentRouteName()) }}" class="text-muted small text-decoration-none hover-link">{{ __('Reset') }}</a>
        </div>
        
        <form method="GET" action="{{ route(Route::currentRouteName()) }}" id="filter-form">
            {{-- State preservation --}}
            @if(request()->filled('q')) <input type="hidden" name="q" value="{{ request('q') }}"> @endif
            <input type="hidden" name="sort" value="{{ request('sort') }}">

            {{-- 1. TRANSACTION TYPE TABS --}}
            <div class="mb-4">
                <label class="filter-label mb-2">{{ __('Availability') }}</label>
                <div class="btn-group w-100 bg-light p-1 rounded-3" role="group">
                    <input type="radio" class="btn-check" name="transaction" value="" id="t_any" x-model="transaction">
                    <label class="btn btn-filter-tab" :class="transaction === '' ? 'btn-primary text-white shadow-sm' : 'text-muted'" for="t_any">{{ __('Any') }}</label>

                    @foreach ($transactionType as $tType)
                        <input type="radio" class="btn-check" name="transaction" value="{{ $tType->id }}" id="t_{{ $tType->id }}" x-model="transaction">
                        <label class="btn btn-filter-tab" :class="transaction == '{{ $tType->id }}' ? 'btn-primary text-white shadow-sm' : 'text-muted'" for="t_{{ $tType->id }}">{{ $tType->title }}</label>
                    @endforeach
                </div>
            </div>

            {{-- 2. DYNAMIC PRICE SLIDER --}}
            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <label class="filter-label mb-0 text-muted">{{ __('Budget Max') }}</label>
                    <span class="badge bg-primary rounded-pill shadow-sm">
                        $<span x-text="Number(priceMax).toLocaleString()"></span>
                    </span>
                </div>
                <input type="range" name="price_max" class="form-range custom-range" 
                       min="1000" max="{{ $maxAllowedPrice }}" step="1000" x-model="priceMax">
            </div>

            {{-- 3. CORE DROPDOWNS (Unified Input Styling) --}}
            <div class="mb-3 pt-2 border-top">
                <label class="filter-label mb-1">{{ __('Location') }}</label>
                <select name="location" class="form-select filter-input shadow-none">
                    <option value="">{{ __('All Locations') }}</option>
                    @foreach($locations as $loc)
                        <option value="{{ $loc->id }}" {{ $currentLocation == $loc->id ? 'selected' : '' }}>{{ $loc->title }}</option>
                    @endforeach
                </select>
            </div>

            <div class="row g-2 mb-4">
                <div class="col-6">
                    <label class="filter-label mb-1">{{ __('Brand') }}</label>
                    <select name="make" class="form-select filter-input shadow-none">
                        <option value="">Any</option>
                        @foreach($brands as $brand)
                            <option value="{{ $brand->title }}" {{ $currentBrand == $brand->title ? 'selected' : '' }}>{{ $brand->title }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="col-6">
                    <label class="filter-label mb-1">{{ __('Category') }}</label>
                    <select name="category" class="form-select filter-input shadow-none">
                        <option value="">Any</option>
                        @foreach($categories as $cat)
                            <option value="{{ $cat->id }}" {{ $currentCategory == $cat->id ? 'selected' : '' }}>{{ $cat->title }}</option>
                        @endforeach
                    </select>
                </div>
            </div>

            {{-- 4. GEARBOX TABS --}}
            <div class="mb-4 pt-2 border-top">
                <label class="filter-label mb-2">{{ __('Gearbox') }}</label>
                <div class="btn-group w-100 bg-light p-1 rounded-3" role="group">
                    <input type="radio" class="btn-check" name="transmission" value="" id="tm_any" x-model="transmission">
                    <label class="btn btn-filter-tab" :class="transmission === '' ? 'btn-primary text-white shadow-sm' : 'text-muted'" for="tm_any">{{ __('Any') }}</label>
                    
                    @foreach ($transmissionOptions as $option)
                        <input type="radio" class="btn-check" name="transmission" value="{{ $option }}" id="tm_{{ strtolower($option) }}" x-model="transmission">
                        <label class="btn btn-filter-tab" :class="transmission === '{{ $option }}' ? 'btn-primary text-white shadow-sm' : 'text-muted'" for="tm_{{ strtolower($option) }}">{{ $option }}</label>
                    @endforeach
                </div>
            </div>

            {{-- 5. FEATURES (Collapsible) --}}
            <div class="mb-2 border-top pt-3">
                <div class="d-flex justify-content-between align-items-center mb-2 pointer-cursor" @click="showTags = !showTags">
                    <label class="filter-label mb-0 text-dark">{{ __('Features') }}</label>
                    <i class="bi small" :class="showTags ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </div>
                <div x-show="showTags" x-collapse>
                    <div class="pt-2">
                        @foreach($tags as $tag)
                            <div class="form-check mb-2">
                                <input class="form-check-input shadow-none" type="checkbox" name="tags[]" value="{{ $tag->id }}" id="tag_{{ $tag->id }}" {{ is_array(request('tags')) && in_array($tag->id, request('tags')) ? 'checked' : '' }}>
                                <label class="form-check-label small text-muted" for="tag_{{ $tag->id }}">{{ $tag->title }}</label>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>

            {{-- Submit Button --}}
            <button type="submit" class="btn btn-primary w-100 py-3 rounded-4 shadow-sm fw-800 mt-4 border-0">
                <i class="bi bi-search me-2"></i>{{ __('Apply Filters') }}
            </button>
        </form>
    </div>
</div>
