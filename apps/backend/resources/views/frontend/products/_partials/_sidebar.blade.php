<div class="filter-sidebar-wrapper w-100"> 
    <div class="filter-sidebar-card p-3 p-lg-4 sticky-sidebar mobile-flush"
        x-data="{
            showBrands: true,
            showTags: {{ request('tags') ? 'true' : 'false' }},
            showInventory: true,
            minPrice: {{ request('min_price', 0) }},
            maxPrice: {{ request('max_price', $maxAllowedPrice ?? 2000) }},
            maxLimit: {{ $maxAllowedPrice ?? 2000 }}
        }"
    >
        {{-- Header --}}
        <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
            <h6 class="filter-heading m-0 fw-800">
                <i class="bi bi-funnel-fill me-2 text-primary"></i>{{ __('Filter Results') }}
            </h6>
            <a href="{{ url()->current() }}" class="text-muted small text-decoration-none hover-link">{{ __('Reset') }}</a>
        </div>

        <form method="GET" action="{{ url()->current() }}" id="shop-filter-form">
            {{-- 1. Search Keywords (Unified Input) --}}
            <div class="mb-4">
                <label class="filter-label mb-2">{{ __('Search Keywords') }}</label>
                <div class="input-group unified-input">
                    <span class="input-group-text">
                        <i class="bi bi-search"></i>
                    </span>
                    <input type="text" name="q" value="{{ request('q', request('keyword')) }}"
                           class="form-control"
                           placeholder="{{ __('Search title or description…') }}">
                </div>
            </div>

            {{-- 2. Department / Category (Unified Select) --}}
            <div class="mb-4">
                <label class="filter-label mb-2">{{ __('Department') }}</label>
                <div class="input-group unified-input">
                    <span class="input-group-text">
                        <i class="bi bi-grid-1x2"></i>
                    </span>
                    <select name="category" class="form-control form-select border-0 shadow-none bg-transparent">
                        <option value="">{{ __('All Categories') }}</option>
                        @foreach ($categories as $category)
                            <option value="{{ $category->id }}" {{ request('category') == $category->id ? 'selected' : '' }}>
                                {{ $category->title }}
                            </option>
                        @endforeach
                    </select>
                </div>
            </div>

            {{-- 3. Dual-Pointer Price Range Slider --}}
            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <label class="filter-label mb-0">{{ __('Price Range') }}</label>
                    <span class="badge bg-primary rounded-2 px-3">
                        {{ setting('currency_symbol', '$') }}<span x-text="Number(minPrice).toLocaleString()"></span> - {{ setting('currency_symbol', '$') }}<span x-text="Number(maxPrice).toLocaleString()"></span>
                    </span>
                </div>

                <div class="dual-range-container position-relative mt-4 mb-3">
                    {{-- Visual Background Track --}}
                    <div class="slider-track"></div>
                    {{-- Active Range Fill --}}
                    <div class="slider-fill" 
                         :style="`left: ${(minPrice / maxLimit) * 100}%; right: ${100 - (maxPrice / maxLimit) * 100}%`"
                    ></div>

                    <input type="range" name="min_price" 
                           min="0" :max="maxLimit" step="1" 
                           x-model="minPrice"
                           @input="if(Number(minPrice) > Number(maxPrice)) minPrice = maxPrice"
                           class="range-input">

                    <input type="range" name="max_price" 
                           min="0" :max="maxLimit" step="1" 
                           x-model="maxPrice"
                           @input="if(Number(maxPrice) < Number(minPrice)) maxPrice = minPrice"
                           class="range-input">
                </div>
            </div>

            {{-- 4. Inventory Status (Switches) --}}
            <div class="mb-2 border-top pt-3">
                <div class="d-flex justify-content-between align-items-center mb-2 pointer-cursor" @click="showInventory = !showInventory">
                    <label class="filter-label mb-0 text-dark">{{ __('Availability') }}</label>
                    <i class="bi small text-muted" :class="showInventory ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </div>
                <div x-show="showInventory" x-collapse>
                    <div class="pt-1 pb-2">
                        <div class="form-check form-switch mb-2">
                            <input class="form-check-input shadow-none" type="checkbox" name="on_sale" id="onSale" value="1" {{ request('on_sale') ? 'checked' : '' }}>
                            <label class="form-check-label small text-muted fw-600" for="onSale">
                                {{ __('Sale Items') }} <span class="badge bg-danger ms-1 animate-pulse tiny">{{ __('HOT') }}</span>
                            </label>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input shadow-none" type="checkbox" name="in_stock" id="inStock" value="1" {{ request('in_stock') ? 'checked' : '' }}>
                            <label class="form-check-label small text-muted fw-600" for="inStock">{{ __('In Stock Only') }}</label>
                        </div>
                    </div>
                </div>
            </div>

            {{-- 5. Brands (Checkboxes) --}}
            <div class="mb-2 border-top pt-3">
                <div class="d-flex justify-content-between align-items-center mb-2 pointer-cursor" @click="showBrands = !showBrands">
                    <label class="filter-label mb-0 text-dark">{{ __('Brands') }}</label>
                    <i class="bi small text-muted transition-all" :class="showBrands ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </div>
                <div x-show="showBrands" x-collapse>
                    <div class="pt-1 pb-2 custom-scrollbar scrollable-list">
                        @foreach ($brands as $brand)
                            <div class="form-check mb-2 last-child-border-0">
                                <input class="form-check-input shadow-none pointer-cursor" type="checkbox" name="brand[]" value="{{ $brand->id }}" id="brand-{{ $brand->id }}"
                                    {{ is_array(request('brand')) && in_array($brand->id, request('brand')) ? 'checked' : '' }}>
                                <label class="form-check-label small fw-600 text-muted pointer-cursor" for="brand-{{ $brand->id }}">
                                    {{ $brand->title }}
                                </label>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>

            {{-- 6. Attributes (Pill Style) --}}
            <div class="mb-2 border-top pt-3">
                <div class="d-flex justify-content-between align-items-center mb-2 pointer-cursor" @click="showTags = !showTags">
                    <label class="filter-label mb-0 text-dark">{{ __('Attributes') }}</label>
                    <i class="bi small text-muted transition-all" :class="showTags ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </div>
                <div x-show="showTags" x-collapse>
                    <div class="d-flex flex-wrap gap-2 pt-2">
                        @foreach ($tags as $tag)
                            <input type="checkbox" class="btn-check" name="tags[]" value="{{ $tag->id }}" id="tag-{{ $tag->id }}"
                                {{ is_array(request('tags')) && in_array($tag->id, request('tags')) ? 'checked' : '' }}>
                            <label class="btn btn-outline-secondary btn-sm rounded-2 px-3 py-1" style="font-size: 0.72rem;" for="tag-{{ $tag->id }}">
                                {{ $tag->title }}
                            </label>
                        @endforeach
                    </div>
                </div>
            </div>

            {{-- Action Button --}}
            <button type="submit" class="btn btn-primary w-100 py-3 rounded-4 fw-semibold mt-4 border-0">
                <i class="bi bi-funnel me-2"></i>{{ __('Apply Changes') }}
            </button>
        </form>
    </div>
</div>
