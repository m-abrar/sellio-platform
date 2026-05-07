{{--
    Administrative Events: Booking Filter Protocol
    
    This component provides a streamlined filtering interface for event 
    attendance management. It enables precise auditing across event 
    identities, taxonomic categories, and lifecycle states (pending, 
    confirmed, cancelled), facilitating efficient registry oversight.
    
    @context Event Booking Management
    @variables Collection $events List of event assets for selection mapping.
    @variables Collection $categories Event categories for vertical filtering.
--}}
<div class="card registry-card-premium registry-filter-card mb-4">
    <div class="card-body">
        <form method="GET" action="{{ url()->current() }}">
            <div class="row align-items-end">
                <div class="col-md-3">
                    <label class="form-label-premium">Event Identification</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-ticket-alt text-xs"></i></span>
                        </div>
                        <select name="event_id" class="form-control select2">
                            <option value="">All Events Intelligence</option>
                            @foreach($events as $e)
                                <option value="{{ $e->id }}" {{ request('event_id') == $e->id ? 'selected' : '' }}>{{ $e->title }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="col-md-3">
                    <label class="form-label-premium">Classification</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-tags text-xs"></i></span>
                        </div>
                        <select name="category" class="form-control select2">
                            <option value="">All Categories</option>
                            @foreach ($categories as $c)
                                <option value="{{ $c->id }}" {{ request('category') == $c->id ? 'selected' : '' }}>{{ $c->title }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="col-md-3">
                    <label class="form-label-premium">Lifecycle Status</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-filter text-xs"></i></span>
                        </div>
                        <select name="status" class="form-control select2">
                            <option value="all">All Lifecycle States</option>
                            <option value="pending" {{ (request('status') ?? $status) == 'pending' ? 'selected' : '' }}>Awaiting Confirmation</option>
                            <option value="confirmed" {{ (request('status') ?? $status) == 'confirmed' ? 'selected' : '' }}>Confirmed Entry</option>
                            <option value="cancelled" {{ (request('status') ?? $status) == 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-3">
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
