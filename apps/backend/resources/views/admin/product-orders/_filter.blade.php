{{-- Filter Protocol --}}
<div class="card registry-card-premium registry-filter-card mb-4">
    <div class="card-body">
        <form method="GET" action="{{ url()->current() }}">
            <div class="row align-items-end">
                <div class="col-md-3">
                    <label class="form-label-premium">Order Tracking #</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-hashtag text-xs"></i></span>
                        </div>
                        <input type="text" name="order_number" class="form-control" 
                               placeholder="Enter reference..." value="{{ request('order_number') }}">
                    </div>
                </div>
                <div class="col-md-3">
                    <label class="form-label-premium">Inventory Identification</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-box text-xs"></i></span>
                        </div>
                        <input type="text" name="product_name" class="form-control" 
                               placeholder="Search items..." value="{{ request('product_name') }}">
                    </div>
                </div>
                <div class="col-md-2">
                    <label class="form-label-premium">Fulfillment Lifecycle</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-truck text-xs"></i></span>
                        </div>
                        <select name="status" class="form-control select2">
                            <option value="all">All States</option>
                            <option value="pending" {{ (request('status') ?? $status) == 'pending' ? 'selected' : '' }}>Pending</option>
                            <option value="processing" {{ (request('status') ?? $status) == 'processing' ? 'selected' : '' }}>Processing</option>
                            <option value="completed" {{ (request('status') ?? $status) == 'completed' ? 'selected' : '' }}>Completed</option>
                            <option value="cancelled" {{ (request('status') ?? $status) == 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-2">
                    <label class="form-label-premium">Settlement State</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-credit-card text-xs"></i></span>
                        </div>
                        <select name="payment_status" class="form-control select2">
                            <option value="">All Payments</option>
                            <option value="paid" {{ request('payment_status') == 'paid' ? 'selected' : '' }}>Paid</option>
                            <option value="pending" {{ request('payment_status') == 'pending' ? 'selected' : '' }}>Pending</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="d-flex align-items-center justify-content-end" style="gap: 12px;">
                        <button type="submit" class="btn-filter-premium flex-grow-1">
                            <i class="fas fa-sync-alt mr-2"></i> UPDATE
                        </button>
                        <a href="{{ url()->current() }}" class="btn-reset-premium" data-toggle="tooltip" title="Reset Filters">
                            <i class="fas fa-undo"></i>
                        </a>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
