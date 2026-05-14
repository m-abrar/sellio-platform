{{--
    Administrative Financial Module: Subscription Lifecycle Filter
    
    This component provides a granular query interface for the platform's 
    active subscription registry. It orchestrates the filtration of 
    subscriber records based on user identity and lifecycle status 
    (active, trial, past due, etc.), ensuring efficient auditing and 
    moderation of the platform's recurring revenue streams.
    
    @context Financial Management - Subscription Orchestration
--}}
<div class="card registry-card-premium registry-filter-card select2-premium mb-4">
    <div class="card-body">
        <form method="GET" action="{{ route('admin.subscriptions.index') }}">
            <div class="row align-items-end">
                <div class="col-md-4">
                    <label class="form-label-premium">{{ __('Subscriber Identifier') }}</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-search text-xs"></i></span>
                        </div>
                        <input type="text" name="user" class="form-control" 
                               placeholder="{{ __('Name or email address...') }}" value="{{ request('user') }}">
                    </div>
                </div>
                <div class="col-md-4">
                    <label class="form-label-premium">{{ __('Lifecycle Status') }}</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-filter text-xs"></i></span>
                        </div>
                        <select name="status" class="form-control select2">
                            <option value="">{{ __('All Lifecycle States') }}</option>
                            @foreach(['active' => __('Active Access'), 'on_trial' => __('Trial Period'), 'past_due' => __('Payment Due'), 'cancelled' => __('Cancelled'), 'expired' => __('Terminated')] as $val => $label)
                                <option value="{{ $val }}" {{ request('status') == $val ? 'selected' : '' }}>{{ $label }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="d-flex align-items-center justify-content-end gap-12">
                        <button type="submit" class="btn-filter-premium flex-grow-1">
                            <i class="fas fa-sync-alt mr-1"></i> {{ __('REFRESH') }}
                        </button>
                        <a href="{{ route('admin.subscriptions.index') }}" class="btn-reset-premium" data-toggle="tooltip" title="{{ __('Reset Filters') }}">
                            <i class="fas fa-undo text-danger"></i>
                        </a>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
