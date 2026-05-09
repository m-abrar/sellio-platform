{{--
    Administrative Automotive: Inquiry Filter Protocol
    
    This component provides a streamlined filtering interface for automotive 
    lead management. It enables precise auditing across vehicle assets and 
    lifecycle states (pending, viewed, contacted), facilitating efficient 
    sales pipeline oversight.
    
    @context Automotive Lead Management
    @variables Collection $autos List of vehicle assets for suggestion mapping.
--}}
<div class="card registry-card-premium registry-filter-card mb-4">
    <div class="card-body">
        <form method="GET" action="{{ url()->current() }}">
            <div class="row align-items-end">
                <div class="col-md-5">
                    <label class="form-label-premium">Vehicle Asset</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-car text-xs"></i></span>
                        </div>
                        <input type="text" name="search" class="form-control" placeholder="Select or type vehicle..." list="auto-suggestions" value="{{ request('search') }}">
                        <datalist id="auto-suggestions">
                            @foreach($autos as $a)
                                <option value="{{ $a->title }}">
                            @endforeach
                        </datalist>
                    </div>
                </div>
                <div class="col-md-4">
                    <label class="form-label-premium">Inquiry Status</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-filter text-xs"></i></span>
                        </div>
                        <select name="status" class="form-control select2">
                            <option value="all">All Lifecycle States</option>
                            <option value="pending" {{ (request('status') ?? $status) == 'pending' ? 'selected' : '' }}>Pending</option>
                            <option value="viewed" {{ (request('status') ?? $status) == 'viewed' ? 'selected' : '' }}>Viewed</option>
                            <option value="contacted" {{ (request('status') ?? $status) == 'contacted' ? 'selected' : '' }}>Contacted</option>
                        </select>
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
