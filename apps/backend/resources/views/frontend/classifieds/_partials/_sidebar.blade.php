<div class="filter-sidebar-wrapper w-100"> 
    <div class="glass-surface p-3 p-lg-4 rounded-4 shadow-sm sticky-sidebar"
        x-data="{
            showTags: {{ request('tags') ? 'true' : 'false' }}
        }"
    >
        {{-- Header --}}
        <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
            <h6 class="filter-heading m-0 fw-800">
                <i class="bi bi-funnel-fill me-2 text-primary"></i>{{ __('Refine Marketplace') }}
            </h6>
            {{-- Improved Reset: Points to current URL without query strings --}}
            <a href="{{ url()->current() }}" class="text-muted small text-decoration-none hover-link">
                {{ __('Reset') }}
            </a>
        </div>

        <form method="GET" action="{{ url()->current() }}" id="classified-filter-form">
            
            {{-- 1. Category Filter --}}
            <div class="mb-4">
                <label class="filter-label mb-2">{{ __('Category') }}</label>
                <div class="input-group unified-input">
                    <span class="input-group-text border-0 bg-transparent ps-3">
                        <i class="bi bi-grid small"></i>
                    </span>
                    <select name="category" class="form-control form-select border-0 shadow-none bg-transparent">
                        <option value="">{{ __('All Categories') }}</option>
                        @foreach ($categories ?? [] as $category)
                            <option value="{{ $category->id }}" {{ request('category') == $category->id ? 'selected' : '' }}>
                                {{ $category->title }}
                            </option>
                        @endforeach
                    </select>
                </div>
            </div>

            {{-- 2. Listing Type --}}
            <div class="mb-4">
                <label class="filter-label mb-2">{{ __('Deal Type') }}</label>
                <div class="input-group unified-input">
                    <span class="input-group-text border-0 bg-transparent ps-3">
                        <i class="bi bi-tag small"></i>
                    </span>
                    <select name="type" class="form-control form-select border-0 shadow-none bg-transparent">
                        <option value="">{{ __('All Types') }}</option>
                        @foreach ($types ?? [] as $type)
                            <option value="{{ $type->id }}" {{ request('type') == $type->id ? 'selected' : '' }}>
                                {{ $type->title }}
                            </option>
                        @endforeach
                    </select>
                </div>
            </div>

            {{-- 3. Location --}}
            <div class="mb-4">
                <label class="filter-label mb-2">{{ __('Location') }}</label>
                <div class="input-group unified-input">
                    <span class="input-group-text border-0 bg-transparent ps-3">
                        <i class="bi bi-geo-alt small"></i>
                    </span>
                    <select name="location" class="form-control form-select border-0 shadow-none bg-transparent">
                        <option value="">{{ __('Everywhere') }}</option>
                        @foreach ($locations ?? [] as $location)
                            <option value="{{ $location->id }}" {{ request('location') == $location->id ? 'selected' : '' }}>
                                {{ $location->title }}
                            </option>
                        @endforeach
                    </select>
                </div>
            </div>

            {{-- 4. Popular Tags (Collapsible) --}}
            @if(isset($tags) && count($tags) > 0)
            <div class="mb-2 border-top pt-3">
                <div class="d-flex justify-content-between align-items-center mb-2 pointer-cursor" 
                     @click="showTags = !showTags" 
                     role="button" 
                     :aria-expanded="showTags">
                    <label class="filter-label mb-0 text-dark" style="cursor: pointer;">{{ __('Condition/Tags') }}</label>
                    <i class="bi small text-muted" :class="showTags ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </div>
                <div x-show="showTags" x-collapse x-cloak>
                    <div class="pt-1 pb-2">
                        @foreach ($tags as $tag)
                            <div class="form-check mb-2">
                                {{-- FIXED: name="tags[]" matches request('tags') --}}
                                <input class="form-check-input shadow-none" type="checkbox" name="tags[]" value="{{ $tag->id }}" id="tag-{{ $tag->id }}"
                                    {{ is_array(request('tags')) && in_array($tag->id, request('tags')) ? 'checked' : '' }}>
                                <label class="form-check-label small text-muted" for="tag-{{ $tag->id }}">
                                    {{ $tag->title }}
                                </label>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
            @endif

            {{-- Submit Button --}}
            <button type="submit" class="btn btn-primary w-100 py-3 rounded-4 shadow-sm fw-800 mt-4 border-0">
                <i class="bi bi-search me-2"></i>{{ __('Apply Filters') }}
            </button>
        </form>
    </div>
</div>
