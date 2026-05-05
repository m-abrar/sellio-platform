{{-- Filter Protocol --}}
<div class="card registry-card-premium registry-filter-card mb-4">
    <div class="card-body">
        <form method="GET" action="{{ route('admin.service-bookings.index') }}">
            <div class="row align-items-end">
                <div class="col-md-8">
                    <label class="form-label-premium">Service Search / Identification</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-search text-xs"></i></span>
                        </div>
                        <input type="text" name="service_name" class="form-control" 
                               placeholder="Enter service title, technician name, or booking ID..." value="{{ request('service_name') }}">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="d-flex align-items-center justify-content-end" style="gap: 12px;">
                        <button type="submit" class="btn-filter-premium flex-grow-1">
                            <i class="fas fa-sync-alt mr-2"></i> REFRESH REGISTRY
                        </button>
                        <a href="{{ route('admin.service-bookings.index') }}" class="btn-reset-premium" data-toggle="tooltip" title="Reset Filters">
                            <i class="fas fa-undo"></i>
                        </a>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
