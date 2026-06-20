{{--
    Administrative Financial Module: Payment Transaction Filter
    
    This component provides a granular query interface for the financial 
    ledger. It orchestrates the filtration of transaction records based 
    on client identity, settlement status (pending, completed, etc.), 
    and Payment Method (gateways), ensuring efficient auditing 
    and moderation of the platform's revenue streams.
    
    @context Financial Management - Ledger Auditing
--}}
<div class="card registry-card-premium registry-filter-card select2-premium mb-4">
    <div class="card-body">
        <form method="GET" action="{{ route('admin.payments.index') }}">
            <div class="row align-items-end">
                <div class="col-md-3">
                    <label class="form-label-premium">Client Info</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-search text-xs"></i></span>
                        </div>
                        <input type="text" name="user_name" class="form-control" placeholder="Name or Identity" value="{{ request('user_name') }}">
                    </div>
                </div>
                <div class="col-md-3">
                    <label class="form-label-premium">Settlement Status</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-traffic-light text-xs"></i></span>
                        </div>
                        <select name="status" class="form-control select2">
                            <option value="">All Lifecycle States</option>
                            <option value="pending" {{ request('status') == 'pending' ? 'selected' : '' }}>Awaiting Capture</option>
                            <option value="completed" {{ request('status') == 'completed' ? 'selected' : '' }}>Settled</option>
                            <option value="failed" {{ request('status') == 'failed' ? 'selected' : '' }}>Terminated</option>
                            <option value="refunded" {{ request('status') == 'refunded' ? 'selected' : '' }}>Reversed</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-3">
                    <label class="form-label-premium">Payment Method</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-network-wired text-xs"></i></span>
                        </div>
                        <select name="method" class="form-control select2">
                            <option value="">All Gateways</option>
                            <option value="stripe" {{ request('method') == 'stripe' ? 'selected' : '' }}>Stripe</option>
                            <option value="paypal" {{ request('method') == 'paypal' ? 'selected' : '' }}>PayPal Express</option>
                            <option value="manual" {{ request('method') == 'manual' ? 'selected' : '' }}>Manual Settlement</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="d-flex align-items-center justify-content-end gap-12">
                        <button type="submit" class="btn-filter-premium flex-grow-1">
                            <i class="fas fa-sync-alt mr-2"></i> UPDATE
                        </button>
                        <a href="{{ route('admin.payments.index') }}" class="btn-reset-premium" data-toggle="tooltip" title="Reset Filters">
                            <i class="fas fa-undo text-danger"></i>
                        </a>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
