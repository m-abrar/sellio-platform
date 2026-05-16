<div class="filter-sidebar-wrapper w-100">
    <div class="glass-surface p-3 p-lg-4 rounded-4 shadow-sm sticky-sidebar"
        x-data="{
            priceType: '{{ request('price') ?: '' }}',
            showTags: {{ request('tags') ? 'true' : 'false' }}
        }"
    >
        <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
            <h6 class="filter-heading m-0 fw-800">
                <i class="bi bi-funnel-fill me-2 text-primary"></i>{{ __('Filter Events') }}
            </h6>
            <a href="{{ route('events.index') }}" class="text-muted small text-decoration-none hover-link">{{ __('Clear') }}</a>
        </div>
        
        <form method="GET" action="{{ route('events.index') }}" id="event-filter-form">
            
            {{-- Search Keyword (Using Unified Input System) --}}
            <div class="mb-4">
                <label class="filter-label mb-2">{{ __('Keyword') }}</label>
                <div class="input-group unified-input">
                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                    <input type="text" name="q" class="form-control" placeholder="{{ __('Event name...') }}" value="{{ request('q') }}">
                </div>
            </div>

            {{-- 1. FORMAT TABS (Updated to Unified Select) --}}
            <div class="mb-4">
                <label class="filter-label mb-2">{{ __('Event Format') }}</label>
                <select name="type" class="form-select filter-input shadow-none">
                    <option value="">{{ __('All Formats') }}</option>
                    @foreach($types as $type)
                        <option value="{{ $type->id }}" {{ request('type') == $type->id ? 'selected' : '' }}>{{ $type->title }}</option>
                    @endforeach
                </select>
            </div>

            {{-- 2. PRICE TOGGLE TABS --}}
            <div class="mb-4">
                <label class="filter-label mb-2">{{ __('Access') }}</label>
                <div class="btn-group w-100 bg-light p-1 rounded-3" role="group">
                    <input type="radio" class="btn-check" name="price" value="" id="p_any" x-model="priceType">
                    <label class="btn btn-filter-tab" :class="priceType === '' ? 'btn-primary text-white shadow-sm' : 'text-muted'" for="p_any">{{ __('Any') }}</label>

                    <input type="radio" class="btn-check" name="price" value="free" id="p_free" x-model="priceType">
                    <label class="btn btn-filter-tab" :class="priceType === 'free' ? 'btn-primary text-white shadow-sm' : 'text-muted'" for="p_free">{{ __('Free') }}</label>

                    <input type="radio" class="btn-check" name="price" value="paid" id="p_paid" x-model="priceType">
                    <label class="btn btn-filter-tab" :class="priceType === 'paid' ? 'btn-primary text-white shadow-sm' : 'text-muted'" for="p_paid">{{ __('Paid') }}</label>
                </div>
            </div>

            {{-- 3. DATE RANGE (Using Unified Inputs) --}}
            <div class="mb-4">
                <label class="filter-label mb-2">{{ __('When') }}</label>
                <div class="row g-2">
                    <div class="col-12 mb-2">
                        <input type="text" name="start_date" placeholder="{{ __('Start Date') }}" value="{{ request('start_date') }}" class="form-control filter-input event-date-picker">
                    </div>
                    <div class="col-12">
                        <input type="text" name="end_date" placeholder="{{ __('End Date') }}" value="{{ request('end_date') }}" class="form-control filter-input event-date-picker">
                    </div>
                </div>
            </div>

            {{-- 4. CATEGORY --}}
            <div class="mb-4 pt-2 border-top">
                <label class="filter-label mb-2">{{ __('Category') }}</label>
                <select name="category" class="form-select filter-input shadow-none">
                    <option value="">{{ __('All Categories') }}</option>
                    @foreach($categories as $cat)
                        <option value="{{ $cat->id }}" {{ request('category') == $cat->id ? 'selected' : '' }}>{{ $cat->title }}</option>
                    @endforeach
                </select>
            </div>

            {{-- 5. POPULAR TAGS (Collapsible) --}}
            <div class="mb-2 border-top pt-3">
                <div class="d-flex justify-content-between align-items-center mb-2 pointer-cursor" @click="showTags = !showTags">
                    <label class="filter-label mb-0 text-dark">{{ __('Popular Tags') }}</label>
                    <i class="bi small" :class="showTags ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </div>
                <div x-show="showTags" x-collapse>
                    <div class="tag-list-scrollable custom-scrollbar px-1" style="max-height: 180px; overflow-y: auto;">
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
                <i class="bi bi-calendar-event me-2"></i>{{ __('Update Results') }}
            </button>
        </form>
    </div>
</div>