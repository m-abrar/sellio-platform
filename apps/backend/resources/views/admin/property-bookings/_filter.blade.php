{{--
    Administrative Real Estate: Booking Filter Protocol
    
    This component provides a sophisticated filtering interface for the 
    property booking registry. It enables multi-dimensional auditing 
    across specific asset inventory, lifecycle states (pending, confirmed, 
    cancelled), and custom temporal ranges.
    
    @context Property Operational Administration
    @variables Collection $properties List of properties for asset-specific filtering.
--}}
<div class="card registry-card-premium registry-filter-card mb-4">
    <div class="card-body">
        <form method="GET" action="{{ url()->current() }}">
            <div class="row align-items-end">
                <div class="col-md-3">
                    <label class="form-label-premium">Property Focus</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-home text-xs"></i></span>
                        </div>
                        <select name="property" class="form-control select2">
                            <option value="">All Inventory</option>
                            @foreach ($properties as $p)
                                <option value="{{ $p->id }}" {{ request('property') == $p->id ? 'selected' : '' }}>
                                    {{ $p->title }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="col-md-3">
                    <label class="form-label-premium">Booking Lifecycle</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-traffic-light text-xs"></i></span>
                        </div>
                        <select name="status" class="form-control select2">
                            <option value="all">All Lifecycle States</option>
                            @foreach (['pending' => 'Pending Review', 'confirmed' => 'Confirmed Stay', 'cancelled' => 'Cancelled'] as $val => $label)
                                <option value="{{ $val }}" {{ request('status') == $val ? 'selected' : '' }}>
                                    {{ $label }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="col-md-3">
                    <label class="form-label-premium">Temporal Range</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-calendar-alt text-xs"></i></span>
                        </div>
                        <input type="text" id="date_range_picker" class="form-control" placeholder="Select dates..." readonly value="{{ request('start_date') && request('end_date') ? request('start_date') . ' to ' . request('end_date') : '' }}">
                        <input type="hidden" name="start_date" id="start_date" value="{{ request('start_date') }}">
                        <input type="hidden" name="end_date" id="end_date" value="{{ request('end_date') }}">
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="d-flex align-items-center justify-content-end gap-12">
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
