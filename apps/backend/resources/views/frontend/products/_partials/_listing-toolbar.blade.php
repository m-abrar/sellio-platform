<div class="d-flex justify-content-between align-items-center glass-surface p-3 rounded-3 border bg-white shadow-sm">
    <div class="d-flex align-items-center">
        <label class="me-2 text-muted small d-none d-md-block text-nowrap" for="product-sort">{{ __('Sort By:') }}</label>
        <select id="product-sort"
                class="form-select form-select-sm border-0 bg-light rounded-pill px-3"
                aria-label="{{ __('Sort products') }}"
                onchange="window.location.href = this.value">
            <option value="{{ request()->fullUrlWithQuery(['sort_by' => 'latest']) }}" @selected(request('sort_by', 'latest') == 'latest')>{{ __('Newest') }}</option>
            <option value="{{ request()->fullUrlWithQuery(['sort_by' => 'price_low']) }}" @selected(request('sort_by') == 'price_low')>{{ __('Price: Low to High') }}</option>
            <option value="{{ request()->fullUrlWithQuery(['sort_by' => 'price_high']) }}" @selected(request('sort_by') == 'price_high')>{{ __('Price: High to Low') }}</option>
            <option value="{{ request()->fullUrlWithQuery(['sort_by' => 'rating']) }}" @selected(request('sort_by') == 'rating')>{{ __('Top Rated') }}</option>
        </select>
    </div>

    <div class="view-modes d-none d-md-flex gap-2" aria-hidden="true">
        <span class="btn btn-sm btn-light rounded-circle active"><i class="bi bi-grid-3x3-gap"></i></span>
        <span class="btn btn-sm btn-light rounded-circle"><i class="bi bi-list-task"></i></span>
    </div>
</div>
