<div class="filter-sidebar-wrapper w-100"> 
    <div class="filter-sidebar-card p-3 p-lg-4 sticky-sidebar"
        x-data="{
            priceMax: {{ request('max_price', 5000) }},
            showCategories: {{ request('category_id') ? 'true' : 'false' }},
            showModels: {{ (request('is_project_based') || request('is_subscription')) ? 'true' : 'false' }},
            showFeatures: {{ (request('is_urgent') || request('is_remote')) ? 'true' : 'false' }},
            showTags: {{ request('tag') ? 'true' : 'false' }}
        }"
    >
        {{-- Header --}}
        <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
            <h6 class="filter-heading m-0 fw-800">
                <i class="bi bi-sliders2-vertical me-2 text-primary"></i>{{ __('Filter Services') }}
            </h6>
            <a href="{{ route('services.index') }}" class="text-muted small text-decoration-none hover-link">{{ __('Reset') }}</a>
        </div>

        <form method="GET" action="{{ route(Route::currentRouteName() ?: 'services.index') }}" id="filter-form">
            
            {{-- 1. Search Keywords (Unified Input - Double Border Fixed) --}}
            <div class="mb-4">
                <label class="filter-label mb-2">{{ __('Search Service') }}</label>
                <div class="input-group unified-input">
                    <span class="input-group-text border-0 bg-transparent ps-3">
                        <i class="bi bi-search small"></i>
                    </span>
                    <input type="text" name="search" value="{{ request('search') }}"
                           class="form-control border-0 shadow-none bg-transparent" 
                           placeholder="{{ __('e.g. Logo Design...') }}">
                </div>
            </div>

            {{-- 2. Location (Unified Input - Double Border Fixed) --}}

            <div class="mb-4">
                <label class="filter-label mb-2">{{ __('Location') }}</label>
                <div class="input-group unified-input">
                    <span class="input-group-text">
                        <i class="bi bi-geo-alt"></i>
                    </span>
                    <select name="location" class="form-control form-select border-0 shadow-none bg-transparent">
                        <option value="">{{ __('Anywhere / Remote') }}</option>
                        @foreach($locations as $loc)
                            <option value="{{ $loc->id }}" {{ request('location') == $loc->id ? 'selected' : '' }}>
                                {{ $loc->title }}
                            </option>
                        @endforeach
                    </select>
                </div>
            </div>

            {{-- 3. Max Price Slider --}}
            <div class="mb-4 border-top pt-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <label class="filter-label mb-0">{{ __('Max Price') }}</label>
                    <span class="badge bg-primary text-white rounded-2 px-3">
                        $<span x-text="Number(priceMax).toLocaleString()"></span>
                    </span>
                </div>
                <input type="range" name="max_price" class="form-range custom-range" 
                       min="0" max="5000" step="50" x-model="priceMax">
                <div class="d-flex justify-content-between text-muted mt-1" style="font-size: 0.65rem; font-weight: 600;">
                    <span>$0</span>
                    <span>$5,000+</span>
                </div>
            </div>

            {{-- 4. Service Category (Collapsible Select) --}}
            <div class="mb-2 border-top pt-3">
                <div class="d-flex justify-content-between align-items-center mb-2 pointer-cursor" @click="showCategories = !showCategories">
                    <label class="filter-label mb-0 text-dark">{{ __('Service Category') }}</label>
                    <i class="bi small text-muted" :class="showCategories ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </div>
                <div x-show="showCategories" x-collapse>
                    <div class="pt-1 pb-2">
                        <select name="category_id" class="form-select filter-input shadow-none small">
                            <option value="">{{ __('All Categories') }}</option>
                            @foreach ($categories as $category)
                                <option value="{{ $category->id }}" {{ request('category_id') == $category->id ? 'selected' : '' }}>
                                    {{ $category->title }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>
            </div>

            {{-- 5. Service Model (Delivery Type) --}}
            <div class="mb-2 border-top pt-3">
                <div class="d-flex justify-content-between align-items-center mb-2 pointer-cursor" @click="showModels = !showModels">
                    <label class="filter-label mb-0 text-dark">{{ __('Service Model') }}</label>
                    <i class="bi small text-muted" :class="showModels ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </div>
                <div x-show="showModels" x-collapse>
                    <div class="pt-1 pb-2 px-1">
                        <div class="form-check mb-2">
                            <input class="form-check-input shadow-none" type="checkbox" name="is_project_based" value="1" id="model_project" {{ request('is_project_based') ? 'checked' : '' }}>
                            <label class="form-check-label small text-muted" for="model_project">{{ __('Project Based') }}</label>
                        </div>
                        <div class="form-check mb-2">
                            <input class="form-check-input shadow-none" type="checkbox" name="is_subscription" value="1" id="model_sub" {{ request('is_subscription') ? 'checked' : '' }}>
                            <label class="form-check-label small text-muted" for="model_sub">{{ __('Subscription') }}</label>
                        </div>
                    </div>
                </div>
            </div>

            {{-- 6. Service Features (Urgent/Remote) --}}
            <div class="mb-2 border-top pt-3">
                <div class="d-flex justify-content-between align-items-center mb-2 pointer-cursor" @click="showFeatures = !showFeatures">
                    <label class="filter-label mb-0 text-dark">{{ __('Service Features') }}</label>
                    <i class="bi small text-muted" :class="showFeatures ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </div>
                <div x-show="showFeatures" x-collapse>
                    <div class="pt-1 pb-2 px-1">
                        <div class="form-check mb-2">
                            <input class="form-check-input shadow-none" type="checkbox" name="is_urgent" value="1" id="feat_urgent" {{ request('is_urgent') ? 'checked' : '' }}>
                            <label class="form-check-label small text-muted" for="feat_urgent">{{ __('Express Delivery') }}</label>
                        </div>
                        <div class="form-check mb-2">
                            <input class="form-check-input shadow-none" type="checkbox" name="is_remote" value="1" id="feat_remote" {{ request('is_remote') ? 'checked' : '' }}>
                            <label class="form-check-label small text-muted" for="feat_remote">{{ __('Remote Friendly') }}</label>
                        </div>
                    </div>
                </div>
            </div>

            {{-- 7. Service Tags (Pill Style from Reference) --}}
            @isset($tags)
            <div class="mb-2 border-top pt-3">
                <div class="d-flex justify-content-between align-items-center mb-2 pointer-cursor" @click="showTags = !showTags">
                    <label class="filter-label mb-0 text-dark">{{ __('Service Tags') }}</label>
                    <i class="bi small text-muted" :class="showTags ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </div>
                <div x-show="showTags" x-collapse>
                    <div class="pt-2 d-flex flex-wrap gap-2">
                        @foreach ($tags as $tag)
                            <input type="checkbox" class="btn-check" name="tag[]" value="{{ $tag->id }}" id="tag_{{ $tag->id }}" 
                                {{ is_array(request('tag')) && in_array($tag->id, request('tag')) ? 'checked' : '' }}>
                            <label class="btn btn-outline-secondary btn-sm rounded-2 px-3 py-1" style="font-size: 0.72rem;" for="tag_{{ $tag->id }}">
                                #{{ $tag->title }}
                            </label>
                        @endforeach
                    </div>
                </div>
            </div>
            @endisset

            {{-- Submit --}}
            <button type="submit" class="btn btn-primary w-100 py-3 rounded-4 fw-semibold mt-4 border-0">
                <i class="bi bi-search me-2"></i>{{ __('Apply Filters') }}
            </button>
        </form>
    </div>
</div>
