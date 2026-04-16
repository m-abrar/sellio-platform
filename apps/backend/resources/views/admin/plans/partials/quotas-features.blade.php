<div class="card shadow-sm rounded-3 mb-4 border-0">
    <div class="card-header bg-white border-bottom">
        <h3 class="card-title font-weight-bold">Usage Limits</h3>
    </div>
    <div class="card-body">
        <div class="alert alert-light border small text-muted">
            <i class="fas fa-info-circle mr-1"></i> Leave fields empty for <strong>unlimited</strong> usage.
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label>Max Total Listings</label>
                    <input type="number" name="max_listings" class="form-control" value="{{ old('max_listings', $plan->max_listings ?? '') }}">
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label>Max Featured Listings</label>
                    <input type="number" name="max_featured_listings" class="form-control" value="{{ old('max_featured_listings', $plan->max_featured_listings ?? '') }}">
                </div>
            </div>
        </div>
    </div>
</div>

<div class="card shadow-sm rounded-3 border-0">
    <div class="card-header bg-white border-bottom">
        <h3 class="card-title font-weight-bold">Premium Privileges</h3>
    </div>
    <div class="card-body">
        <div class="form-group">
            <label>Analytics Access</label>
            <select name="analytics_access" class="form-control">
                <option value="none" {{ ($plan->analytics_access ?? '') == 'none' ? 'selected' : '' }}>None</option>
                <option value="basic" {{ ($plan->analytics_access ?? '') == 'basic' ? 'selected' : '' }}>Basic</option>
                <option value="advanced" {{ ($plan->analytics_access ?? '') == 'advanced' ? 'selected' : '' }}>Advanced</option>
            </select>
        </div>
        <div class="custom-control custom-switch mb-2">
            <input type="checkbox" class="custom-control-input" id="priority_support" name="priority_support" value="1" {{ ($plan->priority_support ?? false) ? 'checked' : '' }}>
            <label class="custom-control-label" for="priority_support">Priority Support</label>
        </div>
    </div>
</div>
