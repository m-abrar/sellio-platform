{{-- Filter Protocol --}}
<div class="card registry-card-premium registry-filter-card select2-premium mb-4">
    <div class="card-body">
        <form method="GET" action="{{ route('admin.plans.index') }}">
            <div class="row align-items-end">
                <div class="col-md-5">
                    <label class="form-label-premium">Search Identifier</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-search text-xs"></i></span>
                        </div>
                        <input type="text" name="name" class="form-control" 
                               placeholder="Filter by tier name or label..." value="{{ request('name') }}">
                    </div>
                </div>
                <div class="col-md-4">
                    <label class="form-label-premium">Billing Cycle</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-calendar-alt text-xs"></i></span>
                        </div>
                        <select name="billing_period" class="form-control select2">
                            <option value="">All Temporal Cycles</option>
                            <option value="monthly" {{ request('billing_period') == 'monthly' ? 'selected' : '' }}>Monthly Tiers</option>
                            <option value="annually" {{ request('billing_period') == 'annually' ? 'selected' : '' }}>Annual Tiers</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="d-flex align-items-center justify-content-end" style="gap: 12px;">
                        <button type="submit" class="btn-filter-premium flex-grow-1">
                            <i class="fas fa-sync-alt mr-1"></i> APPLY
                        </button>
                        <a href="{{ route('admin.plans.index') }}" class="btn-reset-premium" data-toggle="tooltip" title="Reset Filters">
                            <i class="fas fa-undo text-danger"></i>
                        </a>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
