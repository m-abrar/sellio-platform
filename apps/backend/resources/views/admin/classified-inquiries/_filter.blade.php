{{--
    Administrative Classifieds: Inquiry Filter Protocol
    
    This component provides a streamlined search and filtering interface 
    for the classified ad inquiry registry. It enables precise auditing 
    across target assets, market categories, and lead lifecycle states 
    (pending, viewed, contacted, replied), ensuring efficient lead 
    management and conversion tracking.
    
    @context Classified Module Management
    @variables Collection $classifieds Target classified listings.
    @variables Collection $categories Market sector categories.
--}}
<div class="card registry-card-premium registry-filter-card mb-4">
    <div class="card-body">
        <form method="GET" action="{{ url()->current() }}">
            <div class="row align-items-end">
                <div class="col-md-3">
                    <label class="form-label-premium">Target Asset</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-search-dollar text-xs"></i></span>
                        </div>
                        <select name="classifiedad" class="form-control select2">
                            <option value="">All Classifieds</option>
                            @foreach($classifieds as $c)
                                <option value="{{ $c->id }}" {{ request('classifiedad') == $c->id ? 'selected' : '' }}>{{ $c->title }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="col-md-3">
                    <label class="form-label-premium">Market Category</label>
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
                    <label class="form-label-premium">Inquiry Status</label>
                    <div class="input-group input-group-premium">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-filter text-xs"></i></span>
                        </div>
                        <select name="status" class="form-control select2">
                            <option value="all">All Statuses</option>
                            <option value="pending" {{ (request('status') ?? $status) == 'pending' ? 'selected' : '' }}>Awaiting Review</option>
                            <option value="viewed" {{ (request('status') ?? $status) == 'viewed' ? 'selected' : '' }}>Lead Viewed</option>
                            <option value="contacted" {{ (request('status') ?? $status) == 'contacted' ? 'selected' : '' }}>Contact Established</option>
                            <option value="replied" {{ (request('status') ?? $status) == 'replied' ? 'selected' : '' }}>Response Dispatched</option>
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
