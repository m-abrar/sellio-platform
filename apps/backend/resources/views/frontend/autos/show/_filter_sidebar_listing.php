<div class="glass-surface p-4 filter-sidebar">
    <h5 class="fw-bold mb-3" style="color: var(--primary-color);">Search Filters</h5>

    <form method="GET" action="{{ route('autos.index') }}">
        <div class="mb-3">
            <label for="makeSelect" class="form-label small fw-semibold">Make</label>
            <select id="makeSelect" name="make" class="form-select form-select-sm">
                <option>Any</option>
                <option>Toyota</option>
                <option>Honda</option>
                <option>Tesla</option>
            </select>
        </div>

        <div class="mb-3">
            <label class="form-label small fw-semibold">Year Range</label>
            <input type="number" name="min_year" class="form-control form-control-sm mb-1" placeholder="Min Year">
            <input type="number" name="max_year" class="form-control form-control-sm" placeholder="Max Year">
        </div>

        <div class="mb-4">
            <label class="form-label small fw-semibold">Transmission</label>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="trans" id="auto" value="automatic" checked>
                <label class="form-check-label small" for="auto">Automatic</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="trans" id="manual" value="manual">
                <label class="form-check-label small" for="manual">Manual</label>
            </div>
        </div>

        <button type="submit" class="btn btn-sm text-white w-100 btn-primary">
            Apply Filters
        </button>
    </form>
</div>