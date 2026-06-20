{{--
    Administrative Financial Component: Plan Entitlement & Quota Orchestration
    
    This component provides the primary interface for managing resource 
    allocation and feature entitlements within a subscription tier. It 
    orchestrates the configuration of asset limits (listings), priority 
    slots (featured), analytics access depth, and premium service perks, 
    ensuring granular value differentiation across the platform's 
    monetization tiers.
    
    @context Financial Management
    @variables Plan $plan The plan model instance.
--}}
<div class="card card-premium mb-4">
    <div class="card-header bg-white border-0 py-4 px-4">
        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
            <i class="fas fa-list-ol mr-2 text-primary opacity-50"></i> {{ __('Allocation Quotas') }}
        </h3>
    </div>
    <div class="card-body p-4">
        <div class="alert bg-light border-0 rounded-xl p-3 mb-4 d-flex align-items-center">
            <i class="fas fa-info-circle text-primary mr-3 fa-lg"></i>
            <span class="smallest font-weight-bold text-muted uppercase letter-spacing-1">{!! __('Leave fields empty to designate :unlimited resource allocation.', ['unlimited' => '<strong>' . __('Unlimited') . '</strong>']) !!}</span>
        </div>
        
        <div class="row">
            <div class="col-md-6">
                <div class="form-group mb-0">
                    <label class="small font-weight-bold text-secondary mb-2 text-uppercase ls-0-5">{{ __('Max Total Assets') }}</label>
                    <div class="input-group border rounded p-1 shadow-xs bg-white">
                        <div class="input-group-prepend border-0">
                            <span class="input-group-text bg-white border-0"><i class="fas fa-th-list text-primary"></i></span>
                        </div>
                        <input type="number" name="max_listings" class="form-control border-0" value="{{ old('max_listings', $plan->max_listings ?? '') }}" placeholder="∞">
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group mb-0">
                    <label class="small font-weight-bold text-secondary mb-2 text-uppercase ls-0-5">{{ __('Max Priority Slots') }}</label>
                    <div class="input-group border rounded p-1 shadow-xs bg-white">
                        <div class="input-group-prepend border-0">
                            <span class="input-group-text bg-white border-0"><i class="fas fa-star text-warning"></i></span>
                        </div>
                        <input type="number" name="max_featured_listings" class="form-control border-0" value="{{ old('max_featured_listings', $plan->max_featured_listings ?? '') }}" placeholder="∞">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="card card-premium">
    <div class="card-header bg-white border-0 py-4 px-4">
        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
            <i class="fas fa-award mr-2 text-primary opacity-50"></i> {{ __('Premium Entitlements') }}
        </h3>
    </div>
    <div class="card-body p-4">
        <div class="form-group mb-4">
            <label class="small font-weight-bold text-secondary mb-2 text-uppercase ls-0-5">{{ __('Analytics Depth') }}</label>
            <select name="analytics_access" class="form-control custom-select shadow-xs rounded-10">
                <option value="none" {{ ($plan->analytics_access ?? '') == 'none' ? 'selected' : '' }}>{{ __('Disabled (No Access)') }}</option>
                <option value="basic" {{ ($plan->analytics_access ?? '') == 'basic' ? 'selected' : '' }}>{{ __('Standard (Basic Metrics)') }}</option>
                <option value="advanced" {{ ($plan->analytics_access ?? '') == 'advanced' ? 'selected' : '' }}>{{ __('Advanced (Full Access)') }}</option>
            </select>
        </div>
        
        <div class="bg-light p-3 rounded-xl border">
            <div class="custom-control custom-switch custom-switch-premium">
                <input type="checkbox" class="custom-control-input" id="priority_support" name="priority_support" value="1" {{ ($plan->priority_support ?? false) ? 'checked' : '' }}>
                <label class="custom-control-label font-weight-bold text-dark smallest uppercase letter-spacing-1 pt-2-p" for="priority_support">{{ __('Dedicated Priority Support') }}</label>
            </div>
        </div>
    </div>
</div>
