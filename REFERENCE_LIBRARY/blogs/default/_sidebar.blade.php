<div class="filter-sidebar-wrapper w-100"> 
    <div class="glass-surface p-3 p-lg-4 rounded-4 shadow-sm sticky-sidebar"
        x-data="{
            showTags: {{ request('tags') ? 'true' : 'false' }}
        }"
    >
        {{-- Header --}}
        <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
            <h6 class="filter-heading m-0 fw-800">
                <i class="bi bi-funnel-fill me-2 text-primary"></i>{{ __('Filter Articles') }}
            </h6>
            <a href="{{ url()->current() }}" class="text-muted small text-decoration-none hover-link">
                {{ __('Reset') }}
            </a>
        </div>

        <form method="GET" action="{{ url()->current() }}" id="blog-filter-form">
            
            {{-- 1. Keyword Search --}}
            <div class="mb-4">
                <label class="filter-label mb-2">{{ __('Search') }}</label>
                <div class="input-group unified-input">
                    <span class="input-group-text border-0 bg-transparent ps-3">
                        <i class="bi bi-search small"></i>
                    </span>
                    <input type="text" name="search" value="{{ request('search') }}" 
                           class="form-control border-0 shadow-none bg-transparent" 
                           placeholder="{{ __('Search topics...') }}">
                </div>
            </div>

            {{-- 2. Category Filter --}}
            <div class="mb-4">
                <label class="filter-label mb-2">{{ __('Category') }}</label>
                <div class="input-group unified-input">
                    <span class="input-group-text border-0 bg-transparent ps-3">
                        <i class="bi bi-grid small"></i>
                    </span>
                    <select name="category" class="form-control form-select border-0 shadow-none bg-transparent">
                        <option value="">{{ __('All Categories') }}</option>
                        @foreach ($categories ?? [] as $category)
                            <option value="{{ $category->slug }}" {{ request('category') == $category->slug ? 'selected' : '' }}>
                                {{ $category->title }}
                            </option>
                        @endforeach
                    </select>
                </div>
            </div>

            {{-- 3. Sort Order --}}
            <div class="mb-4">
                <label class="filter-label mb-2">{{ __('Sort By') }}</label>
                <div class="input-group unified-input">
                    <span class="input-group-text border-0 bg-transparent ps-3">
                        <i class="bi bi-sort-down small"></i>
                    </span>
                    <select name="sort" class="form-control form-select border-0 shadow-none bg-transparent">
                        <option value="latest" {{ request('sort') == 'latest' ? 'selected' : '' }}>{{ __('Latest') }}</option>
                        <option value="popular" {{ request('sort') == 'popular' ? 'selected' : '' }}>{{ __('Most Viewed') }}</option>
                        <option value="oldest" {{ request('sort') == 'oldest' ? 'selected' : '' }}>{{ __('Oldest') }}</option>
                    </select>
                </div>
            </div>

            {{-- 4. Popular Tags (Collapsible) --}}
            @if(isset($tags) && count($tags) > 0)
            <div class="mb-2 border-top pt-3">
                <div class="d-flex justify-content-between align-items-center mb-2 pointer-cursor" 
                     @click="showTags = !showTags" 
                     role="button">
                    <label class="filter-label mb-0 text-dark" style="cursor: pointer;">{{ __('Topic Tags') }}</label>
                    <i class="bi small text-muted" :class="showTags ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </div>
                <div x-show="showTags" x-collapse x-cloak>
                    <div class="pt-1 pb-2">
                        @foreach ($tags as $tag)
                            <div class="form-check mb-2">
                                <input class="form-check-input shadow-none" type="checkbox" name="tags[]" value="{{ $tag->slug }}" id="tag-{{ $tag->id }}"
                                    {{ is_array(request('tags')) && in_array($tag->slug, request('tags')) ? 'checked' : '' }}>
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
                <i class="bi bi-filter me-2"></i>{{ __('Update Feed') }}
            </button>
        </form>
    </div>
</div>